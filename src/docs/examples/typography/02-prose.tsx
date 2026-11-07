// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Prose } from "@/components/ui/typography";
export const meta = {
  title: "Prose: raw markup" as const,
  description: "Plain HTML you did not style, straight from a markdown renderer: Prose gives it the notebook's type, spacing, links, lists, code and quotations." as const,
  layout: "stack" as const
};
const HTML = `
<h1>Keeping a reading log</h1>
<p>A reading log is <em>not</em> a summary. It is a place to <strong>argue</strong>, and to write down where you stopped believing the author. Start with the <a href="#">field guide to margins</a>.</p>
<h2>What to write down</h2>
<ul>
  <li>The date, so future you can blame past you</li>
  <li>One sentence you would steal</li>
  <li>A question, marked with <code>?</code></li>
</ul>
<blockquote><p>The best time to write it down was when it happened.</p></blockquote>
<h2>Tools</h2>
<ol><li>A pencil</li><li>A second pencil</li></ol>
<p>Press <kbd>Cmd</kbd> + <kbd>S</kbd> to save, or run <code>npm run notes</code>.</p>
<pre><code>read --slowly --with-pencil</code></pre>
`;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Prose innerHTML={HTML} />;
  };
});
export default Example;
