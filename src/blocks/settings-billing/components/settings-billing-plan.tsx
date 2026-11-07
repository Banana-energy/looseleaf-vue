// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef, useId } from "vue";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Ticket, TicketBody, TicketDescription, TicketNumber, TicketStub, TicketTitle } from "@/components/ui/ticket";
import { DAYS_LEFT, PLANS, RENEWS, USAGE, money, planChange, type PlanId } from "@/blocks/settings-billing/components/settings-billing-data";
export const limitOf = (plan: PlanId, key: typeof USAGE[number]["id"]): number => {
  const p = PLANS.find(x => x.id === plan)!;
  return key === "notebooks" ? p.notebooks : key === "storage" ? p.storageGb : p.seats;
};
export const SettingsBillingPlan = defineUi<{
  current: PlanId;
  scheduled?: PlanId;
  onChange: (plan: PlanId) => void;
}>("SettingsBillingPlan", ["current", "scheduled", "onChange"], (_props, {
  slots: _slots
}) => {
  const current = computed(() => _props["current"]);
  const scheduled = computed(() => _props["scheduled"]);
  const onChange = computed(() => _props["onChange"]);
  const picked = shallowRef<PlanId>(initialState(current.value));
  const setPicked = stateSetter(picked);
  const done = shallowRef(initialState(""));
  const setDone = stateSetter(done);
  const uid = useId();
  const plan = computed(() => PLANS.find(p => p.id === current.value)!);
  const next = computed(() => scheduled.value ? PLANS.find(p => p.id === scheduled.value) : undefined);
  const target = computed(() => PLANS.find(p => p.id === picked.value)!);
  const change = computed(() => planChange(current.value, picked.value));
  const over = computed(() => USAGE.filter(u => u.used > limitOf(picked.value, u.id)).map(u => `${u.label.toLowerCase()} (${u.used}${u.unit} of ${limitOf(picked.value, u.id)}${u.unit})`));
  return () => {
    return <div class="grid gap-6">
      <div role="group" aria-label={`Your plan: ${plan.value.name}`}>
        <Ticket stock="kraft" seed="plan-ticket" size={[420, 124]} class="w-full max-w-md">
          <TicketBody>
            <TicketTitle>{plan.value.name} plan</TicketTitle>
            <TicketDescription>
              <span class="whitespace-nowrap">{money(plan.value.cents)} a month ·</span> <span class="whitespace-nowrap">renews {RENEWS}</span>
            </TicketDescription>
            <TicketNumber>No. 0042</TicketNumber>
          </TicketBody>
          <TicketStub>
            <span class="font-type text-xs">Admit</span>
            <span class="font-script text-4xl leading-none font-bold">1</span>
          </TicketStub>
        </Ticket>
      </div>

      {next.value ? <p class="flex flex-wrap items-center gap-x-3 text-sm">
          <span>
            Moving to <b>{next.value.name}</b> on {RENEWS}.
          </span>
          <Button type="button" variant="link" size="sm" onClick={() => {
          onChange.value(current.value);
          setPicked(current.value);
          setDone(`Staying on ${plan.value.name}.`);
        }}>
            Keep {plan.value.name}
          </Button>
        </p> : null}

      <RadioGroup value={picked.value} onValueChange={v => {
        setPicked(v as PlanId);
        setDone("");
      }} aria-label="Plan" class="gap-3 @4xl/settings:grid-cols-3">
        {PLANS.map(p => <FieldLabel key={p.id} for={`${uid}-plan-${p.id}`}>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle class="flex-wrap">
                  {p.name}
                  {p.id === current.value ? <Badge size="sm" variant="secondary">
                      Current
                    </Badge> : null}
                </FieldTitle>
                <FieldDescription>
                  <span class="ll-num font-bold text-foreground">{p.cents ? `${money(p.cents)} a month` : "Free" as const}</span>
                  <br />
                  {p.blurb}
                </FieldDescription>
              </FieldContent>
              <RadioGroupItem value={p.id} id={`${uid}-plan-${p.id}`} />
            </Field>
          </FieldLabel>)}
      </RadioGroup>

      {change.value.kind === "upgrade" ? <Alert variant="info">
          <Icon name="info" />
          <AlertTitle>Move up to {target.value.name}</AlertTitle>
          <AlertDescription>
            From {RENEWS} you will pay {money(change.value.monthly)} a month. Today we charge {money(change.value.today)} for the {DAYS_LEFT} days left in this month, and nothing more.
          </AlertDescription>
        </Alert> : null}
      {change.value.kind === "downgrade" ? <Alert variant="warning">
          <Icon name="triangle-alert" />
          <AlertTitle>Move down to {target.value.name}</AlertTitle>
          <AlertDescription>
            You keep {plan.value.name} until {RENEWS}, then pay {change.value.monthly ? `${money(change.value.monthly)} a month` : "nothing" as const}. Nothing is charged today.
            {over.value.length ? ` You use more than ${target.value.name} holds: ${over.value.join(", ")}. The extra stays readable but cannot be edited.` : "" as const}
          </AlertDescription>
        </Alert> : null}

      <div class="flex flex-wrap items-center gap-3">
        <Button type="button" disabled={change.value.kind === "same"} onClick={() => {
          onChange.value(picked.value);
          setDone(change.value.kind === "upgrade" ? `You are on ${target.value.name} now.` : `Done. ${target.value.name} starts on ${RENEWS}.`);
          if (change.value.kind === "upgrade") setPicked(picked.value);
        }}>
          {change.value.kind === "same" ? "Pick another plan" as const : `Switch to ${target.value.name}`}
        </Button>
        <p role="status" class="text-sm font-bold text-green">
          {done.value}
        </p>
      </div>
    </div>;
  };
});
