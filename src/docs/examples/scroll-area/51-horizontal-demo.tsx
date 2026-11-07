// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Polaroid, PolaroidCaption, PolaroidImage } from "@/components/ui/polaroid";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
export const meta = {
  title: "Horizontal demo" as const,
  description: "Official `scroll-area-horizontal-demo`: a strip of figures that scrolls sideways under an explicit `ScrollBar orientation=\"horizontal\"`. shadcn shows three stock photographs; here they are polaroids of drawn scenes, so nothing is fetched. `bleed` gives the viewport 12 px so the photos' shadows are not cut at the edge." as const,
  layout: "center" as const,
  stage: "desk" as const
};
interface Artwork {
  artist: string;
  scene: "hills" | "sea" | "night";
}
const works: Artwork[] = [{
  artist: "Mira" as const,
  scene: "hills" as const
}, {
  artist: "Tom" as const,
  scene: "sea" as const
}, {
  artist: "Vlad" as const,
  scene: "night" as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <ScrollArea bleed class="w-96 whitespace-nowrap">
      <div class="flex w-max space-x-4 p-4">
        {works.map(artwork => <Polaroid key={artwork.artist} seed={artwork.artist} class="w-52 shrink-0 whitespace-normal">
            <PolaroidImage scene={artwork.scene} label={`Drawing by ${artwork.artist}`} seed={artwork.scene} />
            <PolaroidCaption class="text-2xl">Drawn by {artwork.artist}</PolaroidCaption>
          </Polaroid>)}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>;
  };
});
export default Example;
