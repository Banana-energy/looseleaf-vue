// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "attachment" as const,
  title: "Attachment" as const,
  category: "Chat" as const,
  description: "A file handed over in a conversation: a slip clipped to the message, or a print taped up. Five states (idle, uploading, processing, error, done), a pencil progress bar and a remove button. The pencil traces the slip, dashes it while it is only a promise and goes red when it fails." as const,
  status: "new" as const,
  upstream: "attachment" as const,
  parts: [{
    name: "Attachment" as const,
    description: "The root and the drawing: a `Paper` slip (horizontal) or a taped photo (vertical) behind the content, with a hand-traced outline on top. A finished slip carries a paper clip, a finished print a strip of tape." as const,
    props: [{
      name: "state" as const,
      type: '"idle" | "uploading" | "processing" | "error" | "done"' as const,
      default: '"done"' as const,
      description: "Idle is a dashed empty slot with no paper, error is red pencil on a red wash, uploading and processing are the same slip with a second, looser pass and a pulsing title." as const
    }, {
      name: "size" as const,
      type: '"default" | "sm" | "xs"' as const,
      default: '"default"' as const,
      description: "Padding and type size." as const
    }, {
      name: "orientation" as const,
      type: '"horizontal" | "vertical"' as const,
      default: '"horizontal"' as const,
      description: "A file chip, or a print with a caption in its white border." as const
    }, {
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand." as const
    }]
  }, {
    name: "AttachmentGroup" as const,
    description: "A row of attachments that scrolls sideways and snaps; padded so the clips, the tape and the focus rings are not cut off." as const
  }, {
    name: "AttachmentMedia" as const,
    description: "The tile a file's icon or thumbnail sits in: a paper-shade blob and a pencil loop, red in the error state. A bare glyph is held to 16 px (24 px in a print); a `Doodle` or `Sticker` keeps the size you give it." as const,
    props: [{
      name: "variant" as const,
      type: '"icon" | "image"' as const,
      default: '"icon"' as const,
      description: "`image` frames a picture (`<img>`) that covers the tile; it is dimmed while the file is uploading or processing." as const
    }]
  }, {
    name: "AttachmentContent" as const,
    description: "The title, description and progress bar." as const
  }, {
    name: "AttachmentTitle" as const,
    description: "The file name, bold, truncated; it pulses while the file is uploading or processing." as const
  }, {
    name: "AttachmentDescription" as const,
    description: "Size, type or a message; red in the error state." as const
  }, {
    name: "AttachmentProgress" as const,
    description: "The pencil bar: a ruled box with a hatched fill. The fill is drawn once at full length and clipped by CSS to the value, so progress never redraws it." as const,
    props: [{
      name: "value" as const,
      type: "number" as const,
      description: "0 to `max`. Undefined makes an indeterminate bar (the hatching pulses)." as const
    }, {
      name: "max" as const,
      type: "number" as const,
      default: "100" as const,
      description: "The value that means done." as const
    }]
  }, {
    name: "AttachmentActions" as const,
    description: "A row for actions; in a vertical attachment it sits on the top right corner of the print." as const
  }, {
    name: "AttachmentAction" as const,
    description: "A ghost icon Button (remove, retry, download). Takes every Button prop." as const
  }, {
    name: "AttachmentTrigger" as const,
    description: "A button laid over the whole attachment to make it pressable (`asChild` for a link). Give it an `aria-label`. It draws the hover wash and, on keyboard focus, the blue ring round the whole attachment." as const
  }],
  a11y: ["AttachmentProgress is a `role=\"progressbar\"` with `aria-valuenow`/`min`/`max` (none while indeterminate). Inside an attachment it is named by the AttachmentTitle unless you give it an `aria-label` or `aria-labelledby`; on its own it needs one.", "An AttachmentTrigger covers the attachment and is the tab stop; the Action buttons above it (z-20) stay separately focusable. Label both: the file name is not enough for 'Remove'.", "The state is never only color: error is red pencil plus a red message plus (for you) a retry action; idle is dashed; done carries a clip.", "Sheets, outlines, clips and tape are aria-hidden and take no pointer events. Calm density hides the clip and the tape and traces a plain hairline.", "Error text is red on slip (4.8:1); titles are ink on slip (14:1).", "A finished chip carries a paper clip over its end. With no action beside it the content keeps clear of the clip (extra end padding), so a long title truncates before it, not under it."],
  usage: `import { Icon } from "@/components/ui/icon"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentProgress,
  AttachmentTitle,
} from "@/components/ui/attachment"

export function Example() {
  return (
    <Attachment state="uploading">
      <AttachmentMedia>
        <Icon name="file-code" />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>tags-list.tsx</AttachmentTitle>
        <AttachmentDescription>Uploading 42 %</AttachmentDescription>
        <AttachmentProgress value={42} aria-label="Upload progress" />
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Cancel upload"><Icon name="x" /></AttachmentAction>
      </AttachmentActions>
    </Attachment>
  )
}`,
  related: ["prompt-input", "bubble", "message", "progress", "card"]
} satisfies ComponentDoc;
