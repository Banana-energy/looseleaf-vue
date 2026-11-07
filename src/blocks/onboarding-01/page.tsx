// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Confetti } from "@/components/ui/confetti";
import { Mascot } from "@/components/ui/mascot";
import { Progress } from "@/components/ui/progress";
import { Stamp } from "@/components/ui/stamp";
import { Tally } from "@/components/ui/tally";
import { Onboarding01Steps, STEPS } from "@/blocks/onboarding-01/components/onboarding-01-steps";
type Onboarding01Props = {
  defaultDone?: string[];
  onDoneChange?: (done: string[]) => void;
  onAction?: (id: string) => void;
};
const Onboarding01 = defineUi<Onboarding01Props>("Onboarding01", ["defaultDone", "onDoneChange", "onAction"], (_props, {
  slots: _slots
}) => {
  const defaultDone = computed(() => _props["defaultDone"] === undefined ? ["name", "invite"] : _props["defaultDone"]);
  const onDoneChange = computed(() => _props["onDoneChange"]);
  const onAction = computed(() => _props["onAction"]);
  const titleId = useId();
  const done = shallowRef<Record<string, boolean>>(initialState(() => Object.fromEntries(STEPS.map(s => [s.id, defaultDone.value.includes(s.id)]))));
  const setDone = stateSetter(done);
  const hidden = shallowRef(initialState(false));
  const setHidden = stateSetter(hidden);
  const heading = shallowRef<HTMLHeadingElement | null>(null);
  const showAgain = shallowRef<HTMLButtonElement | null>(null);
  const folded = shallowRef(false);
  watchDependencies(() => {
    if (!folded.value) return;
    folded.value = false;
    if (hidden.value) showAgain.value?.focus();else heading.value?.focus();
  }, () => [hidden.value], false);
  const fold = computed(() => (next: boolean) => {
    folded.value = true;
    setHidden(next);
  });
  const count = computed(() => STEPS.filter(s => done.value[s.id]).length);
  const all = computed(() => count.value === STEPS.length);
  const change = computed(() => (id: string, value: boolean) => {
    const next = {
      ...done.value,
      [id]: value
    };
    setDone(next);
    onDoneChange.value?.(STEPS.filter(s => next[s.id]).map(s => s.id));
  });
  return () => {
    if (hidden.value) {
      return <div class="@container flex w-full justify-center px-4 py-10">
        <Button ref={showAgain} type="button" variant="link" onClick={() => fold.value(false)}>
          Show the setup checklist ({count.value} of {STEPS.length} done)
        </Button>
      </div>;
    }
    return <section aria-labelledby={titleId} class="@container w-full">
      <div class="px-7 py-10 @xl:px-8 @xl:py-14">
        <div class="relative mx-auto max-w-xl">
          <Card tape="top" tapeKind="washi-dots" seed="onboarding-card">
            <CardHeader>
              <CardTitle>
                <h2 id={titleId} ref={heading} tabindex={-1} class="outline-none">
                  Let&rsquo;s get you set up
                </h2>
              </CardTitle>
              <CardDescription>Five small things. Tick them off as you go.</CardDescription>
              <CardAction>
                <Mascot pose={all.value ? "celebrate" as const : "write" as const} size={80} />
              </CardAction>
            </CardHeader>

            <CardContent class="grid gap-6">
              <div>
                <div class="mb-2 flex items-center gap-4">
                  <p role="status" class="text-[15px] text-ink-soft">
                    <span class="ll-num font-bold text-ink">{count.value}</span> of {STEPS.length} done
                  </p>
                  <Tally count={count.value} size="md" tone="blue" label={`${count.value} steps done`} />
                </div>
                <Progress value={count.value} max={STEPS.length} tone={all.value ? "green" as const : "marker" as const} aria-label="Setup progress" aria-valuetext={`${count.value} of ${STEPS.length} steps done`} />
              </div>
              <Onboarding01Steps done={done.value} onDoneChange={change.value} onAction={onAction.value} />
            </CardContent>

            <CardFooter class="justify-between gap-3">
              {all.value ? <>
                  <Stamp text="All set" ink="green" w={124} h={46} tilt={-6} seed="onboarding-stamp" class="animate-in zoom-in-[1.6] fade-in-0 duration-(--ll-dur-pop)" />
                  <Button asChild>
                    <a href="#write">Start writing</a>
                  </Button>
                </> : <Button type="button" variant="ghost" onClick={() => fold.value(true)}>
                  Skip for now
                </Button>}
            </CardFooter>
          </Card>
          <Confetti active={all.value} count={80} />
        </div>
      </div>
    </section>;
  };
});
export default Onboarding01;
export type { Onboarding01Props };
