// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, Fragment } from "vue";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Icon } from "@/components/ui/icon";
export const meta = {
  title: "Separators" as const,
  description: "A pencil slash is the default. Children replace it: a drawn chevron, an arrow, a dot. Links can also be your router's element with asChild." as const,
  layout: "center" as const
};
const TRAIL = ["Notebooks", "Field notes", "March"];
const Trail = defineUi<{
  separator?: UI.VueNode;
  label: string;
}>("Trail", ["separator", "label"], (_props, {
  slots: _slots
}) => {
  const separator = computed(() => _props["separator"]);
  const label = computed(() => _props["label"]);
  return () => {
    return <div class="grid justify-items-start gap-1">
      <span class="font-type text-sm text-ink-muted">{label.value}</span>
      <Breadcrumb>
        <BreadcrumbList>
          {TRAIL.map((name, i) => <Fragment key={name}>
              <BreadcrumbItem>
                {i < TRAIL.length - 1 ? <BreadcrumbLink asChild>
                    <a href={`#${name}`}>{name}</a>
                  </BreadcrumbLink> : <BreadcrumbPage seed={label.value}>{name}</BreadcrumbPage>}
              </BreadcrumbItem>
              {i < TRAIL.length - 1 ? <BreadcrumbSeparator>{separator.value}</BreadcrumbSeparator> : null}
            </Fragment>)}
        </BreadcrumbList>
      </Breadcrumb>
    </div>;
  };
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid gap-5">
      <Trail label="slash (default)" />
      <Trail label="chevron" separator={<Icon name="chevron-right" />} />
      <Trail label="arrow" separator={<Icon name="arrow-right" />} />
      <Trail label="dot" separator={<Icon name="dot" size={20} />} />
    </div>;
  };
});
export default Example;
