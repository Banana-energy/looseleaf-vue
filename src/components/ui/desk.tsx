// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { clip, coffeeRing, pin, ruler } from "@/lib/ink/paper/props";
import { PropSvg } from "@/lib/ink/paper/prop-svg";
import { dropShadow } from "@/lib/ink/paper/shadows";
import { InkTiles, useDensity, useInkSeed, useInkTier } from "@/lib/ink/vue";
import { DESK_OBJECTS, pencil, type DeskObject } from "@/lib/ink/recipes/desk-ink";
import { cn } from "@/lib/utils";
type DeskElement = "div" | "main" | "section" | "article";
type DeskProps = UI.ComponentProps<"div"> & {
  as?: DeskElement;
  objects?: readonly DeskObject[] | boolean;
  lamp?: number | boolean;
  seed?: string | number;
};
function lampVignette(lamp: number): string | undefined {
  if (lamp === 1) return undefined;
  if (lamp <= 0) return "linear-gradient(transparent, transparent)";
  return `radial-gradient(ellipse 120% 100% at 50% 40%, transparent 60%, rgb(var(--ll-shade) / calc(${Math.round(lamp * lamp * 0.05 * 1000) / 1000} * var(--ll-shadow-k))))`;
}
const Desk = defineUi<DeskProps>("Desk", ["class", "style", "as", "objects", "lamp", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const style = computed(() => _props["style"]);
  const children = renderValue(() => readSlot(_slots.default));
  const as = computed(() => _props["as"] === undefined ? "div" as const : _props["as"]);
  const objects = computed(() => _props["objects"] === undefined ? false : _props["objects"]);
  const lamp = computed(() => _props["lamp"] === undefined ? 1 : _props["lamp"]);
  const seed = computed(() => _props["seed"]);
  const props = computed(() => omitProps(_props, ["class", "style", "children", "as", "objects", "lamp", "seed"]));
  const Comp = computed(() => jsxTag(as.value as UI.ElementType));
  const list = computed(() => objects.value === true ? DESK_OBJECTS : objects.value || []);
  const vignette = computed(() => lampVignette(lamp.value === true ? 1 : lamp.value === false ? 0 : lamp.value));
  return () => {
    return <>
      <InkTiles tiles={["linen"]} />
      <Comp.value data-slot="desk" class={cn("ll-desk relative isolate", className.value)} style={cssStyle(vignette.value ? {
        "--ll-desk-vignette": vignette.value,
        ...style.value
      } as UI.CSSProperties : style.value)} {...domProps(props.value)}>
        {list.value.length ? <DeskObjects objects={list.value} seed={seed.value} /> : null}
        {readSlot(_slots.default)}
      </Comp.value>
    </>;
  };
});
const PLACES: Record<DeskObject, string> = {
  coffee: "-bottom-12 -end-10 rotate-6" as const,
  pencil: "bottom-16 start-10 -rotate-[24deg] origin-left" as const,
  clips: "top-5 end-28" as const,
  ruler: "-bottom-1 start-[38%] -rotate-[1.4deg]" as const,
  pins: "top-4 start-24" as const
};
type DeskObjectsProps = Omit<UI.ComponentProps<"div">, "children"> & {
  objects: readonly DeskObject[];
  seed?: string | number;
};
const DeskObjects = defineUi<DeskObjectsProps>("DeskObjects", ["objects", "seed", "class"], (_props, {
  slots: _slots
}) => {
  const objects = computed(() => _props["objects"]);
  const seedProp = computed(() => _props["seed"]);
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["objects", "seed", "class"]));
  const seed = useInkSeed(() => seedProp.value);
  const tier = useInkTier();
  const _nestedHook0 = useDensity();
  const calm = computed(() => _nestedHook0.value === "calm");
  const art = computed(() => {
    const o = {
      tier: tier.value,
      calm: calm.value
    };
    return {
      coffee: [coffeeRing(`${seed.value}:coffee`, {
        radius: 64,
        ...o
      })],
      pencil: [pencil(`${seed.value}:pencil`, {
        length: 200,
        ...o
      })],
      clips: [clip(`${seed.value}:clip-a`, {
        height: 62,
        tone: "steel" as const,
        ...o
      }), clip(`${seed.value}:clip-b`, {
        height: 58,
        tone: "sky" as const,
        ...o
      })],
      ruler: [ruler(`${seed.value}:ruler`, 300, {
        height: 30,
        ...o
      })],
      pins: [pin(`${seed.value}:pin-a`, {
        size: 22,
        color: "tomato" as const,
        ...o
      }), pin(`${seed.value}:pin-b`, {
        size: 24,
        color: "sky" as const,
        ...o
      })]
    } satisfies Record<DeskObject, ReturnType<typeof pin>[]>;
  });
  return () => {
    return <div data-slot="desk-objects" aria-hidden="true" class={cn("pointer-events-none absolute inset-0 z-(--ll-z-sheet) overflow-hidden max-sm:hidden calm:hidden", className.value)} {...domProps(props.value)}>
      {objects.value.map(name => <div key={name} data-object={name} class={cn("absolute flex gap-2", PLACES[name])}>
          {art.value[name].map((res, i) => <PropSvg key={i} res={res} kind="prop" data-slot="desk-object" class={cn("block shrink-0", name === "clips" && (i ? "-mt-1 rotate-[-9deg]" as const : "rotate-12" as const), name === "pins" && (i ? "mt-4" as const : "" as const))} style={cssStyle(name === "coffee" ? undefined : {
          filter: dropShadow("prop")
        })} />)}
        </div>)}
    </div>;
  };
});
export { Desk, DeskObjects };
export type { DeskProps, DeskObjectsProps, DeskObject };
