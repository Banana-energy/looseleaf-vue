// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { Icon } from "@/components/ui/icon";
import { addCommand, componentsJsonSnippet } from "../../core/install";
import { Link } from "../../core/router";
import { paths } from "../../core/router-core";
import { useSettings } from "../../core/settings";
import { DeskSection } from "./section";
const STEPS = [{
  n: 1,
  title: "Point the CLI at the registry" as const,
  text: "One line in components.json, once per project." as const
}, {
  n: 2,
  title: "Add what you need" as const,
  text: "The CLI copies the component, its drawing recipe and any packages into your repo." as const
}, {
  n: 3,
  title: "Import it like any shadcn part" as const,
  text: "The files are yours to read, change and keep." as const
}];
const USAGE = `import { Button } from "@/components/ui/button"

export function Save() {
  return <Button>Save</Button>
}`;
export const How = defineUi<{}>("How", [], (_props, {
  slots: _slots
}) => {
  const _hook0 = useSettings();
  const packageManager = computed(() => _hook0.value.packageManager);
  return () => {
    return <DeskSection id="how" title="How it works" lede="A shadcn registry, so you already know the drill. Same command, same folders, a different hand.">
      <div class="grid items-start gap-x-12 gap-y-10 @3xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div class="grid gap-6">
          <ol role="list" class="grid gap-6">
            {STEPS.map(s => <li key={s.n} class="flex gap-4">
                <span aria-hidden="true" class="ll-num grid size-11 shrink-0 place-items-center font-script text-4xl leading-none font-bold text-ink">
                  {s.n}
                </span>
                <div class="min-w-0">
                  <p class="font-script text-3xl leading-none font-bold text-ink">{s.title}</p>
                  <p class="mt-1 text-ink-soft">{s.text}</p>
                </div>
              </li>)}
          </ol>
          <div>
            <Button asChild variant="link" seed="how-guide" class="text-ink hover:text-ink">
              <Link to={paths.gettingStarted}>
                Read the installation guide
                <Icon name="arrow-right" />
              </Link>
            </Button>
          </div>
        </div>
        <div class="grid gap-10">
          <CodeBlock data-home="how-registry" code={componentsJsonSnippet()} language="json" filename="components.json" seed="how-registry" tape="corner" />
          <CodeBlock data-home="how-command" code={addCommand(packageManager.value, "button")} language="bash" filename="terminal" seed="how-command" tape="top" />
          <CodeBlock data-home="how-usage" code={USAGE} language="tsx" filename="save.tsx" seed="how-usage" tape="corner" />
        </div>
      </div>
    </DeskSection>;
  };
});
