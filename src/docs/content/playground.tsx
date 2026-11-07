// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef, useId } from "vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Desk } from "@/components/ui/desk";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { InkProvider } from "@/lib/ink/vue";
import { Link } from "../core/router";
import { paths } from "../core/router-core";
import { Callout, CodeBlock, InlineCode, Section, Stage } from "../kit";
import { DEFAULT_STATE, DENSITIES, LIVELY_DEGREES, TILT_MAX, TILTS, TIERS, isDefault, seedOf, snippets, type PlaygroundDensity, type PlaygroundState, type PlaygroundTier, type PlaygroundTilt } from "./home/playground-model";
const DENSITY_HINT: Record<PlaygroundDensity, string> = {
  comfortable: "Full ink, 40 px hit areas. The default." as const,
  compact: "The same drawings in 32 px rows, for tools." as const,
  calm: "Hairline pencil rules, no jitter, 28 px: a dense screen that stays quiet." as const
};
const TIER_HINT: Record<PlaygroundTier, string> = {
  lo: "The interface tier: light, fast, fine at any size." as const,
  hi: "More strokes, richer fills. For hero art and screenshots." as const
};
const TILT_HINT: Record<PlaygroundTilt, string> = {
  flat: "Sheets lie square. Text never tilts, in any setting." as const,
  natural: "Each sheet is turned a fraction of a degree, by its seed." as const,
  lively: "Turned up to four degrees, like a desk in a hurry." as const
};
const ORDERS = [{
  id: "N-2041" as const,
  who: "Ada Lovelace" as const,
  status: "Paid" as const,
  total: "$24.00" as const
}, {
  id: "N-2042" as const,
  who: "Jo Okafor" as const,
  status: "Pending" as const,
  total: "$18.50" as const
}, {
  id: "N-2043" as const,
  who: "Mika Kobayashi" as const,
  status: "Paid" as const,
  total: "$31.00" as const
}];
const Knob = defineUi<{
  id: string;
  title: string;
  hint: string;
  children: UI.VueNode;
}>("Knob", ["id", "title", "hint"], (_props, {
  slots: _slots
}) => {
  const id = computed(() => _props["id"]);
  const title = computed(() => _props["title"]);
  const hint = computed(() => _props["hint"]);
  const children = renderValue(() => readSlot(_slots.default));
  return () => {
    return <div class="grid content-start gap-2">
      <p id={id.value} class="font-script text-2xl leading-none font-bold text-ink">
        {title.value}
      </p>
      {readSlot(_slots.default)}
      <p class="text-sm text-muted-foreground">{hint.value}</p>
    </div>;
  };
});
const Sample = defineUi<{
  state: PlaygroundState;
}>("Sample", ["state"], (_props, {
  slots: _slots
}) => {
  const state = computed(() => _props["state"]);
  const seed = computed(() => seedOf(state.value));
  const tiltOf = computed(() => (i: number): boolean | number => state.value.tilt === "flat" ? false : state.value.tilt === "lively" ? LIVELY_DEGREES[i % LIVELY_DEGREES.length] : true);
  return () => {
    return <div style={cssStyle({
      "--ll-tilt-max": TILT_MAX[state.value.tilt]
    } as UI.CSSProperties)} class="grid items-start gap-10 @[62rem]:grid-cols-[minmax(0,21rem)_minmax(0,1fr)]">
      <Card data-sample="order" seed={`${seed.value}:order`} tilt={tiltOf.value(0)} tape="top" class="w-full max-w-md @[62rem]:max-w-none">
        <CardHeader>
          <CardTitle>Order a notebook</CardTitle>
          <CardDescription>Ruled, dotted or blank. Ships in a week.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel for="pg-name">Name on the cover</FieldLabel>
              <Input id="pg-name" defaultValue="Ada Lovelace" autocomplete="off" />
            </Field>
            <Field>
              <FieldLabel for="pg-paper">Paper</FieldLabel>
              <Select defaultValue="ruled">
                <SelectTrigger id="pg-paper" class="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ruled">Ruled</SelectItem>
                  <SelectItem value="dots">Dotted</SelectItem>
                  <SelectItem value="blank">Blank</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field orientation="horizontal">
              <Switch id="pg-gift" />
              <FieldLabel for="pg-gift">Gift wrap it</FieldLabel>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter class="justify-end gap-2">
          <Button variant="ghost">Cancel</Button>
          <Button>Order</Button>
        </CardFooter>
      </Card>
      <Card data-sample="orders" seed={`${seed.value}:orders`} tilt={tiltOf.value(1)} fastener="clip" class="w-full">
        <CardHeader>
          <CardTitle>Recent orders</CardTitle>
          <CardDescription>Three this week.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead class="text-end">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ORDERS.map(o => <TableRow key={o.id}>
                  <TableCell class="font-bold">{o.id}</TableCell>
                  <TableCell>{o.who}</TableCell>
                  <TableCell>
                    <Badge variant={o.status === "Paid" ? "default" as const : "secondary" as const}>{o.status}</Badge>
                  </TableCell>
                  <TableCell class="ll-num text-end">{o.total}</TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>;
  };
});
const PlaygroundBody = defineUi<{}>("PlaygroundBody", [], (_props, {
  slots: _slots
}) => {
  const state = shallowRef<PlaygroundState>(initialState(DEFAULT_STATE));
  const setState = stateSetter(state);
  const _nestedHook0 = useId();
  const _nestedHook1 = useId();
  const _nestedHook2 = useId();
  const _nestedHook3 = useId();
  const ids = computed(() => ({
    density: _nestedHook0,
    tier: _nestedHook1,
    tilt: _nestedHook2,
    motion: _nestedHook3
  }));
  const set = computed(() => <K extends keyof PlaygroundState,>(key: K, value: PlaygroundState[K]) => setState(s => ({
    ...s,
    [key]: value
  })));
  const code = computed(() => snippets(state.value));
  const seed = computed(() => seedOf(state.value));
  return () => {
    return <div class="@container grid gap-10">
      <Stage layout="full" label="Knobs">
        <div class="grid gap-x-8 gap-y-6 p-5 @xl:grid-cols-2 @3xl:grid-cols-3">
          <Knob id={ids.value.density} title="Density" hint={DENSITY_HINT[state.value.density]}>
            <ToggleGroup type="single" variant="outline" value={state.value.density} onValueChange={v => v && set.value("density", v as PlaygroundDensity)} aria-labelledby={ids.value.density} class="flex-wrap">
              {DENSITIES.map(d => <ToggleGroupItem key={d} value={d}>
                  {d}
                </ToggleGroupItem>)}
            </ToggleGroup>
          </Knob>
          <Knob id={ids.value.tier} title="Tier" hint={TIER_HINT[state.value.tier]}>
            <ToggleGroup type="single" variant="outline" value={state.value.tier} onValueChange={v => v && set.value("tier", v as PlaygroundTier)} aria-labelledby={ids.value.tier}>
              {TIERS.map(t => <ToggleGroupItem key={t} value={t}>
                  {t}
                </ToggleGroupItem>)}
            </ToggleGroup>
          </Knob>
          <Knob id={ids.value.tilt} title="Tilt" hint={TILT_HINT[state.value.tilt]}>
            <ToggleGroup type="single" variant="outline" value={state.value.tilt} onValueChange={v => v && set.value("tilt", v as PlaygroundTilt)} aria-labelledby={ids.value.tilt}>
              {TILTS.map(t => <ToggleGroupItem key={t} value={t}>
                  {t}
                </ToggleGroupItem>)}
            </ToggleGroup>
          </Knob>
          <Knob id={ids.value.motion} title="Motion" hint={state.value.reduced ? "Reduced: no hover tilt, no draw-on, durations at zero." as const : "Follows the system setting." as const}>
            <div class="flex items-center gap-3">
              <Switch id="pg-motion" checked={state.value.reduced} onCheckedChange={v => set.value("reduced", v)} />
              <label for="pg-motion" class="font-hand text-[15px] font-bold">
                Reduce motion
              </label>
            </div>
          </Knob>
          <Knob id="pg-seed-title" title="Seed" hint="A new take is a new hand: every stroke on the sheets below is drawn again.">
            <div class="flex flex-wrap items-center gap-3">
              <Button variant="outline" onClick={() => set.value("take", state.value.take + 1)}>
                <Icon name="shuffle" />
                Reroll
              </Button>
              <span class="font-mono text-sm text-ink-soft">
                seed <code>{seed.value}</code>
              </span>
            </div>
          </Knob>
          <div class="flex items-end">
            <Button variant="link" disabled={isDefault(state.value) && state.value.take === DEFAULT_STATE.take} onClick={() => setState(DEFAULT_STATE)}>
              Put everything back
            </Button>
          </div>
        </div>
      </Stage>

      <p role="status" class="dk-sr-only">
        Density {state.value.density}, tier {state.value.tier}, tilt {state.value.tilt}, motion {state.value.reduced ? "reduced" as const : "system" as const}, seed {seed.value}.
      </p>

      <Stage layout="full" label="Preview">
        <Desk seed="playground-desk" class="px-5 py-10 @2xl:px-10">
          <InkProvider key={state.value.take} tier={state.value.tier} density={state.value.density} motion={state.value.reduced ? "reduced" as const : "system" as const} defs={false}>
            <Sample state={state.value} />
          </InkProvider>
        </Desk>
      </Stage>

      <Section id="export" title="Your settings" description="Paste this where you mount the provider; leave out anything you did not change.">
        <CodeBlock code={code.value.provider} lang="tsx" title="providers.tsx" />
        {code.value.component ? <CodeBlock code={code.value.component} lang="tsx" title="on a sheet" copy={false} /> : null}
        {code.value.css ? <CodeBlock code={code.value.css} lang="css" title="index.css" /> : null}
        {code.value.attributes ? <p class="dk-hint">
            Density and motion also work as attributes on any ancestor, usually the root: <InlineCode>{code.value.attributes}</InlineCode>
          </p> : null}
        <Callout tone="tip" title="Where do these go?">
          <p>
            Wrap the app once. The steps for Vite and Next.js are in <Link to={`${paths.gettingStarted}#provider`}>Getting started</Link>, and every prop is listed there. Tier and density change how a drawing is made; the seed and the
            tilt belong to one sheet, so they are props, not settings.
          </p>
        </Callout>
      </Section>
    </div>;
  };
});
export default PlaygroundBody;
