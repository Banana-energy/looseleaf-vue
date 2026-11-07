// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Annotate } from "@/components/ui/annotate";
import { Paper } from "@/components/ui/paper";
import { Blockquote, H1, H2, InlineCode, Lead, List, Muted, P } from "@/components/ui/typography";
export const meta = {
  title: "An article on paper" as const,
  description: "The parts composed into a real page, with a mark or two from the marks family." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Paper stock="paper" tilt seed="article" class="w-full max-w-2xl px-9 py-9">
      <Muted>Notebook / 4 min read</Muted>
      <H1 class="mt-1">Why the margin is the best part</H1>
      <Lead class="mt-4">A book is a conversation with someone who cannot answer back.</Lead>
      <P>
        So you answer in the margin: <Annotate type="highlight">an arrow, a question mark, a small argument</Annotate>. Keep the pencil close and the <InlineCode>rules</InlineCode> loose.
      </P>
      <H2 class="mt-8">Three habits</H2>
      <List class="mt-4">
        <li>Date every page</li>
        <li>Never erase; cross out</li>
        <li>Leave a line at the end for what you want to ask next</li>
      </List>
      <Blockquote>Write it down before you lose it.</Blockquote>
    </Paper>;
  };
});
export default Example;
