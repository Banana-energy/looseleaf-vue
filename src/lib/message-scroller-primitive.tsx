// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, type ComputedRef, shallowRef } from "vue";
export type MessageScrollerDefaultScrollPosition = "start" | "end" | "last-anchor";
export type MessageScrollerButtonDirection = "start" | "end";
export type MessageScrollerScrollAlign = "start" | "center" | "end" | "nearest";
export type MessageScrollerScrollOptions = {
  align?: MessageScrollerScrollAlign;
  behavior?: ScrollBehavior;
  scrollMargin?: number;
};
export type MessageScrollerScrollable = {
  start: boolean;
  end: boolean;
};
export type MessageScrollerVisibilityState = {
  currentAnchorId: string | null;
  visibleMessageIds: string[];
};
type Mode = "following-bottom" | "free-scrolling" | "anchored-to-message" | "settling-jump";
type Options = {
  autoScroll: boolean;
  defaultScrollPosition: MessageScrollerDefaultScrollPosition;
  scrollEdgeThreshold: number;
  scrollPreviousItemPeek: number;
  scrollMargin: number;
  preserveScrollOnPrepend: boolean;
};
const AUTOSCROLL_MS = 180;
const EPS = 0.5;
const SCROLL_KEYS = new Map<string, "start" | "end">([["ArrowUp", "start"], ["PageUp", "start"], ["Home", "start"], ["ArrowDown", "end"], ["PageDown", "end"], ["End", "end"], [" ", "end"]]);
const isField = (t: EventTarget | null) => t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
function createStore<T>(initial: T, equal: (a: T, b: T) => boolean) {
  let value = initial;
  const subs = new Set<() => void>();
  return {
    get: () => value,
    set(next: T) {
      if (equal(value, next)) return;
      value = next;
      subs.forEach(f => f());
    },
    subscribe(f: () => void) {
      subs.add(f);
      return () => void subs.delete(f);
    },
    hasSubscribers: () => subs.size > 0
  };
}
const NO_VISIBILITY: MessageScrollerVisibilityState = {
  currentAnchorId: null,
  visibleMessageIds: []
};
const sameScrollable = (a: MessageScrollerScrollable, b: MessageScrollerScrollable) => a.start === b.start && a.end === b.end;
const sameVisibility = (a: MessageScrollerVisibilityState, b: MessageScrollerVisibilityState) => a.currentAnchorId === b.currentAnchorId && a.visibleMessageIds.length === b.visibleMessageIds.length && a.visibleMessageIds.every((id, i) => id === b.visibleMessageIds[i]);
const px = (v: string | undefined) => {
  const n = Number.parseFloat(v ?? "");
  return Number.isFinite(n) ? n : 0;
};
class Controller {
  opts: Options;
  root: HTMLElement | null = null;
  viewport: HTMLElement | null = null;
  content: HTMLElement | null = null;
  spacer: HTMLElement | null = null;
  items = new Map<string, HTMLElement>();
  mode: Mode;
  scrollable = createStore<MessageScrollerScrollable>({
    start: false,
    end: false
  }, sameScrollable);
  visibility = createStore<MessageScrollerVisibilityState>(NO_VISIBILITY, sameVisibility);
  private itemCount = 0;
  private firstItem: HTMLElement | null = null;
  private appliedDefault = false;
  private lastTop = 0;
  private lastSet = Number.NaN;
  private pointerHeld = false;
  private anchored: HTMLElement | null = null;
  private handled = new WeakSet<HTMLElement>();
  private prepend: {
    el: HTMLElement;
    top: number;
  } | null = null;
  private pendingMessage: {
    id: string;
    options: MessageScrollerScrollOptions;
  } | null = null;
  private autoscrolling = false;
  private autoscrollTimer: number | undefined;
  private frame: number | undefined;
  private visFrame: number | undefined;
  private spacerHeight = 0;
  constructor(opts: Options) {
    this.opts = opts;
    this.mode = opts.autoScroll ? "following-bottom" as const : "free-scrolling" as const;
  }
  private childItems(): HTMLElement[] {
    const c = this.content;
    return c ? Array.from(c.children).filter(n => n instanceof HTMLElement && n !== this.spacer) as HTMLElement[] : [];
  }
  private top(el: Element): number {
    return el.getBoundingClientRect().top - (this.viewport?.getBoundingClientRect().top ?? 0);
  }
  private offset(el: Element): number {
    return this.top(el) + (this.viewport?.scrollTop ?? 0);
  }
  private contentEnd(): number {
    const c = this.content;
    if (!c || !this.viewport) return 0;
    const items = this.childItems();
    const last = items[items.length - 1];
    const end = last ? this.offset(last) + last.getBoundingClientRect().height : 0;
    const pad = typeof getComputedStyle === "function" ? px((getComputedStyle(c).paddingBlockEnd || getComputedStyle(c).paddingBottom) as string) : 0;
    return end + pad;
  }
  private firstBelow(items: HTMLElement[], y: number): number {
    const bottomAt = (i: number): number => {
      for (let j = i; j < items.length; j++) {
        const r = items[j].getBoundingClientRect();
        if (r.width > 0 || r.height > 0) return r.bottom;
      }
      return Number.POSITIVE_INFINITY;
    };
    let lo = 0;
    let hi = items.length;
    while (lo < hi) {
      const mid = lo + hi >> 1;
      if (bottomAt(mid) > y) hi = mid;else lo = mid + 1;
    }
    while (lo < items.length) {
      const r = items[lo].getBoundingClientRect();
      if (r.width > 0 || r.height > 0) break;
      lo++;
    }
    return lo;
  }
  private computeScrollable(): MessageScrollerScrollable {
    const v = this.viewport;
    if (!v) return {
      start: false,
      end: false
    };
    const t = this.opts.scrollEdgeThreshold;
    return {
      start: v.scrollTop > t,
      end: this.contentEnd() - v.scrollTop - v.clientHeight > t
    };
  }
  commit = (): void => {
    const s = this.computeScrollable();
    const shown = this.mode === "following-bottom" ? {
      ...s,
      end: false
    } : s;
    for (const el of [this.root, this.viewport]) {
      if (!el) continue;
      const tokens = [shown.start && "start", shown.end && "end"].filter(Boolean).join(" ");
      if (tokens) el.setAttribute("data-scrollable", tokens);else el.removeAttribute("data-scrollable");
      el.toggleAttribute("data-autoscrolling", this.autoscrolling);
    }
    this.scrollable.set(shown);
  };
  scheduleCommit = (): void => {
    if (this.frame !== undefined) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = undefined;
      this.commit();
    });
  };
  scheduleVisibility = (): void => {
    if (!this.visibility.hasSubscribers() || this.visFrame !== undefined) return;
    this.visFrame = requestAnimationFrame(() => {
      this.visFrame = undefined;
      this.visibility.set(this.computeVisibility());
    });
  };
  private computeVisibility(): MessageScrollerVisibilityState {
    const v = this.viewport;
    if (!v) return NO_VISIBILITY;
    const vr = v.getBoundingClientRect();
    const line = vr.top + this.opts.scrollMargin + this.opts.scrollPreviousItemPeek;
    const items = this.childItems();
    const visible: string[] = [];
    let current: string | null = null;
    const first = this.firstBelow(items, line);
    for (let i = first; i < items.length; i++) {
      const el = items[i];
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (r.top >= vr.bottom) break;
      const id = el.dataset.messageId;
      if (!id) continue;
      visible.push(id);
      if (el.dataset.scrollAnchor === "true" && r.top <= line + EPS) current = id;
    }
    for (let i = Math.min(first, items.length) - 1; i >= 0 && current === null; i--) {
      const el = items[i];
      if (el.dataset.messageId && el.dataset.scrollAnchor === "true") current = el.dataset.messageId;
    }
    return visible.length === 0 && current === null ? NO_VISIBILITY : {
      currentAnchorId: current,
      visibleMessageIds: visible
    };
  }
  private flagAutoscrolling(on: boolean): void {
    window.clearTimeout(this.autoscrollTimer);
    this.autoscrollTimer = undefined;
    if (this.autoscrolling !== on) {
      this.autoscrolling = on;
      this.commit();
    }
    if (on) {
      this.autoscrollTimer = window.setTimeout(() => {
        this.autoscrollTimer = undefined;
        this.autoscrolling = false;
        this.commit();
      }, AUTOSCROLL_MS);
    }
  }
  private setSpacer(height: number): void {
    const s = this.spacer;
    if (!s) return;
    const h = Math.max(0, Math.ceil(height));
    if (h === this.spacerHeight) return;
    this.spacerHeight = h;
    s.hidden = h === 0;
    s.style.height = `${h}px`;
    const gap = this.content ? px(getComputedStyle(this.content).rowGap === "normal" ? getComputedStyle(this.content).gap : getComputedStyle(this.content).rowGap) : 0;
    s.style.marginTop = h > 0 ? `${-gap}px` : "" as const;
  }
  private reducedMotion(): boolean {
    if (typeof window === "undefined") return false;
    return !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || !!this.viewport?.closest('[data-motion="reduced"]');
  }
  private scrollTo(top: number, behavior: ScrollBehavior = "auto", autoscrolling = false): void {
    const v = this.viewport;
    if (!v) return;
    const t = Math.max(0, top);
    if (Math.abs(v.scrollTop - t) <= EPS) {
      v.scrollTop = t;
      this.commit();
      return;
    }
    if (autoscrolling) this.flagAutoscrolling(true);
    this.lastSet = t;
    if (behavior === "smooth" && typeof v.scrollTo === "function" && !this.reducedMotion()) v.scrollTo({
      top: t,
      behavior
    });else v.scrollTop = t;
    this.scheduleCommit();
  }
  scrollToEnd = ({
    behavior = "auto"
  }: {
    behavior?: ScrollBehavior;
  } = {}): boolean => {
    const v = this.viewport;
    if (!v) return false;
    this.setSpacer(0);
    this.anchored = null;
    this.mode = this.opts.autoScroll ? "following-bottom" as const : "free-scrolling" as const;
    this.scrollTo(this.contentEnd() - v.clientHeight, behavior, true);
    this.scheduleVisibility();
    return true;
  };
  scrollToStart = ({
    behavior = "auto"
  }: {
    behavior?: ScrollBehavior;
  } = {}): boolean => {
    if (!this.viewport) return false;
    this.setSpacer(0);
    this.anchored = null;
    this.mode = "free-scrolling";
    this.scrollTo(0, behavior);
    this.scheduleVisibility();
    return true;
  };
  private targetFor(el: HTMLElement, align: MessageScrollerScrollAlign, margin: number): number {
    const v = this.viewport as HTMLElement;
    const off = this.offset(el);
    const h = el.getBoundingClientRect().height;
    if (align === "center") return off - (v.clientHeight - h) / 2 - margin;
    if (align === "end") return off + h - v.clientHeight + margin;
    if (align === "nearest") {
      const from = v.scrollTop;
      const to = from + v.clientHeight;
      return off >= from && off + h <= to ? from : off < from ? off - margin : off + h - v.clientHeight + margin;
    }
    return off - margin;
  }
  scrollToElement = (el: HTMLElement, {
    align = "start",
    behavior = "auto",
    scrollMargin = this.opts.scrollMargin
  }: MessageScrollerScrollOptions = {}, {
    keepPreviousPeek = false
  } = {}): boolean => {
    const v = this.viewport;
    if (!v || !this.content?.contains(el)) return false;
    const target = Math.max(0, this.targetFor(el, align, scrollMargin + (keepPreviousPeek ? this.opts.scrollPreviousItemPeek : 0)));
    this.setSpacer(target + v.clientHeight - this.contentEnd());
    this.mode = keepPreviousPeek ? "anchored-to-message" as const : "free-scrolling" as const;
    this.anchored = keepPreviousPeek ? el : null;
    this.scrollTo(target, behavior);
    this.snapshot();
    this.scheduleVisibility();
    return true;
  };
  scrollToMessage = (id: string, options: MessageScrollerScrollOptions = {}): boolean => {
    const el = this.items.get(id);
    if (el) {
      this.appliedDefault = true;
      this.pendingMessage = null;
      return this.scrollToElement(el, options);
    }
    if (this.itemCount === 0) {
      this.pendingMessage = {
        id,
        options
      };
      this.appliedDefault = true;
      return true;
    }
    return false;
  };
  flushPendingMessage = (): void => {
    const p = this.pendingMessage;
    const el = p ? this.items.get(p.id) : undefined;
    if (p && el && this.scrollToElement(el, p.options)) this.pendingMessage = null;
  };
  private applyDefault(): boolean {
    if (this.appliedDefault || this.itemCount === 0) return false;
    const pos = this.opts.defaultScrollPosition;
    let done = false;
    if (pos === "last-anchor") {
      const anchors = this.childItems().filter(n => n.dataset.scrollAnchor === "true");
      const last = anchors[anchors.length - 1];
      const v = this.viewport;
      if (!last || !v) done = this.scrollToEnd();else if (this.contentEnd() - this.offset(last) <= v.clientHeight) done = this.scrollToEnd();else done = this.scrollToElement(last, {
        align: "start" as const
      }, {
        keepPreviousPeek: true
      });
    } else done = pos === "end" ? this.scrollToEnd() : this.scrollToStart();
    if (done) this.appliedDefault = true;
    return done;
  }
  snapshot = (): void => {
    const v = this.viewport;
    if (!v) return;
    const vr = v.getBoundingClientRect();
    const items = this.childItems();
    const el = items[this.firstBelow(items, vr.top)];
    const r = el?.getBoundingClientRect();
    this.prepend = el && r && r.top < vr.bottom ? {
      el,
      top: r.top - vr.top
    } : null;
  };
  private restorePrepend(): boolean {
    const v = this.viewport;
    const p = this.prepend;
    if (!v || !p || !p.el.isConnected) return false;
    const delta = this.top(p.el) - p.top;
    if (Math.abs(delta) <= EPS) return false;
    v.scrollTop += delta;
    this.lastSet = v.scrollTop;
    this.snapshot();
    this.scheduleCommit();
    this.scheduleVisibility();
    return true;
  }
  handleContentChange = (): void => {
    if (!this.content || !this.viewport) return;
    if (this.pendingMessage) this.flushPendingMessage();
    const items = this.childItems();
    const before = this.itemCount;
    const first = this.firstItem;
    this.itemCount = items.length;
    this.firstItem = items[0] ?? null;
    if (before === 0) {
      if (this.applyDefault()) this.scheduleVisibility();else this.commit();
      this.snapshot();
      return;
    }
    const at = first ? items.indexOf(first) : -1;
    if (this.opts.preserveScrollOnPrepend && at > 0) {
      this.restorePrepend();
      this.commit();
      return;
    }
    const fresh = items.slice(before).filter(el => el.dataset.scrollAnchor === "true" && !this.handled.has(el));
    if (fresh.length) {
      for (const el of fresh) this.handled.add(el);
      const newest = fresh[fresh.length - 1];
      if (this.mode === "following-bottom" && this.opts.autoScroll && fresh.length > 1) this.scrollToEnd();else this.scrollToElement(newest, {
        align: "start" as const
      }, {
        keepPreviousPeek: true
      });
      return;
    }
    if (this.mode === "following-bottom" && this.opts.autoScroll) this.scrollToEnd();else this.commit();
    this.snapshot();
    this.scheduleVisibility();
  };
  handleResize = (): void => {
    if (this.mode === "following-bottom" && this.opts.autoScroll) {
      this.scrollToEnd();
      return;
    }
    const el = this.anchored;
    if (el?.isConnected && this.mode === "anchored-to-message") {
      const v = this.viewport as HTMLElement;
      const target = Math.max(0, this.targetFor(el, "start", this.opts.scrollMargin + this.opts.scrollPreviousItemPeek));
      const had = this.spacerHeight;
      this.setSpacer(target + v.clientHeight - this.contentEnd());
      if (Math.abs(v.scrollTop - target) > EPS && this.spacerHeight > 0) {
        v.scrollTop = target;
        this.lastSet = target;
      }
      if (this.opts.autoScroll && had > 0 && this.spacerHeight === 0) {
        this.scrollToEnd();
        return;
      }
    }
    this.scheduleCommit();
    this.scheduleVisibility();
  };
  handleScroll = (): void => {
    const v = this.viewport;
    if (!v) return;
    const s = this.computeScrollable();
    const up = v.scrollTop < this.lastTop - EPS;
    this.lastTop = v.scrollTop;
    if (this.pointerHeld && !(Math.abs(v.scrollTop - this.lastSet) <= 1.5) && (this.mode === "following-bottom" || this.mode === "anchored-to-message")) this.mode = "free-scrolling";
    if (this.opts.autoScroll && !s.end && this.mode !== "settling-jump" && this.mode !== "anchored-to-message") this.mode = "following-bottom";else if (this.mode === "following-bottom" && s.end && up && !(Math.abs(v.scrollTop - this.lastSet) <= 1.5)) this.mode = "free-scrolling";
    this.snapshot();
    this.commit();
    this.scheduleVisibility();
  };
  userIntent = (toward: "start" | "end" | "any" = "any"): void => {
    if (this.mode === "following-bottom") {
      if (toward !== "end") this.mode = "free-scrolling";
    } else if (this.mode === "anchored-to-message" || this.mode === "settling-jump") this.mode = "free-scrolling";
  };
  holdPointer = (on: boolean): void => {
    this.pointerHeld = on;
  };
  setSpacerElement = (el: HTMLElement | null): void => {
    this.spacer = el;
  };
  registerItem = (id: string, el: HTMLElement | null, previous: HTMLElement | null): void => {
    if (el) {
      this.items.set(id, el);
      if (this.pendingMessage?.id === id) requestAnimationFrame(this.flushPendingMessage);
    } else if (previous && this.items.get(id) === previous) this.items.delete(id);
    this.scheduleVisibility();
  };
  setAutoScroll = (on: boolean): void => {
    this.opts.autoScroll = on;
    if (on) {
      if (this.mode === "free-scrolling" && this.viewport && !this.computeScrollable().end) this.mode = "following-bottom";
    } else if (this.mode === "following-bottom") this.mode = "free-scrolling";
  };
  dispose = (): void => {
    for (const f of [this.frame, this.visFrame]) if (f !== undefined) cancelAnimationFrame(f);
    this.frame = undefined;
    this.visFrame = undefined;
    window.clearTimeout(this.autoscrollTimer);
    this.autoscrollTimer = undefined;
    if (this.autoscrolling) {
      this.autoscrolling = false;
      this.viewport?.removeAttribute("data-autoscrolling");
      this.root?.removeAttribute("data-autoscrolling");
    }
  };
}
const ControllerContext = createContext<Controller | null>(null);
function useController(): ComputedRef<Controller> {
  const c = useContext(ControllerContext);
  return computed(() => {
    if (!c.value) console.error("MessageScroller parts and hooks must be used inside <MessageScroller.Provider>");
    return c.value;
  });
}
export function useMessageScroller() {
  const c = useController();
  const _nestedHook0 = computed(() => ({
    scrollToEnd: c.value.scrollToEnd,
    scrollToMessage: c.value.scrollToMessage,
    scrollToStart: c.value.scrollToStart
  }));
  return computed(() => {
    return _nestedHook0.value;
  });
}
export function useMessageScrollerScrollable(): ComputedRef<MessageScrollerScrollable> {
  const c = useController();
  const _nestedHook0 = useExternalStore(c.value.scrollable.subscribe, c.value.scrollable.get);
  return computed(() => {
    return _nestedHook0.value;
  });
}
export function useMessageScrollerVisibility(): ComputedRef<MessageScrollerVisibilityState> {
  const c = useController();
  const subscribe = (f: () => void) => {
    const off = c.value.visibility.subscribe(f);
    c.value.scheduleVisibility();
    return off;
  };
  const _nestedHook0 = useExternalStore(subscribe, c.value.visibility.get);
  return computed(() => {
    return _nestedHook0.value;
  });
}
const MessageScrollerProvider = defineUi<{
  children?: UI.ReactNode;
  autoScroll?: boolean;
  defaultScrollPosition?: MessageScrollerDefaultScrollPosition;
  scrollEdgeThreshold?: number;
  scrollPreviousItemPeek?: number;
  scrollMargin?: number;
}>("MessageScrollerProvider", ["autoScroll", "defaultScrollPosition", "scrollEdgeThreshold", "scrollPreviousItemPeek", "scrollMargin"], (_props, {
  slots: _slots
}) => {
  const autoScroll = computed(() => _props["autoScroll"] === undefined ? false : _props["autoScroll"]);
  const children = renderValue(() => readSlot(_slots.default));
  const defaultScrollPosition = computed(() => _props["defaultScrollPosition"] === undefined ? "end" as const : _props["defaultScrollPosition"]);
  const scrollEdgeThreshold = computed(() => _props["scrollEdgeThreshold"] === undefined ? 8 : _props["scrollEdgeThreshold"]);
  const scrollPreviousItemPeek = computed(() => _props["scrollPreviousItemPeek"] === undefined ? 64 : _props["scrollPreviousItemPeek"]);
  const scrollMargin = computed(() => _props["scrollMargin"] === undefined ? 0 : _props["scrollMargin"]);
  const ref = shallowRef<Controller | null | null>(null);
  ref.value ??= new Controller({
    autoScroll: autoScroll.value,
    defaultScrollPosition: defaultScrollPosition.value,
    scrollEdgeThreshold: scrollEdgeThreshold.value,
    scrollPreviousItemPeek: scrollPreviousItemPeek.value,
    scrollMargin: scrollMargin.value,
    preserveScrollOnPrepend: true
  });
  const c = computed(() => ref.value);
  watchDependencies(() => c.value.setAutoScroll(autoScroll.value), () => [c.value, autoScroll.value], true);
  watchDependencies(() => {
    c.value.scheduleCommit();
    c.value.scheduleVisibility();
    return () => c.value.dispose();
  }, () => [c.value], false);
  return () => {
    c.value.opts.defaultScrollPosition = defaultScrollPosition.value;
    c.value.opts.scrollEdgeThreshold = scrollEdgeThreshold.value;
    c.value.opts.scrollPreviousItemPeek = scrollPreviousItemPeek.value;
    c.value.opts.scrollMargin = scrollMargin.value;
    return <ControllerContext.Provider value={c.value}>{readSlot(_slots.default)}</ControllerContext.Provider>;
  };
});
const MessageScrollerRoot = defineUi<UI.ComponentProps<"div">>("MessageScrollerRoot", [], (_props, {
  slots: _slots
}) => {
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["ref"]));
  const c = useController();
  const set = (el: HTMLDivElement | null) => {
    c.value.root = el;
    if (el) c.value.commit();
    if (typeof ref.value === "function") ref.value(el);else if (ref.value) (ref.value as UI.RefObject<HTMLDivElement | null>).value = el;
  };
  return () => {
    return <div ref={set} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const MessageScrollerViewport = defineUi<UI.ComponentProps<"div"> & {
  preserveScrollOnPrepend?: boolean;
}>("MessageScrollerViewport", ["preserveScrollOnPrepend", "onScroll", "onWheel", "onPointerdown", "onTouchstart", "onTouchmove", "onKeydown", "role", "tabIndex", "aria-label"], (_props, {
  slots: _slots
}) => {
  const preserveScrollOnPrepend = computed(() => _props["preserveScrollOnPrepend"] === undefined ? true : _props["preserveScrollOnPrepend"]);
  const onScroll = computed(() => _props["onScroll"]);
  const onWheel = computed(() => _props["onWheel"]);
  const onPointerdown = computed(() => _props["onPointerdown"]);
  const onTouchstart = computed(() => _props["onTouchstart"]);
  const onTouchmove = computed(() => _props["onTouchmove"]);
  const onKeydown = computed(() => _props["onKeydown"]);
  const role = computed(() => _props["role"]);
  const tabIndex = computed(() => _props["tabIndex"]);
  const ref = computed(() => _props["ref"]);
  const ariaLabel = computed(() => _props["aria-label"]);
  const props = computed(() => omitProps(_props, ["preserveScrollOnPrepend", "onScroll", "onWheel", "onPointerdown", "onTouchstart", "onTouchmove", "onKeydown", "role", "tabIndex", "ref", "aria-label"]));
  const c = useController();
  const touchY = shallowRef<number | null | null>(null);
  const set = (el: HTMLDivElement | null) => {
    c.value.viewport = el;
    if (typeof ref.value === "function") ref.value(el);else if (ref.value) (ref.value as UI.RefObject<HTMLDivElement | null>).value = el;
    if (el) {
      c.value.commit();
      c.value.handleContentChange();
    }
  };
  watchDependencies(() => {
    const release = () => c.value.holdPointer(false);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
  }, () => [c.value], false);
  watchDependencies(() => {
    const el = c.value.viewport;
    if (!el || typeof ResizeObserver === "undefined") return;
    let f = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(f);
      f = requestAnimationFrame(c.value.handleResize);
    });
    ro.observe(el);
    return () => {
      cancelAnimationFrame(f);
      ro.disconnect();
    };
  }, () => [c.value], false);
  return () => {
    c.value.opts.preserveScrollOnPrepend = preserveScrollOnPrepend.value;
    return <div ref={set} role={role.value ?? "region"} aria-label={ariaLabel.value ?? "Messages"} tabindex={tabIndex.value ?? 0} onScroll={e => {
      c.value.handleScroll();
      onScroll.value?.(e);
    }} onWheel={e => {
      if (e.deltaY !== 0) c.value.userIntent(e.deltaY < 0 ? "start" as const : "end" as const);
      onWheel.value?.(e);
    }} onPointerdown={(e: PointerEvent) => {
      if (e.target as HTMLElement === e.currentTarget as HTMLElement) c.value.holdPointer(true);
      onPointerdown.value?.(e);
    }} onTouchstart={e => {
      touchY.value = e.touches[0]?.clientY ?? null;
      onTouchstart.value?.(e);
    }} onTouchmove={e => {
      const y = e.touches[0]?.clientY;
      const before = touchY.value;
      touchY.value = y ?? null;
      c.value.userIntent(y === undefined || before === null ? "any" as const : y > before ? "start" as const : y < before ? "end" as const : "any" as const);
      onTouchmove.value?.(e);
    }} onKeydown={(e: KeyboardEvent) => {
      const toward = SCROLL_KEYS.get(e.key);
      if (toward && !e.defaultPrevented && !isField(e.target as HTMLElement)) c.value.userIntent(e.key === " " && e.shiftKey ? "start" as const : toward);
      onKeydown.value?.(e);
    }} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const MessageScrollerContent = defineUi<UI.ComponentProps<"div"> & {
  spacerClassName?: string;
}>("MessageScrollerContent", ["spacerClassName", "role", "aria-relevant"], (_props, {
  slots: _slots
}) => {
  const children = renderValue(() => readSlot(_slots.default));
  const spacerClassName = computed(() => _props["spacerClassName"]);
  const role = computed(() => _props["role"]);
  const ref = computed(() => _props["ref"]);
  const ariaRelevant = computed(() => _props["aria-relevant"]);
  const props = computed(() => omitProps(_props, ["children", "spacerClassName", "role", "ref", "aria-relevant"]));
  const c = useController();
  const own = shallowRef<HTMLDivElement | null | null>(null);
  const set = (el: HTMLDivElement | null) => {
    own.value = el;
    c.value.content = el;
    if (typeof ref.value === "function") ref.value(el);else if (ref.value) (ref.value as UI.RefObject<HTMLDivElement | null>).value = el;
  };
  watchDependencies(() => {
    c.value.handleContentChange();
  }, undefined, true);
  watchDependencies(() => {
    const el = own.value;
    if (!el) return;
    const mo = typeof MutationObserver === "undefined" ? null : new MutationObserver(() => c.value.handleContentChange());
    mo?.observe(el, {
      childList: true
    });
    let f = 0;
    const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => {
      cancelAnimationFrame(f);
      f = requestAnimationFrame(c.value.handleResize);
    });
    ro?.observe(el);
    return () => {
      mo?.disconnect();
      cancelAnimationFrame(f);
      ro?.disconnect();
    };
  }, () => [c.value], false);
  return () => {
    return <div ref={set} role={role.value ?? "log"} aria-relevant={ariaRelevant.value ?? "additions"} {...domProps(props.value)}>
      {readSlot(_slots.default)}
      <div ref={c.value.setSpacerElement} aria-hidden="true" data-message-scroller-spacer="" hidden class={spacerClassName.value} />
    </div>;
  };
});
const MessageScrollerItem = defineUi<UI.ComponentProps<"div"> & {
  messageId?: string;
  scrollAnchor?: boolean;
}>("MessageScrollerItem", ["messageId", "scrollAnchor"], (_props, {
  slots: _slots
}) => {
  const messageId = computed(() => _props["messageId"]);
  const scrollAnchor = computed(() => _props["scrollAnchor"] === undefined ? false : _props["scrollAnchor"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["messageId", "scrollAnchor", "ref"]));
  const c = useController();
  const prev = shallowRef<HTMLDivElement | null | null>(null);
  const set = (el: HTMLDivElement | null) => {
    const before = prev.value;
    prev.value = el;
    if (messageId.value) c.value.registerItem(messageId.value, el, before);
    if (typeof ref.value === "function") ref.value(el);else if (ref.value) (ref.value as UI.RefObject<HTMLDivElement | null>).value = el;
  };
  return () => {
    return <div ref={set} data-message-id={messageId.value} data-scroll-anchor={scrollAnchor.value ? "true" as const : "false" as const} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
type ButtonRenderState = {
  active: boolean;
  direction: MessageScrollerButtonDirection;
};
function mergeProps(a: Record<string, unknown>, b: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {
    ...a
  };
  for (const k of Object.keys(b)) {
    const v = b[k];
    if (v === undefined) continue;
    const w = out[k];
    if (k === "className") out[k] = [w, v].filter(Boolean).join(" ");else if (k === "style") out[k] = {
      ...(w as object),
      ...(v as object)
    };else if (/^on[A-Z]/.test(k) && typeof w === "function" && typeof v === "function") out[k] = (e: {
      defaultPrevented?: boolean;
    }) => (void (v as (e: unknown) => void)(e), e.defaultPrevented ? undefined : (w as (e: unknown) => void)(e));else out[k] = v;
  }
  return out;
}
const MessageScrollerButton = defineUi<Omit<UI.ComponentProps<"button">, "ref"> & {
  ref?: UI.Ref<HTMLButtonElement>;
  behavior?: ScrollBehavior;
  direction?: MessageScrollerButtonDirection;
  render?: UI.ReactElement | ((props: Record<string, unknown>, state: ButtonRenderState) => UI.ReactElement);
}>("MessageScrollerButton", ["behavior", "direction", "render", "onClick", "tabIndex", "type"], (_props, {
  slots: _slots
}) => {
  const behavior = computed(() => _props["behavior"] === undefined ? "smooth" as const : _props["behavior"]);
  const direction = computed(() => _props["direction"] === undefined ? "end" as const : _props["direction"]);
  const render = computed(() => _props["render"]);
  const children = renderValue(() => readSlot(_slots.default));
  const onClick = computed(() => _props["onClick"]);
  const tabIndex = computed(() => _props["tabIndex"]);
  const type = computed(() => _props["type"] === undefined ? "button" as const : _props["type"]);
  const props = computed(() => omitProps(_props, ["behavior", "direction", "render", "children", "onClick", "tabIndex", "type"]));
  const c = useController();
  const sc = useExternalStore(c.value.scrollable.subscribe, c.value.scrollable.get);
  const active = computed(() => direction.value === "start" ? sc.value.start : sc.value.end);
  const merged = renderValue<Record<string, unknown>>(() => ({
    type: type.value,
    inert: !active.value,
    tabIndex: active.value ? tabIndex.value : -1,
    "data-active": active.value ? "true" as const : "false" as const,
    onClick: (e: MouseEvent) => {
      if (!active.value) return;
      onClick.value?.(e);
      if (e.defaultPrevented) return;
      if (e.currentTarget as HTMLButtonElement === document.activeElement) {
        if (c.value.viewport) c.value.viewport.focus({
          preventScroll: true
        });else (e.currentTarget as HTMLButtonElement).blur();
      }
      if (direction.value === "start") c.value.scrollToStart({
        behavior: behavior.value
      });else c.value.scrollToEnd({
        behavior: behavior.value
      });
    },
    children: children.value ?? <span>Scroll to {direction.value}</span>,
    ...props.value
  }));
  const state = computed(() => ({
    active: active.value,
    direction: direction.value
  }));
  return () => {
    if (!render.value) return createElement("button", merged.value as UI.ComponentProps<"button">);
    if (typeof render.value === "function") return render.value(merged.value, state.value);
    if (!isValidElement(render.value)) return null;
    const own = render.value.props as Record<string, unknown>;
    return cloneElement(render.value, mergeProps(own, merged.value));
  };
});
export const MessageScroller = {
  Provider: MessageScrollerProvider,
  Root: MessageScrollerRoot,
  Viewport: MessageScrollerViewport,
  Content: MessageScrollerContent,
  Item: MessageScrollerItem,
  Button: MessageScrollerButton
};
