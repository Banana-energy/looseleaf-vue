// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId } from "vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Desk } from "@/components/ui/desk";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Paper } from "@/components/ui/paper";
import { Switch } from "@/components/ui/switch";
import { InkProvider } from "@/lib/ink/vue";
import { engineKnobs, scopeStyle, type ThemeState } from "./theme-model";
export const ThemePreview = defineUi<{
  state: ThemeState;
  label: string;
  seed?: string;
}>("ThemePreview", ["state", "label", "seed"], (_props, {
  slots: _slots
}) => {
  const state = computed(() => _props["state"]);
  const label = computed(() => _props["label"]);
  const seed = computed(() => _props["seed"] === undefined ? "theme" as const : _props["seed"]);
  const id = useId();
  return () => {
    return <div data-ll-scope="" style={cssStyle(scopeStyle(state.value))} role="group" aria-label={label.value} class="min-w-0">
      <InkProvider knobs={engineKnobs(state.value)} defs={false}>
        <Desk class="grid gap-5 p-4 sm:p-5">
          <Card seed={`${seed.value}:card`} tape="corner" class="w-full gap-4 py-5">
            <CardHeader>
              <CardTitle>Trip notes</CardTitle>
              <CardDescription>Packed for the weekend.</CardDescription>
            </CardHeader>
            <CardContent class="grid gap-3">
              <div class="grid gap-1.5">
                <Label for={`${id}-where`}>Where to</Label>
                <Input id={`${id}-where`} defaultValue="The pond" />
              </div>
              <div class="flex items-center gap-2.5">
                <Checkbox id={`${id}-umbrella`} defaultChecked />
                <Label for={`${id}-umbrella`}>Bring the big umbrella</Label>
              </div>
              <div class="flex items-center gap-2.5">
                <Switch id={`${id}-share`} defaultChecked />
                <Label for={`${id}-share`}>Share with Sam</Label>
              </div>
              <p class="text-[15px] leading-snug text-ink">
                Read <span class="font-bold text-ink-you underline decoration-2 underline-offset-4">the small print</span> or <mark>mark it up</mark>.{" "}
                <span class="text-red">Not saved.</span> <span class="text-green">Saved.</span> <span class="text-muted-foreground">Edited a minute ago.</span>
              </p>
              <div class="flex flex-wrap gap-2">
                <Badge>new</Badge>
                <Badge variant="secondary">draft</Badge>
                <Badge variant="destructive">late</Badge>
                <Badge variant="outline">3 left</Badge>
              </div>
            </CardContent>
            <CardFooter class="flex-wrap gap-2">
              <Button variant="outline" size="sm">
                Cancel
              </Button>
              <Button size="sm">Save</Button>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </CardFooter>
          </Card>
          <div class="flex flex-wrap items-start gap-5">
            <Paper stock="sticky-yellow" seed={`${seed.value}:sticky`} size={[132, 92]} class="h-[92px] w-[132px] p-3 font-script text-2xl leading-tight font-bold text-ink">
              buy more ink!
            </Paper>
            <Paper stock="slip" seed={`${seed.value}:slip`} size={[150, 92]} class="h-[92px] w-[150px] p-3 text-[14px] leading-snug text-ink">
              <span class="font-bold">Slip</span> <code class="bg-muted px-1 font-mono text-[12.5px]">--ll-slip</code>
            </Paper>
            <Paper stock="kraft" seed={`${seed.value}:kraft`} size={[110, 92]} class="h-[92px] w-[110px] p-3 text-[14px] leading-snug text-ink">
              Kraft
            </Paper>
          </div>
        </Desk>
      </InkProvider>
    </div>;
  };
});
