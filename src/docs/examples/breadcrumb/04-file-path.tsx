// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, Fragment, shallowRef } from "vue";
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { Paper } from "@/components/ui/paper";
export const meta = {
  title: "File path (composed)" as const,
  description: "A real use: the crumbs are the folders you have opened. Click one to go back up; when the path is longer than four names the middle folds into an ellipsis whose menu takes you there too." as const,
  layout: "center" as const,
  height: 260,
  stage: "desk" as const
};
const TREE: Record<string, string[]> = {
  Notebooks: ["Field notes", "Garden", "Recipes"],
  "Field notes": ["2026", "2025"],
  "2026": ["March", "April"],
  March: ["Week 1", "Week 2"],
  Garden: ["Beds", "Seeds"],
  Recipes: ["Soups", "Bread"]
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const path = shallowRef(initialState(["Notebooks", "Field notes", "2026", "March"]));
  const setPath = stateSetter(path);
  const here = computed(() => path.value[path.value.length - 1]);
  const folded = computed(() => path.value.length > 4);
  const shown = computed(() => folded.value ? [path.value[0], ...path.value.slice(-2)] : path.value);
  const hidden = computed(() => folded.value ? path.value.slice(1, -2) : []);
  return () => {
    return <Paper stock="paper" seed="path" class="w-full max-w-md p-5">
      <Breadcrumb>
        <BreadcrumbList>
          {shown.value.map((name, i) => {
            const at = folded.value && i > 0 ? path.value.length - (shown.value.length - i) : i;
            const last = i === shown.value.length - 1;
            return <Fragment key={`${name}-${at}`}>
                <BreadcrumbItem>
                  {last ? <BreadcrumbPage seed={`p-${at}`}>{name}</BreadcrumbPage> : <BreadcrumbLink href={`#${name}`} onClick={e => {
                  e.preventDefault();
                  setPath(p => p.slice(0, at + 1));
                }}>
                      {name}
                    </BreadcrumbLink>}
                </BreadcrumbItem>
                {i === 0 && folded.value ? <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <DropdownMenu>
                        <DropdownMenuTrigger class="-mx-1 flex items-center gap-1 px-1 hover:ll-swipe focus-visible:ll-swipe data-[state=open]:ll-swipe" aria-label="Show hidden folders">
                          <BreadcrumbEllipsis class="size-6" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {hidden.value.map((h, k) => <DropdownMenuItem key={h} onSelect={() => setPath(p => p.slice(0, k + 2))}>
                              <Icon name="folder" /> {h}
                            </DropdownMenuItem>)}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </BreadcrumbItem>
                  </> : null}
                {!last ? <BreadcrumbSeparator /> : null}
              </Fragment>;
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <ul role="list" class="mt-4 grid gap-1">
        {(TREE[here.value] ?? []).map(child => <li key={child}>
            <button type="button" class="-mx-1 flex w-full items-center gap-2 px-2 py-1 text-start hover:ll-swipe focus-visible:ll-swipe" onClick={() => setPath(p => [...p, child])}>
              <Icon name="folder" /> {child}
            </button>
          </li>)}
        {(TREE[here.value] ?? []).length === 0 ? <li class="text-sm text-muted-foreground">This folder is empty. Go back up with the path above.</li> : null}
      </ul>
    </Paper>;
  };
});
export default Example;
