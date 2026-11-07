// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { CHANGELOG } from "../core/changelog";
import { Callout, Page, Prose } from "../kit";
import { ContentSlot } from "../widgets/ContentSlot";
export const PlaygroundPage = defineUi<{}>("PlaygroundPage", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Page kicker="More" title="Playground" description="A place to try components without leaving the docs.">
      <ContentSlot contentKey="playground" fallback={<Callout tone="todo" title="The playground is still being drawn">
            <p>For now, every example on a component page shows its full source: copy it into your own project to play.</p>
          </Callout>} />
    </Page>;
  };
});
export const ChangelogPage = defineUi<{}>("ChangelogPage", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Page kicker="More" title="Changelog" description="What changed, newest first." toc="auto">
      <ContentSlot contentKey="changelog" fallback={<div class="dk-changelog">
            {CHANGELOG.map(entry => <section key={entry.version} class="dk-release" aria-labelledby={`release-${entry.version}`}>
                <h2 id={`release-${entry.version}`} class="dk-heading" data-level={2}>
                  {entry.version} <span class="dk-release-title">{entry.title}</span>
                </h2>
                {entry.date !== entry.version ? <p class="dk-hint">{entry.date}</p> : null}
                <Prose>
                  <ul>
                    {entry.notes.map(note => <li key={note}>{note}</li>)}
                  </ul>
                </Prose>
              </section>)}
          </div>} />
    </Page>;
  };
});
