// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { DENSITIES, MOTIONS, useLocaleText, useSettings, type Density, type Motion } from "../core/settings";
import { LOCALES, LOCALE_LABELS, type I18nKey, type Locale } from "../core/i18n";
import { useDeskKnob } from "./desk-knob";
const DENSITY_LABELS: Record<Density, { label: I18nKey; hint: I18nKey }> = {
  comfortable: { label: "settings.comfortable", hint: "settings.comfortableHint" },
  compact: { label: "settings.compact", hint: "settings.compactHint" },
  calm: { label: "settings.calm", hint: "settings.calmHint" }
};
const MOTION_LABELS: Record<Motion, { label: I18nKey; hint: I18nKey }> = {
  system: { label: "settings.system", hint: "settings.systemHint" },
  reduced: { label: "settings.reduced", hint: "settings.reducedHint" }
};
const Option = defineUi<{
  group: string;
  value: string;
  label: string;
  hint: string;
}>("Option", ["group", "value", "label", "hint"], (_props, {
  slots: _slots
}) => {
  const group = computed(() => _props["group"]);
  const value = computed(() => _props["value"]);
  const label = computed(() => _props["label"]);
  const hint = computed(() => _props["hint"]);
  const id = computed(() => `${group.value}-${value.value}`);
  return () => {
    return <div class="flex items-start gap-2.5">
      <RadioGroupItem value={value.value} id={id.value} aria-describedby={`${id.value}-hint`} class="mt-1" />
      <div class="flex min-w-0 flex-col">
        <Label for={id.value} class="leading-snug">
          {label.value}
        </Label>
        <p id={`${id.value}-hint`} class="text-sm leading-snug text-muted-foreground">
          {hint.value}
        </p>
      </div>
    </div>;
  };
});
export const SettingsMenu = defineUi<{}>("SettingsMenu", [], (_props, {
  slots: _slots
}) => {
  const _hook0 = useSettings();
  const density = computed(() => _hook0.value.density);
  const motion = computed(() => _hook0.value.motion);
  const locale = computed(() => _hook0.value.locale);
  const setDensity = computed(() => _hook0.value.setDensity);
  const setMotion = computed(() => _hook0.value.setMotion);
  const setLocale = computed(() => _hook0.value.setLocale);
  const text = useLocaleText();
  const _hook5 = useDeskKnob();
  const clutter = computed(() => _hook5.value.clutter);
  const setClutter = computed(() => _hook5.value.setClutter);
  const base = useId();
  const densityLabel = computed(() => `${base}-density`);
  const motionLabel = computed(() => `${base}-motion`);
  const clutterId = computed(() => `${base}-clutter`);
  return () => {
    return <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={text.value.t("top.displaySettings")}>
          <Icon name="sliders-horizontal" size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" aria-label={text.value.t("top.displaySettings")} tilt={false} class="flex w-80 flex-col gap-4">
        <div class="flex flex-col gap-2">
          <p id={densityLabel.value} class="font-type text-xs text-ink-muted">
            {text.value.t("settings.density")}
          </p>
          <RadioGroup aria-labelledby={densityLabel.value} value={density.value} onValueChange={v => setDensity.value(v as Density)} class="gap-2.5">
            {DENSITIES.map(value => <Option key={value} group={`${base}-d`} value={value} label={text.value.t(DENSITY_LABELS[value].label)} hint={text.value.t(DENSITY_LABELS[value].hint)} />)}
          </RadioGroup>
        </div>
        <Separator variant="dashed" />
        <div class="flex flex-col gap-2">
          <p id={motionLabel.value} class="font-type text-xs text-ink-muted">
            {text.value.t("settings.motion")}
          </p>
          <RadioGroup aria-labelledby={motionLabel.value} value={motion.value} onValueChange={v => setMotion.value(v as Motion)} class="gap-2.5">
            {MOTIONS.map(value => <Option key={value} group={`${base}-m`} value={value} label={text.value.t(MOTION_LABELS[value].label)} hint={text.value.t(MOTION_LABELS[value].hint)} />)}
          </RadioGroup>
        </div>
        <Separator variant="dashed" />
        <div class="flex items-center justify-between gap-3">
          <Label for={clutterId.value}>{text.value.t("settings.thingsOnDesk")}</Label>
          <Switch id={clutterId.value} checked={clutter.value} onCheckedChange={setClutter.value} />
        </div>
        <Separator variant="dashed" />
        <div class="flex flex-col gap-2">
          <p class="font-type text-xs text-ink-muted">{text.value.t("settings.language")}</p>
          <RadioGroup aria-label={text.value.t("settings.language")} value={locale.value} onValueChange={v => setLocale.value(v as Locale)} class="gap-2.5">
            {LOCALES.map(value => <Option key={value} group={`${base}-l`} value={value} label={LOCALE_LABELS[value]} hint={value === "zh-CN" ? "简体中文文档界面" : "English documentation interface"} />)}
          </RadioGroup>
        </div>
      </PopoverContent>
    </Popover>;
  };
});
