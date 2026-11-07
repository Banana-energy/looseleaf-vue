// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { format, isSameMonth, startOfMonth } from "date-fns";
import type { DayButtonProps } from "@/lib/calendar-primitive";
import { ComingUp, DayCard, Dot } from "@/blocks/calendar-planner/components/calendar-planner-agenda";
import { dayKey, events as sample, kindOf, onDay, parseDay, TODAY, type EventKind, type PlannerEvent } from "@/blocks/calendar-planner/components/calendar-planner-data";
import { EventDialog } from "@/blocks/calendar-planner/components/calendar-planner-event-dialog";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Icon } from "@/components/ui/icon";
import { Fastener } from "@/components/ui/paper";
import { Sticker } from "@/components/ui/sticker";
const DotsContext = createContext<Record<string, EventKind[]>>({});
const PlannerDayButton = defineUi<DayButtonProps>("PlannerDayButton", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  const _nestedHook0 = useContext(DotsContext);
  const kinds = computed(() => _nestedHook0.value[props.day.isoDate] ?? []);
  return () => {
    return <CalendarDayButton {...domProps(props)}>
      <span class="relative grid place-items-center">
        {props.children}
        {kinds.value.length ? <span aria-hidden="true" class="absolute -bottom-1.5 flex gap-px">
            {kinds.value.slice(0, 3).map((k, i) => <Dot key={i} kind={k} class="size-[5px] ring-0" />)}
          </span> : null}
      </span>
    </CalendarDayButton>;
  };
});
type Editing = {
  event?: PlannerEvent;
  date: string;
} | null;
const CalendarPlanner = defineUi<{
  as?: "main" | "div";
}>("CalendarPlanner", ["as"], (_props, {
  slots: _slots
}) => {
  const Root = computed(() => jsxTag(_props["as"] === undefined ? "main" as const : _props["as"]));
  const all = shallowRef<PlannerEvent[]>(initialState(sample));
  const setAll = stateSetter(all);
  const selected = shallowRef(initialState(TODAY));
  const setSelected = stateSetter(selected);
  const month = shallowRef<Date>(initialState(() => startOfMonth(parseDay(TODAY))));
  const setMonth = stateSetter(month);
  const editing = shallowRef<Editing>(initialState(null));
  const setEditing = stateSetter(editing);
  const message = shallowRef(initialState(""));
  const setMessage = stateSetter(message);
  const opener = shallowRef<HTMLElement | null | null>(null);
  const newButton = shallowRef<HTMLButtonElement | null>(null);
  const dots = computed(() => {
    const map: Record<string, EventKind[]> = {};
    for (const e of all.value) (map[e.date] ??= []).push(e.kind);
    return map;
  });
  const count = computed(() => onDay(all.value, selected.value).length);
  return () => {
    function open(next: NonNullable<Editing>) {
      opener.value = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setEditing(next);
    }
    function show(iso: string) {
      setSelected(iso);
      const d = parseDay(iso);
      setMonth(m => isSameMonth(m, d) ? m : startOfMonth(d));
    }
    function save(draft: Omit<PlannerEvent, "id">, id?: string) {
      if (id) setAll(list => list.map(e => e.id === id ? {
        ...draft,
        id
      } : e));else {
        const next = Math.max(0, ...all.value.map(e => Number(e.id.slice(1)) || 0)) + 1;
        setAll(list => [...list, {
          ...draft,
          id: `e${next}`
        }]);
      }
      show(draft.date);
      setMessage(`${id ? "Saved" as const : "Added" as const} “${draft.title}” on ${format(parseDay(draft.date), "EEEE d MMMM")}.`);
      setEditing(null);
    }
    function remove(event: PlannerEvent) {
      setAll(list => list.filter(e => e.id !== event.id));
      setMessage(`Deleted “${event.title}”.`);
      setEditing(null);
    }
    return <Root.value class="mx-auto flex w-full max-w-5xl flex-col gap-6 overflow-x-clip p-4 sm:p-6 lg:p-8">
      <header class="flex flex-wrap items-end justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="flex flex-col gap-1">
            <p class="font-type text-sm tracking-wide text-ink-muted">Planner</p>
            <h1 class="font-script text-4xl leading-none font-bold sm:text-5xl">{format(month.value, "MMMM yyyy")}</h1>
          </div>
          <Sticker name="acorn-pair" size={68} seed="planner-acorns" class="hidden shrink-0 sm:block" />
        </div>
        <div class="flex items-center gap-3">
          <Button variant="outline" onClick={() => {
            setSelected(TODAY);
            setMonth(startOfMonth(parseDay(TODAY)));
          }}>
            Today
          </Button>
          <Button ref={newButton} onClick={() => open({
            date: selected.value
          })}>
            <Icon name="calendar-plus" />
            New event
          </Button>
        </div>
      </header>

      <div class="grid items-start gap-6 lg:grid-cols-[auto_1fr]">
        <div class="flex flex-col gap-4">
          <DotsContext.Provider value={dots.value}>
            <div class="relative mx-auto w-fit max-lg:mt-8">
              <Fastener kind="clip" seed="planner-clip" class="pointer-events-none absolute -top-10 right-[3.125rem] z-(--ll-z-prop) calm:hidden" />
              <Calendar mode="single" required selected={parseDay(selected.value)} onSelect={d => d && show(dayKey(d))} month={month.value} onMonthChange={setMonth} today={parseDay(TODAY)} components={{
                DayButton: PlannerDayButton
              }} labels={{
                labelDayButton: (date, modifiers) => {
                  const n = dots.value[dayKey(date)]?.length ?? 0;
                  const label = `${modifiers.today ? "Today, " as const : "" as const}${format(date, "EEEE, MMMM do, yyyy")}${modifiers.selected ? ", selected" as const : "" as const}`;
                  return n ? `${label}, ${n} ${n === 1 ? "event" as const : "events" as const}` : label;
                }
              }} seed="planner-month" sheet={{
                stock: "card" as const,
                tilt: false
              }} class="max-[21rem]:[--cell:2.25rem]" />
            </div>
          </DotsContext.Provider>
          <ul role="list" class="mx-auto flex w-0 min-w-full flex-wrap justify-center gap-x-4 gap-y-1 px-2 text-sm text-muted-foreground lg:justify-start" aria-label="What the dots mean">
            {(["studio", "home", "friends", "trips", "errands"] as const).map(k => <li key={k} class="flex items-center gap-1.5">
                <Dot kind={k} />
                {kindOf(k).label}
              </li>)}
          </ul>
        </div>

        <div class="flex min-w-0 flex-col gap-6">
          <DayCard day={selected.value} list={all.value} onOpen={e => open({
            event: e,
            date: e.date
          })} />
          <ComingUp day={selected.value} list={all.value} onOpen={e => open({
            event: e,
            date: e.date
          })} />
        </div>
      </div>

      <p role="status" aria-label="Planner updates" class="sr-only">
        {message.value || `${count.value} ${count.value === 1 ? "event" as const : "events" as const} on ${format(parseDay(selected.value), "EEEE d MMMM")}.`}
      </p>

      {editing.value ? <EventDialog key={editing.value.event?.id ?? "new"} event={editing.value.event} date={editing.value.date} onSave={save} onDelete={remove} onClose={() => setEditing(null)} restoreFocus={() => (opener.value?.isConnected ? opener.value : newButton.value)?.focus()} /> : null}
    </Root.value>;
  };
});
export default CalendarPlanner;
