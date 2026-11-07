// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { OTPInput, OTPInputContext, REGEXP_ONLY_CHARS, REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from "@/lib/otp-primitive";
import { Icon } from "@/components/ui/icon";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { otpCss, otpSlotRecipe } from "@/lib/ink/recipes/input-otp-ink";
import { cn } from "@/lib/utils";
const stripSeparators = (pasted: string): string => pasted.replace(/[\s\u2010-\u2015-]+/g, "");
const InvalidContext = createContext<{
  invalid: boolean;
  disabled: boolean;
  touched: boolean;
}>({
  invalid: false,
  disabled: false,
  touched: false
});
const InputOTP = defineUi<UI.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
  invalid?: boolean;
}>("InputOTP", ["class", "containerClassName", "invalid", "disabled", "onChange", "pasteTransformer"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const containerClassName = computed(() => _props["containerClassName"]);
  const invalid = computed(() => _props["invalid"]);
  const disabled = computed(() => _props["disabled"]);
  const onChange = computed(() => _props["onChange"]);
  const pasteTransformer = computed(() => _props["pasteTransformer"] === undefined ? stripSeparators : _props["pasteTransformer"]);
  const props = computed(() => omitProps(_props, ["class", "containerClassName", "invalid", "disabled", "onChange", "pasteTransformer"]));
  const touched = shallowRef(initialState(false));
  const setTouched = stateSetter(touched);
  const bad = computed(() => !!invalid.value || props.value["aria-invalid"] === true || props.value["aria-invalid"] === "true");
  const value = computed(() => ({
    invalid: bad.value,
    disabled: !!disabled.value,
    touched: touched.value
  }));
  return () => {
    return <InvalidContext.Provider value={value.value}>
      <style>
        {otpCss()}
      </style>
      <OTPInput data-slot="input-otp" data-touched={touched.value ? "" as const : undefined} aria-invalid={bad.value || undefined} disabled={disabled.value} pasteTransformer={pasteTransformer.value} containerClassName={cn("group/otp flex max-w-full flex-nowrap items-center gap-3 has-disabled:cursor-not-allowed", containerClassName.value)} class={cn("disabled:cursor-not-allowed", className.value)} onChange={v => {
        setTouched(true);
        onChange.value?.(v);
      }} {...domProps(props.value)}>{_slots.default?.()}</OTPInput>
    </InvalidContext.Provider>;
  };
});
const InputOTPGroup = defineUi<UI.ComponentProps<"div">>("InputOTPGroup", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="input-otp-group" class={cn("flex min-w-0 items-center gap-1.5 calm:gap-1", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const InputOTPSlot = defineUi<UI.ComponentProps<"div"> & {
  index: number;
  seed?: string | number;
}>("InputOTPSlot", ["index", "class", "seed"], (_props, {
  slots: _slots
}) => {
  const index = computed(() => _props["index"]);
  const className = computed(() => _props["class"]);
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["index", "class", "seed", "ref"]));
  const inputOTPContext = useContext(OTPInputContext);
  const _context6 = useContext(InvalidContext);
  const invalid = computed(() => _context6.value.invalid);
  const disabled = computed(() => _context6.value.disabled);
  const touched = computed(() => _context6.value.touched);
  const char = computed(() => (inputOTPContext.value?.slots[index.value] ?? {}).char);
  const hasFakeCaret = computed(() => (inputOTPContext.value?.slots[index.value] ?? {}).hasFakeCaret);
  const isActive = computed(() => (inputOTPContext.value?.slots[index.value] ?? {}).isActive);
  const placeholderChar = computed(() => (inputOTPContext.value?.slots[index.value] ?? {}).placeholderChar);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: otpSlotRecipe,
    params: {
      invalid: invalid.value,
      disabled: disabled.value,
      active: !!isActive.value,
      filled: !!char.value
    },
    kind: "field" as const,
    seed: seed.value,
    still: true
  }));
  return () => {
    return <div data-slot="input-otp-slot" data-active={isActive.value} data-filled={char.value ? "true" as const : undefined} data-focus-visible={isActive.value ? "" as const : undefined} data-invalid={invalid.value ? "" as const : undefined} ref={useMergedRef<HTMLDivElement>(hostRef, ref.value)} {...domProps(hostProps.value)} class={cn("relative isolate flex h-12 w-10 min-w-6 items-center justify-center font-script text-[1.75rem] leading-none font-semibold text-(--ll-input-ink) select-none compact:h-10 compact:w-9 calm:h-9 calm:w-8 calm:text-2xl", "data-[active=true]:z-10 forced-colors:border forced-colors:border-[CanvasText]", disabled.value && "text-pencil-text", className.value)} {...domProps(props.value)}>
      {node.value}
      {char.value ? <span key={char.value} class={cn(touched.value && "animate-pop")}>
          {char.value}
        </span> : placeholderChar.value && <span class="text-(--ll-placeholder)">{placeholderChar.value}</span>}
      {hasFakeCaret.value && <span aria-hidden="true" class="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span data-part="caret" />
        </span>}
    </div>;
  };
});
const InputOTPSeparator = defineUi<UI.ComponentProps<"div">>("InputOTPSeparator", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="input-otp-separator" role="separator" class={cn("shrink-0 text-ink-soft", className.value)} {...domProps(props.value)}>
      <Icon name="minus" size={20} />
    </div>;
  };
});
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator, REGEXP_ONLY_CHARS, REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS };
