// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { IndexCard, IndexCardContent, IndexCardFooter, IndexCardHeader, IndexCardTitle } from "@/components/ui/index-card";
import { Mascot } from "@/components/ui/mascot";
import { Polaroid, PolaroidCaption, PolaroidImage } from "@/components/ui/polaroid";
import { Sticker } from "@/components/ui/sticker";
import { StickyNote, StickyNoteContent, StickyNoteTitle } from "@/components/ui/sticky-note";
const LandingHero01Collage = defineUi<{}>("LandingHero01Collage", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div data-slot="landing-hero-collage" class="mx-auto flex max-w-full flex-wrap items-start justify-center gap-x-8 gap-y-8 pt-2 @xl:relative @xl:block @xl:h-[30rem] @xl:w-[26rem] @xl:pt-0">
      <Polaroid seed="hero-photo" tape="top" tapeKind="washi-dots" class="w-60 max-w-full @xl:absolute @xl:start-0 @xl:top-2">
        <PolaroidImage scene="hills" label="A drawn hillside with one tree and a sun" seed="hero-hills" />
        <PolaroidCaption>monday, 9:41</PolaroidCaption>
      </Polaroid>

      <StickyNote color="yellow" fastener="pin" seed="hero-todo" class="w-44 @xl:absolute @xl:start-[13.5rem] @xl:top-20">
        <StickyNoteTitle>todo</StickyNoteTitle>
        <StickyNoteContent>ship the new page (friday!)</StickyNoteContent>
      </StickyNote>

      <IndexCard seed="hero-roadmap" fastener="clip" class="min-h-0 w-60 max-w-full @xl:absolute @xl:start-10 @xl:top-[18rem]">
        <IndexCardHeader>
          <IndexCardTitle>Roadmap</IndexCardTitle>
        </IndexCardHeader>
        <IndexCardContent>
          <p>1. draw the thing</p>
          <p>2. show a friend</p>
          <p>3. ship it</p>
        </IndexCardContent>
        <IndexCardFooter>
          <span class="ll-num">no. 0042</span>
        </IndexCardFooter>
      </IndexCard>

      <Mascot pose="wave" size={184} class="h-[184px] w-auto @xl:absolute @xl:end-0 @xl:bottom-0" />
      <Sticker name="rocket" size={76} rotate={10} class="hidden @xl:absolute @xl:-top-2 @xl:end-2 @xl:block" />
    </div>;
  };
});
export { LandingHero01Collage };
