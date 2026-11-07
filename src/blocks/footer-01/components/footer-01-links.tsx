// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId } from "vue";
const COLUMNS = [{
  title: "Product" as const,
  links: ["Notebooks", "Tasks", "Templates", "Changelog", "Pricing"]
}, {
  title: "Company" as const,
  links: ["About", "Careers", "Press kit", "Contact"]
}, {
  title: "Resources" as const,
  links: ["Guides", "Help center", "API docs", "Status", "Community"]
}];
const Footer01Links = defineUi<{}>("Footer01Links", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid grid-cols-2 gap-x-6 gap-y-10 @xl:grid-cols-3">
      {COLUMNS.map(col => <FooterColumn key={col.title} title={col.title} links={col.links} />)}
    </div>;
  };
});
const FooterColumn = defineUi<{
  title: string;
  links: string[];
}>("FooterColumn", ["title", "links"], (_props, {
  slots: _slots
}) => {
  const title = computed(() => _props["title"]);
  const links = computed(() => _props["links"]);
  const id = useId();
  return () => {
    return <nav aria-labelledby={id}>
      <h2 id={id} class="font-script text-2xl leading-none font-bold text-ink">
        {title.value}
      </h2>
      <ul role="list" class="mt-3 grid list-none gap-0.5">
        {links.value.map(l => <li key={l}>
            <a href={`#${l.toLowerCase().replace(/\s+/g, "-")}`} class="-mx-2 inline-block px-2 py-1 text-base text-ink hover:ll-swipe">
              {l}
            </a>
          </li>)}
      </ul>
    </nav>;
  };
});
export { Footer01Links, COLUMNS };
