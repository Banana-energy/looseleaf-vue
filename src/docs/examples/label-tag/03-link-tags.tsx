// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { LabelTag, LabelTagTitle } from "@/components/ui/label-tag";
export const meta = {
  title: "Tags that link" as const,
  description: "`asChild` makes the tag a link (or a button). It keeps its native focus and keyboard behavior and swings on its eyelet when you hover it." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const tags = [{
  href: "#sale" as const,
  label: "Sale" as const,
  twine: "tomato" as const,
  stock: "kraft" as const
}, {
  href: "#new" as const,
  label: "New" as const,
  twine: "grass" as const,
  stock: "sticky-yellow" as const
}, {
  href: "#gifts" as const,
  label: "Gifts" as const,
  twine: "sky" as const,
  stock: "paper" as const
}] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <nav aria-label="Shop sections" class="flex flex-wrap justify-center gap-x-10 gap-y-14 p-6">
      {tags.map(t => <LabelTag key={t.label} asChild stock={t.stock} twine={t.twine} shape="round" seed={t.label} class="min-h-28 w-28">
          <a href={t.href}>
            <LabelTagTitle class="text-center">{t.label}</LabelTagTitle>
          </a>
        </LabelTag>)}
    </nav>;
  };
});
export default Example;
