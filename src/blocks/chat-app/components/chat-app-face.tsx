// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mascot } from "@/components/ui/mascot";
import type { Conversation } from "@/blocks/chat-app/components/chat-app-data";
export const ChatAppFace = defineUi<{
  conversation: Pick<Conversation, "id" | "kind" | "name">;
  size?: number;
  name?: string;
}>("ChatAppFace", ["conversation", "size", "name"], (_props, {
  slots: _slots
}) => {
  const conversation = computed(() => _props["conversation"]);
  const size = computed(() => _props["size"] === undefined ? 36 : _props["size"]);
  const name = computed(() => _props["name"]);
  return () => {
    if (conversation.value.kind === "assistant") {
      const draw = Math.round(size.value * 1.25);
      return <Mascot pose="idle" size={draw} seed={`${conversation.value.id}-face`} style={cssStyle({
        margin: -(draw - size.value) / 2
      })} />;
    }
    return <Avatar size={size.value > 36 ? "lg" as const : "default" as const} seed={`${conversation.value.id}-${name.value ?? ""}`}>
      <AvatarFallback name={name.value ?? conversation.value.name} />
    </Avatar>;
  };
});
