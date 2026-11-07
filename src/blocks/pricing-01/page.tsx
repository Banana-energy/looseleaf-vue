// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef, useId } from "vue";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Doodle } from "@/components/ui/doodle";
import { Paper } from "@/components/ui/paper";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Pricing01Card } from "@/blocks/pricing-01/components/pricing-01-card";
import { FAQ, TIERS, dollars, type Period, type Tier } from "@/blocks/pricing-01/components/pricing-01-data";
import { cn } from "@/lib/utils";
type Props = {
  className?: string;
  defaultPeriod?: Period;
  onChoose?: (tier: Tier, period: Period) => void;
};
const Pricing01 = defineUi<Props>("Pricing01", ["class", "defaultPeriod", "onChoose"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const defaultPeriod = computed(() => _props["defaultPeriod"] === undefined ? "monthly" as const : _props["defaultPeriod"]);
  const onChoose = computed(() => _props["onChoose"]);
  const period = shallowRef<Period>(initialState(defaultPeriod.value));
  const setPeriod = stateSetter(period);
  const chosen = shallowRef<Tier["id"] | null>(initialState(null));
  const setChosen = stateSetter(chosen);
  const uid = useId();
  const yearlySaving = computed(() => TIERS.find(t => t.popular)!);
  const saved = computed(() => yearlySaving.value.monthly * 12 - yearlySaving.value.yearly);
  return () => {
    return <section aria-labelledby={`${uid}-title`} class={cn("@container/pricing mx-auto grid w-full max-w-6xl gap-12 px-4 py-12 sm:px-8", className.value)}>
      <header class="mx-auto grid max-w-2xl justify-items-center gap-4 text-center">
        <h2 id={`${uid}-title`} class="ll-riso font-script text-5xl leading-none font-bold text-balance @lg/pricing:text-6xl">
          Pick a desk that fits
        </h2>
        <p class="text-lg text-muted-foreground text-balance">Start free with one notebook. Pay when you need more paper, more people or the good highlighters. Cancel with one press.</p>
        <div class="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <ToggleGroup type="single" variant="outline" size="lg" value={period.value} onValueChange={v => v && setPeriod(v as Period)} aria-label="Billing period">
            <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
            <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
          </ToggleGroup>
          <span class="flex items-end gap-1 font-script text-2xl leading-none text-ink-soft">
            <Doodle name="arrow-swoop" size={48} class="-scale-x-100 rtl:scale-x-100" />
            two months free
          </span>
        </div>
      </header>

      <p role="status" class="sr-only">
        {period.value === "yearly" ? `Showing yearly prices. Studio saves you ${dollars(saved.value)} a year.` : "Showing monthly prices." as const}
      </p>

      <div class="mx-auto grid w-full max-w-md gap-12 pt-6 @4xl/pricing:max-w-none @4xl/pricing:grid-cols-3 @4xl/pricing:items-stretch @4xl/pricing:gap-8">
        {TIERS.map(t => <Pricing01Card key={t.id} id={`${uid}-${t.id}`} tier={t} period={period.value} chosen={chosen.value === t.id} onChoose={() => {
          setChosen(t.id);
          onChoose.value?.(t, period.value);
        }} />)}
      </div>

      <Paper as="section" stock="slip" tilt={-0.3} seed="pricing-faq" aria-labelledby={`${uid}-faq`} class="mx-auto grid w-full max-w-2xl gap-4 px-6 py-6">
        <h3 id={`${uid}-faq`} class="font-script text-3xl leading-none font-semibold">
          Questions people ask
        </h3>
        <Accordion type="single" collapsible>
          {FAQ.map((f, i) => <AccordionItem key={f.q} value={`q${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>)}
        </Accordion>
      </Paper>
    </section>;
  };
});
export default Pricing01;
