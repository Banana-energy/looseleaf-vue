// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, shallowRef, type ComputedRef } from "vue";
import type { ExampleEntry, Loader } from "../core/catalog";
import { useLocation } from "../core/router";
import { Callout, CodeBlock, Section, Skeleton, Stage, Tabs } from "../kit";
import { PreviewFrame } from "./PreviewFrame";
import { ErrorBoundary } from "./ErrorBoundary";
import type { ExampleModule } from "../types";
import { exampleLoader, useLoaded, type Loaded } from "./use-loaded";
import { useLocaleText } from "../core/settings";
import { localizedExampleDescription, localizedExampleTitle } from "../core/i18n";
export interface ExampleViewerProps {
  entry: ExampleEntry;
  slug: string;
  headingLevel?: 2 | 3;
  lazy?: boolean;
}
const FETCH_MARGIN = 2400;
const MOUNT_MARGIN = 600;
const DEFAULT_ROOM = 240;
const CHROME = 48;
const measured = new Map<string, number>();
function useSeenNear(_source0: MaybeRefOrGetter<UI.RefObject<Element | null>>, _source1: MaybeRefOrGetter<boolean>, _source2: MaybeRefOrGetter<number>): ComputedRef<boolean> {
  const ref = computed(() => toValue(_source0));
  const watching = computed(() => toValue(_source1));
  const margin = computed(() => toValue(_source2));
  const seen = shallowRef(initialState(typeof IntersectionObserver === "undefined"));
  const setSeen = stateSetter(seen);
  watchDependencies(() => {
    const el = ref.value.value;
    if (seen.value || !watching.value || !el) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        setSeen(true);
        observer.disconnect();
      }
    }, {
      rootMargin: `${margin.value}px 0px`
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, () => [seen.value, watching.value, ref.value, margin.value], false);
  return computed(() => {
    return seen.value;
  });
}
function browserAnchorsScroll(): boolean {
  return typeof CSS !== "undefined" && typeof CSS.supports === "function" && CSS.supports("overflow-anchor", "auto");
}
function useHoldScroll(_source0: MaybeRefOrGetter<UI.RefObject<HTMLElement | null>>, _source1: MaybeRefOrGetter<boolean>) {
  const ref = computed(() => toValue(_source0));
  const enabled = computed(() => toValue(_source1));
  watchDependencies(() => {
    const el = ref.value.value;
    if (!enabled.value || !el || typeof ResizeObserver === "undefined" || browserAnchorsScroll()) return;
    let last = el.getBoundingClientRect().height;
    const observer = new ResizeObserver(() => {
      const box = el.getBoundingClientRect();
      const grew = box.height - last;
      last = box.height;
      if (grew !== 0 && box.bottom <= 0) window.scrollBy({
        top: grew,
        left: 0,
        behavior: "instant" as const
      });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, () => [ref.value, enabled.value], false);
  return computed(() => {});
}
export const ExampleViewer = defineUi<ExampleViewerProps>("ExampleViewer", ["entry", "slug", "headingLevel", "lazy"], (_props, {
  slots: _slots
}) => {
  const entry = computed(() => _props["entry"]);
  const slug = computed(() => _props["slug"]);
  const headingLevel = computed(() => _props["headingLevel"] === undefined ? 3 : _props["headingLevel"]);
  const lazy = computed(() => _props["lazy"] === undefined ? false : _props["lazy"]);
  const root = shallowRef<HTMLDivElement | null>(null);
  const id = computed(() => `example-${entry.value.id}`);
  const _nestedHook0 = useLocation();
  const linked = computed(() => _nestedHook0.value.anchor === id.value);
  const pinned = shallowRef(initialState(false));
  const setPinned = stateSetter(pinned);
  const watching = computed(() => lazy.value && !pinned.value);
  const nearFetch = useSeenNear(() => root, () => watching.value, () => FETCH_MARGIN);
  const nearMount = useSeenNear(() => root, () => watching.value, () => MOUNT_MARGIN);
  const mount = computed(() => !lazy.value || pinned.value || nearMount.value);
  const state = useLoaded(() => mount.value || nearFetch.value ? exampleLoader(entry.value) : null);
  const text = useLocaleText();
  useHoldScroll(() => root, () => lazy.value);
  const meta = computed(() => state.value.status === "ready" ? state.value.value.meta : undefined);
  const title = computed(() => localizedExampleTitle(text.value.locale, meta.value?.title || entry.value.title));
  const description = computed(() => localizedExampleDescription(text.value.locale, meta.value?.description));
  return () => {
    if (linked.value && !pinned.value) setPinned(true);
    return <Section id={id.value} title={title.value} level={headingLevel.value} description={description.value} class="dk-example">
      <div ref={root}>
        <Tabs label={`${title.value}: ${text.value.t("page.previewOrCode")}`} variant="pill" items={[{
          id: "preview" as const,
          label: text.value.t("page.preview"),
          content: () => <ExamplePreview state={state.value} mount={mount.value} title={title.value} path={entry.value.path} />
        }, {
          id: "code" as const,
          label: text.value.t("page.code"),
          content: () => <ExampleSource source={entry.value.source} title={`examples/${slug.value}/${entry.value.fileName}`} />
        }]} />
      </div>
    </Section>;
  };
});
const ExamplePreview = defineUi<{
  state: Loaded<ExampleModule>;
  mount: boolean;
  title: string;
  path: string;
}>("ExamplePreview", ["state", "mount", "title", "path"], (_props, {
  slots: _slots
}) => {
  const state = computed(() => _props["state"]);
  const mount = computed(() => _props["mount"]);
  const title = computed(() => _props["title"]);
  const path = computed(() => _props["path"]);
  const text = useLocaleText();
  const room = computed(() => measured.get(path.value) ?? (state.value.status === "ready" && state.value.value.meta.height ? state.value.value.meta.height + CHROME : DEFAULT_ROOM));
  return () => {
    if (!mount.value) return <Skeleton quiet height={room.value} />;
    if (state.value.status === "loading") return <Skeleton height={room.value} label={`${text.value.t("page.loadingExample")} ${title.value}`} />;
    if (state.value.status === "error") {
      return <Callout tone="error" title={text.value.locale === "zh-CN" ? "示例加载失败" : "This example could not be loaded"}>
        <p>{state.value.error.message}</p>
      </Callout>;
    }
    const {
      default: Example,
      meta
    } = state.value.value;
    return <Remembered path={path.value}>
      <PreviewFrame class="mt-1">
        <Stage layout={meta.layout} height={meta.height} label={`${title.value} preview`} surface={meta.stage === "desk" ? "desk" as const : "paper" as const} contain={meta.contain}>
          <ErrorBoundary resetKey={path.value} title={text.value.locale === "zh-CN" ? "示例运行出错" : "This example crashed"}>
            <Suspense fallback={<Skeleton height={80} />}>
              <Example />
            </Suspense>
          </ErrorBoundary>
        </Stage>
      </PreviewFrame>
    </Remembered>;
  };
});
const Remembered = defineUi<{
  path: string;
  children: UI.VueNode;
}>("Remembered", ["path"], (_props, {
  slots: _slots
}) => {
  const path = computed(() => _props["path"]);
  const children = renderValue(() => readSlot(_slots.default));
  const box = shallowRef<HTMLDivElement | null>(null);
  watchDependencies(() => {
    const el = box.value;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      const height = Math.round(el.getBoundingClientRect().height);
      if (height > 0) measured.set(path.value, height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, () => [path.value], false);
  return () => {
    return <div ref={box}>{readSlot(_slots.default)}</div>;
  };
});
const ExampleSource = defineUi<{
  source: Loader<string>;
  title: string;
}>("ExampleSource", ["source", "title"], (_props, {
  slots: _slots
}) => {
  const source = computed(() => _props["source"]);
  const title = computed(() => _props["title"]);
  const text = useLocaleText();
  const state = useLoaded(() => source.value);
  return () => {
    if (state.value.status === "loading") return <Skeleton height={120} label={text.value.t("page.loadingSource")} />;
    if (state.value.status === "error") {
      return <Callout tone="error" title={text.value.locale === "zh-CN" ? "源码加载失败" : "Could not load the source"}>
        <p>{state.value.error.message}</p>
      </Callout>;
    }
    if (!state.value.value) return <Callout tone="warn">{text.value.locale === "zh-CN" ? "当前构建中没有这个示例的源码。" : "The source for this example is not available in this build."}</Callout>;
    return <CodeBlock code={state.value.value} lang="tsx" title={title.value} lineNumbers />;
  };
});
