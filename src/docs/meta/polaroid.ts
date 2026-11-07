// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "polaroid" as const,
  title: "Polaroid" as const,
  category: "Paper" as const,
  description: "An instant photograph: a white frame with the thick foot, a recessed square window and a caption in script. Put a real image in the window, or let it draw a little scene in marker and felt tip. Tape it, pin it, clip it, pile it up." as const,
  status: "new" as const,
  parts: [{
    name: "Polaroid" as const,
    description: "A `figure` and a Paper (`photo` stock, no printed rules): 16 rem wide, padded 14 px on the sides and top with a taller foot. Photographs are turned more than paper, up to 1.5 degrees. It takes every Paper prop except `stock`, `rules` and `as`." as const,
    props: [{
      name: "as" as const,
      type: '"figure" | "div" | "article"' as const,
      default: '"figure"' as const,
      description: "The element; with `figure` the caption names the picture." as const
    }]
  }, {
    name: "PolaroidImage" as const,
    description: "The photo window: square, recessed with an inner shadow, clipping its content. An `img` inside fills it (`object-cover`)." as const,
    props: [{
      name: "scene" as const,
      type: '"hills" | "sea" | "house" | "night"' as const,
      description: "Draw a scene in the window in marker and felt tip (14 KB or so each in the lo tier; use it for placeholders and empty states, not for a hundred thumbnails)." as const
    }, {
      name: "date" as const,
      type: "string" as const,
      description: "A retro camera's date stamp in the corner (orange, glowing)." as const
    }, {
      name: "develop" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "The picture is milky when it appears and clears over half a second. Once per mount; instant with reduced motion." as const
    }, {
      name: "label" as const,
      type: "string" as const,
      description: "Names a drawn scene (`role=\"img\"`). Without it the scene is decoration." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand of the drawing." as const
    }]
  }, {
    name: "PolaroidCaption" as const,
    description: "A `figcaption` in the foot: script font at 26 px, centered, balanced, at least 3 rem high." as const
  }],
  a11y: ["Give a real photograph its `alt` text as usual; the figure and figcaption name it for assistive technology. A drawn scene is decoration unless you pass `label`.", "The frame, window shadow, date stamp, veil, tape and fasteners are aria-hidden and pointer-events-none. The `date` stamp is decoration: if the date matters, say it in the caption or the alt text. Caption ink is 14:1 on the frame.", "The developing veil does not run with reduced motion or in calm density's flattened tilt; the picture is simply there."],
  usage: `import { Polaroid, PolaroidCaption, PolaroidImage } from "@/components/ui/polaroid"

<Polaroid tape="top">
  <PolaroidImage date="'25 8 09">
    <img src="/august.jpg" alt="A hill in August, with a tree" />
  </PolaroidImage>
  <PolaroidCaption>august, finally</PolaroidCaption>
</Polaroid>

<Polaroid fastener="pin"><PolaroidImage scene="sea" /><PolaroidCaption>the ferry home</PolaroidCaption></Polaroid>`,
  related: ["paper", "tape", "card", "sticker"]
} satisfies ComponentDoc;
