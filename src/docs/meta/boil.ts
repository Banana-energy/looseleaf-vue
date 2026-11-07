// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "boil" as const,
  title: "Boil" as const,
  category: "Interactive" as const,
  description: "Makes drawn things shiver the way hand-animated line drawings do. About six times a second it moves to the next of a few frames: doodles are redrawn by a new hand, and buttons, cards and fields inside wobble a little differently. It stands still when motion is reduced, off screen and in a hidden tab." as const,
  status: "new" as const,
  parts: [{
    name: "Boil" as const,
    description: "A wrapper (an inline-block span). Direct children that take a `seed` (Doodle, Sticker, Mascot, Icon, Tape, Button…) get a new seed each frame; every drawn thing anywhere inside feels the frame through the ink context (wobble, fill offset, bleed and pen width move a few percent). Frames repeat, so after one turn every drawing comes from the cache: the cost is DOM updates, not drawing." as const,
    props: [{
      name: "fps" as const,
      type: "number" as const,
      default: "6" as const,
      description: "Redraws per second, 1 to 12." as const
    }, {
      name: "frames" as const,
      type: "number" as const,
      default: "3" as const,
      description: "How many different drawings it cycles through, 2 to 4." as const
    }, {
      name: "strength" as const,
      type: "number" as const,
      default: "1" as const,
      description: "How far each frame is from the resting drawing: 0 none, 2 restless." as const
    }, {
      name: "active" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Turn it off without unmounting (frame 0, the resting drawing)." as const
    }, {
      name: "reseed" as const,
      type: "boolean" as const,
      default: "true" as const,
      description: "Give direct children a new seed each frame. Off: only the knobs move." as const
    }, {
      name: "children" as const,
      type: "VueNode | ({ frame, seed }) => VueNode" as const,
      description: "A render prop gets the frame (0 to frames − 1) and `seed(base)`, for anything of your own that draws." as const
    }]
  }],
  a11y: ["Boil changes drawings, never content or layout: the shapes do not move, the lines shiver by a fraction of a pixel to a couple of pixels. Nothing is announced and nothing takes focus.", "Reduced motion (the OS setting, data-motion=\"reduced\", or an InkProvider with motion=\"reduced\") shows the resting drawing and runs no timer. The same happens while the tab is hidden and while the wrapper is scrolled out of view.", "WCAG 2.2.2: a boil that runs for more than five seconds is moving content. It stops for people who ask for reduced motion, but give everyone else a way out where it matters: bind `active` to a pause control or to a preference. Children keep their state, focus and drawn ink across frames (they are re-seeded, never remounted).", "Use it for a few live things (a mascot, a logo doodle, a call to action), not lists: every frame re-renders the children. The timer stops when the component unmounts.", "Hooks for your own drawings: useBoilFrame() and useBoilSeed(seed) return the frame and a frame-suffixed seed inside a Boil, and the plain seed outside one."],
  usage: `import { Boil } from "@/components/ui/boil"
import { Doodle } from "@/components/ui/doodle"

export function Example() {
  return (
    <Boil>
      <Doodle name="sun" size={96} />
    </Boil>
  )
}`,
  related: ["reveal", "doodle", "sticker", "mascot", "confetti"]
} satisfies ComponentDoc;
