// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Desk, type DeskObject } from "@/components/ui/desk";
import { useDeskKnob } from "../shell/desk-knob";
import { Footer } from "./home/footer";
import { Hero } from "./home/hero";
import { How } from "./home/how";
import { LazyOnView } from "./home/lazy-on-view";
import { Stats } from "./home/stats";
import { Why } from "./home/why";
const ChartCard = vueLazy(() => import("./home/chart-card"));
const PrefsCard = vueLazy(() => import("./home/prefs-card"));
const Annotated = vueLazy(() => import("./home/annotated"));
const Planner = vueLazy(() => import("./home/planner"));
const ChatCard = vueLazy(() => import("./home/chat-card"));
const TabsCard = vueLazy(() => import("./home/tabs-card"));
const ToastCard = vueLazy(() => import("./home/toast-card"));
const ON_THE_DESK: readonly DeskObject[] = ["clips", "ruler"];
const ROW = "grid items-start gap-x-10 gap-y-14";
const Home = defineUi<{}>("Home", [], (_props, {
  slots: _slots
}) => {
  const _hook0 = useDeskKnob();
  const clutter = computed(() => _hook0.value.clutter);
  return () => {
    return <Desk objects={clutter.value ? ON_THE_DESK : false} seed="home-desk" data-home="desk" class="-mx-4 -mt-6 -mb-20 overflow-x-clip overflow-y-visible lg:-mx-10 lg:-mt-9 lg:-mb-24">
      <div class="@container mx-auto w-full max-w-[72rem] px-6 pt-8 pb-16 sm:px-10 sm:pt-16">
        <Hero />

        <section aria-labelledby="live" class="mt-16">
          <h2 id="live" class="font-script text-4xl leading-tight font-bold text-balance text-ink @xl:text-5xl">
            This desk is made of real components.
          </h2>

          <div class="mt-10 grid gap-y-14">
            <div class={`${ROW} @2xl:grid-cols-2 @4xl:grid-cols-12`}>
              <LazyOnView height={22} order={0} class="min-w-0 @4xl:col-span-7">
                <ChartCard />
              </LazyOnView>
              <LazyOnView height={15} order={1} class="min-w-0 @4xl:col-span-5">
                <PrefsCard />
              </LazyOnView>
            </div>

            <div class={`${ROW} @2xl:grid-cols-2 @4xl:grid-cols-12`}>
              <LazyOnView height={17} order={2} class="min-w-0 @4xl:col-span-7">
                <Annotated />
              </LazyOnView>
              <LazyOnView height={25} order={3} class="min-w-0 @4xl:col-span-5">
                <Planner />
              </LazyOnView>
            </div>

            <div class={`${ROW} @2xl:grid-cols-2 @4xl:grid-cols-12`}>
              <LazyOnView height={17} order={4} class="min-w-0 @4xl:col-span-5">
                <ChatCard />
              </LazyOnView>
              <LazyOnView height={17} order={5} class="min-w-0 @4xl:col-span-4">
                <TabsCard />
              </LazyOnView>
              <LazyOnView height={9} order={6} class="min-w-0 @2xl:col-span-2 @4xl:col-span-3">
                <ToastCard />
              </LazyOnView>
            </div>
          </div>
        </section>

        <Why />
        <How />
        <Stats />
        <Footer />
      </div>
    </Desk>;
  };
});
export default Home;
