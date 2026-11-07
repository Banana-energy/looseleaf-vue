// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId, shallowRef } from "vue";
import { zodResolver } from "@/lib/schema-bridge";
import { useForm } from "@/lib/form-bridge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Mascot } from "@/components/ui/mascot";
import { Page, PageDescription, PageHeader, PageTitle } from "@/components/ui/page";
import { Receipt, ReceiptFooter, ReceiptHeader, ReceiptLine, ReceiptLines, ReceiptTotal } from "@/components/ui/receipt";
import { Stamp } from "@/components/ui/stamp";
import { Checkout01Form } from "@/blocks/checkout-01/components/checkout-01-form";
import { Checkout01Summary } from "@/blocks/checkout-01/components/checkout-01-summary";
import { DEFAULT_QTY, DEFAULT_VALUES, METHODS, PRODUCTS, currentMonth, makeCheckoutSchema, money, totals as totalsOf, type CheckoutValues, type Month, type MethodId, type Totals } from "@/blocks/checkout-01/components/checkout-01-data";
import { cn } from "@/lib/utils";
export type PlacedOrder = {
  number: string;
  email: string;
  name: string;
  qty: number[];
  totals: Totals;
  code: string | null;
};
type Props = {
  className?: string;
  defaultQty?: number[];
  orderNumber?: string;
  today?: Month;
  onPlace?: (order: PlacedOrder, values: CheckoutValues) => void | Promise<void>;
};
const Checkout01 = defineUi<Props>("Checkout01", ["class", "defaultQty", "orderNumber", "today", "onPlace"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const defaultQty = computed(() => _props["defaultQty"] === undefined ? DEFAULT_QTY : _props["defaultQty"]);
  const orderNumber = computed(() => _props["orderNumber"] === undefined ? "0042 1187" as const : _props["orderNumber"]);
  const today = computed(() => _props["today"]);
  const onPlace = computed(() => _props["onPlace"]);
  const formId = useId();
  const qty = shallowRef<number[]>(initialState(defaultQty.value));
  const setQty = stateSetter(qty);
  const code = shallowRef<string | null>(initialState(null));
  const setCode = stateSetter(code);
  const placing = shallowRef(initialState(false));
  const setPlacing = stateSetter(placing);
  const placed = shallowRef<PlacedOrder | null>(initialState(null));
  const setPlaced = stateSetter(placed);
  const failure = shallowRef(initialState(""));
  const setFailure = stateSetter(failure);
  const done = shallowRef<HTMLHeadingElement | null>(null);
  const form = useForm<CheckoutValues>(() => ({
    resolver: (values, context, options) => zodResolver(makeCheckoutSchema(today.value ?? currentMonth()))(values, context, options),
    defaultValues: DEFAULT_VALUES,
    mode: "onTouched" as const
  }));
  const method = computed(() => form.value.watch("method") as MethodId);
  const totals = computed(() => totalsOf(qty.value, method.value, code.value));
  const shipping = computed(() => Object.fromEntries(METHODS.map(m => [m.id, totalsOf(qty.value, m.id, code.value).shipping])) as Record<MethodId, number>);
  watchDependencies(() => {
    if (placed.value) done.value?.focus();
  }, () => [placed.value], false);
  const submit = computed(() => form.value.handleSubmit(async values => {
    const order: PlacedOrder = {
      number: orderNumber.value,
      email: values.email,
      name: values.name,
      qty: qty.value,
      totals: totals.value,
      code: code.value
    };
    setPlacing(true);
    setFailure("");
    try {
      await onPlace.value?.(order, values);
      setPlaced(order);
    } catch (err) {
      setFailure(err instanceof Error && err.message ? err.message : "Something went wrong on our side." as const);
    } finally {
      setPlacing(false);
    }
  }));
  return () => {
    if (placed.value) {
      return <section aria-labelledby={`${formId}-done`} class={cn("mx-auto grid w-full max-w-3xl justify-items-center gap-6 px-4 py-12 text-center sm:px-8", className.value)}>
        <Mascot pose="celebrate" size={132} seed="checkout-done" />
        <div class="grid gap-2">
          <h2 id={`${formId}-done`} ref={done} tabindex={-1} class="font-script text-5xl leading-none font-bold outline-none">
            Thank you, {placed.value.name.trim().split(/\s+/)[0]}
          </h2>
          <p class="text-lg text-muted-foreground">
            Order <span class="ll-num font-bold text-foreground">{placed.value.number}</span> is paid. The receipt is on its way to {placed.value.email}.
          </p>
        </div>
        <div class="relative">
          <Receipt as="article" seed="checkout-paid" aria-label="Receipt of your order">
            <ReceiptHeader>
              <span>Looseleaf shop</span>
              <span>Order {placed.value.number}</span>
            </ReceiptHeader>
            <ReceiptLines>
              {PRODUCTS.map((p, i) => placed.value.qty[i] ? <ReceiptLine key={p.id} qty={placed.value.qty[i]} price={money(p.cents * placed.value.qty[i]!)}>
                    {p.name}
                  </ReceiptLine> : null)}
            </ReceiptLines>
            <ReceiptTotal circled>{money(placed.value.totals.total)}</ReceiptTotal>
            <ReceiptFooter>paid by card - thank you</ReceiptFooter>
          </Receipt>
          <Stamp name="stamp-paid" class="absolute -end-6 -top-4 sm:-end-12" seed="paid" />
        </div>
        <Button variant="outline" onClick={() => {
          setPlaced(null);
          setQty(defaultQty.value);
          setCode(null);
          form.value.reset();
        }}>
          Keep shopping
        </Button>
      </section>;
    }
    return <div class={cn("@container/checkout mx-auto w-full max-w-6xl px-4 py-10 sm:px-8", className.value)}>
      <div class="grid items-start gap-10 @4xl/checkout:grid-cols-[minmax(0,1fr)_24rem]">
        <Page as="section" width="full" tape="top" seed="checkout-form" aria-labelledby={`${formId}-title`}>
          <PageHeader>
            <PageTitle as="h2" id={`${formId}-title`} underline="wavy" seed="checkout-title">
              Checkout
            </PageTitle>
            <PageDescription>Three short steps and it is on its way. We ask for nothing we do not need.</PageDescription>
          </PageHeader>
          {failure.value ? <Alert variant="destructive">
              <Icon name="circle-alert" />
              <AlertTitle>The order was not placed</AlertTitle>
              <AlertDescription>{failure.value} You have not been charged. Try again, or use another card.</AlertDescription>
            </Alert> : null}
          <Checkout01Form form={form.value} id={formId} onSubmit={submit.value} shipping={shipping.value} />
        </Page>
        <div class="@4xl/checkout:sticky @4xl/checkout:top-6">
          <Checkout01Summary qty={qty.value} onQty={(i, v) => setQty(all => all.map((n, k) => k === i ? v : n))} code={code.value} onCode={setCode} totals={totals.value} formId={formId} orderNumber={orderNumber.value} placing={placing.value} />
        </div>
      </div>
    </div>;
  };
});
export default Checkout01;
