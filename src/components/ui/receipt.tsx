// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Paper, type PaperProps } from "@/components/ui/paper";
import type { EdgeKind } from "@/lib/ink/paper/edges";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { barcode, receiptCircleRecipe } from "@/lib/ink/recipes/receipt-ink";
import { cn } from "@/lib/utils";
type ReceiptProps = Omit<PaperProps, "stock" | "rules" | "edge"> & {
  ends?: EdgeKind;
};
const Receipt = defineUi<ReceiptProps>("Receipt", ["class", "ends"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const ends = computed(() => _props["ends"] === undefined ? "zig" as const : _props["ends"]);
  const props = computed(() => omitProps(_props, ["class", "ends"]));
  return () => {
    return <Paper data-slot="receipt" stock="receipt" rules="none" edge={{
      top: ends.value,
      bottom: ends.value
    }} class={cn("mx-auto flex w-72 flex-col gap-3 px-5 py-8 font-type text-[13px] leading-5 text-ink", className.value)} {...domProps(props.value)}>{_slots.default?.()}</Paper>;
  };
});
const ReceiptHeader = defineUi<UI.ComponentProps<"div">>("ReceiptHeader", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="receipt-header" class={cn("flex flex-col items-center gap-0.5 text-center [&>:first-child]:text-base [&>:first-child]:font-bold", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const ReceiptLines = defineUi<UI.ComponentProps<"dl">>("ReceiptLines", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <dl data-slot="receipt-lines" class={cn("flex flex-col gap-1 border-y border-dashed border-pencil-mark py-2.5", className.value)} {...domProps(props.value)}>{_slots.default?.()}</dl>;
  };
});
type ReceiptLineProps = Omit<UI.ComponentProps<"div">, "children"> & {
  children: UI.ReactNode;
  qty?: number;
  price: UI.ReactNode;
};
const ReceiptLine = defineUi<ReceiptLineProps>("ReceiptLine", ["class", "qty", "price"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const qty = computed(() => _props["qty"]);
  const price = computed(() => _props["price"]);
  const props = computed(() => omitProps(_props, ["class", "children", "qty", "price"]));
  return () => {
    return <div data-slot="receipt-line" class={cn("flex items-baseline gap-2", className.value)} {...domProps(props.value)}>
      <dt class="min-w-0 flex-1 wrap-anywhere">
        {qty.value !== undefined ? <span class="ll-num">{qty.value} x </span> : null}
        {readSlot(_slots.default)}
      </dt>
      <dd class="ll-num shrink-0 text-end">{price.value}</dd>
    </div>;
  };
});
type ReceiptTotalProps = Omit<UI.ComponentProps<"dl">, "children"> & {
  label?: UI.ReactNode;
  children: UI.ReactNode;
  circled?: boolean | "red" | "blue" | "ink";
  seed?: string | number;
};
const ReceiptTotal = defineUi<ReceiptTotalProps>("ReceiptTotal", ["class", "label", "circled", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const label = computed(() => _props["label"] === undefined ? "TOTAL" as const : _props["label"]);
  const children = renderValue(() => readSlot(_slots.default));
  const circled = computed(() => _props["circled"] === undefined ? false : _props["circled"]);
  const seed = computed(() => _props["seed"]);
  const props = computed(() => omitProps(_props, ["class", "label", "children", "circled", "seed"]));
  const pen = computed(() => circled.value === "blue" ? "blue" as const : circled.value === "ink" ? "ink" as const : "redfelt" as const);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: receiptCircleRecipe,
    params: {
      pen: pen.value
    },
    kind: "circle" as const,
    seed: seed.value,
    still: true
  }));
  const merged = computed(() => useMergedRef<HTMLElement>(circled.value ? hostRef : undefined));
  return () => {
    return <dl data-slot="receipt-total" class={cn("flex flex-wrap items-baseline justify-between gap-x-3 text-base font-bold", className.value)} {...domProps(props.value)}>
      <dt>{label.value}</dt>
      <dd ref={merged.value as UI.Ref<HTMLElement>} {...domProps(circled.value && node.value ? hostProps.value : {})} class="ll-num relative isolate ms-auto px-1">
        {circled.value ? node.value : null}
        {readSlot(_slots.default)}
      </dd>
    </dl>;
  };
});
const ReceiptDivider = defineUi<UI.ComponentProps<"div">>("ReceiptDivider", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="receipt-divider" role="separator" class={cn("h-0 w-full border-t border-dashed border-pencil-mark", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
type ReceiptBarcodeProps = Omit<UI.ComponentProps<"figure">, "children"> & {
  value: string;
  height?: number;
};
const ReceiptBarcode = defineUi<ReceiptBarcodeProps>("ReceiptBarcode", ["class", "value", "height"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const value = computed(() => _props["value"]);
  const height = computed(() => _props["height"] === undefined ? 44 : _props["height"]);
  const props = computed(() => omitProps(_props, ["class", "value", "height"]));
  const code = computed(() => barcode(value.value, 220, height.value));
  return () => {
    return <figure data-slot="receipt-barcode" class={cn("flex flex-col items-center gap-1.5", className.value)} {...domProps(props.value)}>
      <svg role="img" aria-label={`Barcode ${value.value}`} viewBox={`0 0 220 ${height.value}`} preserveAspectRatio="none" class="w-full" style={cssStyle({
        height: height.value
      })} focusable="false">
        <path d={code.value.d} fill="currentColor" />
      </svg>
      <figcaption class="ll-num text-xs tracking-[0.3em]">{value.value}</figcaption>
    </figure>;
  };
});
const ReceiptFooter = defineUi<UI.ComponentProps<"div">>("ReceiptFooter", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="receipt-footer" class={cn("text-center text-xs text-muted-foreground", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
export { Receipt, ReceiptHeader, ReceiptLines, ReceiptLine, ReceiptTotal, ReceiptDivider, ReceiptBarcode, ReceiptFooter };
export type { ReceiptProps, ReceiptLineProps, ReceiptTotalProps, ReceiptBarcodeProps };
