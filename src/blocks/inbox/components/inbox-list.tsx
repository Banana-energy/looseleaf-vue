// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Icon } from "@/components/ui/icon";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { cn } from "@/lib/utils";
import type { Mail } from "@/blocks/inbox/components/inbox-data";
export const MailList = defineUi<{
  list: readonly Mail[];
  selectedId: string | null;
  onOpen: (id: string) => void;
  label: string;
}>("MailList", ["list", "selectedId", "onOpen", "label"], (_props, {
  slots: _slots
}) => {
  const list = computed(() => _props["list"]);
  const selectedId = computed(() => _props["selectedId"]);
  const onOpen = computed(() => _props["onOpen"]);
  const label = computed(() => _props["label"]);
  const root = shallowRef<HTMLDivElement | null>(null);
  const stop = computed(() => list.value.some(m => m.id === selectedId.value) ? selectedId.value : list.value[0]?.id);
  return () => {
    function onKeydown(e: KeyboardEvent) {
      const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
      if (!keys.includes(e.key)) return;
      const rows = Array.from(root.value?.querySelectorAll<HTMLElement>("[data-mail-row]") ?? []);
      const at = rows.findIndex(r => r === document.activeElement);
      if (at < 0) return;
      e.preventDefault();
      const to = e.key === "Home" ? 0 : e.key === "End" ? rows.length - 1 : Math.min(rows.length - 1, Math.max(0, at + (e.key === "ArrowDown" ? 1 : -1)));
      rows[to]?.focus();
    }
    return <div ref={root} onKeydown={onKeydown} class="min-h-0 flex-1 overflow-y-auto p-3">
      <ItemGroup ruled aria-label={label.value}>
        {list.value.map(m => {
          const selected = m.id === selectedId.value;
          return <Item key={m.id} asChild size="sm" class={cn("flex-nowrap items-start text-start", selected && "ll-swipe")}>
              <button type="button" data-mail-row="" data-mail-id={m.id} data-selected={selected || undefined} aria-current={selected ? "true" as const : undefined} tabindex={m.id === stop.value ? 0 : -1} onClick={() => onOpen.value(m.id)}>
                <ItemMedia variant="icon">
                  <Icon name={m.unread ? "mail" as const : "mail-check" as const} />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle class="w-full justify-between gap-3">
                    <span class={cn("min-w-0 truncate", m.unread ? "font-bold" as const : "font-normal" as const)}>
                      {m.unread ? <span class="sr-only">Unread. </span> : null}
                      {m.from}
                    </span>
                    <span class="flex shrink-0 items-center gap-1.5 text-sm font-normal text-muted-foreground">
                      {m.starred ? <Icon name="star" size={14} label="Starred" class="text-hi-deep" /> : null}
                      {m.date}
                    </span>
                  </ItemTitle>
                  <span class={cn("block truncate text-[15px]", m.unread && "font-bold")}>{m.subject}</span>
                  <ItemDescription class="line-clamp-1">{m.body[0]}</ItemDescription>
                </ItemContent>
                {m.unread ? <span aria-hidden="true" class="mt-2 size-2 shrink-0 rounded-full bg-ink-you" /> : null}
              </button>
            </Item>;
        })}
      </ItemGroup>
    </div>;
  };
});
