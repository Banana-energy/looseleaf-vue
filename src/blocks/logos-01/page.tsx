// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId, shallowRef } from "vue";
import { Marquee, MarqueeItem } from "@/components/ui/marquee";
import { LOGOS, Logos01Name } from "@/blocks/logos-01/components/logos-01-names";
const ROW_A = LOGOS.slice(0, 4);
const ROW_B = LOGOS.slice(4);
const Logos01 = defineUi<{}>("Logos01", [], (_props, {
  slots: _slots
}) => {
  const titleId = useId();
  const paused = shallowRef(initialState(false));
  const setPaused = stateSetter(paused);
  return () => {
    return <section aria-labelledby={titleId} class="@container w-full">
      <div class="px-4 py-14 @xl:px-8 @xl:py-20">
        <div class="mx-auto max-w-5xl">
          <h2 id={titleId} class="text-center font-type text-sm text-ink-soft">
            Kept on desks at
          </h2>

          <div class="mt-8 grid gap-3 motion-reduce:hidden [[data-motion=reduced]_&]:hidden">
            <Marquee label="Teams that use Penmark" tape="washi-stripes" color="tangerine" speed={46} paused={paused.value} onPausedChange={setPaused} seed="logos-a">
              {ROW_A.map(logo => <MarqueeItem key={logo.name}>
                  <Logos01Name logo={logo} />
                </MarqueeItem>)}
            </Marquee>
            <Marquee label="More teams that use Penmark" tape="washi-gingham" color="sky" direction="end" speed={38} paused={paused.value} controls={false} seed="logos-b">
              {ROW_B.map(logo => <MarqueeItem key={logo.name}>
                  <Logos01Name logo={logo} />
                </MarqueeItem>)}
            </Marquee>
          </div>

          <ul aria-label="Teams that use Penmark" class="mt-8 hidden list-none flex-wrap items-center justify-center gap-x-10 gap-y-4 text-ink motion-reduce:flex [[data-motion=reduced]_&]:flex">
            {LOGOS.map(logo => <li key={logo.name}>
                <Logos01Name logo={logo} />
              </li>)}
          </ul>
        </div>
      </div>
    </section>;
  };
});
export default Logos01;
