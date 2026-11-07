// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
const TASKS = [{
  id: "ship" as const,
  label: "Ship the sign-in card" as const
}, {
  id: "draw" as const,
  label: "Draw the dashboard" as const
}, {
  id: "focus" as const,
  label: "Fix the focus ring" as const
}, {
  id: "water" as const,
  label: "Water the plant" as const
}];
const TEAM = ["Ada Lovelace", "Jo Okafor", "Mika Kobayashi", "Sam Reyes", "Priya Nair"];
const TabsCard = defineUi<{}>("TabsCard", [], (_props, {
  slots: _slots
}) => {
  const done = shallowRef<Record<string, boolean>>(initialState({
    ship: true,
    draw: true
  }));
  const setDone = stateSetter(done);
  const count = computed(() => TASKS.filter(t => done.value[t.id]).length);
  return () => {
    return <Card data-home="tabs" seed="home-tabs" tape="top" class="w-full gap-3 py-6">
      <CardHeader>
        <CardTitle>This week</CardTitle>
        <CardDescription>
          {count.value} of {TASKS.length} done
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="todo">
          <TabsList>
            <TabsTrigger value="todo">To do</TabsTrigger>
            <TabsTrigger value="sprint">Sprint</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          <TabsContent value="todo" class="grid gap-2 pt-3">
            {TASKS.map(t => <div key={t.id} class="flex items-center gap-2">
                <Checkbox id={`home-task-${t.id}`} checked={!!done.value[t.id]} onCheckedChange={v => setDone(d => ({
                ...d,
                [t.id]: v === true
              }))} />
                <Label for={`home-task-${t.id}`} class={cn("font-normal text-[16px]", done.value[t.id] && "text-muted-foreground line-through decoration-red")}>
                  {t.label}
                </Label>
              </div>)}
          </TabsContent>
          <TabsContent value="sprint" class="grid gap-3 pt-4">
            <div class="flex items-baseline justify-between">
              <span class="font-script text-2xl leading-none">Sprint 7 of 10</span>
              <span class="ll-num font-script text-2xl leading-none text-red">70%</span>
            </div>
            <Progress value={70} aria-label="Sprint progress" />
          </TabsContent>
          <TabsContent value="team" class="flex flex-wrap gap-3 pt-4">
            {TEAM.map(name => <Avatar key={name} size="lg">
                <AvatarFallback name={name} />
              </Avatar>)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>;
  };
});
export default TabsCard;
