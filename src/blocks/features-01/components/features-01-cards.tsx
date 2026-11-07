// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Doodle } from "@/components/ui/doodle";
import { Icon } from "@/components/ui/icon";
import { IndexCard, IndexCardContent, IndexCardFooter, IndexCardHeader, IndexCardTitle } from "@/components/ui/index-card";
import { Fastener } from "@/components/ui/paper";
const FEATURES = [{
  id: "write" as const,
  title: "Write together" as const,
  doodle: "pencil" as const,
  body: "Everyone edits the same page at once, with little name flags for cursors. No more “which version is final?”" as const,
  link: "How writing works" as const,
  dress: {}
}, {
  id: "keep" as const,
  title: "Never lose a page" as const,
  doodle: "book" as const,
  body: "Every change is kept for a year. Wind a page back to last Tuesday, or lift a single paragraph out of it." as const,
  link: "About history" as const,
  dress: {
    tape: "top" as const,
    tapeKind: "washi-dots" as const
  }
}, {
  id: "share" as const,
  title: "Share the good bits" as const,
  doodle: "paper-plane" as const,
  body: "Send one page, a whole notebook, or a single line. People without an account can read along." as const,
  link: "About sharing" as const,
  dress: {
    fastener: "clip" as const
  }
}];
const Features01Cards = defineUi<{}>("Features01Cards", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <ul role="list" class="grid list-none gap-x-8 gap-y-12 @3xl:grid-cols-3" data-slot="features-cards">
      {FEATURES.map((f, i) => <li key={f.id} class="@3xl:[&:nth-child(2)]:mt-8">
          <IndexCard as="article" seed={`feature-${f.id}`} class="mx-auto" {...domProps(f.dress)}>
            {f.id === "write" ? <Fastener kind="pin" seed="feature-write-pin" class="absolute -top-2 end-10 calm:hidden" /> : null}
            <IndexCardHeader>
              <IndexCardTitle>
                <h3 class="inline">{f.title}</h3>
              </IndexCardTitle>
            </IndexCardHeader>
            <IndexCardContent>
              <Doodle name={f.doodle} size={56} seed={`doodle-${f.id}`} class="float-end mt-0.5 ms-3" />
              {f.body}
            </IndexCardContent>
            <IndexCardFooter>
              <Button asChild variant="link" size="sm" class="-ms-3">
                <a href={`#${f.id}`}>
                  {f.link}
                  <Icon name="arrow-right" class="rtl:-scale-x-100" />
                </a>
              </Button>
              <span class="ll-num">no. {String(i + 1).padStart(4, "0")}</span>
            </IndexCardFooter>
          </IndexCard>
        </li>)}
    </ul>;
  };
});
export { Features01Cards };
