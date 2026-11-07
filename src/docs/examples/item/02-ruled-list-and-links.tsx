// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemSeparator, ItemTitle } from "@/components/ui/item";
export const meta = {
  title: "A ruled list of links" as const,
  description: "ruled puts a blue pencil line under every row, so the rules always match the rows. Link rows (asChild) light up under a highlighter swipe when you point at them, and take the focus ring from the keyboard." as const,
  layout: "stack" as const
};
const pages = [{
  icon: "file" as const,
  title: "Quarterly pages" as const,
  desc: "Last opened on Tuesday, tidy." as const
}, {
  icon: "folder" as const,
  title: "Receipts" as const,
  desc: "Forty-one of them, all crumpled." as const
}, {
  icon: "calendar" as const,
  title: "Calendar" as const,
  desc: "Three things this week, one of them cake." as const
}] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex w-full max-w-md flex-col gap-8">
      <ItemGroup ruled>
        {pages.map(p => <Item key={p.title} asChild>
            <a href="#item">
              <ItemMedia variant="icon">
                <Icon name={p.icon} />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{p.title}</ItemTitle>
                <ItemDescription>{p.desc}</ItemDescription>
              </ItemContent>
              <Icon name="chevron-right" />
            </a>
          </Item>)}
      </ItemGroup>
      <ItemGroup>
        <Item size="sm">
          <ItemContent>
            <ItemTitle>Before the separator</ItemTitle>
          </ItemContent>
        </Item>
        <ItemSeparator variant="dashed" />
        <Item size="sm">
          <ItemContent>
            <ItemTitle>After it</ItemTitle>
          </ItemContent>
        </Item>
      </ItemGroup>
    </div>;
  };
});
export default Example;
