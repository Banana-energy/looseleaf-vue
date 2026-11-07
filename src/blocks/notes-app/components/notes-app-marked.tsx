// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, Fragment } from "vue";
import { Annotate, type AnnotateType } from "@/components/ui/annotate";
import { parseLine, type MarkKind } from "@/blocks/notes-app/components/notes-app-data";
export const MARK_LOOK: Record<MarkKind, {
  type: AnnotateType;
  color: "yellow" | "blue" | "red";
  kind?: "wavy";
}> = {
  highlight: {
    type: "highlight" as const,
    color: "yellow" as const
  },
  underline: {
    type: "underline" as const,
    color: "blue" as const,
    kind: "wavy" as const
  },
  circle: {
    type: "circle" as const,
    color: "red" as const
  },
  strike: {
    type: "strike-through" as const,
    color: "red" as const
  }
};
export const NotesAppMarked = defineUi<{
  body: string;
  seed: string;
}>("NotesAppMarked", ["body", "seed"], (_props, {
  slots: _slots
}) => {
  const body = computed(() => _props["body"]);
  const seed = computed(() => _props["seed"]);
  return () => {
    return <div class="text-[17px] leading-7 wrap-break-word">
      {body.value.split("\n").map((line, i) => <div key={i} class="min-h-7">
          {parseLine(line).map((piece, j) => {
          if (!piece.mark) return <Fragment key={j}>{piece.text}</Fragment>;
          const look = MARK_LOOK[piece.mark];
          return <Annotate key={j} type={look.type} color={look.color} kind={look.kind} seed={`${seed.value}:${i}:${j}`}>
                {piece.text}
              </Annotate>;
        })}
        </div>)}
    </div>;
  };
});
