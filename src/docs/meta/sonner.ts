// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "sonner" as const,
  title: "Sonner" as const,
  category: "Feedback" as const,
  description: "Toasts as slips of paper tossed onto the desk. A guest check for success, a pink sticky for errors, yellow for warnings, blue for news; stacked, swipeable, with drawn icons, action buttons, promise toasts and tape or a pin to hold them down. Built on the sonner package: you keep its `toast()` API." as const,
  status: "stable" as const,
  upstream: "sonner" as const,
  parts: [{
    name: "Toaster" as const,
    description: "Mount it once near the root of the app. It wraps sonner's Toaster in unstyled mode and gives each toast the paper look with classes on sonner's own elements, so stacking, swiping, timers, hover-to-expand and the aria-live region are all sonner's. Every sonner prop works (`position`, `expand`, `visibleToasts`, `duration`, `gap`, `offset`, `closeButton`, `dir`, `hotkey`, `toastOptions`, `icons`, `id` ...)." as const,
    props: [{
      name: "decoration" as const,
      type: '"none" | "tape" | "pin"' as const,
      default: '"none"' as const,
      description: "Hold every slip to the page with a strip of masking tape or a push-pin (drawn with CSS on the content box; hidden in calm density)." as const
    }, {
      name: "portal" as const,
      type: "boolean" as const,
      default: "false" as const,
      description: "Render the stack into `document.body`. The stack is `position: fixed`, so an ancestor with `container-type` (Tailwind's `@container`), `transform`, `filter` or `contain: layout` becomes its containing block and pins the toasts to that box instead of the window. Mount `<Toaster />` at the app root and you never need this; pass `portal` when it has to live inside such a wrapper. The stack appears after the first client render, and repeats the InkProvider's density, motion and theme." as const
    }, {
      name: "theme" as const,
      type: '"light" | "dark" | "system"' as const,
      default: '"light"' as const,
      description: "Passed to sonner. There is no next-themes here; Looseleaf themes come from CSS variables and the InkProvider, so the slips follow them without a prop." as const
    }, {
      name: "icons" as const,
      type: "ToastIcons" as const,
      description: "Override the drawn icons: success (circle-check), info, warning (triangle-alert), error (octagon-x), loading (loader-circle, spinning), close." as const
    }, {
      name: "toastOptions" as const,
      type: "ToastOptions" as const,
      description: "Sonner's options. `classNames` are merged with ours (yours come last); `unstyled` stays on." as const
    }]
  }, {
    name: "toast" as const,
    description: "Sonner's `toast()` re-exported for convenience: `toast(...)`, `toast.success/error/warning/info/loading/message/custom`, `toast.promise`, `toast.dismiss`. Importing it from \"sonner\" directly works the same." as const
  }, {
    name: "useSonner" as const,
    description: "Sonner's hook that returns the list of active toasts." as const
  }],
  a11y: ["Sonner renders a polite aria-live region (`aria-label=\"Notifications alt+T\"`); Alt+T focuses it so a keyboard user can reach the toasts, and hovering or focusing pauses the timers. Each type is its own icon shape and paper (guest check, pink, yellow, blue sticky), so color is never the only signal.", "Action and cancel are real buttons at least 24 px tall; the close button is named \"Close toast\". Keep toast text short and never put the only copy of an error in a toast that disappears: pair it with an inline message.", "Swipe to dismiss is a pointer shortcut only (sonner); every toast also closes with its close button, its action, its timer or `toast.dismiss()`.", "The toss-in uses the theme's `ll-toss` (`ll-drop` when the stack is not on the right) and collapses to nothing with reduced motion. In `calm` density the slips lose their tilt, tape and pin.", "Toasts are above dialogs and popovers on the z-scale and stay clickable while a modal is open."],
  usage: `// app/layout.tsx  (once)
import { Toaster } from "@/components/ui/sonner"

export default function Layout({ children }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}

import { toast } from "sonner"

toast.success("Notebook saved", { description: "All 48 pages are safe." })

toast.promise(saveNotebook(), {
  loading: "Saving notebook…",
  success: "Saved",
  error: "Could not save",
})`,
  related: ["alert", "dialog", "button", "popover"]
} satisfies ComponentDoc;
