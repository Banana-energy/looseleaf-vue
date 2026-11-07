// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, Fragment, toValue, type MaybeRefOrGetter, shallowRef } from "vue";
import { copyText } from "@/docs/core/hooks";
import { cx } from "@/docs/kit";
import { LazyMount, useColumns } from "./lazy";
export const GAP = 8;
export function useCopyStatus(_source0: MaybeRefOrGetter<number | undefined> = 1600) {
  const ms = computed(() => toValue(_source0) === undefined ? 1600 : toValue(_source0));
  const copied = shallowRef<string | null>(initialState(null));
  const setCopied = stateSetter(copied);
  const message = shallowRef(initialState(""));
  const setMessage = stateSetter(message);
  const count = shallowRef(0);
  const timer = shallowRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  watchDependencies(() => () => clearTimeout(timer.value), () => [], false);
  const copy = async (id: string, text: string) => {
    const ok = await copyText(text);
    count.value += 1;
    const tail = count.value % 2 ? "" as const : "​" as const;
    setMessage((ok ? `Copied ${text}` : `Copying was blocked. The code is ${text}`) + tail);
    clearTimeout(timer.value);
    if (ok) {
      setCopied(id);
      timer.value = setTimeout(() => setCopied(null), ms.value);
    }
    return ok;
  };
  return computed(() => {
    return {
      copied: copied.value,
      message: message.value,
      copy
    };
  });
}
export const CopyStatus = defineUi<{
  message: string;
}>("CopyStatus", ["message"], (_props, {
  slots: _slots
}) => {
  const message = computed(() => _props["message"]);
  return () => {
    return <p role="status" class="sr-only">
      {message.value}
    </p>;
  };
});
const RovingContext = createContext<{
  tabbable: string | undefined;
}>({
  tabbable: undefined
});
function neighbour(tiles: HTMLElement[], from: HTMLElement, dir: 1 | -1): HTMLElement | undefined {
  const r = from.getBoundingClientRect();
  let best: HTMLElement | undefined;
  let bestDy = Number.POSITIVE_INFINITY;
  let bestDx = Number.POSITIVE_INFINITY;
  for (const t of tiles) {
    if (t === from) continue;
    const b = t.getBoundingClientRect();
    const dy = (b.top - r.top) * dir;
    if (dy <= 1) continue;
    const dx = Math.abs(b.left - r.left);
    if (dy < bestDy - 1 || Math.abs(dy - bestDy) <= 1 && dx < bestDx) {
      best = t;
      bestDy = dy;
      bestDx = dx;
    }
  }
  return best;
}
export interface RovingGroupProps {
  label: string;
  describedBy?: string;
  ids: readonly string[];
  className?: string;
  children: UI.VueNode;
}
export const RovingGroup = defineUi<RovingGroupProps>("RovingGroup", ["label", "describedBy", "ids", "class"], (_props, {
  slots: _slots
}) => {
  const label = computed(() => _props["label"]);
  const describedBy = computed(() => _props["describedBy"]);
  const ids = computed(() => _props["ids"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const active = shallowRef<string | undefined>(initialState(undefined));
  const setActive = stateSetter(active);
  const rootRef = shallowRef<HTMLDivElement | null>(null);
  const tabbable = computed(() => active.value !== undefined && ids.value.includes(active.value) ? active.value : ids.value[0]);
  watchDependencies(() => {
    const root = rootRef.value;
    if (!root || root.querySelector('[data-tile][tabindex="0"]')) return;
    const first = root.querySelector<HTMLElement>("[data-tile]")?.dataset.tile;
    if (first) setActive(first);
  }, undefined, true);
  const onKeydown = computed(() => (event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (!target.hasAttribute("data-tile") || event.altKey || event.ctrlKey || event.metaKey) return;
    const root = rootRef.value;
    if (!root) return;
    const tiles = Array.from(root.querySelectorAll<HTMLElement>("[data-tile]"));
    const at = tiles.indexOf(target);
    const rtl = getComputedStyle(root).direction === "rtl";
    let next: HTMLElement | undefined;
    switch (event.key) {
      case "ArrowRight":
        next = tiles[at + (rtl ? -1 : 1)];
        break;
      case "ArrowLeft":
        next = tiles[at + (rtl ? 1 : -1)];
        break;
      case "ArrowDown":
        next = neighbour(tiles, target, 1);
        break;
      case "ArrowUp":
        next = neighbour(tiles, target, -1);
        break;
      case "Home":
        next = tiles[0];
        break;
      case "End":
        next = tiles[tiles.length - 1];
        break;
      default:
        return;
    }
    event.preventDefault();
    next?.focus();
  });
  return () => {
    return <RovingContext.Provider value={{
      tabbable: tabbable.value
    }}>
      <div ref={rootRef} role="group" aria-label={label.value} aria-describedby={describedBy.value} class={className.value} onKeydown={onKeydown.value} onFocus={(event: FocusEvent) => {
        const id = (event.target as HTMLElement).dataset?.tile;
        if (id) setActive(id);
      }}>
        {readSlot(_slots.default)}
      </div>
    </RovingContext.Provider>;
  };
});
export interface TileProps {
  id: string;
  name: string;
  selected?: boolean;
  copied?: boolean;
  hint?: string;
  onPress: () => void;
  className?: string;
  style?: UI.CSSProperties;
  children: UI.VueNode;
}
export const Tile = defineUi<TileProps>("Tile", ["id", "name", "selected", "copied", "hint", "onPress", "class", "style"], (_props, {
  slots: _slots
}) => {
  const id = computed(() => _props["id"]);
  const name = computed(() => _props["name"]);
  const selected = computed(() => _props["selected"]);
  const copied = computed(() => _props["copied"]);
  const hint = computed(() => _props["hint"]);
  const onPress = computed(() => _props["onPress"]);
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const children = renderValue(() => readSlot(_slots.default));
  const _context9 = useContext(RovingContext);
  const tabbable = computed(() => _context9.value.tabbable);
  return () => {
    return <button type="button" data-tile={id.value} tabindex={tabbable.value === id.value ? 0 : -1} data-selected={selected.value ? "" as const : undefined} data-copied={copied.value ? "" as const : undefined} onClick={onPress.value} class={cx("group relative flex min-w-0 scroll-mt-28 md:scroll-mb-44 flex-col items-center justify-start gap-1.5 px-1.5 pt-2.5 pb-2 text-ink", "hover:ll-swipe data-[selected]:shadow-[inset_0_0_0_2px_var(--ll-ink-you)]", className.value)} style={cssStyle(style.value)}>
      {readSlot(_slots.default)}
      <span class="text-center text-sm leading-tight text-pencil-text [overflow-wrap:anywhere] group-hover:text-inherit group-data-[selected]:text-ink">{name.value}</span>
      {hint.value ? <span aria-hidden="true" class="-mt-1 text-center font-type text-sm leading-tight text-ink-you [overflow-wrap:anywhere]">
          {hint.value}
        </span> : null}
      <span aria-hidden="true" class="pointer-events-none absolute end-1 top-1 hidden bg-hi px-1.5 font-type text-xs leading-5 text-ink group-data-[copied]:inline-block">
        copied
      </span>
    </button>;
  };
});
export interface TileGridProps<T> {
  items: readonly T[];
  getId: (item: T) => string;
  renderTile: (item: T) => UI.VueNode;
  minTile: number;
  tileHeight: number;
  chunk?: number;
  eager?: boolean;
  className?: string;
}
export const TileGrid = (<T,>() => {
  return defineUi<TileGridProps<T>>("TileGrid", ["items", "getId", "renderTile", "minTile", "tileHeight", "chunk", "eager", "class"], (_props, {
    slots: _slots
  }) => {
    const items = computed(() => _props["items"]);
    const getId = computed(() => _props["getId"]);
    const renderTile = computed(() => _props["renderTile"]);
    const minTile = computed(() => _props["minTile"]);
    const tileHeight = computed(() => _props["tileHeight"]);
    const chunk = computed(() => _props["chunk"] === undefined ? 24 : _props["chunk"]);
    const eager = computed(() => _props["eager"] === undefined ? false : _props["eager"]);
    const className = computed(() => _props["class"]);
    const _hook8 = useColumns(() => minTile.value, () => GAP);
    const measure = computed(() => _hook8.value[0]);
    const columns = computed(() => _hook8.value[1]);
    const blocks = computed(() => {
      const out: T[][] = [];
      for (let i = 0; i < items.value.length; i += chunk.value) out.push(items.value.slice(i, i + chunk.value));
      return out;
    });
    return () => {
      return <div ref={measure.value} class={className.value}>
      {blocks.value.map((block, index) => {
          const rows = Math.ceil(block.length / columns.value);
          return <LazyMount key={getId.value(block[0]!)} eager={eager.value && index === 0} class={index ? "pt-2" as const : undefined} minHeight={rows * tileHeight.value + (rows - 1) * GAP + (index ? GAP : 0)}>
            <div class="grid" style={cssStyle({
              gridTemplateColumns: `repeat(auto-fill, minmax(min(${minTile.value}px, 100%), 1fr))`,
              gap: GAP
            })}>
              {block.map(item => <Fragment key={getId.value(item)}>{renderTile.value(item)}</Fragment>)}
            </div>
          </LazyMount>;
        })}
    </div>;
    };
  });
})();
export const ResultCount = defineUi<{
  shown: number;
  total: number;
  noun: string;
}>("ResultCount", ["shown", "total", "noun"], (_props, {
  slots: _slots
}) => {
  const shown = computed(() => _props["shown"]);
  const total = computed(() => _props["total"]);
  const noun = computed(() => _props["noun"]);
  return () => {
    return <p role="status" class="text-[15px] text-muted-foreground m-0 whitespace-nowrap">
      {shown.value === total.value ? `${total.value} ${noun.value}` : `${shown.value} of ${total.value} ${noun.value}`}
    </p>;
  };
});
