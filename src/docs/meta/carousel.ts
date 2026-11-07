// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "carousel" as const,
  title: "Carousel" as const,
  category: "Data display" as const,
  description: "Embla's smooth, swipeable scroller with paper furniture: hand-drawn arrows outside the slides (dashed when there is nowhere to go) and, if you want it, a tally under them: one stroke per slide, groups of five with the fifth struck across the other four, the current slide in blue felt. Horizontal or vertical, any number of slides per view, autoplay only if you plug it in." as const,
  status: "stable" as const,
  upstream: "carousel" as const,
  parts: [{
    name: "Carousel" as const,
    description: "The `role=\"region\"` (`aria-roledescription=\"carousel\"`, give it a name) that owns the Embla instance and the keys, plus a screen-reader status (\"Slide 2 of 5\")." as const,
    props: [{
      name: "opts" as const,
      type: "EmblaOptionsType" as const,
      description: "Embla options: `loop`, `align`, `startIndex`, `dragFree`, `slidesToScroll`, `direction: \"rtl\"` ... (`axis` follows `orientation`)." as const
    }, {
      name: "plugins" as const,
      type: "EmblaPluginType[]" as const,
      description: "Embla plugins. Autoplay is not on by default: install `embla-carousel-autoplay` and pass it here if you really want it (and give people a way to stop it)." as const
    }, {
      name: "orientation" as const,
      type: '"horizontal" | "vertical"' as const,
      default: '"horizontal"' as const,
      description: "The axis the slides scroll along." as const
    }, {
      name: "setApi" as const,
      type: "(api: CarouselApi) => void" as const,
      description: "Receive the Embla API to read the current slide, listen to `select`, or scroll from outside." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand of the tally's strokes. Default: from useId()." as const
    }]
  }, {
    name: "CarouselContent" as const,
    description: "Embla's window (`overflow: hidden`) and the track inside it. The window is padded across its axis and pulled back with a negative margin so a slide's shadow is not cut on the sides that do not slide. Size the track's gap with `-ms-*` here and `ps-*` on the items." as const
  }, {
    name: "CarouselItem" as const,
    description: "One slide (`role=\"group\"`, `aria-roledescription=\"slide\"`). `basis-full` by default; `basis-1/2`, `md:basis-1/3` ... show several." as const
  }, {
    name: "CarouselPrevious" as const,
    description: "Back one slide: a Button (outline, 32 px) with a hand-drawn arrow, outside the start edge. Dashed and inert on the first slide unless the carousel loops. Takes every Button prop." as const
  }, {
    name: "CarouselNext" as const,
    description: "Forward one slide, outside the end edge." as const
  }, {
    name: "CarouselDots" as const,
    description: "The tally: a `tablist` with a stroke per scroll snap. Each stroke is a `tab` (`aria-selected`, \"Go to slide n\") and the ink host of its own drawing; clicking goes to that slide. Draws nothing when there is only one slide. New in Looseleaf (shadcn has no indicator)." as const
  }, {
    name: "CarouselApi" as const,
    description: "The type of the Embla API that `setApi` receives." as const
  }],
  a11y: ["The APG carousel pattern: a labeled region (`aria-roledescription=\"carousel\"`), slides that are groups (`aria-roledescription=\"slide\"`; give each an `aria-label` such as \"3 of 7\" when the position matters), and previous / next buttons with names. A polite live region says \"Slide 2 of 5\" as it changes.", "The arrow keys along the carousel's axis (Left and Right, mirrored in RTL; Up and Down when vertical) move it from anywhere inside it: on a button, a link or a slide. They are left alone while you are typing in a field (the caret's), when a widget inside a slide has already used the key (a radio group, tabs, a slider, a menu opened from a slide) and when a modifier is held (Alt+Left is the browser's Back). Your own `onKeyDown` on the Carousel runs first. Previous and next are ordinary buttons in the tab order.", "The tally is a tablist with one tab stop (the current stroke); when the arrow keys move the carousel while focus is on it, focus goes along to the new current stroke. Strokes stay together in their group of five when the row wraps, and the tally clips its own drawings so they add no scroll area to the page. Each stroke is 24 by 32 px, is named \"Go to slide n\" and is marked with `aria-selected`; the current one is also bolder, taller and blue, so it does not rely on color alone.", "Swipe and drag are Embla's. Nothing moves by itself. Reduced motion does not change Embla's scroll animation (configure `duration` in `opts` if you want it shorter)."],
  usage: `import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export function Example() {
  return (
    <div className="mx-12 max-w-xs">
      <Carousel aria-label="Notes">
        <CarouselContent>
          {Array.from({ length: 7 }, (_, i) => (
            <CarouselItem key={i}>
              <Card>
                <CardContent className="grid aspect-square place-items-center font-script text-5xl">{i + 1}</CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
    </div>
  )
}`,
  related: ["tabs", "pagination", "polaroid", "scroll-area"]
} satisfies ComponentDoc;
