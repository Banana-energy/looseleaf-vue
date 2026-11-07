// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { ComponentEntry } from "../core/catalog";
import { useAnnounce } from "../core/announcer";
import { useCopy } from "../core/hooks";
import { addCommand } from "../core/install";
import { useSettings } from "../core/settings";
import { CodeBlock, Skeleton, Callout } from "../kit";
import { useLoaded } from "./use-loaded";
export const ComponentActions = defineUi<{
  entry: ComponentEntry;
}>("ComponentActions", ["entry"], (_props, {
  slots: _slots
}) => {
  const entry = computed(() => _props["entry"]);
  const _hook1 = useSettings();
  const packageManager = computed(() => _hook1.value.packageManager);
  const _hook3 = useCopy();
  const copied = computed(() => _hook3.value.copied);
  const copy = computed(() => _hook3.value.copy);
  const announce = useAnnounce();
  const command = computed(() => addCommand(packageManager.value, entry.value.slug));
  return () => {
    return <>
      <Button variant="outline" size="sm" data-copied={copied.value || undefined} onClick={async () => {
        if (await copy.value(command.value)) announce.value("Copied to clipboard");
      }}>
        <Icon name={copied.value ? "check" as const : "terminal" as const} />
        {copied.value ? "Copied" as const : "Copy install command" as const}{" "}
        <span class="font-normal text-ink-muted max-sm:hidden">{packageManager.value}</span>
        <span class="sr-only">: {command.value}</span>
      </Button>
      {entry.value.uiSource ? <ViewSource entry={entry.value} /> : null}
    </>;
  };
});
const ViewSource = defineUi<{
  entry: ComponentEntry;
}>("ViewSource", ["entry"], (_props, {
  slots: _slots
}) => {
  const entry = computed(() => _props["entry"]);
  return () => {
    return <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Icon name="file-code" />
          View source
        </Button>
      </SheetTrigger>
      <SheetContent side="right" binding="holes" class="w-[95vw] sm:max-w-3xl">
        <SheetHeader>
          <SheetTitle>{entry.value.slug}.tsx</SheetTitle>
          <SheetDescription>
            components/ui/{entry.value.slug}.tsx: the file the CLI copies into your project. Change it freely, it is yours.
          </SheetDescription>
        </SheetHeader>
        <div class="min-h-0 flex-1 overflow-y-auto px-4 pt-5 pb-6">
          <SourceBody entry={entry.value} />
        </div>
      </SheetContent>
    </Sheet>;
  };
});
const SourceBody = defineUi<{
  entry: ComponentEntry;
}>("SourceBody", ["entry"], (_props, {
  slots: _slots
}) => {
  const entry = computed(() => _props["entry"]);
  const state = useLoaded(() => entry.value.uiSource);
  return () => {
    if (state.value.status === "loading") return <Skeleton height={240} label="Loading the source" />;
    if (state.value.status === "error") {
      return <Callout tone="error" title="Could not load the source">
        <p>{state.value.error.message}</p>
      </Callout>;
    }
    return <CodeBlock code={state.value.value} lang="tsx" title={`components/ui/${entry.value.slug}.tsx`} lineNumbers />;
  };
});
