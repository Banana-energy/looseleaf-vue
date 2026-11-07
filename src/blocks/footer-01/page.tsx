// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Paper } from "@/components/ui/paper";
import { Separator } from "@/components/ui/separator";
import { Footer01Brand } from "@/blocks/footer-01/components/footer-01-brand";
import { Footer01Links } from "@/blocks/footer-01/components/footer-01-links";
const social = [{
  label: "Email us" as const,
  icon: "mail" as const,
  href: "mailto:hello@penmark.example" as const
}, {
  label: "Read the blog" as const,
  icon: "book-open" as const,
  href: "#blog" as const
}, {
  label: "Join the chat" as const,
  icon: "message-circle" as const,
  href: "#chat" as const
}, {
  label: "See the source" as const,
  icon: "code" as const,
  href: "#source" as const
}];
const Footer01 = defineUi<{}>("Footer01", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="@container w-full">
      <div class="px-4 pt-14 pb-6 @xl:px-8">
        <Paper as="footer" stock="kraft" edge={{
          top: "torn" as const
        }} tilt={false} seed="footer-01" class="mx-auto max-w-6xl px-6 pt-12 pb-7 @xl:px-12">
          <div class="grid gap-12 @3xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <Footer01Brand />
            <Footer01Links />
          </div>

          <Separator variant="stitched" class="my-8" />

          <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 text-[15px] text-ink">
            <p>&copy; 2026 Penmark. Every page checked by hand.</p>
            <ul role="list" class="flex list-none items-center gap-1" aria-label="Elsewhere">
              {social.map(s => <li key={s.label}>
                  <Button asChild variant="ghost" size="icon">
                    <a href={s.href} aria-label={s.label}>
                      <Icon name={s.icon} size={20} />
                    </a>
                  </Button>
                </li>)}
            </ul>
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
              <a href="#privacy" class="inline-block py-1 underline underline-offset-4 hover:ll-swipe">
                Privacy
              </a>
              <a href="#terms" class="inline-block py-1 underline underline-offset-4 hover:ll-swipe">
                Terms
              </a>
              <Badge tone="grass">All systems normal</Badge>
            </div>
          </div>
        </Paper>
      </div>
    </div>;
  };
});
export default Footer01;
