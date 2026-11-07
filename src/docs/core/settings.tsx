// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef, toValue, type MaybeRefOrGetter, type ComputedRef } from "vue";
import { PACKAGE_MANAGERS, type PackageManager } from "./install";
import { readStoredChoice, writeStored } from "./storage";
import { LOCALES, translate, type I18nKey, type Locale } from "./i18n";
export const DENSITIES = ["comfortable", "compact", "calm"] as const;
export type Density = typeof DENSITIES[number];
export const MOTIONS = ["system", "reduced"] as const;
export type Motion = typeof MOTIONS[number];
export interface Settings {
  density: Density;
  motion: Motion;
  packageManager: PackageManager;
  locale: Locale;
  setDensity(value: Density): void;
  setMotion(value: Motion): void;
  setPackageManager(value: PackageManager): void;
  setLocale(value: Locale): void;
}
const noop = () => {};
const SettingsContext = createContext<Settings>({
  density: "comfortable" as const,
  motion: "system" as const,
  packageManager: "pnpm" as const,
  locale: "en" as const,
  setDensity: noop,
  setMotion: noop,
  setPackageManager: noop,
  setLocale: noop
});
export const SettingsProvider = defineUi<{
  children: UI.VueNode;
}>("SettingsProvider", [], (_props, {
  slots: _slots
}) => {
  const children = renderValue(() => readSlot(_slots.default));
  const density = shallowRef<Density>(initialState(() => readStoredChoice("density", DENSITIES, "comfortable")));
  const setDensityState = stateSetter(density);
  const motion = shallowRef<Motion>(initialState(() => readStoredChoice("motion", MOTIONS, "system")));
  const setMotionState = stateSetter(motion);
  const packageManager = shallowRef<PackageManager>(initialState(() => readStoredChoice("pm", PACKAGE_MANAGERS, "pnpm")));
  const setPackageManagerState = stateSetter(packageManager);
  const locale = shallowRef<Locale>(initialState(() => readStoredChoice("locale", LOCALES, "en")));
  const setLocaleState = stateSetter(locale);
  watchDependencies(() => {
    const root = document.documentElement;
    root.setAttribute("data-density", density.value);
    if (motion.value === "reduced") root.setAttribute("data-motion", "reduced");else root.removeAttribute("data-motion");
    root.lang = locale.value;
  }, () => [density.value, motion.value, locale.value], false);
  const setDensity = (value: Density) => {
    setDensityState(value);
    writeStored("density", value);
  };
  const setMotion = (value: Motion) => {
    setMotionState(value);
    writeStored("motion", value);
  };
  const setPackageManager = (value: PackageManager) => {
    setPackageManagerState(value);
    writeStored("pm", value);
  };
  const setLocale = (value: Locale) => {
    setLocaleState(value);
    writeStored("locale", value);
    document.documentElement.lang = value;
  };
  const value = computed<Settings>(() => ({
    density: density.value,
    motion: motion.value,
    packageManager: packageManager.value,
    locale: locale.value,
    setDensity,
    setMotion,
    setPackageManager,
    setLocale
  }));
  return () => {
    return <SettingsContext.Provider value={value.value}>{readSlot(_slots.default)}</SettingsContext.Provider>;
  };
});
export function useSettings(): ComputedRef<Settings> {
  const _nestedHook0 = useContext(SettingsContext);
  return computed(() => {
    return _nestedHook0.value;
  });
}

// 组件通过这个轻量适配层读取当前语言，避免各处直接操作设置上下文。
export function useLocaleText(): ComputedRef<{ locale: Locale; t: (key: I18nKey) => string }> {
  const settings = useSettings();
  return computed(() => ({
    locale: settings.value.locale,
    t: (key: I18nKey) => translate(settings.value.locale, key)
  }));
}
