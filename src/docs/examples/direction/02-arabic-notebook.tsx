// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DirectionProvider } from "@/components/ui/direction";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export const meta = {
  title: "Arabic: notebook" as const,
  description: "Tabs, a menu with a sub-menu, a slider and a table, in Arabic. Tab and arrow keys run right to left, the sub-menu opens with ArrowLeft, the slider starts at its right edge, the table columns read from the right." as const,
  layout: "center" as const,
  height: 640
};
const ROWS = [{
  name: "ليلى" as const,
  status: "مدفوع" as const,
  amount: "250.00" as const
}, {
  name: "يوسف" as const,
  status: "قيد الانتظار" as const,
  amount: "150.00" as const
}, {
  name: "مريم" as const,
  status: "متأخر" as const,
  amount: "350.00" as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <DirectionProvider direction="rtl">
      <Card lang="ar" seed="direction-arabic" class="w-full max-w-xl">
        <CardHeader>
          <CardTitle>دفتر الحسابات</CardTitle>
          <CardDescription>افتح القائمة، حرّك المنزلق، وتنقّل بين الألسنة بمفاتيح الأسهم.</CardDescription>
        </CardHeader>
        <CardContent class="grid gap-6">
          <div class="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  الخيارات <Icon name="chevron-down" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-56" align="start" seed="direction-arabic-menu">
                <DropdownMenuLabel>الصفحة الحالية</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Icon name="pencil" /> تعديل <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Icon name="copy" /> نسخ <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Icon name="folder" /> نقل إلى
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>المسودات</DropdownMenuItem>
                    <DropdownMenuItem>الأرشيف</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <Icon name="trash" /> حذف
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Slider class="flex-1" defaultValue={[40]} ticks={5} aria-label="حجم الخط" getValueText={v => `${v}%`} />
          </div>

          <Tabs defaultValue="paid">
            <TabsList>
              <TabsTrigger value="paid">المدفوعات</TabsTrigger>
              <TabsTrigger value="pending">المعلّقة</TabsTrigger>
              <TabsTrigger value="all">الكل</TabsTrigger>
            </TabsList>
            <TabsContent value="paid">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead class="text-end">المبلغ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ROWS.map(row => <TableRow key={row.name}>
                      <TableCell class="font-bold">{row.name}</TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell class="ll-num text-end">{row.amount}</TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="pending">لا توجد مدفوعات معلّقة الآن.</TabsContent>
            <TabsContent value="all">كل الحسابات في دفتر واحد.</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DirectionProvider>;
  };
});
export default Example;
