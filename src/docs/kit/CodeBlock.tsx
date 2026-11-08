// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { CodeBlock as CodeSlip, CodeBlockActions, CodeBlockContent, CodeBlockCopy, CodeBlockHeader, CodeBlockTitle } from "@/components/ui/code-block";
import { InlineCode as CodeChip } from "@/components/ui/typography";
import { Kbd as KeyCap } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";
import { Glyph } from "./glyphs";
import { useAnnounce } from "../core/announcer";
import { useCopy } from "../core/hooks";
import { useLocaleText } from "../core/settings";
export interface CodeBlockProps {
  code: string;
  lang?: string;
  title?: string;
  lineNumbers?: boolean;
  copy?: boolean;
  maxHeight?: number;
  className?: string;
}
export const CodeBlock = defineUi<CodeBlockProps>("CodeBlock", ["code", "lang", "title", "lineNumbers", "copy", "maxHeight", "class"], (_props, {
  slots: _slots
}) => {
  const code = computed(() => _props["code"]);
  const lang = computed(() => _props["lang"] === undefined ? "tsx" as const : _props["lang"]);
  const title = computed(() => _props["title"]);
  const lineNumbers = computed(() => _props["lineNumbers"] === undefined ? false : _props["lineNumbers"]);
  const copy = computed(() => _props["copy"] === undefined ? true : _props["copy"]);
  const maxHeight = computed(() => _props["maxHeight"]);
  const className = computed(() => _props["class"]);
  const locale = useLocaleText();
  const trimmed = computed(() => code.value.replace(/\n+$/, ""));
  const name = computed(() => title.value ?? lang.value);
  return () => {
    return <CodeSlip code={trimmed.value} language={lang.value} filename={title.value ?? lang.value} lineNumbers={lineNumbers.value} class={cn("my-2", className.value)}>
      <CodeBlockHeader>
        <CodeBlockTitle />
        {copy.value ? <CodeBlockActions>
            <CodeBlockCopy />
          </CodeBlockActions> : null}
      </CodeBlockHeader>
      <CodeBlockContent role="group" aria-label={`${locale.value.locale === "zh-CN" ? "代码" : "Code"}: ${name.value}`} style={cssStyle(maxHeight.value ? {
        maxHeight: maxHeight.value
      } : undefined)} class={maxHeight.value ? "overflow-y-auto" as const : undefined} />
    </CodeSlip>;
  };
});
export const CopyButton = defineUi<{
  text: string;
  label?: string;
  className?: string;
}>("CopyButton", ["text", "label", "class"], (_props, {
  slots: _slots
}) => {
  const text = computed(() => _props["text"]);
  const label = computed(() => _props["label"] === undefined ? locale.value.locale === "zh-CN" ? "复制代码" as const : "Copy code" as const : _props["label"]);
  const className = computed(() => _props["class"]);
  const _hook3 = useCopy();
  const copied = computed(() => _hook3.value.copied);
  const copy = computed(() => _hook3.value.copy);
  const announce = useAnnounce();
  const locale = useLocaleText();
  return () => {
    return <button type="button" class={cn("inline-flex min-h-hit-min items-center gap-1.5 px-2 font-type text-[13px] tracking-wide text-ink-muted hover:ll-swipe hover:text-ink data-copied:text-green", className.value)} onClick={async () => {
      if (await copy.value(text.value)) announce.value(locale.value.locale === "zh-CN" ? "已复制到剪贴板" : "Copied to clipboard");
    }} aria-label={copied.value ? "Copied" as const : label.value} data-copied={copied.value || undefined}>
      <Glyph name={copied.value ? "check" as const : "copy" as const} size={16} />
      <span aria-hidden="true">{copied.value ? "copied" as const : "copy" as const}</span>
    </button>;
  };
});
export const InlineCode = defineUi<UI.ComponentProps<"code">>("InlineCode", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <CodeChip class={className.value} {...domProps(props.value)}>{_slots.default?.()}</CodeChip>;
  };
});
export const Kbd = defineUi<UI.ComponentProps<"kbd">>("Kbd", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <KeyCap class={className.value} {...domProps(props.value)}>{_slots.default?.()}</KeyCap>;
  };
});
