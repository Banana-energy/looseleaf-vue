// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, type ComputedRef, shallowRef, useId } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sketchpad, SketchpadCanvas, type SketchColor, type SketchStroke } from "@/components/ui/sketchpad";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { signatureBaselineRecipe, typedSignature } from "@/lib/ink/recipes/signature-pad-ink";
import { strokesToSvg, svgDataUrl } from "@/lib/ink/recipes/sketchpad-ink";
import { svgToPngDataUrl } from "@/lib/sketch-export";
import { cn } from "@/lib/utils";
type SignatureMode = "draw" | "type";
interface SignatureDetail {
  mode: SignatureMode;
  strokes: SketchStroke[];
  text: string;
}
interface SignaturePadContextValue {
  mode: SignatureMode;
  setMode(m: SignatureMode): void;
  typed: string;
  setTyped(t: string): void;
  strokes: SketchStroke[];
  setStrokes(s: SketchStroke[]): void;
  value: string;
  signed: boolean;
  clear(): void;
  width: number;
  height: number;
  disabled: boolean;
  readOnly: boolean;
  invalid: boolean;
  message: string;
  typedFallback: boolean;
  seed: string;
  penColor: SketchColor;
  focusTyped(): void;
}
const SignaturePadContext = createContext<SignaturePadContextValue | null>(null);
function useSignaturePad(): ComputedRef<SignaturePadContextValue> {
  const ctx = useContext(SignaturePadContext);
  return computed(() => {
    if (!ctx.value) console.error("SignaturePad parts must be used inside <SignaturePad>");
    return ctx.value;
  });
}
type SignaturePadProps = Omit<UI.ComponentProps<"div">, "onChange" | "defaultValue" | "color"> & {
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, detail: SignatureDetail) => void;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  message?: string;
  mode?: SignatureMode;
  defaultMode?: SignatureMode;
  onModeChange?: (mode: SignatureMode) => void;
  typedFallback?: boolean;
  penColor?: SketchColor;
  pen?: "brush" | "felt";
  format?: "svg" | "png";
  width?: number;
  height?: number;
  seed?: string | number;
};
const SignaturePad = defineUi<SignaturePadProps>("SignaturePad", ["class", "name", "value", "defaultValue", "onValueChange", "required", "disabled", "readOnly", "invalid", "message", "mode", "defaultMode", "onModeChange", "typedFallback", "penColor", "pen", "format", "width", "height", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const name = computed(() => _props["name"]);
  const valueProp = computed(() => _props["value"]);
  const defaultValue = computed(() => _props["defaultValue"] === undefined ? "" as const : _props["defaultValue"]);
  const onValueChange = computed(() => _props["onValueChange"]);
  const required = computed(() => _props["required"]);
  const disabled = computed(() => _props["disabled"] === undefined ? false : _props["disabled"]);
  const readOnly = computed(() => _props["readOnly"] === undefined ? false : _props["readOnly"]);
  const invalidProp = computed(() => _props["invalid"] === undefined ? false : _props["invalid"]);
  const message = computed(() => _props["message"] === undefined ? "Please sign in the box." as const : _props["message"]);
  const modeProp = computed(() => _props["mode"]);
  const defaultMode = computed(() => _props["defaultMode"] === undefined ? "draw" as const : _props["defaultMode"]);
  const onModeChange = computed(() => _props["onModeChange"]);
  const typedFallback = computed(() => _props["typedFallback"] === undefined ? true : _props["typedFallback"]);
  const penColor = computed(() => _props["penColor"] === undefined ? "ink-you" as const : _props["penColor"]);
  const pen = computed(() => _props["pen"] === undefined ? "brush" as const : _props["pen"]);
  const format = computed(() => _props["format"] === undefined ? "svg" as const : _props["format"]);
  const width = computed(() => _props["width"] === undefined ? 480 : _props["width"]);
  const height = computed(() => _props["height"] === undefined ? 180 : _props["height"]);
  const seed = computed(() => _props["seed"]);
  const props = computed(() => omitProps(_props, ["class", "children", "ref", "name", "value", "defaultValue", "onValueChange", "required", "disabled", "readOnly", "invalid", "message", "mode", "defaultMode", "onModeChange", "typedFallback", "penColor", "pen", "format", "width", "height", "seed"]));
  const rootRef = shallowRef<HTMLDivElement | null | null>(null);
  const inputRef = shallowRef<HTMLInputElement | null | null>(null);
  const strokes = shallowRef<SketchStroke[]>(initialState([]));
  const setStrokesState = stateSetter(strokes);
  const typed = shallowRef(initialState(""));
  const setTypedState = stateSetter(typed);
  const modeInner = shallowRef<SignatureMode>(initialState(defaultMode.value));
  const setModeInner = stateSetter(modeInner);
  const valueInner = shallowRef(initialState(defaultValue.value));
  const setValueInner = stateSetter(valueInner);
  const invalidForm = shallowRef(initialState(false));
  const setInvalidForm = stateSetter(invalidForm);
  const mode = computed(() => modeProp.value ?? modeInner.value);
  const value = computed(() => valueProp.value ?? valueInner.value);
  const uid = useId();
  const token = shallowRef(0);
  const published = shallowRef(valueProp.value ?? defaultValue.value);
  const resolve = (n: string) => {
    const el = rootRef.value;
    return el && typeof getComputedStyle !== "undefined" ? getComputedStyle(el).getPropertyValue(n).trim() || undefined : undefined;
  };
  const compose = (m: SignatureMode, s: SketchStroke[], t: string): string => {
    const pad = 6;
    let svg = "";
    if (m === "draw" && s.length) svg = strokesToSvg(s, {
      width: width.value,
      height: height.value,
      resolve,
      margin: pad,
      title: "Signature" as const
    });else if (m === "type" && t.trim()) {
      const sig = typedSignature(t, width.value, height.value, `${uid}${seed.value ?? ""}`);
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${width.value + 2 * pad} ${height.value + 2 * pad}" width="${width.value + 2 * pad}" height="${height.value + 2 * pad}" role="img"><title>Signature</title>${sig.svg}</svg>`;
      svg = svg.replace(/var\((--ll-[a-z0-9-]+)\)/g, (whole, n: string) => resolve(n) || whole);
    }
    return svg ? svgDataUrl(svg) : "" as const;
  };
  const publish = (m: SignatureMode, s: SketchStroke[], t: string) => {
    const detail: SignatureDetail = {
      mode: m,
      strokes: s,
      text: t
    };
    const svgUrl = compose(m, s, t);
    const put = (v: string) => {
      published.value = v;
      setValueInner(v);
      onValueChange.value?.(v, detail);
    };
    const mine = ++token.value;
    if (format.value === "png" && svgUrl) {
      const pad = 6;
      void svgToPngDataUrl(svgUrl, width.value + 2 * pad, height.value + 2 * pad, 2).then(png => {
        if (mine === token.value) put(png ?? svgUrl);
      });
    } else put(svgUrl);
    if (svgUrl) setInvalidForm(false);
  };
  const setStrokes = computed(() => (s: SketchStroke[]) => {
    setStrokesState(s);
    publish("draw", s, typed.value);
  });
  const setTyped = computed(() => (t: string) => {
    setTypedState(t);
    publish("type", strokes.value, t);
  });
  const setMode = computed(() => (m: SignatureMode) => {
    setModeInner(m);
    onModeChange.value?.(m);
    publish(m, strokes.value, typed.value);
  });
  const clear = computed(() => () => {
    if (mode.value === "type") {
      setTypedState("");
      publish("type", strokes.value, "");
    } else {
      setStrokesState([]);
      publish("draw", [], typed.value);
    }
  });
  watchDependencies(() => {
    if (valueProp.value === undefined || valueProp.value === published.value) return;
    published.value = valueProp.value;
    setStrokesState([]);
    setTypedState("");
  }, () => [valueProp.value], false);
  watchDependencies(() => {
    const form = inputRef.value?.form;
    if (!form) return;
    const onReset = () => {
      if (!strokes.value.length && !typed.value && !value.value) return;
      setStrokesState([]);
      setTypedState("");
      publish(mode.value, [], "");
    };
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, () => [strokes.value.length, typed.value, value.value, mode.value, publish], false);
  watchDependencies(() => {
    inputRef.value?.setCustomValidity(required.value && !value.value ? message.value : "" as const);
  }, () => [required.value, value.value, message.value], false);
  const invalid = computed(() => invalidProp.value || invalidForm.value);
  const ctx = computed<SignaturePadContextValue>(() => ({
    mode: mode.value,
    setMode: setMode.value,
    typed: typed.value,
    setTyped: setTyped.value,
    strokes: strokes.value,
    setStrokes: setStrokes.value,
    value: value.value,
    signed: !!value.value,
    clear: clear.value,
    width: width.value,
    height: height.value,
    disabled: disabled.value,
    readOnly: readOnly.value,
    invalid: invalid.value,
    message: message.value,
    typedFallback: typedFallback.value,
    seed: `${uid}${seed.value ?? ""}`,
    penColor: penColor.value,
    focusTyped: () => rootRef.value?.querySelector<HTMLElement>('[data-slot="signature-typed"] input')?.focus()
  }));
  return () => {
    return <SignaturePadContext.Provider value={ctx.value}>
      <Sketchpad data-slot="signature-pad" data-mode={mode.value} data-invalid={invalid.value ? "" as const : undefined} ref={useMergedRef<HTMLDivElement>(rootRef, ref.value)} class={cn("max-w-xl gap-2", className.value)} tool={pen.value} tools={[pen.value]} color={penColor.value} size={pen.value === "brush" ? 0.95 : 1.2} value={strokes.value} onValueChange={setStrokes.value} readOnly={readOnly.value || mode.value === "type"} disabled={disabled.value} width={width.value} height={height.value} seed={seed.value} {...domProps(props.value)}>
        {readSlot(_slots.default) ?? <>
            <SignaturePadCanvas />
            <SignaturePadTyped />
            {readOnly.value ? null : <div class="flex items-center justify-between gap-2">
                <SignaturePadClear />
                {typedFallback.value ? <SignaturePadModeToggle /> : null}
              </div>}
          </>}
        {name.value || required.value ? <input ref={inputRef} type="text" name={name.value} value={value.value} required={required.value} disabled={disabled.value} tabindex={-1} aria-hidden="true" onChange={() => {}} onInvalid={e => {
          e.preventDefault();
          setInvalidForm(true);
          rootRef.value?.querySelector<HTMLElement>(mode.value === "type" ? '[data-slot="signature-typed"] input' as const : '[data-slot="signature-canvas"]' as const)?.focus();
        }} class="sr-only" /> : null}
        {invalid.value ? <p role="alert" class="font-script text-xl leading-none text-red">
            {message.value}
          </p> : null}
      </Sketchpad>
    </SignaturePadContext.Provider>;
  };
});
const Guides = defineUi<{}>("Guides", [], (_props, {
  slots: _slots
}) => {
  const ctx = useSignaturePad();
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: signatureBaselineRecipe,
    params: {
      invalid: ctx.value.invalid
    },
    kind: "signature-baseline" as const,
    size: [ctx.value.width, ctx.value.height],
    seed: `${ctx.value.seed}|line`
  }));
  const typedSvg = computed(() => ctx.value.mode === "type" ? typedSignature(ctx.value.typed, ctx.value.width, ctx.value.height, ctx.value.seed).svg : "" as const);
  const empty = computed(() => !ctx.value.strokes.length && !ctx.value.typed.trim() && !ctx.value.value);
  return () => {
    return <>
      <div ref={hostRef} {...domProps(hostProps.value)} data-slot="signature-baseline" class="pointer-events-none absolute inset-0 isolate">
        {node.value}
      </div>
      {typedSvg.value ? <svg aria-hidden="true" focusable="false" viewBox={`0 0 ${ctx.value.width} ${ctx.value.height}`} preserveAspectRatio="none" class="pointer-events-none absolute inset-0 size-full forced-color-adjust-none" innerHTML={typedSvg.value} /> : null}
      {ctx.value.value && !ctx.value.strokes.length && !ctx.value.typed.trim() ? <img data-slot="signature-image" src={ctx.value.value} alt="Signature" class="pointer-events-none absolute inset-0 size-full object-contain" /> : null}
      {empty.value ? <span aria-hidden="true" class="pointer-events-none absolute start-[12%] font-script text-2xl leading-none text-pencil-text" style={cssStyle({
        top: "calc(72% - 2.4rem)" as const
      })}>
          {ctx.value.mode === "type" ? "Type your name below" as const : "Sign here" as const}
        </span> : null}
    </>;
  };
});
const SignaturePadCanvas = defineUi<Omit<UI.ComponentProps<typeof SketchpadCanvas>, "children" | "label">>("SignaturePadCanvas", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  const ctx = useSignaturePad();
  const label = computed(() => ctx.value.mode === "type" ? ctx.value.typed.trim() ? `Signature, typed: ${ctx.value.typed.trim()}` : "Signature, typed" as const : "Signature" as const);
  return () => {
    return <SketchpadCanvas data-slot="signature-canvas" paper="plain" label="Signature" {...domProps(ctx.value.mode === "type" ? {
      "aria-label": label.value
    } : {})} class={cn("w-full", className.value)} paperProps={{
      stock: "slip" as const,
      shadow: "hair" as const
    }} {...domProps(props.value)}>
      <Guides />
    </SketchpadCanvas>;
  };
});
const SignaturePadClear = defineUi<UI.ComponentProps<typeof Button>>("SignaturePadClear", ["onClick"], (_props, {
  slots: _slots
}) => {
  const children = renderValue(() => readSlot(_slots.default));
  const onClick = computed(() => _props["onClick"]);
  const props = computed(() => omitProps(_props, ["children", "onClick"]));
  const ctx = useSignaturePad();
  return () => {
    return <Button data-slot="signature-clear" type="button" variant="ghost" size="sm" disabled={ctx.value.disabled || ctx.value.readOnly || !(ctx.value.mode === "type" ? ctx.value.typed : ctx.value.strokes.length)} onClick={e => {
      onClick.value?.(e);
      if (e.defaultPrevented) return;
      ctx.value.clear();
      if (ctx.value.mode === "type") ctx.value.focusTyped();
    }} {...domProps(props.value)}>
      {readSlot(_slots.default) ?? "Clear"}
    </Button>;
  };
});
const SignaturePadModeToggle = defineUi<UI.ComponentProps<typeof Button>>("SignaturePadModeToggle", ["onClick"], (_props, {
  slots: _slots
}) => {
  const children = renderValue(() => readSlot(_slots.default));
  const onClick = computed(() => _props["onClick"]);
  const props = computed(() => omitProps(_props, ["children", "onClick"]));
  const ctx = useSignaturePad();
  return () => {
    return <Button data-slot="signature-mode" type="button" variant="link" size="sm" disabled={ctx.value.disabled || ctx.value.readOnly} aria-pressed={ctx.value.mode === "type"} onClick={e => {
      onClick.value?.(e);
      if (!e.defaultPrevented) ctx.value.setMode(ctx.value.mode === "type" ? "draw" as const : "type" as const);
    }} {...domProps(props.value)}>
      {readSlot(_slots.default) ?? (ctx.value.mode === "type" ? "Draw instead" as const : "Type instead" as const)}
    </Button>;
  };
});
const SignaturePadTyped = defineUi<Omit<UI.ComponentProps<typeof Input>, "value" | "defaultValue">>("SignaturePadTyped", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  const ctx = useSignaturePad();
  return () => {
    if (ctx.value.mode !== "type") return null;
    return <div data-slot="signature-typed" class={cn("w-full pt-1", className.value)}>
      <Input type="text" autocomplete="name" aria-label="Type your full name" placeholder="Type your full name" value={ctx.value.typed} onChange={(e: Event) => ctx.value.setTyped((e.target as HTMLInputElement).value)} disabled={ctx.value.disabled} class="w-full font-script text-2xl" {...domProps(props.value)}>{_slots.default?.()}</Input>
    </div>;
  };
});
export { SignaturePad, SignaturePadCanvas, SignaturePadClear, SignaturePadModeToggle, SignaturePadTyped, useSignaturePad };
export type { SignaturePadProps, SignatureDetail, SignatureMode };
