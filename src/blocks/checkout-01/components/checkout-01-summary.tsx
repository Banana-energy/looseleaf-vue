// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef, useId } from "vue";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Paper } from "@/components/ui/paper";
import { Receipt, ReceiptBarcode, ReceiptDivider, ReceiptFooter, ReceiptHeader, ReceiptLine, ReceiptLines, ReceiptTotal } from "@/components/ui/receipt";
import { Stepper, StepperDecrement, StepperIncrement, StepperInput } from "@/components/ui/stepper";
import { StickyNote, StickyNoteContent } from "@/components/ui/sticky-note";
import { FREE_SHIPPING_FROM, PRODUCTS, PROMOS, VAT, money, type Totals } from "@/blocks/checkout-01/components/checkout-01-data";
type Props = {
  qty: number[];
  onQty: (index: number, value: number) => void;
  code: string | null;
  onCode: (code: string | null) => void;
  totals: Totals;
  formId: string;
  orderNumber: string;
  placing?: boolean;
};
export const Checkout01Summary = defineUi<Props>("Checkout01Summary", ["qty", "onQty", "code", "onCode", "totals", "formId", "orderNumber", "placing"], (_props, {
  slots: _slots
}) => {
  const qty = computed(() => _props["qty"]);
  const onQty = computed(() => _props["onQty"]);
  const code = computed(() => _props["code"]);
  const onCode = computed(() => _props["onCode"]);
  const totals = computed(() => _props["totals"]);
  const formId = computed(() => _props["formId"]);
  const orderNumber = computed(() => _props["orderNumber"]);
  const placing = computed(() => _props["placing"]);
  const draft = shallowRef(initialState(""));
  const setDraft = stateSetter(draft);
  const error = shallowRef(initialState(""));
  const setError = stateSetter(error);
  const promoId = useId();
  const promoInput = shallowRef<HTMLInputElement | null>(null);
  const promoRemove = shallowRef<HTMLButtonElement | null>(null);
  const swapped = shallowRef(false);
  watchDependencies(() => {
    if (!swapped.value) return;
    swapped.value = false;
    if (code.value) promoRemove.value?.focus();else promoInput.value?.focus();
  }, () => [code.value], false);
  const empty = computed(() => qty.value.every(n => n === 0));
  const promo = computed(() => code.value ? PROMOS[code.value] : undefined);
  const apply = computed(() => (e: SubmitEvent) => {
    e.preventDefault();
    const c = draft.value.trim().toUpperCase();
    if (!c) return setError("Type a code first.");
    if (!PROMOS[c]) return setError("That code is not on our list. Check the spelling.");
    setError("");
    setDraft("");
    swapped.value = true;
    onCode.value(c);
  });
  return () => {
    return <div class="grid gap-6">
      <Paper as="section" stock="paper" tilt={0.3} seed="basket" aria-labelledby={`${formId.value}-basket`} class="grid gap-4 p-5">
        <h3 id={`${formId.value}-basket`} class="font-script text-3xl leading-none font-semibold">
          Your basket
        </h3>
        <ul aria-label="Basket" class="grid gap-4">
          {PRODUCTS.map((p, i) => <li key={p.id} class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <p id={`${formId.value}-p-${p.id}`} class="font-bold">
                  {p.name}
                </p>
                <p class="text-sm text-muted-foreground">
                  {p.note} · <span class="ll-num">€{money(p.cents)}</span>
                </p>
              </div>
              <Stepper value={qty.value[i]} onValueChange={v => onQty.value(i, v ?? 0)} min={0} max={9} aria-labelledby={`${formId.value}-p-${p.id}`}>
                <StepperDecrement aria-label={`One less: ${p.name}`} />
                <StepperInput />
                <StepperIncrement aria-label={`One more: ${p.name}`} />
              </Stepper>
            </li>)}
        </ul>

        <form onSubmit={apply.value} novalidate class="grid gap-2" aria-label="Promo code">
          <Label for={promoId}>Promo code</Label>
          {code.value ? <p class="flex flex-wrap items-center gap-x-3 text-sm">
              <span>
                <b class="font-type">{code.value}</b> applied: {promo.value?.label}.
              </span>
              <Button ref={promoRemove} type="button" variant="link" size="sm" onClick={() => {
              swapped.value = true;
              onCode.value(null);
            }}>
                Remove
              </Button>
            </p> : <>
              <div class="flex gap-2">
                <Input ref={promoInput} id={promoId} placeholder="PAPER10" autocomplete="off" value={draft.value} aria-invalid={!!error.value} aria-describedby={error.value ? `${promoId}-err` : undefined} onChange={(e: Event) => {
                setDraft((e.target as HTMLInputElement).value);
                setError("");
              }} />
                <Button type="submit" variant="outline">
                  Apply
                </Button>
              </div>
              <FieldError id={`${promoId}-err`}>{error.value}</FieldError>
            </>}
        </form>
      </Paper>

      {empty.value ? <Paper as="div" stock="slip" tilt={-0.3} seed="empty-basket">
          <Empty seed="basket-empty" class="p-4 md:p-6">
            <EmptyHeader>
              <EmptyMedia pose="shrug" size={96} />
              <EmptyTitle>Nothing in the basket</EmptyTitle>
              <EmptyDescription>Add a notebook with the plus and the receipt starts writing itself.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </Paper> : <Receipt as="article" seed="checkout-receipt" aria-label="Your order" class="mx-auto">
          <ReceiptHeader>
            <span>Looseleaf shop</span>
            <span>Order {orderNumber.value}</span>
          </ReceiptHeader>
          <ReceiptLines>
            {PRODUCTS.map((p, i) => qty.value[i] ? <ReceiptLine key={p.id} qty={qty.value[i]} price={money(p.cents * qty.value[i]!)}>
                  {p.name}
                </ReceiptLine> : null)}
          </ReceiptLines>
          <ReceiptLines>
            <ReceiptLine price={money(totals.value.subtotal)}>subtotal</ReceiptLine>
            {totals.value.discount ? <ReceiptLine price={`-${money(totals.value.discount)}`}>code {code.value}</ReceiptLine> : null}
            <ReceiptLine price={totals.value.shipping ? money(totals.value.shipping) : "free" as const}>delivery</ReceiptLine>
            <ReceiptLine price={money(totals.value.vat)}>of which VAT {VAT}%</ReceiptLine>
          </ReceiptLines>
          <ReceiptTotal circled>{money(totals.value.total)}</ReceiptTotal>
          <ReceiptDivider />
          <ReceiptBarcode value={orderNumber.value} />
          <ReceiptFooter>prices in euro, VAT included</ReceiptFooter>
        </Receipt>}

      <p role="status" class="sr-only">
        {empty.value ? "The basket is empty." as const : `Total €${money(totals.value.total)}.`}
      </p>

      <Button type="submit" form={formId.value} size="lg" class="w-full" disabled={empty.value} aria-busy={placing.value}>
        {placing.value ? "Placing your order…" as const : `Pay €${money(totals.value.total)}`}
      </Button>

      <StickyNote color="yellow" fastener="pin" tilt={2} seed="checkout-hint" class="mx-auto mt-3 min-h-0 w-full max-w-56 pb-4">
        <StickyNoteContent class="text-lg leading-snug">
          psst: free delivery over {money(FREE_SHIPPING_FROM)}, and <b class="font-type text-base">PAPER10</b> takes a tenth off the paper.
        </StickyNoteContent>
      </StickyNote>
    </div>;
  };
});
