// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label as FieldLabel } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LABELS, type Label } from "@/blocks/kanban-board/components/kanban-board-data";
export const AddNote = defineUi<{
  column: string;
  onAdd: (title: string, label: Label) => void;
}>("AddNote", ["column", "onAdd"], (_props, {
  slots: _slots
}) => {
  const column = computed(() => _props["column"]);
  const onAdd = computed(() => _props["onAdd"]);
  const uid = useId();
  const open = shallowRef(initialState(false));
  const setOpen = stateSetter(open);
  const title = shallowRef(initialState(""));
  const setTitle = stateSetter(title);
  const label = shallowRef<Label>(initialState("Studio"));
  const setLabel = stateSetter(label);
  const error = shallowRef(initialState(false));
  const setError = stateSetter(error);
  const opener = shallowRef<HTMLButtonElement | null>(null);
  const field = shallowRef<HTMLInputElement | null>(null);
  watchDependencies(() => {
    if (open.value) field.value?.focus();
  }, () => [open.value], false);
  const close = computed(() => () => {
    setOpen(false);
    setTitle("");
    setError(false);
    requestAnimationFrame(() => opener.value?.focus());
  });
  return () => {
    if (!open.value) {
      return <Button ref={opener} variant="ghost" class="w-full justify-start" onClick={() => setOpen(true)}>
        <Icon name="plus" />
        Add a note<span class="sr-only"> to {column.value}</span>
      </Button>;
    }
    return <form class="flex flex-col gap-3 p-1" aria-label={`New note in ${column.value}`} novalidate onSubmit={(e: SubmitEvent) => {
      e.preventDefault();
      if (!title.value.trim()) return setError(true);
      onAdd.value(title.value.trim(), label.value);
      close.value();
    }} onKeydown={(e: KeyboardEvent) => {
      if (e.key === "Escape" && !e.defaultPrevented) close.value();
    }}>
      <div class="flex flex-col gap-1.5">
        <FieldLabel for={`${uid}-title`}>What needs doing?</FieldLabel>
        <Input ref={field} id={`${uid}-title`} value={title.value} onChange={(e: Event) => {
          setTitle((e.target as HTMLInputElement).value);
          setError(false);
        }} aria-invalid={error.value ? true : undefined} aria-describedby={error.value ? `${uid}-error` : undefined} />
        {error.value ? <p id={`${uid}-error`} role="alert" class="text-sm text-destructive">
            Write a few words on the note first.
          </p> : null}
      </div>
      <div class="flex flex-col gap-1.5">
        <FieldLabel for={`${uid}-label`}>Which pad?</FieldLabel>
        <Select value={label.value} onValueChange={v => setLabel(v as Label)}>
          <SelectTrigger id={`${uid}-label`} size="sm" class="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LABELS.map(l => <SelectItem key={l} value={l}>
                {l}
              </SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" variant="outline" size="sm" onClick={close.value}>
          Cancel
        </Button>
        <Button type="submit" size="sm">
          Stick it up
        </Button>
      </div>
    </form>;
  };
});
