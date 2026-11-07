// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { CodeBlock } from "@/components/ui/code-block";
export const meta = {
  title: "A typed slip" as const,
  description: "Pass `code`, a `filename` and a language: the header, the copy button and the lines come with it. Keywords are typed in red, functions struck twice, strings underscored." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const CODE = `import { useState } from "vue"

type Props = { tags: string[] } // one per note

export function TagChips({ tags }: Props) {
  const [on, setOn] = useState(new Set<string>())
  return (
    <ul className="flex gap-2">
      {tags.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  )
}`;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <CodeBlock code={CODE} filename="src/notes/tag-chips.tsx" lineNumbers class="mx-auto w-full max-w-xl" seed="default" />;
  };
});
export default Example;
