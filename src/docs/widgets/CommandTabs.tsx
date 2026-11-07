// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { PACKAGE_MANAGERS, type PackageManager } from "../core/install";
import { useSettings } from "../core/settings";
import { CodeBlock, Tabs } from "../kit";
export const CommandTabs = defineUi<{
  command: (pm: PackageManager) => string;
  label?: string;
  title?: string;
}>("CommandTabs", ["command", "label", "title"], (_props, {
  slots: _slots
}) => {
  const command = computed(() => _props["command"]);
  const label = computed(() => _props["label"] === undefined ? "Package manager" as const : _props["label"]);
  const title = computed(() => _props["title"] === undefined ? "Terminal" as const : _props["title"]);
  const _hook3 = useSettings();
  const packageManager = computed(() => _hook3.value.packageManager);
  const setPackageManager = computed(() => _hook3.value.setPackageManager);
  return () => {
    return <Tabs label={label.value} variant="pill" value={packageManager.value} onValueChange={id => setPackageManager.value(id as PackageManager)} items={PACKAGE_MANAGERS.map(pm => ({
      id: pm,
      label: pm,
      content: () => <CodeBlock code={command.value(pm)} lang="bash" title={title.value} />
    }))} />;
  };
});
