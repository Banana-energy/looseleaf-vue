// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Desk } from "@/components/ui/desk";
import { Page, PageContent, PageDescription, PageHeader, PageTitle } from "@/components/ui/page";
import { Paper } from "@/components/ui/paper";
export const meta = {
  title: "A morning at the desk" as const,
  description: "A whole workspace: a punched page, an index card taped up and two sticky notes, with the pencil and the coffee ring behind them." as const,
  layout: "full" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Desk as="section" aria-label="Workspace" objects={["coffee", "pencil", "clips"]} seed="morning" class="min-h-[34rem] px-6 py-12">
      <div class="mx-auto flex max-w-4xl flex-wrap items-start justify-center gap-10">
        <Page holes reinforced width="sm" seed="morning-page" class="min-h-[22rem] flex-1 basis-72">
          <PageHeader>
            <PageTitle underline="highlight">Monday</PageTitle>
            <PageDescription>Three things, in this order.</PageDescription>
          </PageHeader>
          <PageContent>
            <ol class="list-decimal space-y-1 ps-5">
              <li>Ink the outline</li>
              <li>Answer Marguerite</li>
              <li>Tea</li>
            </ol>
          </PageContent>
        </Page>
        <div class="flex basis-64 flex-col gap-8">
          <Card stock="index-card" tape="top" seed="morning-card" class="gap-3 py-4">
            <CardHeader>
              <CardTitle>Reminder</CardTitle>
            </CardHeader>
            <CardContent class="text-sm">Post the parcel before the office shuts.</CardContent>
            <CardFooter>
              <Button size="sm" variant="secondary">
                Done
              </Button>
            </CardFooter>
          </Card>
          <div class="flex gap-5">
            <Paper stock="sticky-yellow" seed="s1" class="size-28 p-3">
              <p class="font-script text-2xl leading-none font-bold">call mum</p>
            </Paper>
            <Paper stock="sticky-pink" seed="s2" class="size-28 p-3">
              <p class="font-script text-2xl leading-none font-bold">pens!!</p>
            </Paper>
          </div>
        </div>
      </div>
    </Desk>;
  };
});
export default Example;
