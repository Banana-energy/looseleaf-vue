// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef, useId } from "vue";
import { Badge } from "@/components/ui/badge";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Paper } from "@/components/ui/paper";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChatAppFace } from "@/blocks/chat-app/components/chat-app-face";
import { snippet, type Conversation } from "@/blocks/chat-app/components/chat-app-data";
import { cn } from "@/lib/utils";
type Props = {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
};
export const ChatAppConversationList = defineUi<Props>("ChatAppConversationList", ["conversations", "activeId", "onSelect", "class"], (_props, {
  slots: _slots
}) => {
  const conversations = computed(() => _props["conversations"]);
  const activeId = computed(() => _props["activeId"]);
  const onSelect = computed(() => _props["onSelect"]);
  const className = computed(() => _props["class"]);
  const query = shallowRef(initialState(""));
  const setQuery = stateSetter(query);
  const show = shallowRef<"all" | "unread">(initialState("all"));
  const setShow = stateSetter(show);
  const heading = useId();
  const q = computed(() => query.value.trim().toLowerCase());
  const rows = computed(() => conversations.value.filter(c => (show.value === "all" || c.unread > 0) && (!q.value || `${c.name} ${snippet(c)}`.toLowerCase().includes(q.value))));
  const unreadTotal = computed(() => conversations.value.reduce((n, c) => n + c.unread, 0));
  return () => {
    return <Paper as="aside" stock="pad" rules="none" tilt={-0.3} fastener="binder-clip" seed="chat-list" aria-labelledby={heading} data-slot="chat-app-list" class={cn("flex min-h-0 flex-col gap-3 pt-6 pb-3", className.value)}>
      <div class="flex items-center justify-between gap-3 px-4">
        <h2 id={heading} tabindex={-1} class="font-script text-[1.7rem] leading-none font-semibold outline-offset-4 focus-visible:outline-2 focus-visible:outline-focus">
          Chats
        </h2>
        {unreadTotal.value > 0 ? <Badge variant="secondary">{unreadTotal.value} new</Badge> : null}
      </div>

      <div class="grid gap-2.5 px-4">
        <InputGroup>
          <InputGroupAddon>
            <Icon name="search" />
          </InputGroupAddon>
          <InputGroupInput type="search" placeholder="Search chats" aria-label="Search chats" value={query.value} onChange={(e: Event) => setQuery((e.target as HTMLInputElement).value)} />
        </InputGroup>
        <ToggleGroup type="single" size="sm" variant="outline" value={show.value} onValueChange={v => setShow(v === "unread" ? "unread" as const : "all" as const)} aria-label="Show" class="w-fit">
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="unread">Unread</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <ScrollArea class="min-h-0 flex-1" bleed>
        {rows.value.length === 0 ? <Empty seed="chat-none" class="p-2 md:p-4">
            <EmptyHeader>
              <EmptyMedia pose="search" size={88} />
              <EmptyTitle>No chats match</EmptyTitle>
              <EmptyDescription>{q.value ? `Nothing says “${query.value.trim()}”. Try a shorter word.` : "You are all caught up." as const}</EmptyDescription>
            </EmptyHeader>
          </Empty> : <ItemGroup ruled aria-label="Conversations">
            {rows.value.map(c => {
            const active = c.id === activeId.value;
            return <Item key={c.id} asChild size="sm" seed={c.id}>
                  <button type="button" aria-current={active ? "true" as const : undefined} onClick={() => onSelect.value(c.id)} class="w-full text-start aria-[current=true]:ll-swipe">
                    <ItemMedia>
                      <ChatAppFace conversation={c} />
                    </ItemMedia>
                    <ItemContent class="min-w-0">
                      <ItemTitle class={cn(c.unread > 0 && "font-extrabold")}>{c.name}</ItemTitle>
                      <ItemDescription class="line-clamp-1">{snippet(c)}</ItemDescription>
                    </ItemContent>
                    <ItemActions class="flex-col items-end gap-1 self-start">
                      <span class="ll-num text-sm text-muted-foreground">{c.time}</span>
                      {c.unread > 0 ? <Badge size="sm" class="ll-num">
                          {c.unread}
                          <span class="sr-only"> unread</span>
                        </Badge> : null}
                    </ItemActions>
                  </button>
                </Item>;
          })}
          </ItemGroup>}
      </ScrollArea>
    </Paper>;
  };
});
