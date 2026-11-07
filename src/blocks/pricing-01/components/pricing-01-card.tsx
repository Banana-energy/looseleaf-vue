// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Highlight } from "@/components/ui/highlight";
import { Icon } from "@/components/ui/icon";
import { Sticker } from "@/components/ui/sticker";
import { dollars, perMonth, type Period, type Tier } from "@/blocks/pricing-01/components/pricing-01-data";
import { cn } from "@/lib/utils";
export const Pricing01Card = defineUi<{
  id: string;
  tier: Tier;
  period: Period;
  chosen: boolean;
  onChoose: () => void;
}>("Pricing01Card", ["id", "tier", "period", "chosen", "onChoose"], (_props, {
  slots: _slots
}) => {
  const id = computed(() => _props["id"]);
  const tier = computed(() => _props["tier"]);
  const period = computed(() => _props["period"]);
  const chosen = computed(() => _props["chosen"]);
  const onChoose = computed(() => _props["onChoose"]);
  const free = computed(() => tier.value.monthly === 0);
  const title = computed(() => `${id.value}-title`);
  return () => {
    return <Card as="article" aria-labelledby={title.value} stock={tier.value.popular ? "card" as const : "paper" as const} tape="top" tapeKind={tier.value.tape} seed={`price-${tier.value.id}`} data-popular={tier.value.popular ? "" as const : undefined} class={cn("relative h-full", tier.value.popular && "@4xl/pricing:-my-4 @4xl/pricing:pt-10 @4xl/pricing:pb-10")}>
      {tier.value.popular ? <Sticker name="first-place" size={76} rotate={10} seed="popular" class="absolute -end-2 -top-9 z-10 @4xl/pricing:-end-5" /> : null}
      <CardHeader>
        <CardTitle id={title.value} role="heading" aria-level={3} class="text-3xl">
          {tier.value.popular ? <Highlight>{tier.value.name}</Highlight> : tier.value.name}
          {tier.value.popular ? <Badge size="sm" class="ms-3 align-middle">
              Most popular
            </Badge> : null}
        </CardTitle>
        <CardDescription>{tier.value.tagline}</CardDescription>
      </CardHeader>
      <CardContent class="grid flex-1 content-start gap-6">
        <div>
          <p class="flex items-baseline gap-2.5">
            <span class="ll-num font-script text-6xl leading-none font-bold">{dollars(perMonth(tier.value, period.value))}</span>
            <span class="text-muted-foreground">{free.value ? "forever" as const : "a month" as const}</span>
          </p>
          <p class="mt-1 h-5 text-sm text-muted-foreground">{free.value ? "No card needed" as const : period.value === "yearly" ? `billed ${dollars(tier.value.yearly)} once a year` : "billed monthly" as const}</p>
        </div>
        <ul class="grid gap-2.5" aria-label={`${tier.value.name} includes`}>
          {tier.value.features.map(f => <li key={f} class="flex items-start gap-2.5">
              <Icon name="check" class="mt-1 text-green" weight={1.3} />
              <span>{f}</span>
            </li>)}
        </ul>
      </CardContent>
      <CardFooter>
        <Button class="w-full" size="lg" variant={tier.value.popular ? "default" as const : "outline" as const} aria-pressed={chosen.value} onClick={onChoose.value}>
          {chosen.value ? "Picked" as const : tier.value.cta}
          {chosen.value ? <Icon name="check" /> : null}
        </Button>
      </CardFooter>
    </Card>;
  };
});
