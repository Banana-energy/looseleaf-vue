// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId, shallowRef } from "vue";
import { ChatAlignContext } from "@/lib/chat-align";
import { makeRng } from "@/lib/ink/rng";
import { cn } from "@/lib/utils";
const MessageGroup = defineUi<UI.ComponentProps<"div">>("MessageGroup", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="message-group" class={cn("flex min-w-0 flex-col gap-2", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const Message = defineUi<UI.ComponentProps<"div"> & {
  align?: "start" | "end";
}>("Message", ["class", "align"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const align = computed(() => _props["align"] === undefined ? "start" as const : _props["align"]);
  const props = computed(() => omitProps(_props, ["class", "align"]));
  return () => {
    return <ChatAlignContext.Provider value={align.value}>
      <div data-slot="message" data-align={align.value} class={cn("group/message relative flex w-full min-w-0 gap-2 text-[15px] data-[align=end]:flex-row-reverse", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>
    </ChatAlignContext.Provider>;
  };
});
const MessageAvatar = defineUi<UI.ComponentProps<"div">>("MessageAvatar", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="message-avatar" class={cn("flex w-fit min-w-8 shrink-0 items-center justify-center self-end group-has-data-[slot=message-footer]/message:-translate-y-8", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const MessageContent = defineUi<UI.ComponentProps<"div">>("MessageContent", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="message-content" class={cn("flex w-full min-w-0 flex-col gap-2.5 wrap-break-word group-data-[align=end]/message:*:data-slot:self-end", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const MessageHeader = defineUi<UI.ComponentProps<"div">>("MessageHeader", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="message-header" class={cn("flex max-w-full min-w-0 items-center gap-2 px-3 font-hand text-sm font-bold text-muted-foreground group-has-data-[variant=ghost]/message:px-0", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const MessageFooter = defineUi<UI.ComponentProps<"div">>("MessageFooter", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="message-footer" class={cn("flex max-w-full min-w-0 items-center gap-2 px-3 font-hand text-sm text-muted-foreground group-has-data-[variant=ghost]/message:px-0 group-data-[align=end]/message:justify-end", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
function jitterOf(seed: string, index: number): UI.CSSProperties {
  const r = makeRng(`${seed}:${index}`);
  return {
    "--jy": `${((r() * 2 - 1) * 0.6).toFixed(2)}px`,
    "--jo": (0.88 + r() * 0.12).toFixed(2)
  } as UI.CSSProperties;
}
const CSS = `[data-slot=message-text] [style*="--jy"]{position:relative;top:calc(var(--jy,0px)*var(--ll-jitter-k,1));color:color-mix(in srgb,currentColor calc((1 - (1 - var(--jo,1))*var(--ll-jitter-k,1))*100%),transparent)}`;
const WORDS = /(\s+)/;
const RTL_SCRIPT = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;
const CARET = "after:ms-0.5 after:inline-block after:h-[1.05em] after:w-0.5 after:animate-pulse after:rounded-full after:bg-ink-you after:align-[-0.18em] after:content-['']";
const MessageText = defineUi<Omit<UI.ComponentProps<"span">, "children"> & {
  children?: string;
  streaming?: boolean;
  jitter?: boolean;
  seed?: string | number;
}>("MessageText", ["streaming", "jitter", "seed", "class"], (_props, {
  slots: _slots
}) => {
  const children = renderValue(() => readSlot(_slots.default));
  const streaming = computed(() => _props["streaming"] === undefined ? false : _props["streaming"]);
  const jitter = computed(() => _props["jitter"] === undefined ? true : _props["jitter"]);
  const seed = computed(() => _props["seed"]);
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["children", "streaming", "jitter", "seed", "class"]));
  const id = useId();
  const text = computed(() => children.value ?? "");
  const s = computed(() => seed.value === undefined ? id : String(seed.value));
  const bidi = computed(() => RTL_SCRIPT.test(text.value));
  const parts = computed(() => bidi.value ? [] : text.value.split(WORDS));
  const last = shallowRef(parts.value.length - 1);
  const settled = shallowRef<number | null | null>(null);
  const word = shallowRef(0);
  const out = renderValue(() => parts.value.map((p, i) => {
    if (p === "") return null;
    if (i % 2 === 1) return p;
    const n = word.value++;
    const fresh = streaming.value && i >= (settled.value ?? 0);
    return <span key={i} data-word={fresh ? "fresh" as const : undefined} class={cn(fresh && "animate-soak", streaming.value && i === last.value && CARET) || undefined} style={cssStyle(jitter.value ? jitterOf(s.value, n) : undefined)}>
        {p}
      </span>;
  }));
  return () => {
    while (last.value > 0 && (parts.value[last.value] === "" || last.value % 2 === 1)) last.value--;
    if (settled.value === null) {
      let end = parts.value.length;
      while (end > 0 && parts.value[end - 1] === "") end--;
      settled.value = end;
    }
    return <span data-slot="message-text" data-streaming={streaming.value ? "" as const : undefined} dir={bidi.value ? "auto" as const : undefined} class={cn("whitespace-pre-wrap", bidi.value && streaming.value && CARET, className.value)} {...domProps(props.value)}>
      {jitter.value && !bidi.value ? <style>
          {CSS}
        </style> : null}
      {bidi.value ? text.value : out.value}
    </span>;
  };
});
export { MessageGroup, Message, MessageAvatar, MessageContent, MessageFooter, MessageHeader, MessageText };
