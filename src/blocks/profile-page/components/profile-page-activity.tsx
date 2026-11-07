// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId } from "vue";
import { Icon } from "@/components/ui/icon";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Marker, MarkerContent } from "@/components/ui/marker";
import { Paper } from "@/components/ui/paper";
import { Tally } from "@/components/ui/tally";
import { FEED, WEEKS, type Entry, type Week } from "@/blocks/profile-page/components/profile-page-data";
const WeeklyTally = defineUi<{
  weeks: Week[];
}>("WeeklyTally", ["weeks"], (_props, {
  slots: _slots
}) => {
  const weeks = computed(() => _props["weeks"]);
  const titleId = useId();
  const best = computed(() => Math.max(0, ...weeks.value.map(w => w.pages)));
  return () => {
    return <Paper as="section" stock="slip" aria-labelledby={titleId} seed="weekly-tally" class="grid grid-rows-[auto_minmax(0,1fr)] gap-3 px-6 py-5">
      <div class="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 id={titleId} class="font-script text-3xl leading-none font-semibold">
          Pages, week by week
        </h3>
        <p class="text-sm text-muted-foreground">Best week: {best.value} pages</p>
      </div>
      <ol aria-label="Pages written each week" class="grid divide-y divide-rule-blue/60">
        {weeks.value.map((w, i) => {
          const now = i === weeks.value.length - 1;
          return <li key={w.label} class="grid min-h-9 grid-cols-[minmax(0,1fr)_3rem] items-center gap-x-3 gap-y-1 py-1.5 @md/profile:grid-cols-[8rem_minmax(0,1fr)_3rem] @md/profile:py-0">
              <span class="text-sm text-muted-foreground">{now ? "This week" as const : w.label}</span>
              <Tally count={w.pages} size="sm" tone={now ? "marker" as const : "ink" as const} label={`${w.pages} pages, ${w.label}`} seed={`week-${i}`} class="col-span-2 row-start-2 @md/profile:col-span-1 @md/profile:col-start-2 @md/profile:row-start-1" />
              <span class="ll-num col-start-2 row-start-1 text-end font-bold @md/profile:col-start-3">{w.pages}</span>
            </li>;
        })}
      </ol>
    </Paper>;
  };
});
const DAYS: Entry["day"][] = ["Today", "Yesterday", "Last week"];
const Feed = defineUi<{
  feed: Entry[];
}>("Feed", ["feed"], (_props, {
  slots: _slots
}) => {
  const feed = computed(() => _props["feed"]);
  const titleId = useId();
  return () => {
    return <Paper as="section" stock="paper" tilt={0.25} seed="profile-feed" aria-labelledby={titleId} class="grid content-start gap-2 px-6 py-5">
      <h3 id={titleId} class="font-script text-3xl leading-none font-semibold">
        Lately
      </h3>
      {DAYS.map(day => <div key={day} role="group" aria-label={day} class="grid">
          <Marker variant="separator">
            <MarkerContent>{day}</MarkerContent>
          </Marker>
          <ItemGroup>
            {feed.value.filter(e => e.day === day).map(e => <Item key={e.id} size="sm">
                <ItemMedia variant="icon">
                  <Icon name={e.icon} />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{e.title}</ItemTitle>
                  <ItemDescription>
                    {e.where} · <span class="ll-num">{e.time}</span>
                  </ItemDescription>
                </ItemContent>
              </Item>)}
          </ItemGroup>
        </div>)}
    </Paper>;
  };
});
export const ProfilePageActivity = defineUi<{
  weeks?: Week[];
  feed?: Entry[];
}>("ProfilePageActivity", ["weeks", "feed"], (_props, {
  slots: _slots
}) => {
  const weeks = computed(() => _props["weeks"] === undefined ? WEEKS : _props["weeks"]);
  const feed = computed(() => _props["feed"] === undefined ? FEED : _props["feed"]);
  return () => {
    return <div class="grid gap-10 @4xl/profile:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <WeeklyTally weeks={weeks.value} />
      <Feed feed={feed.value} />
    </div>;
  };
});
