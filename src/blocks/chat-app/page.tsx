// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { ChatAppConversationList } from "@/blocks/chat-app/components/chat-app-conversation-list";
import { CONVERSATIONS, type ChatFile, type Conversation } from "@/blocks/chat-app/components/chat-app-data";
import { useChatApp } from "@/blocks/chat-app/components/chat-app-state";
import { ChatAppThread } from "@/blocks/chat-app/components/chat-app-thread";
import { cn } from "@/lib/utils";
type Props = {
  className?: string;
  conversations?: Conversation[];
  onSend?: (conversationId: string, text: string, files: ChatFile[]) => void;
};
const ChatApp = defineUi<Props>("ChatApp", ["class", "conversations", "onSend"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const conversations = computed(() => _props["conversations"] === undefined ? CONVERSATIONS : _props["conversations"]);
  const onSend = computed(() => _props["onSend"]);
  const chat = useChatApp(() => conversations.value, () => conversations.value[0]?.id ?? "", () => onSend.value);
  const view = shallowRef<"list" | "thread">(initialState("list"));
  const setView = stateSetter(view);
  const grid = shallowRef<HTMLDivElement | null>(null);
  const shown = shallowRef(view.value);
  watchDependencies(() => {
    if (shown.value === view.value) return;
    shown.value = view.value;
    const gone = grid.value?.querySelector<HTMLElement>(view.value === "thread" ? "[data-slot=chat-app-list]" as const : "[data-slot=chat-app-thread]" as const);
    if (!gone || getComputedStyle(gone).display !== "none") return;
    const pane = view.value === "thread" ? "[data-slot=chat-app-thread]" as const : "[data-slot=chat-app-list]" as const;
    const target = (view.value === "list" ? grid.value?.querySelector<HTMLElement>(`${pane} [aria-current=true]`) : null) ?? grid.value?.querySelector<HTMLElement>(`${pane} h2`);
    target?.focus();
  }, () => [view.value], false);
  return () => {
    return <div class="@container/chat w-full">
      <div ref={grid} data-slot="chat-app" data-view={view.value} class={cn("group/chat grid h-[50rem] max-h-[100svh] min-h-[32rem] w-full grid-cols-1 grid-rows-[minmax(0,1fr)] gap-6 p-4 pt-10 @3xl/chat:grid-cols-[minmax(16rem,21rem)_minmax(0,1fr)] @3xl/chat:p-6 @3xl/chat:pt-12", className.value)}>
        <ChatAppConversationList conversations={chat.value.conversations} activeId={chat.value.activeId} onSelect={id => {
          chat.value.select(id);
          setView("thread");
        }} class="group-data-[view=thread]/chat:@max-3xl/chat:hidden" />
        {chat.value.active ? <ChatAppThread key={chat.value.active.id} conversation={chat.value.active} status={chat.value.status} announce={chat.value.announce} onSend={chat.value.send} onStop={chat.value.stop} onBack={() => setView("list")} class="group-data-[view=list]/chat:@max-3xl/chat:hidden" /> : null}
      </div>
    </div>;
  };
});
export default ChatApp;
