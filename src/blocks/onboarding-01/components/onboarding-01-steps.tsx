// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId } from "vue";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
type Onboarding01Step = {
  id: string;
  title: string;
  hint: UI.ReactNode;
  action: string;
};
const STEPS: Onboarding01Step[] = [{
  id: "name" as const,
  title: "Name your first notebook" as const,
  hint: "Give it a cover and a name people will remember." as const,
  action: "Name it" as const
}, {
  id: "invite" as const,
  title: "Invite a teammate" as const,
  hint: "Notes are better with company." as const,
  action: "Invite" as const
}, {
  id: "pin" as const,
  title: "Pin a page you love" as const,
  hint: "Pinned pages sit at the top of every notebook." as const,
  action: "Show me" as const
}, {
  id: "draw" as const,
  title: "Draw something, anything" as const,
  hint: "Every page has a sketch pad. Stubby will not judge." as const,
  action: "Open sketch pad" as const
}, {
  id: "jump" as const,
  title: "Try the shortcut" as const,
  hint: <>
        Press <Kbd>&#8984;</Kbd> <Kbd>K</Kbd> to jump to any page.
      </>,
  action: "Try it" as const
}];
type Onboarding01StepsProps = {
  done: Record<string, boolean>;
  onDoneChange: (id: string, done: boolean) => void;
  onAction?: (id: string) => void;
};
const Onboarding01Steps = defineUi<Onboarding01StepsProps>("Onboarding01Steps", ["done", "onDoneChange", "onAction"], (_props, {
  slots: _slots
}) => {
  const done = computed(() => _props["done"]);
  const onDoneChange = computed(() => _props["onDoneChange"]);
  const onAction = computed(() => _props["onAction"]);
  const uid = useId();
  return () => {
    return <ul class="grid list-none gap-5 @md:gap-4">
      {STEPS.map(step => {
        const id = `${uid}-${step.id}`;
        return <li key={step.id} class="grid grid-cols-[1.25rem_minmax(0,1fr)] items-start gap-x-3 gap-y-1 @md:grid-cols-[1.25rem_minmax(0,1fr)_auto]">
            <Checkbox id={id} aria-describedby={`${id}-hint`} class="mt-0.5 size-5" checked={!!done.value[step.id]} onCheckedChange={v => onDoneChange.value(step.id, v === true)} />
            <div class="min-w-0">
              <Label for={id} class={cn("text-[17px] leading-6 font-bold", done.value[step.id] && "text-ink-muted line-through")}>
                {step.title}
              </Label>
              <p id={`${id}-hint`} class="text-[15px] leading-6 text-ink-soft">
                {step.hint}
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => onAction.value?.(step.id)} class="col-start-2 mt-1 justify-self-start @md:col-start-3 @md:row-start-1 @md:mt-0 @md:self-center">
              {step.action}
              <span class="sr-only">, {step.title.toLowerCase()}</span>
            </Button>
          </li>;
      })}
    </ul>;
  };
});
export { Onboarding01Steps, STEPS };
export type { Onboarding01Step };
