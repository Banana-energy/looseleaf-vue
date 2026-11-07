// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, shallowRef } from "vue";
import type { ChatFile, ChatPart, Conversation } from "@/blocks/chat-app/components/chat-app-data";
export type ChatStatus = "ready" | "submitted" | "streaming";
type Step = {
  wait: number;
  apply: (parts: ChatPart[]) => ChatPart[];
};
function replySteps(script: ChatPart[]): Step[] {
  return script.flatMap((part): Step[] => part.kind === "text" ? part.text.split(" ").map((word, k) => ({
    wait: 85,
    apply: parts => {
      const last = parts[parts.length - 1];
      return k > 0 && last?.kind === "text" ? [...parts.slice(0, -1), {
        kind: "text" as const,
        text: `${last.text} ${word}`
      }] : [...parts, {
        kind: "text" as const,
        text: word
      }];
    }
  })) : [{
    wait: 700,
    apply: parts => [...parts, part]
  }]);
}
export function useChatApp(_source0: MaybeRefOrGetter<Conversation[]>, _source1: MaybeRefOrGetter<string>, _source2?: MaybeRefOrGetter<(conversationId: string, text: string, files: ChatFile[]) => void>) {
  const initial = computed(() => toValue(_source0));
  const firstId = computed(() => toValue(_source1));
  const onSend = computed(() => toValue(_source2));
  const conversations = shallowRef(initialState(initial.value));
  const setConversations = stateSetter(conversations);
  const activeId = shallowRef(initialState(firstId.value));
  const setActiveId = stateSetter(activeId);
  const stream = shallowRef<{
    id: string;
    phase: "submitted" | "streaming";
  } | null>(initialState(null));
  const setStream = stateSetter(stream);
  const announce = shallowRef(initialState(""));
  const setAnnounce = stateSetter(announce);
  const timers = shallowRef<number[]>([]);
  const counter = shallowRef(0);
  const clear = () => {
    timers.value.forEach(t => window.clearTimeout(t));
    timers.value = [];
  };
  watchDependencies(() => clear, () => [clear], false);
  const stop = () => {
    clear();
    setStream(null);
  };
  const select = (id: string) => {
    if (id === activeId.value) return;
    stop();
    setActiveId(id);
    setAnnounce("");
    setConversations(all => all.map(c => c.id === id && c.unread ? {
      ...c,
      unread: 0
    } : c));
  };
  const send = (text: string, files: ChatFile[] = []) => {
    const convo = conversations.value.find(c => c.id === activeId.value);
    if (!convo) return;
    onSend.value?.(convo.id, text, files);
    const n = counter.value++;
    const mine = `me-${n}`;
    const theirs = `re-${n}`;
    const who = convo.replyFrom;
    setConversations(all => all.map(c => c.id === activeId.value ? {
      ...c,
      time: "now" as const,
      turns: [...c.turns, {
        id: mine,
        from: "me" as const,
        time: "now" as const,
        parts: [{
          kind: "text" as const,
          text: text || "(the files)"
        }],
        files: files.length ? files : undefined
      }]
    } : c));
    setStream({
      id: activeId.value,
      phase: "submitted" as const
    });
    setAnnounce("");
    const steps = replySteps(convo.reply);
    let at = 700;
    timers.value.push(window.setTimeout(() => {
      setStream({
        id: activeId.value,
        phase: "streaming" as const
      });
      setConversations(all => all.map(c => c.id === activeId.value ? {
        ...c,
        turns: [...c.turns, {
          id: theirs,
          from: "them" as const,
          who,
          time: "now" as const,
          parts: []
        }]
      } : c));
    }, at));
    steps.forEach((step, i) => {
      at += step.wait;
      timers.value.push(window.setTimeout(() => {
        setConversations(all => all.map(c => c.id === activeId.value ? {
          ...c,
          turns: c.turns.map(t => t.id === theirs ? {
            ...t,
            parts: step.apply(t.parts)
          } : t)
        } : c));
        if (i === steps.length - 1) {
          setStream(null);
          setAnnounce(`${convo.name} replied`);
        }
      }, at));
    });
  };
  const status = computed<ChatStatus>(() => stream.value && stream.value.id === activeId.value ? stream.value.phase : "ready" as const);
  return computed(() => {
    return {
      conversations: conversations.value,
      activeId: activeId.value,
      active: conversations.value.find(c => c.id === activeId.value),
      status: status.value,
      announce: announce.value,
      select,
      send,
      stop
    };
  });
}
