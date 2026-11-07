// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { Lettering } from "@/components/ui/lettering";
import { Paper } from "@/components/ui/paper";
import { Error404Scene } from "@/blocks/error-404/components/error-404-scene";
type Error404Props = {
  onSearch?: (query: string) => void;
  onGoBack?: () => void;
};
const Error404 = defineUi<Error404Props>("Error404", ["onSearch", "onGoBack"], (_props, {
  slots: _slots
}) => {
  const onSearch = computed(() => _props["onSearch"]);
  const onGoBack = computed(() => _props["onGoBack"] === undefined ? () => window.history.back() : _props["onGoBack"]);
  const titleId = useId();
  const inputRef = shallowRef<HTMLInputElement | null>(null);
  const query = shallowRef(initialState(""));
  const setQuery = stateSetter(query);
  watchDependencies(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(input|textarea|select)$/i.test(t.tagName))) return;
      e.preventDefault();
      inputRef.value?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, () => [], false);
  return () => {
    return <section aria-labelledby={titleId} class="@container w-full">
      <div class="px-8 py-10 @xl:py-14">
        <Paper stock="paper" tilt={false} tape="both" tapeKind="masking" seed="error-404" class="mx-auto max-w-3xl px-6 py-12 text-center @xl:px-12">
          <Error404Scene />

          <p class="mt-10 font-type text-sm text-pencil-text">Error 404 &middot; Page not found</p>
          <Lettering as="h1" id={titleId} size="md" tone="marker" wobble={0.4} seed="error-404-title" class="mt-3">
            This page wandered off
          </Lettering>
          <p class="mx-auto mt-4 max-w-md text-lg/7 text-ink-soft">We looked under the desk, behind the stapler and in the recycling. Nothing. The link may be old, or mistyped.</p>

          <form role="search" class="mx-auto mt-8 max-w-md" onSubmit={(e: SubmitEvent) => {
            e.preventDefault();
            onSearch.value?.(query.value.trim());
          }}>
            <InputGroup>
              <InputGroupAddon>
                <Icon name="search" />
              </InputGroupAddon>
              <InputGroupInput ref={inputRef} type="search" name="q" class="text-start" aria-label="Search the site" placeholder="Try searching for pages…" value={query.value} onChange={(e: Event) => setQuery((e.target as HTMLInputElement).value)} />
              <InputGroupAddon align="inline-end" class="max-sm:hidden">
                <Kbd aria-hidden="true">/</Kbd>
              </InputGroupAddon>
            </InputGroup>
          </form>

          <div class="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
            <Button asChild size="lg">
              <a href="#home">
                <Icon name="house" />
                Take me home
              </a>
            </Button>
            <Button type="button" size="lg" variant="outline" onClick={onGoBack.value}>
              <Icon name="arrow-left" class="rtl:-scale-x-100" />
              Go back
            </Button>
          </div>

          <p class="mt-8 text-[15px] text-ink-muted">
            Still lost?{" "}
            <a href="#contact" class="text-link underline underline-offset-4 hover:text-link-hover">
              Tell us what you were looking for
            </a>
            .
          </p>
        </Paper>
      </div>
    </section>;
  };
});
export default Error404;
export type { Error404Props };
