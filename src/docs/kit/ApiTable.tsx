// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { PropDoc } from "../types";
export interface ApiTableProps {
  props: readonly PropDoc[];
  caption: string;
}
const Chip = defineUi<{
  children: string;
  tone: "type" | "default";
}>("Chip", ["tone"], (_props, {
  slots: _slots
}) => {
  const children = renderValue(() => readSlot(_slots.default));
  const tone = computed(() => _props["tone"]);
  return () => {
    return <code class={"inline-block max-w-[30ch] px-1.5 py-0.5 align-baseline font-mono text-[0.8125rem] leading-snug break-words whitespace-normal [border-radius:2px_6px_3px_5px/5px_2px_6px_3px] " + (tone.value === "type" ? "bg-hi-select/45 text-ink" as const : "bg-muted text-ink" as const)}>
      {readSlot(_slots.default)}
    </code>;
  };
});
export const ApiTable = defineUi<ApiTableProps>("ApiTable", ["props", "caption"], (_props, {
  slots: _slots
}) => {
  const props = computed(() => _props["props"]);
  const caption = computed(() => _props["caption"]);
  return () => {
    return <div role="group" tabindex={0} aria-label={caption.value} class="-m-3 overflow-x-auto p-3 outline-offset-[-4px]">
      <Table containerClassName="overflow-x-visible" class="min-w-[36rem]">
        <caption class="sr-only">{caption.value}</caption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Prop</TableHead>
            <TableHead scope="col">Type</TableHead>
            <TableHead scope="col">Default</TableHead>
            <TableHead scope="col">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.value.map(prop => <TableRow key={prop.name} class="h-auto">
              <TableHead scope="row" class="py-3 align-top font-mono text-[0.9375rem] font-semibold tracking-normal whitespace-normal text-ink calm:font-mono calm:text-[0.9375rem] calm:font-semibold calm:text-ink">
                <code>{prop.name}</code>
                {prop.required ? <>
                    <span class="ms-0.5 text-red" aria-hidden="true">
                      *
                    </span>
                    <span class="sr-only"> (required)</span>
                  </> : null}
              </TableHead>
              <TableCell class="py-3 align-top whitespace-normal">
                <Chip tone="type">{prop.type}</Chip>
              </TableCell>
              <TableCell class="py-3 align-top whitespace-normal">
                {prop.default ? <Chip tone="default">{prop.default}</Chip> : <span aria-label="no default">-</span>}
              </TableCell>
              <TableCell class="min-w-[16rem] py-3 align-top text-[15px] leading-snug whitespace-normal">{prop.description}</TableCell>
            </TableRow>)}
        </TableBody>
      </Table>
    </div>;
  };
});
