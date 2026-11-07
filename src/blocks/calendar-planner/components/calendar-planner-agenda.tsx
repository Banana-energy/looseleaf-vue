// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { format } from "date-fns";
import { IndexCard, IndexCardContent, IndexCardFooter, IndexCardHeader, IndexCardTitle } from "@/components/ui/index-card";
import { cn } from "@/lib/utils";
import { after, clock, kindOf, onDay, parseDay, TODAY, type PlannerEvent } from "@/blocks/calendar-planner/components/calendar-planner-data";
export const Dot = defineUi<{
  kind: PlannerEvent["kind"];
  className?: string;
}>("Dot", ["kind", "class"], (_props, {
  slots: _slots
}) => {
  const kind = computed(() => _props["kind"]);
  const className = computed(() => _props["class"]);
  return () => {
    return <span aria-hidden="true" class={cn("inline-block size-2.5 shrink-0 rounded-full ring-1 ring-ink/40", kindOf(kind.value).dot, className.value)} />;
  };
});
const NUMBER_WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const row = "flex h-[30px] w-full items-center gap-2 text-start leading-[30px] hover:ll-swipe focus-visible:ll-swipe";
export const DayCard = defineUi<{
  day: string;
  list: readonly PlannerEvent[];
  onOpen: (e: PlannerEvent) => void;
  className?: string;
}>("DayCard", ["day", "list", "onOpen", "class"], (_props, {
  slots: _slots
}) => {
  const day = computed(() => _props["day"]);
  const list = computed(() => _props["list"]);
  const onOpen = computed(() => _props["onOpen"]);
  const className = computed(() => _props["class"]);
  const events = computed(() => onDay(list.value, day.value));
  return () => {
    return <IndexCard class={cn("max-w-none", className.value)} seed={`planner-day-${day.value}`} tilt={false}>
      <IndexCardHeader>
        <IndexCardTitle role="heading" aria-level={2}>
          {format(parseDay(day.value), "EEEE d MMMM")}
        </IndexCardTitle>
        {day.value === TODAY ? <span class="pb-0.5 font-type text-sm tracking-wide text-ink-muted">today</span> : null}
      </IndexCardHeader>
      <IndexCardContent>
        {events.value.length ? <ul role="list">
            {events.value.map(e => <li key={e.id}>
                <button type="button" class={row} onClick={() => onOpen.value(e)}>
                  <span class="ll-num w-14 shrink-0 text-end whitespace-nowrap text-ink-soft">{clock(e.start)}</span>
                  <Dot kind={e.kind} />
                  <span class="min-w-0 flex-1 truncate">{e.title}</span>
                  <span class="sr-only">, {clock(e.start)} to {clock(e.end)}, {kindOf(e.kind).label}. Open to change it.</span>
                </button>
              </li>)}
          </ul> : <p class="text-muted-foreground">Nothing planned. Leave it that way?</p>}
      </IndexCardContent>
      <IndexCardFooter>
        <span>{events.value.length === 0 ? "a free day" as const : events.value.length === 1 ? "one thing" as const : `${NUMBER_WORDS[events.value.length] ?? events.value.length} things`}</span>
      </IndexCardFooter>
    </IndexCard>;
  };
});
export const ComingUp = defineUi<{
  day: string;
  list: readonly PlannerEvent[];
  onOpen: (e: PlannerEvent) => void;
  className?: string;
}>("ComingUp", ["day", "list", "onOpen", "class"], (_props, {
  slots: _slots
}) => {
  const day = computed(() => _props["day"]);
  const list = computed(() => _props["list"]);
  const onOpen = computed(() => _props["onOpen"]);
  const className = computed(() => _props["class"]);
  const next = computed(() => after(list.value, day.value));
  return () => {
    return <IndexCard class={cn("max-w-none", className.value)} seed="planner-next" tilt={false} stack={2} flag="sky">
      <IndexCardHeader>
        <IndexCardTitle role="heading" aria-level={2}>
          Coming up
        </IndexCardTitle>
      </IndexCardHeader>
      <IndexCardContent>
        {next.value.length ? <ul role="list">
            {next.value.map(e => <li key={e.id}>
                <button type="button" class={row} onClick={() => onOpen.value(e)}>
                  <span class="ll-num w-20 shrink-0 whitespace-nowrap text-ink-soft">{format(parseDay(e.date), "EEE d")}</span>
                  <Dot kind={e.kind} />
                  <span class="min-w-0 flex-1 truncate">{e.title}</span>
                  <span class="sr-only">
                    , {format(parseDay(e.date), "EEEE d MMMM")}, {clock(e.start)}, {kindOf(e.kind).label}. Open to change it.
                  </span>
                </button>
              </li>)}
          </ul> : <p class="text-muted-foreground">Nothing after this day yet.</p>}
      </IndexCardContent>
    </IndexCard>;
  };
});
