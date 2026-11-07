// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Callout } from "@/components/ui/callout";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Mascot } from "@/components/ui/mascot";
import { Paper } from "@/components/ui/paper";
import { Progress } from "@/components/ui/progress";
import { Stamp } from "@/components/ui/stamp";
import { Sticker } from "@/components/ui/sticker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tally } from "@/components/ui/tally";
import { cn } from "@/lib/utils";
const TASKS = [{
  id: "invoices" as const,
  label: "Send the invoices" as const,
  done: true
}, {
  id: "post" as const,
  label: "Draft the launch post" as const,
  done: true
}, {
  id: "review" as const,
  label: "Review Ada’s pull request" as const,
  done: false
}, {
  id: "offsite" as const,
  label: "Book the offsite" as const,
  done: false
}, {
  id: "plant" as const,
  label: "Water the plant" as const,
  done: false
}];
const WEEK = [{
  day: "Mon" as const,
  value: 100
}, {
  day: "Tue" as const,
  value: 80
}, {
  day: "Wed" as const,
  value: 60
}, {
  day: "Thu" as const,
  value: 20
}, {
  day: "Fri" as const,
  value: 0
}];
const people = ["Ada Lovelace", "Jo Okafor", "Sam Reyes"];
const LandingHero02Window = defineUi<{
  className?: string;
}>("LandingHero02Window", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const done = shallowRef(initialState(() => Object.fromEntries(TASKS.map(t => [t.id, t.done])) as Record<string, boolean>));
  const setDone = stateSetter(done);
  const count = computed(() => Object.values(done.value).filter(Boolean).length);
  const all = computed(() => count.value === TASKS.length);
  return () => {
    return <div data-slot="landing-hero-window" class={className.value}>
      <div class="relative mx-auto w-full max-w-3xl">
        <Mascot pose="peek" size={112} class="pointer-events-none absolute end-12 bottom-[calc(100%-1.3rem)] [--ll-blend:normal]" />
        <Paper stock="paper" tilt={0.5} tape="both" tapeKind="washi-stripes" shadow="lift" seed="hero-window" class="relative z-(--ll-z-raised) px-5 pt-5 pb-6 @xl:px-8 @xl:pb-10">
          <div class="flex items-center justify-between gap-4">
            <p class="font-script text-2xl leading-none font-bold text-ink">
              penmark <span class="font-hand text-base font-normal text-ink-muted">/ week 39</span>
            </p>
            <AvatarGroup class="[--ll-avatar-group-ring:var(--ll-paper)] [&>*+*]:-ms-0.5">
              {people.map(name => <Avatar key={name}>
                  <AvatarFallback name={name} />
                </Avatar>)}
            </AvatarGroup>
          </div>

          <Tabs defaultValue="today" class="mt-4 gap-4">
            <TabsList variant="line" aria-label="View">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">This week</TabsTrigger>
            </TabsList>

            <TabsContent value="today">
              <h2 class="sr-only">Today</h2>
              <div class="relative @2xl:pe-52">
                <ul role="list" class="grid">
                  {TASKS.map(t => <li key={t.id} class="flex h-11 items-center gap-3">
                      <Checkbox id={`hero-task-${t.id}`} checked={done.value[t.id]} onCheckedChange={v => setDone(d => ({
                      ...d,
                      [t.id]: v === true
                    }))} />
                      <Label for={`hero-task-${t.id}`} class={cn("flex-1 text-[17px]", done.value[t.id] && "text-ink-muted line-through")}>
                        {t.label}
                      </Label>
                    </li>)}
                </ul>
                <div class="pointer-events-none absolute end-0 top-0 hidden w-48 @2xl:block">
                  <Callout direction="left" seed="note-a" class="absolute start-0 top-11">
                    done before lunch
                  </Callout>
                  <Callout direction="left" seed="note-b" class="absolute start-0 top-33">
                    ask Sam first
                  </Callout>
                </div>
              </div>

              <div class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                <div class="min-w-40 flex-1">
                  <div class="mb-1.5 flex items-center gap-4">
                    <p class="text-[15px] text-ink-soft" role="status" aria-live="polite">
                      <span class="ll-num font-bold">{count.value}</span> of {TASKS.length} done
                    </p>
                    <Tally count={count.value} size="md" label={`${count.value} tasks done`} />
                  </div>
                  <Progress value={count.value} max={TASKS.length} aria-label="Tasks done today" aria-valuetext={`${count.value} of ${TASKS.length} done`} tone={all.value ? "green" as const : "marker" as const} />
                </div>
                {all.value ? <Stamp text="All done" ink="green" w={132} h={48} tilt={-6} class="animate-in zoom-in-[1.6] fade-in-0 duration-(--ll-dur-pop)" /> : null}
              </div>
            </TabsContent>

            <TabsContent value="week">
              <h2 class="sr-only">This week</h2>
              <ul role="list" class="grid gap-3 py-1">
                {WEEK.map(d => <li key={d.day} class="grid grid-cols-[3rem_minmax(0,1fr)_3rem] items-center gap-3 text-base">
                    <span class="font-bold">{d.day}</span>
                    <Progress value={d.value} aria-label={`${d.day}: ${d.value}% done`} size="sm" />
                    <span class="ll-num text-end text-sm text-ink-muted">{d.value}%</span>
                  </li>)}
              </ul>
            </TabsContent>
          </Tabs>
        </Paper>
        <Sticker name="party-popper" size={88} rotate={-14} class="absolute -start-6 -bottom-14 z-(--ll-z-raised) hidden @xl:block" />
        <Sticker name="rating-five" size={80} rotate={9} class="absolute -end-4 -bottom-11 z-(--ll-z-raised) hidden @xl:block" />
      </div>
    </div>;
  };
});
export { LandingHero02Window };
