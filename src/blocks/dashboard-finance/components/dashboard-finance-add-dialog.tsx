// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, type Category, type Transaction } from "@/blocks/dashboard-finance/components/dashboard-finance-data";
type Errors = {
  description?: string;
  amount?: string;
};
export function parseAmount(text: string): number | null {
  const t = text.replace(/[$\s]/g, "");
  if (!/^[\d.,]+$/.test(t)) return null;
  const n = Number(t.includes(".") ? t.replace(/,/g, "") : t.replace(",", "."));
  return t !== "" && Number.isFinite(n) && n > 0 ? Math.round(n * 100) : null;
}
export const AddTransaction = defineUi<{
  date: string;
  onAdd: (t: Omit<Transaction, "id">) => void;
}>("AddTransaction", ["date", "onAdd"], (_props, {
  slots: _slots
}) => {
  const date = computed(() => _props["date"]);
  const onAdd = computed(() => _props["onAdd"]);
  const uid = useId();
  const id = computed(() => (name: string) => `${uid}-${name}`);
  const open = shallowRef(initialState(false));
  const setOpen = stateSetter(open);
  const description = shallowRef(initialState(""));
  const setDescription = stateSetter(description);
  const amount = shallowRef(initialState(""));
  const setAmount = stateSetter(amount);
  const kind = shallowRef<"out" | "in">(initialState("out"));
  const setKind = stateSetter(kind);
  const category = shallowRef<Category>(initialState("Groceries"));
  const setCategory = stateSetter(category);
  const errors = shallowRef<Errors>(initialState({}));
  const setErrors = stateSetter(errors);
  const reset = computed(() => () => {
    setDescription("");
    setAmount("");
    setKind("out");
    setCategory("Groceries");
    setErrors({});
  });
  return () => {
    function submit(e: SubmitEvent) {
      e.preventDefault();
      const cents = parseAmount(amount.value);
      const next: Errors = {};
      if (!description.value.trim()) next.description = "Give it a name so you can find it later.";
      if (cents === null) next.amount = "Write an amount above zero, like 12.50.";
      setErrors(next);
      if (next.description || cents === null) {
        document.getElementById(id.value(next.description ? "description" as const : "amount" as const))?.focus();
        return;
      }
      onAdd.value({
        date: date.value,
        description: description.value.trim(),
        account: "Checking" as const,
        category: kind.value === "in" ? "Income" as const : category.value,
        cents: kind.value === "in" ? cents : -cents,
        status: "pending" as const
      });
      setOpen(false);
    }
    return <Dialog open={open.value} onOpenChange={next => {
      if (next) reset.value();
      setOpen(next);
    }}>
      <DialogTrigger asChild>
        <Button>
          <Icon name="plus" />
          Add transaction
        </Button>
      </DialogTrigger>
      <DialogContent tape="both" tapeKind="washi-dots">
        <DialogHeader>
          <DialogTitle>Add a transaction</DialogTitle>
          <DialogDescription>It goes in as pending until the bank agrees.</DialogDescription>
        </DialogHeader>
        <form id={id.value("form")} onSubmit={submit} novalidate class="flex flex-col gap-4">
          <Field data-invalid={errors.value.description ? "true" as const : undefined}>
            <FieldLabel for={id.value("description")}>What was it?</FieldLabel>
            <Input id={id.value("description")} value={description.value} onChange={(e: Event) => setDescription((e.target as HTMLInputElement).value)} aria-invalid={errors.value.description ? true : undefined} aria-describedby={errors.value.description ? id.value("description-error") : undefined} placeholder="Ramen night" />
            <FieldError id={id.value("description-error")}>{errors.value.description}</FieldError>
          </Field>
          <Field data-invalid={errors.value.amount ? "true" as const : undefined}>
            <FieldLabel for={id.value("amount")}>How much?</FieldLabel>
            <Input id={id.value("amount")} inputmode="decimal" value={amount.value} onChange={(e: Event) => setAmount((e.target as HTMLInputElement).value)} aria-invalid={errors.value.amount ? true : undefined} aria-describedby={errors.value.amount ? id.value("amount-error") : undefined} placeholder="12.50" />
            <FieldError id={id.value("amount-error")}>{errors.value.amount}</FieldError>
          </Field>
          <RadioGroup value={kind.value} onValueChange={v => setKind(v as "out" | "in")} orientation="horizontal" aria-label="Money in or out">
            <div class="flex items-center gap-2">
              <RadioGroupItem id={id.value("out")} value="out" />
              <Label for={id.value("out")}>Money out</Label>
            </div>
            <div class="flex items-center gap-2">
              <RadioGroupItem id={id.value("in")} value="in" />
              <Label for={id.value("in")}>Money in</Label>
            </div>
          </RadioGroup>
          {kind.value === "out" ? <Field>
              <FieldLabel for={id.value("category")}>Which pot?</FieldLabel>
              <Select value={category.value} onValueChange={v => setCategory(v as Category)}>
                <SelectTrigger id={id.value("category")} class="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter(c => c !== "Income").map(c => <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </Field> : null}
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form={id.value("form")}>
            Add it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
  };
});
