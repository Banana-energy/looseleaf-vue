// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { UseFormReturn } from "@/lib/form-bridge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { COUNTRIES, FIELD_LABELS, METHODS, formatCardNumber, formatExpiry, money, type CheckoutValues, type MethodId } from "@/blocks/checkout-01/components/checkout-01-data";
type Props = {
  form: UseFormReturn<CheckoutValues>;
  id: string;
  onSubmit: (e?: UI.BaseSyntheticEvent) => void;
  shipping: Record<MethodId, number>;
};
const Heading = defineUi<{
  n: number;
  children: UI.ReactNode;
}>("Heading", ["n"], (_props, {
  slots: _slots
}) => {
  const n = computed(() => _props["n"]);
  const children = renderValue(() => readSlot(_slots.default));
  return () => {
    return <h3 class="flex items-baseline gap-3 font-script text-3xl leading-none font-semibold">
      <span class="ll-num text-ink-you">{n.value}</span>
      {readSlot(_slots.default)}
    </h3>;
  };
});
const ErrorSummary = defineUi<{
  form: UseFormReturn<CheckoutValues>;
}>("ErrorSummary", ["form"], (_props, {
  slots: _slots
}) => {
  const form = computed(() => _props["form"]);
  const errors = computed(() => form.value.formState.errors);
  const submitCount = computed(() => form.value.formState.submitCount);
  const names = computed(() => (Object.keys(errors.value) as (keyof CheckoutValues)[]).filter(k => errors.value[k]?.message));
  return () => {
    if (!submitCount.value || names.value.length === 0) return null;
    return <Alert variant="destructive">
      <Icon name="circle-alert" />
      <AlertTitle>{names.value.length === 1 ? "One thing needs a look" as const : `${names.value.length} things need a look`}</AlertTitle>
      <AlertDescription>
        <ul class="grid gap-1">
          {names.value.map(k => <li key={k}>
              <button type="button" class="text-start underline decoration-wavy underline-offset-4 outline-offset-2 focus-visible:outline-2 focus-visible:outline-focus" onClick={() => form.value.setFocus(k)}>
                {FIELD_LABELS[k] ?? k}: {errors.value[k]?.message}
              </button>
            </li>)}
        </ul>
      </AlertDescription>
    </Alert>;
  };
});
export const Checkout01Form = defineUi<Props>("Checkout01Form", ["form", "id", "onSubmit", "shipping"], (_props, {
  slots: _slots
}) => {
  const form = computed(() => _props["form"]);
  const id = computed(() => _props["id"]);
  const onSubmit = computed(() => _props["onSubmit"]);
  const shipping = computed(() => _props["shipping"]);
  const method = computed(() => form.value.watch("method"));
  const pickup = computed(() => method.value === "pickup");
  return () => {
    return <Form {...domProps(form.value)}>
      <form id={id.value} novalidate onSubmit={onSubmit.value} aria-label="Checkout" class="@container/form grid gap-8">
        <ErrorSummary form={form.value} />

        <section aria-labelledby={`${id.value}-contact`} class="grid gap-5">
          <div id={`${id.value}-contact`}>
            <Heading n={1}>Who is it for?</Heading>
          </div>
          <FormField control={form.value.control} name="email" render={({
            field
          }) => <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" autocomplete="email" placeholder="ada@notes.dev" {...domProps(field)} />
                </FormControl>
                <FormMessage />
              </FormItem>} />
          <FormField control={form.value.control} name="name" render={({
            field
          }) => <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input autocomplete="name" placeholder="Ada Lovelace" {...domProps(field)} />
                </FormControl>
                <FormMessage />
              </FormItem>} />
        </section>

        <Separator variant="dashed" />

        <section aria-labelledby={`${id.value}-delivery`} class="grid gap-5">
          <div id={`${id.value}-delivery`}>
            <Heading n={2}>Where does it go?</Heading>
          </div>
          <FormField control={form.value.control} name="method" render={({
            field
          }) => <FormItem>
                <FormControl>
                  <RadioGroup value={field.value} onValueChange={field.onChange} aria-label="Delivery" class="gap-3">
                    {METHODS.map(m => <FieldLabel key={m.id} for={`${id.value}-m-${m.id}`}>
                        <Field orientation="horizontal">
                          <FieldContent>
                            <FieldTitle>
                              {m.name}
                              <span class="ll-num ms-auto font-normal">{shipping.value[m.id] === 0 ? "free" as const : `€${money(shipping.value[m.id])}`}</span>
                            </FieldTitle>
                            <FieldDescription>{m.help}</FieldDescription>
                          </FieldContent>
                          <RadioGroupItem value={m.id} id={`${id.value}-m-${m.id}`} />
                        </Field>
                      </FieldLabel>)}
                  </RadioGroup>
                </FormControl>
              </FormItem>} />
          {pickup.value ? <p class="text-sm text-muted-foreground">We will write to you when it is on the counter. Bring the email.</p> : <>
              <FormField control={form.value.control} name="address" render={({
              field
            }) => <FormItem>
                    <FormLabel>Street and number</FormLabel>
                    <FormControl>
                      <Input autocomplete="street-address" placeholder="12 rue de l'Eau" {...domProps(field)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              <div class="grid gap-5 @md/form:grid-cols-[1fr_9rem]">
                <FormField control={form.value.control} name="city" render={({
                field
              }) => <FormItem>
                      <FormLabel>Town or city</FormLabel>
                      <FormControl>
                        <Input autocomplete="address-level2" placeholder="Lisbon" {...domProps(field)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                <FormField control={form.value.control} name="postcode" render={({
                field
              }) => <FormItem>
                      <FormLabel>Postal code</FormLabel>
                      <FormControl>
                        <Input autocomplete="postal-code" placeholder="1100-148" {...domProps(field)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
              </div>
              <FormField control={form.value.control} name="country" render={({
              field
            }) => <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <NativeSelect autoComplete="country-name" class="w-full" {...domProps(field)}>
                        {COUNTRIES.map(c => <NativeSelectOption key={c} value={c}>
                            {c}
                          </NativeSelectOption>)}
                      </NativeSelect>
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
            </>}
        </section>

        <Separator variant="dashed" />

        <section aria-labelledby={`${id.value}-pay`} class="grid gap-5">
          <div id={`${id.value}-pay`}>
            <Heading n={3}>How are you paying?</Heading>
          </div>
          <FormField control={form.value.control} name="cardName" render={({
            field
          }) => <FormItem>
                <FormLabel>Name on card</FormLabel>
                <FormControl>
                  <Input autocomplete="cc-name" placeholder="Ada Lovelace" {...domProps(field)} />
                </FormControl>
                <FormMessage />
              </FormItem>} />
          <FormField control={form.value.control} name="cardNumber" render={({
            field
          }) => <FormItem>
                <FormLabel>Card number</FormLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <Icon name="credit-card" />
                  </InputGroupAddon>
                  <FormControl>
                    <InputGroupInput inputmode="numeric" autocomplete="cc-number" placeholder="4242 4242 4242 4242" {...domProps(field)} onChange={(e: Event) => field.onChange(formatCardNumber((e.target as HTMLInputElement).value))} />
                  </FormControl>
                </InputGroup>
                <FormMessage />
              </FormItem>} />
          <div class="grid grid-cols-2 gap-5">
            <FormField control={form.value.control} name="expiry" render={({
              field
            }) => <FormItem>
                  <FormLabel>Expires</FormLabel>
                  <FormControl>
                    <Input inputmode="numeric" autocomplete="cc-exp" placeholder="MM/YY" {...domProps(field)} onChange={(e: Event) => field.onChange(formatExpiry((e.target as HTMLInputElement).value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            <FormField control={form.value.control} name="cvc" render={({
              field
            }) => <FormItem>
                  <FormLabel>Security code</FormLabel>
                  <FormControl>
                    <Input inputmode="numeric" autocomplete="cc-csc" placeholder="123" maxlength={4} {...domProps(field)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
          </div>
          <FormField control={form.value.control} name="terms" render={({
            field
          }) => <FormItem>
                <div class="flex items-start gap-3">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} class="mt-0.5" />
                  </FormControl>
                  <FormLabel class="min-w-0 font-normal leading-snug">I have read the small print: returns within 30 days, in their box.</FormLabel>
                </div>
                <FormMessage />
              </FormItem>} />
        </section>
      </form>
    </Form>;
  };
});
