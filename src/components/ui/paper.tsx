// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, proxyRefs } from "vue";
import { isCutEdge, edgeInset, edgeName, type EdgeSpec } from "@/lib/ink/paper/edges";
import { PaperDefs } from "@/lib/ink/paper/defs";
import { faceLook, tilesOf } from "@/lib/ink/paper/faces";
import { clip, pin, staple, binderClip, type Accent, type TapeKind } from "@/lib/ink/paper/props";
import { PropSvg } from "@/lib/ink/paper/prop-svg";
import { useInkFaces } from "@/lib/ink/paper/sheet-layers";
import { dropShadow, sheetShadow, tiltFor, type SheetShadowKind } from "@/lib/ink/paper/shadows";
import { RULE_OFFSET_VAR, ruleGeometry, rulesLayer, stockOf, type RuleName, type StockName } from "@/lib/ink/paper/stocks";
import { InkTiles, useDensity, useInk, useInkSeed, useInkTier, useMergedRef } from "@/lib/ink/vue";
import { handRulesRecipe, sheetRecipe } from "@/lib/ink/recipes/paper-ink";
import { cn } from "@/lib/utils";
import { Tape } from "@/components/ui/tape";
type FastenerKind = "clip" | "pin" | "staple" | "binder-clip";
type TapePlacement = "corner" | "top" | "both";
type PaperElement = "div" | "section" | "article" | "aside" | "header" | "footer" | "main" | "nav" | "li" | "ul" | "ol" | "form" | "fieldset" | "figure";
type PaperProps = Omit<UI.ComponentProps<"div">, "ref"> & {
  ref?: UI.Ref<HTMLElement>;
  stock?: StockName;
  edge?: EdgeSpec;
  tilt?: boolean | number;
  rules?: RuleName;
  tape?: TapePlacement | false;
  tapeKind?: TapeKind;
  fastener?: FastenerKind | false;
  fastenerTone?: "steel" | Accent;
  fastenerClassName?: string;
  shadow?: "stock" | "none" | SheetShadowKind;
  curl?: boolean;
  as?: PaperElement;
  seed?: string | number;
  size?: readonly [number, number];
};
const RULED = new Set<RuleName>(["ruled", "ruled-hand", "index", "pad", "ledger"]);
const TAPE_PLACES: Record<TapePlacement, ReadonlyArray<{
  className: string;
  angle: number;
}>> = {
  corner: [{
    className: "-top-2 -left-7" as const,
    angle: -38
  }],
  top: [{
    className: "-top-3 left-1/2 -ml-8" as const,
    angle: -2
  }],
  both: [{
    className: "-top-2 -left-7" as const,
    angle: -38
  }, {
    className: "-top-2 -right-7" as const,
    angle: 36
  }]
};
const FASTENER_PLACE: Record<FastenerKind, string> = {
  clip: "-top-5 right-8" as const,
  pin: "-top-2 left-1/2 -ml-3" as const,
  staple: "top-2 left-2" as const,
  "binder-clip": "-top-10 left-1/2 -ml-[26px]" as const
};
const CURL = 34;
const Paper = defineUi<PaperProps>("Paper", ["class", "style", "stock", "edge", "tilt", "rules", "tape", "tapeKind", "fastener", "fastenerTone", "fastenerClassName", "shadow", "curl", "as", "seed", "size"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const stock = computed(() => _props["stock"] === undefined ? "paper" as const : _props["stock"]);
  const edge = computed(() => _props["edge"]);
  const tilt = computed(() => _props["tilt"] === undefined ? true : _props["tilt"]);
  const rules = computed(() => _props["rules"]);
  const tape = computed(() => _props["tape"]);
  const tapeKind = computed(() => _props["tapeKind"] === undefined ? "masking" as const : _props["tapeKind"]);
  const fastener = computed(() => _props["fastener"] === undefined ? false : _props["fastener"]);
  const fastenerTone = computed(() => _props["fastenerTone"]);
  const fastenerClassName = computed(() => _props["fastenerClassName"]);
  const shadow = computed(() => _props["shadow"] === undefined ? "stock" as const : _props["shadow"]);
  const curl = computed(() => _props["curl"] === undefined ? false : _props["curl"]);
  const as = computed(() => _props["as"] === undefined ? "div" as const : _props["as"]);
  const seedProp = computed(() => _props["seed"]);
  const size = computed(() => _props["size"]);
  const props = computed(() => omitProps(_props, ["class", "style", "children", "ref", "stock", "edge", "tilt", "rules", "tape", "tapeKind", "fastener", "fastenerTone", "fastenerClassName", "shadow", "curl", "as", "seed", "size"]));
  const Comp = computed(() => jsxTag(as.value as UI.ElementType));
  const S = computed(() => stockOf(stock.value));
  const _nestedHook0 = useDensity();
  const calm = computed(() => _nestedHook0.value === "calm");
  const requested = computed<EdgeSpec>(() => calm.value ? "cut" as const : edge.value ?? S.value.edge);
  const drawn = computed(() => !isCutEdge(requested.value) || curl.value && !calm.value);
  const shadowKind = computed(() => shadow.value === "stock" ? undefined : shadow.value);
  const sheetParams = computed(() => ({
    stock: S.value.name,
    edge: requested.value,
    chamfer: curl.value && !calm.value ? CURL : undefined,
    shadow: shadowKind.value
  }));
  const {
    hostRef,
    hostProps,
    node,
    seed
  } = useInkFaces(() => ({
    recipe: sheetRecipe,
    params: sheetParams.value,
    kind: "sheet" as const,
    size: drawn.value ? size.value : undefined,
    seed: seedProp.value
  }));
  const merged = computed(() => useMergedRef<HTMLElement>(drawn.value ? hostRef : undefined, ref.value));
  const ready = computed(() => drawn.value && node.value !== null);
  const ruleName = computed<RuleName>(() => rules.value ?? S.value.rules);
  const handRules = computed(() => ruleName.value === "ruled-hand" && !calm.value);
  const _handCore = useInk(() => ({
    recipe: handRulesRecipe,
    params: {
      paper: S.value.name === "pad" ? "pad" as const : "ruled" as const
    },
    kind: "rules" as const,
    seed: `${seed.value}|rules`
  }));
  const hand = computed(() => proxyRefs(_handCore));
  const layer = computed(() => rulesLayer(ruleName.value === "ruled-hand" ? calm.value ? "ruled" as const : "none" as const : ruleName.value, {
    calm: calm.value
  }));
  const handOffset = computed(() => ruleGeometry("ruled", {
    calm: calm.value
  }).offset);
  const deg = computed(() => tilt.value === false ? 0 : typeof tilt.value === "number" ? tilt.value : tiltFor(seed.value, S.value.tilt * (RULED.has(ruleName.value) ? 0.45 : 1)));
  const vars = computed<Record<string, string>>(() => ready.value ? {} : faceLook(S.value.name, seed.value).vars);
  const inset = computed(() => drawn.value ? Math.ceil(edgeInset(requested.value)) + 1 : 0);
  const places = computed(() => tape.value ? TAPE_PLACES[tape.value] : []);
  const cssTiles = computed(() => ready.value ? null : tilesOf([S.value.name]));
  return () => {
    if (deg.value) vars.value["--ll-tilt"] = `${deg.value}deg`;
    if (shadow.value !== "stock") vars.value["--ll-sheet-shadow"] = shadow.value === "none" ? "none" as const : sheetShadow(shadow.value);
    return <>
      {cssTiles.value ? <InkTiles tiles={cssTiles.value} /> : null}
      <Comp.value data-slot="paper" data-stock={S.value.name} data-edge={ready.value ? curl.value && isCutEdge(requested.value) ? "curl" as const : edgeName(requested.value) : "cut" as const} ref={merged.value} {...domProps(ready.value ? hostProps.value : {})} class={cn("ll-paper", S.value.stockClass, S.value.toothClass, S.value.shadowClass, "calm:[--ll-sheet-shadow:var(--ll-shadow-hair)]", className.value)} style={cssStyle({
        ...vars.value,
        ...style.value
      } as UI.CSSProperties)} {...domProps(props.value)}>
        {drawn.value ? node.value : null}
        {layer.value ? <span data-slot="paper-rules" aria-hidden="true" class="ll-tilt-layer ll-multiply pointer-events-none absolute z-(--ll-z-sheet)" style={cssStyle({
          inset: inset.value,
          ...layer.value.style,
          ...(deg.value ? {
            "--ll-tilt": `${deg.value}deg`
          } : {})
        } as UI.CSSProperties)} /> : null}
        {handRules.value ? <span data-slot="paper-rules" aria-hidden="true" ref={hand.value.hostRef} {...domProps(hand.value.node ? hand.value.hostProps : {})} class="ll-tilt-layer ll-multiply pointer-events-none absolute isolate z-(--ll-z-sheet)" style={cssStyle({
          inset: inset.value,
          translate: `0 calc(${handOffset.value}px - var(${RULE_OFFSET_VAR}, ${handOffset.value}px))`,
          ...(deg.value ? {
            "--ll-tilt": `${deg.value}deg`
          } as UI.CSSProperties : {})
        })}>
            {hand.value.node}
          </span> : null}
        {readSlot(_slots.default)}
        {places.value.map((p, i) => <Tape key={i} kind={tapeKind.value} length={64} height={20} angle={p.angle} seed={`${seed.value}:tape:${i}`} class={cn("absolute z-(--ll-z-prop) calm:hidden", p.className)} />)}
        {fastener.value ? <Fastener kind={fastener.value} tone={fastenerTone.value} seed={`${seed.value}:fastener`} class={cn("absolute z-(--ll-z-prop) calm:hidden", FASTENER_PLACE[fastener.value], fastenerClassName.value)} /> : null}
      </Comp.value>
    </>;
  };
});
type FastenerProps = Omit<UI.ComponentProps<"svg">, "children"> & {
  kind?: FastenerKind;
  tone?: "steel" | Accent;
  size?: number;
  seed?: string | number;
};
const Fastener = defineUi<FastenerProps>("Fastener", ["kind", "tone", "size", "seed", "class", "style"], (_props, {
  slots: _slots
}) => {
  const kind = computed(() => _props["kind"] === undefined ? "clip" as const : _props["kind"]);
  const tone = computed(() => _props["tone"]);
  const size = computed(() => _props["size"]);
  const seedProp = computed(() => _props["seed"]);
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const props = computed(() => omitProps(_props, ["kind", "tone", "size", "seed", "class", "style"]));
  const seed = useInkSeed(() => seedProp.value);
  const tier = useInkTier();
  const _nestedHook0 = useDensity();
  const calm = computed(() => _nestedHook0.value === "calm");
  const res = computed(() => {
    const s = `${seed.value}|${kind.value}`;
    if (kind.value === "pin") return pin(s, {
      size: size.value ?? 24,
      color: tone.value && tone.value !== "steel" ? tone.value : undefined,
      tier: tier.value,
      calm: calm.value
    });
    if (kind.value === "staple") return staple(s, {
      length: size.value ?? 20,
      tier: tier.value,
      calm: calm.value
    });
    if (kind.value === "binder-clip") return binderClip(s, {
      width: size.value ?? 52,
      tier: tier.value,
      calm: calm.value
    });
    return clip(s, {
      height: size.value ?? 62,
      tone: tone.value ?? "steel",
      tier: tier.value,
      calm: calm.value
    });
  });
  const jitter = computed(() => Math.round(tiltFor(`${seed.value}|at`, 1) * 6));
  return () => {
    return <PropSvg res={res.value} kind="sticker" data-slot="fastener" data-kind={kind.value} class={cn("pointer-events-none relative z-(--ll-z-prop) block shrink-0", className.value)} style={cssStyle({
      filter: dropShadow("prop"),
      translate: `${jitter.value}px 0`,
      ...style.value
    })} {...domProps(props.value)}>{_slots.default?.()}</PropSvg>;
  };
});
export { Paper, Fastener, PaperDefs };
export type { PaperProps, FastenerProps, FastenerKind, TapePlacement };
