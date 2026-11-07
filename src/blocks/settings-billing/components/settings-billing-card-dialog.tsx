// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { zodResolver } from "@/lib/schema-bridge";
import { useForm } from "@/lib/form-bridge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { cardBrand, currentMonth, formatCardNumber, formatExpiry, makeCardSchema, type CardValues, type Month } from "@/blocks/settings-billing/components/settings-billing-data";
export type SavedCard = {
  brand: string;
  last4: string;
  expiry: string;
};
export const SettingsBillingCardDialog = defineUi<{
  onSaved: (card: SavedCard) => void;
  today?: Month;
  children: UI.ReactNode;
}>("SettingsBillingCardDialog", ["onSaved", "today"], (_props, {
  slots: _slots
}) => {
  const onSaved = computed(() => _props["onSaved"]);
  const today = computed(() => _props["today"]);
  const children = renderValue(() => readSlot(_slots.default));
  const open = shallowRef(initialState(false));
  const setOpen = stateSetter(open);
  const form = useForm<CardValues>(() => ({
    resolver: (values, context, options) => zodResolver(makeCardSchema(today.value ?? currentMonth()))(values, context, options),
    defaultValues: {
      name: "" as const,
      number: "" as const,
      expiry: "" as const,
      cvc: "" as const
    },
    mode: "onTouched" as const
  }));
  const brand = computed(() => cardBrand(form.value.watch("number").replace(/\s/g, "")));
  const submit = computed(() => form.value.handleSubmit(v => {
    const digits = v.number.replace(/\s/g, "");
    onSaved.value({
      brand: cardBrand(digits),
      last4: digits.slice(-4),
      expiry: v.expiry
    });
    setOpen(false);
  }));
  return () => {
    return <Dialog open={open.value} onOpenChange={next => {
      setOpen(next);
      if (!next) form.value.reset();
    }}>
      <DialogTrigger asChild>{readSlot(_slots.default)}</DialogTrigger>
      <DialogContent stock="paper" tape="top" seed="replace-card" class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Replace your card</DialogTitle>
          <DialogDescription>The next invoice is charged to the new card. The old one is forgotten as soon as you save.</DialogDescription>
        </DialogHeader>
        <Form {...domProps(form.value)}>
          <form novalidate onSubmit={submit.value} class="grid gap-5" aria-label="Card details">
            <FormField control={form.value.control} name="name" render={({
              field
            }) => <FormItem>
                  <FormLabel>Name on card</FormLabel>
                  <FormControl>
                    <Input autocomplete="cc-name" placeholder="Jo Delacroix" {...domProps(field)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            <FormField control={form.value.control} name="number" render={({
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
                    {brand.value !== "Card" ? <InputGroupAddon align="inline-end">
                        <InputGroupText>{brand.value}</InputGroupText>
                      </InputGroupAddon> : null}
                  </InputGroup>
                  <FormMessage />
                </FormItem>} />
            <div class="grid grid-cols-2 gap-4">
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
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save card</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>;
  };
});
