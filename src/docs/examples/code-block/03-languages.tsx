// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { CodeBlock } from "@/components/ui/code-block";
export const meta = {
  title: "css, json and bash" as const,
  description: "The small lexer knows tsx, ts, jsx, js, css, json and bash. The language comes from the file name when you do not say. Long lines wrap with `wrap`." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="mx-auto flex w-full max-w-xl flex-col gap-10 pt-2">
      <CodeBlock filename="card.css" seed="css" code={`@media (min-width: 40rem) {
  .card > h1 {
    color: var(--ll-ink); /* felt */
    margin: -2px 1.5rem !important;
  }
}`} />
      <CodeBlock filename="package.json" seed="json" code={`{\n  "name": "looseleaf",\n  "private": true,\n  "keywords": ["paper", null]\n}`} />
      <CodeBlock language="bash" filename="terminal" wrap seed="bash" code={`$ npx shadcn add https://kevintngo.github.io/looseleaf/r/bubble.json https://kevintngo.github.io/looseleaf/r/message.json --overwrite
# then draw something
export FOO=$BAR && echo "\${FOO}" | grep -i tags`} />
    </div>;
  };
});
export default Example;
