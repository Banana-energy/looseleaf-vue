// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef, useId } from "vue";
import { splitFieldClass } from "@/lib/field-class";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { textareaRecipe } from "@/lib/ink/recipes/textarea-ink";
import { cn } from "@/lib/utils";
const control = "min-w-0 flex-1 resize-y appearance-none self-stretch border-0 bg-transparent px-3 py-2 text-[length:inherit] leading-6 [text-align:inherit] " + "disabled:cursor-not-allowed disabled:text-pencil-text aria-invalid:pe-9 forced-colors:aria-invalid:underline forced-colors:aria-invalid:decoration-wavy [&::-webkit-resizer]:bg-transparent " + "autofill:shadow-[inset_0_0_0_1000px_var(--ll-slip)] autofill:[-webkit-text-fill-color:var(--ll-input-ink)]";
const RULED_LINE = 28;
const RULED_TOP = 8;
const frame = "relative isolate flex min-h-16 w-full min-w-0 items-stretch font-hand text-base text-(--ll-input-ink) caret-(--ll-caret) calm:text-[15px]";
const isTrue = (v: unknown) => v === true || v === "true";
const noResize = (s: string) => /(?:^|\s)(?:[^\s:]+:)*resize-none(?:\s|$)/.test(s);
const TextareaControl = defineUi<UI.ComponentProps<"textarea">>("TextareaControl", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <textarea data-slot="textarea" class={cn(control, "field-sizing-content", className.value)} {...domProps(props.value, true)}>{_slots.default?.()}</textarea>;
  };
});
interface CountInfo {
  length: number;
  max?: number;
}
const Textarea = defineUi<UI.ComponentProps<"textarea"> & {
  inputClassName?: string;
  ruled?: boolean;
  autoGrow?: boolean;
  showCount?: boolean | ((info: CountInfo) => UI.ReactNode);
  seed?: string | number;
}>("Textarea", ["class", "inputClassName", "ruled", "autoGrow", "showCount", "seed", "style", "onChange"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const inputClassName = computed(() => _props["inputClassName"]);
  const ruled = computed(() => _props["ruled"] === undefined ? false : _props["ruled"]);
  const autoGrow = computed(() => _props["autoGrow"] === undefined ? true : _props["autoGrow"]);
  const showCount = computed(() => _props["showCount"] === undefined ? false : _props["showCount"]);
  const seed = computed(() => _props["seed"]);
  const style = computed(() => _props["style"]);
  const ref = computed(() => _props["ref"]);
  const onChange = computed(() => _props["onChange"]);
  const props = computed(() => omitProps(_props, ["class", "inputClassName", "ruled", "autoGrow", "showCount", "seed", "style", "ref", "onChange"]));
  const split = computed(() => splitFieldClass(className.value));
  const grow = computed(() => autoGrow.value || ruled.value);
  const resizable = computed(() => !noResize(`${className.value ?? ""} ${inputClassName.value ?? ""}`));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: textareaRecipe,
    params: {
      disabled: !!props.value.disabled,
      invalid: isTrue(props.value["aria-invalid"]),
      readOnly: !!props.value.readOnly,
      ruled: ruled.value,
      lineHeight: RULED_LINE,
      ruleTop: RULED_TOP,
      grip: resizable.value
    },
    kind: "field" as const,
    seed: seed.value,
    still: true
  }));
  const inner = shallowRef<HTMLTextAreaElement | null | null>(null);
  const typed = shallowRef(initialState(() => String(props.value.defaultValue ?? "").length));
  const setTyped = stateSetter(typed);
  watchDependencies(() => {
    const form = inner.value?.form;
    if (!showCount.value || !form) return;
    const onReset = () => queueMicrotask(() => setTyped(inner.value?.value.length ?? 0));
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, () => [showCount.value], false);
  const length = computed(() => props.value.value !== undefined ? String(props.value.value).length : typed.value);
  const mergedRef = computed(() => useMergedRef(ref.value, inner));
  const countId = useId();
  const count = computed(() => typeof showCount.value === "function" ? showCount.value({
    length: length.value,
    max: props.value.maxLength
  }) : `${length.value}${props.value.maxLength ? `/${props.value.maxLength}` : "" as const}`);
  return () => {
    return <span data-slot="textarea-frame" data-ink-focus="within" ref={hostRef} {...domProps(hostProps.value)} style={cssStyle(style.value)} class={cn(frame, ruled.value && "min-h-24", split.value.frame)}>
      {node.value}
      <TextareaControl {...domProps(props.value)} ref={mergedRef.value} class={cn(!grow.value && "field-sizing-fixed", showCount.value && "pb-7", split.value.control, inputClassName.value, ruled.value && "pt-2 pb-2 leading-7")} aria-describedby={showCount.value ? cn(countId, props.value["aria-describedby"]) : props.value["aria-describedby"]} onChange={(e: Event) => {
        if (showCount.value) setTyped((e.currentTarget as HTMLTextAreaElement).value.length);
        onChange.value?.(e);
      }}>{_slots.default?.()}</TextareaControl>
      {showCount.value && <span data-slot="textarea-count" id={countId} class="pointer-events-none absolute end-6 bottom-1.5 text-sm text-ink-muted ll-num">
          <span aria-hidden="true">{count.value}</span>
          <span class="sr-only">
            {length.value} characters{props.value.maxLength ? ` of ${props.value.maxLength}` : "" as const}
          </span>
        </span>}
    </span>;
  };
});
export { Textarea, TextareaControl };
