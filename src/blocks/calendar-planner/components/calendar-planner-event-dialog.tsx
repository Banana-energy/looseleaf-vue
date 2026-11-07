// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { KINDS, type EventKind, type PlannerEvent } from "@/blocks/calendar-planner/components/calendar-planner-data";
type Draft = Omit<PlannerEvent, "id">;
type Errors = Partial<Record<"title" | "date" | "end", string>>;
export const EventDialog = defineUi<{
  event?: PlannerEvent;
  date: string;
  onSave: (e: Draft, id?: string) => void;
  onDelete: (e: PlannerEvent) => void;
  onClose: () => void;
  restoreFocus: () => void;
}>("EventDialog", ["event", "date", "onSave", "onDelete", "onClose", "restoreFocus"], (_props, {
  slots: _slots
}) => {
  const event = computed(() => _props["event"]);
  const date = computed(() => _props["date"]);
  const onSave = computed(() => _props["onSave"]);
  const onDelete = computed(() => _props["onDelete"]);
  const onClose = computed(() => _props["onClose"]);
  const restoreFocus = computed(() => _props["restoreFocus"]);
  const uid = useId();
  const id = computed(() => (name: string) => `${uid}-${name}`);
  const draft = shallowRef<Draft>(initialState(() => ({
    title: event.value?.title ?? "",
    date: event.value?.date ?? date.value,
    start: event.value?.start ?? "09:00",
    end: event.value?.end ?? "10:00",
    kind: event.value?.kind ?? "studio",
    notes: event.value?.notes ?? ""
  })));
  const setDraft = stateSetter(draft);
  const errors = shallowRef<Errors>(initialState({}));
  const setErrors = stateSetter(errors);
  const set = computed(() => <K extends keyof Draft,>(key: K, value: Draft[K]) => setDraft(d => ({
    ...d,
    [key]: value
  })));
  const bad = computed(() => (key: keyof Errors) => errors.value[key] ? {
    "aria-invalid": true as const,
    "aria-describedby": id.value(`${key}-error`)
  } : {});
  return () => {
    function submit(e: SubmitEvent) {
      e.preventDefault();
      const next: Errors = {};
      if (!draft.value.title.trim()) next.title = "Give the event a name.";
      if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.value.date)) next.date = "Pick a day.";
      if (draft.value.end <= draft.value.start) next.end = "The end has to come after the start.";
      setErrors(next);
      const first = next.title ? "title" as const : next.date ? "date" as const : next.end ? "end" as const : null;
      if (first) {
        document.getElementById(id.value(first))?.focus();
        return;
      }
      onSave.value({
        ...draft.value,
        title: draft.value.title.trim()
      }, event.value?.id);
    }
    return <Dialog open onOpenChange={open => !open && onClose.value()}>
      <DialogContent tape="both" tapeKind="washi-dots" onCloseAutoFocus={e => {
        e.preventDefault();
        restoreFocus.value();
      }}>
        <DialogHeader>
          <DialogTitle>{event.value ? "Change the event" as const : "A new event" as const}</DialogTitle>
          <DialogDescription>{event.value ? "Rewrite it, or cross it out." as const : "Write it on the day so it does not slip." as const}</DialogDescription>
        </DialogHeader>
        <form id={id.value("form")} onSubmit={submit} novalidate class="flex flex-col gap-4">
          <Field data-invalid={errors.value.title ? "true" as const : undefined}>
            <FieldLabel for={id.value("title")}>What is happening?</FieldLabel>
            <Input id={id.value("title")} value={draft.value.title} onChange={(e: Event) => set.value("title", (e.target as HTMLInputElement).value)} {...domProps(bad.value("title"))} />
            <FieldError id={id.value("title-error")}>{errors.value.title}</FieldError>
          </Field>
          <Field data-invalid={errors.value.date ? "true" as const : undefined}>
            <FieldLabel for={id.value("date")}>Which day?</FieldLabel>
            <Input id={id.value("date")} type="date" value={draft.value.date} onChange={(e: Event) => set.value("date", (e.target as HTMLInputElement).value)} {...domProps(bad.value("date"))} />
            <FieldError id={id.value("date-error")}>{errors.value.date}</FieldError>
          </Field>
          <div class="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel for={id.value("start")}>From</FieldLabel>
              <Input id={id.value("start")} type="time" value={draft.value.start} onChange={(e: Event) => set.value("start", (e.target as HTMLInputElement).value)} />
            </Field>
            <Field data-invalid={errors.value.end ? "true" as const : undefined}>
              <FieldLabel for={id.value("end")}>To</FieldLabel>
              <Input id={id.value("end")} type="time" value={draft.value.end} onChange={(e: Event) => set.value("end", (e.target as HTMLInputElement).value)} {...domProps(bad.value("end"))} />
            </Field>
          </div>
          <FieldError id={id.value("end-error")}>{errors.value.end}</FieldError>
          <Field>
            <FieldLabel for={id.value("kind")}>What sort?</FieldLabel>
            <Select value={draft.value.kind} onValueChange={v => set.value("kind", v as EventKind)}>
              <SelectTrigger id={id.value("kind")} class="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {KINDS.map(k => <SelectItem key={k.id} value={k.id}>
                    {k.label}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel for={id.value("notes")}>Notes</FieldLabel>
            <Textarea id={id.value("notes")} value={draft.value.notes} onChange={(e: Event) => set.value("notes", (e.target as HTMLTextAreaElement).value)} rows={2} />
          </Field>
        </form>
        <DialogFooter>
          {event.value ? <Button variant="destructive" class="sm:me-auto" onClick={() => onDelete.value(event.value)}>
              <Icon name="trash" />
              Delete
            </Button> : null}
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form={id.value("form")}>
            {event.value ? "Save changes" as const : "Add it" as const}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
  };
});
