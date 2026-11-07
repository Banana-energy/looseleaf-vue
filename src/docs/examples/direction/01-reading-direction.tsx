// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DirectionProvider, useDirection } from "@/components/ui/direction";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
export const meta = {
  title: "Reading direction" as const,
  description: "One provider, one prop. Flip it and the Reka UI keys, the slider's start edge, the tab shoulders and the words all turn round together. Click a tab and press the arrow keys before and after." as const,
  layout: "center" as const,
  height: 360
};
const Readout = defineUi<{}>("Readout", [], (_props, {
  slots: _slots
}) => {
  const dir = useDirection();
  return () => {
    return <p class="text-sm text-muted-foreground">
      <bdi dir="ltr">
        <code class="font-mono">useDirection()</code> says <strong class="text-foreground">{dir.value}</strong>. ArrowRight moves to the {dir.value === "rtl" ? "previous" as const : "next" as const} tab.
      </bdi>
    </p>;
  };
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const direction = shallowRef<"ltr" | "rtl">(initialState("rtl"));
  const setDirection = stateSetter(direction);
  return () => {
    return <div class="grid w-full max-w-md gap-4">
      <ToggleGroup type="single" variant="outline" value={direction.value} onValueChange={v => (v === "ltr" || v === "rtl") && setDirection(v)} aria-label="Reading direction">
        <ToggleGroupItem value="ltr">Left to right</ToggleGroupItem>
        <ToggleGroupItem value="rtl">Right to left</ToggleGroupItem>
      </ToggleGroup>

      <DirectionProvider direction={direction.value}>
        <Card seed="direction-default">
          <CardHeader>
            <CardTitle>{direction.value === "rtl" ? "دفتر الملاحظات" as const : "Notebook" as const}</CardTitle>
            <CardDescription>{direction.value === "rtl" ? "كل صفحة تُقرأ من اليمين إلى اليسار." as const : "Every page reads from left to right." as const}</CardDescription>
          </CardHeader>
          <CardContent class="grid gap-5">
            <Tabs defaultValue="one">
              <TabsList>
                <TabsTrigger value="one">{direction.value === "rtl" ? "الأول" as const : "First" as const}</TabsTrigger>
                <TabsTrigger value="two">{direction.value === "rtl" ? "الثاني" as const : "Second" as const}</TabsTrigger>
                <TabsTrigger value="three">{direction.value === "rtl" ? "الثالث" as const : "Third" as const}</TabsTrigger>
              </TabsList>
              <TabsContent value="one">
                <Readout />
              </TabsContent>
              <TabsContent value="two">
                <Readout />
              </TabsContent>
              <TabsContent value="three">
                <Readout />
              </TabsContent>
            </Tabs>
            <Slider defaultValue={[35]} ticks={4} aria-label={direction.value === "rtl" ? "حجم الخط" as const : "Type size" as const} />
          </CardContent>
        </Card>
      </DirectionProvider>
    </div>;
  };
});
export default Example;
