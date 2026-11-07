// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId, shallowRef } from "vue";
import { zodResolver } from "@/lib/schema-bridge";
import { useForm } from "@/lib/form-bridge";
import { Button } from "@/components/ui/button";
import { Field, FieldContent } from "@/components/ui/field";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Page, PageDescription, PageHeader, PageTitle } from "@/components/ui/page";
import { Paper } from "@/components/ui/paper";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { SettingsBillingCardDialog, type SavedCard } from "@/blocks/settings-billing/components/settings-billing-card-dialog";
import { INVOICES, USAGE, detailsSchema, planChange, type DetailsValues, type Invoice, type Month, type PlanId } from "@/blocks/settings-billing/components/settings-billing-data";
import { SettingsBillingInvoices } from "@/blocks/settings-billing/components/settings-billing-invoices";
import { SettingsBillingPlan, limitOf } from "@/blocks/settings-billing/components/settings-billing-plan";
import { cn } from "@/lib/utils";
type Props = {
  className?: string;
  defaultPlan?: PlanId;
  today?: Month;
  onSaveDetails?: (values: DetailsValues) => void | Promise<void>;
  onDownload?: (invoice: Invoice) => void;
};
const Section = defineUi<{
  title: string;
  description: string;
  children: UI.ReactNode;
}>("Section", ["title", "description"], (_props, {
  slots: _slots
}) => {
  const title = computed(() => _props["title"]);
  const description = computed(() => _props["description"]);
  const children = renderValue(() => readSlot(_slots.default));
  const id = useId();
  return () => {
    return <div role="group" aria-labelledby={id} class="grid gap-x-10 gap-y-4 @2xl/settings:grid-cols-[13rem_minmax(0,1fr)]">
      <div class="grid content-start gap-1">
        <h3 id={id} class="font-script text-[1.6rem] leading-none font-bold">
          {title.value}
        </h3>
        <p class="text-sm text-muted-foreground">{description.value}</p>
      </div>
      <div class="grid min-w-0 gap-4">{readSlot(_slots.default)}</div>
    </div>;
  };
});
const SettingsBilling = defineUi<Props>("SettingsBilling", ["class", "defaultPlan", "today", "onSaveDetails", "onDownload"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const defaultPlan = computed(() => _props["defaultPlan"] === undefined ? "studio" as const : _props["defaultPlan"]);
  const today = computed(() => _props["today"]);
  const onSaveDetails = computed(() => _props["onSaveDetails"]);
  const onDownload = computed(() => _props["onDownload"]);
  const plan = shallowRef<PlanId>(initialState(defaultPlan.value));
  const setPlan = stateSetter(plan);
  const scheduled = shallowRef<PlanId>(initialState(undefined));
  const setScheduled = stateSetter(scheduled);
  const card = shallowRef<SavedCard>(initialState({
    brand: "Visa" as const,
    last4: "4242" as const,
    expiry: "08/28" as const
  }));
  const setCard = stateSetter(card);
  const cardSaved = shallowRef(initialState(false));
  const setCardSaved = stateSetter(cardSaved);
  const saved = shallowRef(initialState(false));
  const setSaved = stateSetter(saved);
  const failure = shallowRef(initialState(""));
  const setFailure = stateSetter(failure);
  const titleId = useId();
  const details = useForm<DetailsValues>(() => ({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      email: "billing@looseleaf.example" as const,
      company: "Delacroix Letterpress" as const,
      taxId: "PT123456789" as const
    },
    mode: "onTouched" as const
  }));
  const edit = computed(() => <T,>(change: (value: T) => void, value: T) => {
    setSaved(false);
    setFailure("");
    change(value);
  });
  return () => {
    return <div class="w-full overflow-x-clip px-2">
      <Page as="section" width="xl" tape="top" stain seed="settings-billing" aria-labelledby={titleId} class={cn("my-6", className.value)}>
        <PageHeader>
          <PageTitle as="h2" id={titleId} underline="double" seed="billing-title">
            Billing
          </PageTitle>
          <PageDescription>What you pay, what you use, and every receipt we have ever handed you.</PageDescription>
        </PageHeader>

        <div class="@container/settings grid gap-8">
          <Section title="Your plan" description="Change it whenever you like. We only charge the difference.">
            <SettingsBillingPlan current={plan.value} scheduled={scheduled.value} onChange={next => {
              const kind = planChange(plan.value, next).kind;
              if (kind === "upgrade") setPlan(next);
              setScheduled(kind === "downgrade" ? next : undefined);
            }} />
          </Section>

          <Separator variant="dashed" />

          <Section title="Usage" description="Counted on your current plan. Bars turn to marker when you get close.">
            <ul aria-label="Usage" class="grid gap-5">
              {USAGE.map(u => {
                const limit = limitOf(plan.value, u.id);
                const share = Math.min(100, Math.round(u.used / limit * 100));
                return <li key={u.id} class="grid gap-2">
                    <div class="flex items-baseline justify-between gap-4">
                      <span class="font-bold">{u.label}</span>
                      <span class="ll-num text-sm text-muted-foreground">
                        {u.used}
                        {u.unit} of {limit}
                        {u.unit}
                        {u.used > limit ? " (over)" as const : "" as const}
                      </span>
                    </div>
                    <Progress value={share} tone={share >= 90 ? "marker" as const : "green" as const} aria-label={`${u.label}: ${share}% used`} />
                  </li>;
              })}
            </ul>
          </Section>

          <Separator variant="dashed" />

          <Section title="Payment method" description="One card, charged on the 14th.">
            <Paper stock="slip" tilt={-0.4} seed="card-on-file" class="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3" role="group" aria-label="Card on file">
              <Icon name="credit-card" size={28} />
              <div class="grid min-w-0 flex-1 leading-tight">
                <span class="font-bold">
                  {card.value.brand} ending in <span class="ll-num">{card.value.last4}</span>
                </span>
                <span class="text-sm text-muted-foreground">
                  Expires <span class="ll-num">{card.value.expiry}</span>
                </span>
              </div>
              <SettingsBillingCardDialog today={today.value} onSaved={c => {
                setCard(c);
                setCardSaved(true);
              }}>
                <Button variant="outline" size="sm">
                  Replace card
                </Button>
              </SettingsBillingCardDialog>
            </Paper>
            <p role="status" class="text-sm font-bold text-green">
              {cardSaved.value ? `Done. New charges go to the ${card.value.brand} ending in ${card.value.last4}.` : "" as const}
            </p>
          </Section>

          <Separator variant="dashed" />

          <Section title="Invoice details" description="Printed on every receipt. Change it and old receipts keep what they said.">
            <Form {...domProps(details.value)}>
              <form novalidate aria-label="Invoice details" class="grid gap-5" onSubmit={details.value.handleSubmit(async v => {
                try {
                  await onSaveDetails.value?.(v);
                } catch (err) {
                  setFailure(err instanceof Error && err.message ? err.message : "The details were not saved. Nothing was lost, so try again in a moment." as const);
                  return;
                }
                setFailure("");
                details.value.reset(v);
                setSaved(true);
              })}>
                <FormField control={details.value.control} name="email" render={({
                  field
                }) => <FormItem>
                      <FormLabel>Send invoices to</FormLabel>
                      <FormControl>
                        <Input type="email" autocomplete="email" {...domProps(field)} onChange={(e: Event) => edit.value(field.onChange, e)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                <div class="grid gap-5 @xl/settings:grid-cols-2">
                  <FormField control={details.value.control} name="company" render={({
                    field
                  }) => <FormItem class="content-start">
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input autocomplete="organization" placeholder="Optional" {...domProps(field)} onChange={(e: Event) => edit.value(field.onChange, e)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                  <FormField control={details.value.control} name="taxId" render={({
                    field
                  }) => <FormItem class="content-start">
                        <FormLabel>VAT number</FormLabel>
                        <FormControl>
                          <Input placeholder="Optional" {...domProps(field)} onChange={(e: Event) => edit.value(field.onChange, (e.target as HTMLInputElement).value.toUpperCase())} />
                        </FormControl>
                        <FormDescription>Two letters and the number, no spaces.</FormDescription>
                        <FormMessage />
                      </FormItem>} />
                </div>
                <Field orientation="horizontal">
                  <Button type="submit">Save details</Button>
                  <FieldContent>
                    <p role="status" class="text-sm font-bold text-green">
                      {saved.value ? "Saved. New invoices will say so." as const : "" as const}
                    </p>
                    {failure.value ? <p role="alert" class="text-sm font-bold text-red">
                        {failure.value}
                      </p> : null}
                  </FieldContent>
                </Field>
              </form>
            </Form>
          </Section>

          <Separator variant="dashed" />

          <Section title="Invoices" description="Newest first. Each is a PDF you can keep.">
            <SettingsBillingInvoices invoices={INVOICES} onDownload={onDownload.value} />
          </Section>
        </div>
      </Page>
    </div>;
  };
});
export default SettingsBilling;
