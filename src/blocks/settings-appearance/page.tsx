// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef, useId } from "vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Page, PageDescription, PageHeader, PageTitle } from "@/components/ui/page";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DEFAULT_APPEARANCE, DENSITIES, MOTIONS, PAPERS, THEMES, providerSnippet, type Appearance, type Density, type Direction, type Motion, type PaperChoice } from "@/blocks/settings-appearance/components/settings-appearance-options";
import { SettingsAppearancePreview } from "@/blocks/settings-appearance/components/settings-appearance-preview";
import { cn } from "@/lib/utils";
type Props = {
  className?: string;
  value?: Appearance;
  defaultValue?: Appearance;
  onValueChange?: (value: Appearance) => void;
};
const SettingsAppearance = defineUi<Props>("SettingsAppearance", ["class", "value", "defaultValue", "onValueChange"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const value = computed(() => _props["value"]);
  const defaultValue = computed(() => _props["defaultValue"] === undefined ? DEFAULT_APPEARANCE : _props["defaultValue"]);
  const onValueChange = computed(() => _props["onValueChange"]);
  const inner = shallowRef<Appearance>(initialState(defaultValue.value));
  const setInner = stateSetter(inner);
  const a = computed(() => value.value ?? inner.value);
  const ids = useId();
  const set = computed(() => (patch: Partial<Appearance>) => {
    const next = {
      ...a.value,
      ...patch
    };
    if (value.value === undefined) setInner(next);
    onValueChange.value?.(next);
  });
  const isDefault = computed(() => JSON.stringify(a.value) === JSON.stringify(DEFAULT_APPEARANCE));
  return () => {
    return <div class="w-full overflow-x-clip px-2">
      <Page as="section" width="xl" holes="top" seed="settings-appearance" aria-labelledby={`${ids}-title`} class={cn("my-6", className.value)}>
        <PageHeader>
          <PageTitle as="h2" id={`${ids}-title`} underline="highlight" seed="appearance-title">
            Appearance
          </PageTitle>
          <PageDescription>How the desk feels. Choices apply to the preview straight away; the code below is what to give your own provider.</PageDescription>
        </PageHeader>

        <div class="@container/appearance">
          <div class="grid items-start gap-10 @4xl/appearance:grid-cols-[minmax(0,1fr)_22rem]">
            <div class="@container/opts">
              <FieldGroup class="gap-8">
                <FieldSet>
                  <FieldLegend>Theme</FieldLegend>
                  <RadioGroup value={a.value.theme} onValueChange={theme => set.value({
                    theme
                  })} aria-label="Theme" class="gap-3 @xl/opts:grid-cols-3">
                    {THEMES.map(t => <FieldLabel key={t.id} for={`${ids}-theme-${t.id}`}>
                        <Field orientation="horizontal" data-disabled={t.ready ? undefined : true}>
                          <FieldContent>
                            <FieldTitle class="flex-wrap">
                              {t.name}
                              {t.ready ? null : <Badge size="sm" variant="outline">
                                  soon
                                </Badge>}
                            </FieldTitle>
                            <FieldDescription>{t.help}</FieldDescription>
                          </FieldContent>
                          <RadioGroupItem value={t.id} id={`${ids}-theme-${t.id}`} disabled={!t.ready} />
                        </Field>
                      </FieldLabel>)}
                  </RadioGroup>
                </FieldSet>

                <FieldSet>
                  <FieldLegend>Density</FieldLegend>
                  <RadioGroup value={a.value.density} onValueChange={v => set.value({
                    density: v as Density
                  })} aria-label="Density" class="gap-3">
                    {DENSITIES.map(d => <FieldLabel key={d.id} for={`${ids}-density-${d.id}`}>
                        <Field orientation="horizontal">
                          <FieldContent>
                            <FieldTitle>{d.name}</FieldTitle>
                            <FieldDescription>{d.help}</FieldDescription>
                          </FieldContent>
                          <RadioGroupItem value={d.id} id={`${ids}-density-${d.id}`} />
                        </Field>
                      </FieldLabel>)}
                  </RadioGroup>
                </FieldSet>

                <FieldSet>
                  <FieldLegend>Motion</FieldLegend>
                  <RadioGroup value={a.value.motion} onValueChange={v => set.value({
                    motion: v as Motion
                  })} aria-label="Motion" class="gap-3 @lg/opts:grid-cols-2">
                    {MOTIONS.map(m => <FieldLabel key={m.id} for={`${ids}-motion-${m.id}`}>
                        <Field orientation="horizontal">
                          <FieldContent>
                            <FieldTitle>{m.name}</FieldTitle>
                            <FieldDescription>{m.help}</FieldDescription>
                          </FieldContent>
                          <RadioGroupItem value={m.id} id={`${ids}-motion-${m.id}`} />
                        </Field>
                      </FieldLabel>)}
                  </RadioGroup>
                </FieldSet>

                <Separator variant="dashed" />

                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldLabel for={`${ids}-fine`}>Fine ink</FieldLabel>
                    <FieldDescription>Draws with more strokes. Lovely on a big screen, heavier on a small phone.</FieldDescription>
                  </FieldContent>
                  <Switch id={`${ids}-fine`} checked={a.value.fine} onCheckedChange={fine => set.value({
                    fine
                  })} />
                </Field>

                <Field>
                  <FieldLabel id={`${ids}-paper`}>Paper for the preview</FieldLabel>
                  <ToggleGroup type="single" variant="outline" aria-labelledby={`${ids}-paper`} value={a.value.paper} onValueChange={v => v && set.value({
                    paper: v as PaperChoice
                  })} class="w-fit! flex-wrap">
                    {PAPERS.map(p => <ToggleGroupItem key={p.id} value={p.id}>
                        {p.name}
                      </ToggleGroupItem>)}
                  </ToggleGroup>
                </Field>

                <Field>
                  <FieldLabel id={`${ids}-dir`}>Reading direction</FieldLabel>
                  <ToggleGroup type="single" variant="outline" aria-labelledby={`${ids}-dir`} value={a.value.dir} onValueChange={v => v && set.value({
                    dir: v as Direction
                  })} class="w-fit!">
                    <ToggleGroupItem value="ltr">Left to right</ToggleGroupItem>
                    <ToggleGroupItem value="rtl">Right to left</ToggleGroupItem>
                  </ToggleGroup>
                  <FieldDescription>Margins, tabs and arrows turn round; the handwriting does not.</FieldDescription>
                </Field>

                <div>
                  <Button type="button" variant="outline" onClick={() => set.value(DEFAULT_APPEARANCE)} aria-disabled={isDefault.value}>
                    <Icon name="rotate-cw" />
                    Back to the defaults
                  </Button>
                </div>
              </FieldGroup>
            </div>

            <div class="grid gap-6 @4xl/appearance:sticky @4xl/appearance:top-6">
              <SettingsAppearancePreview appearance={a.value} />
              <div class="grid gap-2">
                <p class="font-script text-2xl leading-none font-semibold">Your provider</p>
                <CodeBlock code={providerSnippet(a.value)} language="tsx" filename="root.tsx" wrap seed="appearance-snippet" />
              </div>
            </div>
          </div>
        </div>
      </Page>
    </div>;
  };
});
export default SettingsAppearance;
