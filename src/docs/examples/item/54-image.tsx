// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Doodle } from "@/components/ui/doodle";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
export const meta = {
  title: "Image" as const,
  description: "shadcn's `item-image`: a list of tracks, each a link row with a small picture (`variant=\"image\"`), a title with the album in muted type, the artist below and the running time at the far end. The pictures are doodles, pasted in a little crooked; the original's `role=\"listitem\"` is not needed, the group already makes each link one." as const,
  layout: "center" as const
};
const music = [{
  title: "Midnight City Lights" as const,
  artist: "Neon Dreams" as const,
  album: "Electric Nights" as const,
  duration: "3:45" as const,
  doodle: "moon" as const
}, {
  title: "Coffee Shop Conversations" as const,
  artist: "The Morning Brew" as const,
  album: "Urban Stories" as const,
  duration: "4:05" as const,
  doodle: "cup" as const
}, {
  title: "Digital Rain" as const,
  artist: "Cyber Symphony" as const,
  album: "Binary Beats" as const,
  duration: "3:30" as const,
  doodle: "rain-cloud" as const
}] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex w-full max-w-md flex-col gap-6">
      <ItemGroup class="gap-4">
        {music.map(song => <Item key={song.title} variant="outline" asChild>
            <a href="#track">
              <ItemMedia variant="image">
                <Doodle name={song.doodle} size={36} class="mx-auto mt-0.5" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle class="line-clamp-1">
                  {song.title} - <span class="text-muted-foreground">{song.album}</span>
                </ItemTitle>
                <ItemDescription>{song.artist}</ItemDescription>
              </ItemContent>
              <ItemContent class="flex-none text-center">
                <ItemDescription>{song.duration}</ItemDescription>
              </ItemContent>
            </a>
          </Item>)}
      </ItemGroup>
    </div>;
  };
});
export default Example;
