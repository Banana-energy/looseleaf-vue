// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
import { PromptInput, PromptInputBody, PromptInputFooter, PromptInputHint, PromptInputSubmit, PromptInputSuggestion, PromptInputSuggestions, PromptInputTextarea, usePromptInput } from "@/components/ui/prompt-input";
export const meta = {
  title: "Slash commands and @mentions" as const,
  description: "The composer knows no data. `triggers` says which characters open a list, `usePromptInput().trigger` gives the word being typed, and you render the choices. Arrows move, Enter or Tab pick, Escape closes." as const,
  layout: "stack" as const,
  stage: "desk" as const,
  height: 420
};
const COMMANDS = [{
  name: "summarize" as const,
  hint: "Sum up the thread" as const
}, {
  name: "draw" as const,
  hint: "Sketch a diagram" as const
}, {
  name: "clear" as const,
  hint: "Start a fresh page" as const
}];
const PEOPLE = ["Ada", "Lin", "Stubby", "Grace"];
const Lists = defineUi<{}>("Lists", [], (_props, {
  slots: _slots
}) => {
  const _hook0 = usePromptInput();
  const trigger = computed(() => _hook0.value.trigger);
  const replaceTrigger = computed(() => _hook0.value.replaceTrigger);
  const q = computed(() => (trigger.value?.query ?? "").toLowerCase());
  const commands = computed(() => trigger.value?.char === "/" ? COMMANDS.filter(c => c.name.startsWith(q.value)) : []);
  const people = computed(() => trigger.value?.char === "@" ? PEOPLE.filter(p => p.toLowerCase().startsWith(q.value)) : []);
  return () => {
    return <>
      <PromptInputSuggestions trigger="/" aria-label="Commands" open={commands.value.length > 0}>
        {commands.value.map(c => <PromptInputSuggestion key={c.name} onSelect={() => replaceTrigger.value(`/${c.name}`)}>
            <Icon name="slash" size={14} />
            <span class="font-bold">{c.name}</span>
            <span class="text-muted-foreground">{c.hint}</span>
          </PromptInputSuggestion>)}
      </PromptInputSuggestions>
      <PromptInputSuggestions trigger="@" aria-label="People" open={people.value.length > 0}>
        {people.value.map(p => <PromptInputSuggestion key={p} onSelect={() => replaceTrigger.value(`@${p}`)}>
            <Icon name="user" size={14} />
            <span class="font-bold">{p}</span>
          </PromptInputSuggestion>)}
      </PromptInputSuggestions>
    </>;
  };
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="mx-auto flex h-full w-full max-w-xl flex-col justify-end px-2 pt-40 pb-3">
      <PromptInput seed="mentions" triggers={[{
        char: "/" as const,
        atStart: true
      }, "@"]} defaultValue="Thanks @">
        <Lists />
        <PromptInputBody>
          <PromptInputTextarea aria-label="Message" />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputHint>Type / for commands, @ for people</PromptInputHint>
          <PromptInputSubmit />
        </PromptInputFooter>
      </PromptInput>
    </div>;
  };
});
export default Example;
