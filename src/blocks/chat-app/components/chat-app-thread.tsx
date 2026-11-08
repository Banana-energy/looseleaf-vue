// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef, useId } from "vue";
import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentTitle } from "@/components/ui/attachment";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { Icon } from "@/components/ui/icon";
import { Marker, MarkerContent } from "@/components/ui/marker";
import { Message, MessageAvatar, MessageContent, MessageHeader, MessageText } from "@/components/ui/message";
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from "@/components/ui/message-scroller";
import { Paper } from "@/components/ui/paper";
import { PromptInput, PromptInputAttachments, PromptInputBody, PromptInputButton, PromptInputFooter, PromptInputHint, PromptInputSubmit, PromptInputTextarea, PromptInputTools, usePromptInput } from "@/components/ui/prompt-input";
import { TypingIndicator } from "@/components/ui/typing-indicator";
import { ChatAppFace } from "@/blocks/chat-app/components/chat-app-face";
import type { ChatFile, ChatPart, ChatTurn, Conversation } from "@/blocks/chat-app/components/chat-app-data";
import type { ChatStatus } from "@/blocks/chat-app/components/chat-app-state";
import { cn } from "@/lib/utils";
import { useLocaleText } from "@/docs/core/settings";
const FileChip = defineUi<{
  file: ChatFile;
  children?: UI.ReactNode;
}>("FileChip", ["file"], (_props, {
  slots: _slots
}) => {
  const file = computed(() => _props["file"]);
  const children = renderValue(() => readSlot(_slots.default));
  return () => {
    return <Attachment size="sm" seed={file.value.name}>
      <AttachmentMedia>
        <Icon name="file-text" />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>{file.value.name}</AttachmentTitle>
        <AttachmentDescription>{file.value.size}</AttachmentDescription>
      </AttachmentContent>
      {readSlot(_slots.default)}
    </Attachment>;
  };
});
const ToolNote = defineUi<{
  title: string;
  result: string;
}>("ToolNote", ["title", "result"], (_props, {
  slots: _slots
}) => {
  const title = computed(() => _props["title"]);
  const result = computed(() => _props["result"]);
  return () => {
    return <Bubble shape="note" variant="muted" class="max-w-full">
      <BubbleContent class="flex items-center gap-2 px-4 py-2 font-type text-sm leading-snug" paper={{
        tilt: -0.7,
        curl: false
      }}>
        <Icon name="terminal" size={14} />
        <span>{title.value}</span>
        <span class="font-bold text-green">{result.value}</span>
      </BubbleContent>
    </Bubble>;
  };
});
const Parts = defineUi<{
  turn: ChatTurn;
  conversation: Conversation;
  live: boolean;
}>("Parts", ["turn", "conversation", "live"], (_props, {
  slots: _slots
}) => {
  const turn = computed(() => _props["turn"]);
  const conversation = computed(() => _props["conversation"]);
  const live = computed(() => _props["live"]);
  const prose = computed(() => conversation.value.kind === "assistant");
  const locale = useLocaleText();
  return () => {
    return <>
      {turn.value.parts.map((p: ChatPart, i) => {
        if (p.kind === "tool") return <ToolNote key={i} title={locale.value.locale === "zh-CN" && p.title === "ran npm test" ? "运行 npm test" : p.title} result={p.result} />;
        if (p.kind === "code") return <CodeBlock key={i} diff language="ts" filename={p.filename} code={p.code} seed={`${turn.value.id}-${i}`} class="mt-1" />;
        return <Bubble key={i} variant={prose.value ? "ghost" as const : "muted" as const} class="max-w-full">
            <BubbleContent seed={`${turn.value.id}-${i}`}>
              <MessageText streaming={live.value && i === turn.value.parts.length - 1} seed={`${turn.value.id}-${i}`}>
                {p.text}
              </MessageText>
            </BubbleContent>
          </Bubble>;
      })}
    </>;
  };
});
const TurnView = defineUi<{
  turn: ChatTurn;
  conversation: Conversation;
  live: boolean;
}>("TurnView", ["turn", "conversation", "live"], (_props, {
  slots: _slots
}) => {
  const turn = computed(() => _props["turn"]);
  const conversation = computed(() => _props["conversation"]);
  const live = computed(() => _props["live"]);
  const locale = useLocaleText();
  return () => {
    if (turn.value.from === "me") {
      const first = turn.value.parts[0];
      return <Message align="end">
        <MessageContent>
          <MessageHeader class="justify-end">{locale.value.locale === "zh-CN" ? "你" : "you"} · {turn.value.time}</MessageHeader>
          <Bubble variant="outline" pen="you">
            <BubbleContent seed={turn.value.id}>{first?.kind === "text" ? first.text : "" as const}</BubbleContent>
          </Bubble>
          {turn.value.files ? <div class="flex flex-wrap justify-end gap-3 pt-2">
              {turn.value.files.map(f => <FileChip key={f.name} file={f} />)}
            </div> : null}
        </MessageContent>
      </Message>;
    }
    const name = turn.value.who ?? conversation.value.name;
    return <Message>
      <MessageAvatar>
        <ChatAppFace conversation={conversation.value} name={name} size={conversation.value.kind === "assistant" ? 36 : 32} />
      </MessageAvatar>
      <MessageContent>
        <MessageHeader>
          {name} · {turn.value.time}
        </MessageHeader>
        <Parts turn={turn.value} conversation={conversation.value} live={live.value} />
        {turn.value.files ? <div class="flex flex-wrap gap-3 pt-2">
            {turn.value.files.map(f => <FileChip key={f.name} file={f} />)}
          </div> : null}
      </MessageContent>
    </Message>;
  };
});
const RemoveFile = defineUi<{
  name: string;
  onRemove: () => void;
}>("RemoveFile", ["name", "onRemove"], (_props, {
  slots: _slots
}) => {
  const name = computed(() => _props["name"]);
  const onRemove = computed(() => _props["onRemove"]);
  const _hook2 = usePromptInput();
  const focus = computed(() => _hook2.value.focus);
  return () => {
    return <AttachmentAction aria-label={`Remove ${name.value}`} onClick={() => {
      onRemove.value();
      focus.value();
    }}>
      <Icon name="x" />
    </AttachmentAction>;
  };
});
type Props = {
  locale?: "en" | "zh-CN";
  conversation: Conversation;
  status: ChatStatus;
  announce: string;
  onSend: (text: string, files: ChatFile[]) => void;
  onStop: () => void;
  onBack: () => void;
  className?: string;
};
export const ChatAppThread = defineUi<Props>("ChatAppThread", ["locale", "conversation", "status", "announce", "onSend", "onStop", "onBack", "class"], (_props, {
  slots: _slots
}) => {
  const conversation = computed(() => _props["conversation"]);
  const status = computed(() => _props["status"]);
  const announce = computed(() => _props["announce"]);
  const onSend = computed(() => _props["onSend"]);
  const onStop = computed(() => _props["onStop"]);
  const onBack = computed(() => _props["onBack"]);
  const className = computed(() => _props["class"]);
  const zh = computed(() => _props["locale"] === "zh-CN");
  const files = shallowRef<ChatFile[]>(initialState([]));
  const setFiles = stateSetter(files);
  const heading = useId();
  const busy = computed(() => status.value !== "ready");
  const attachable = computed(() => conversation.value.attachable);
  return () => {
    return <Paper as="section" stock="card" tilt={0.25} tape="top" tapeKind="washi-dots" seed="chat-thread" aria-labelledby={heading} data-slot="chat-app-thread" class={cn("flex min-h-0 flex-col pt-5 pb-3", className.value)}>
      <header class="flex items-center gap-3 px-4 pb-2 sm:px-6">
        <Button variant="ghost" size="icon-sm" class="@3xl/chat:hidden" onClick={onBack.value} aria-label={zh.value ? "返回聊天列表" : "Back to chats"}>
          <Icon name="arrow-left" class="rtl:-scale-x-100" />
        </Button>
        <ChatAppFace conversation={conversation.value} size={40} />
        <div class="min-w-0">
          <h2 id={heading} tabindex={-1} class="truncate font-script text-[1.7rem] leading-none font-semibold outline-offset-4 focus-visible:outline-2 focus-visible:outline-focus">
            {conversation.value.name}
          </h2>
          <p class="truncate text-sm text-muted-foreground">{conversation.value.subtitle}</p>
        </div>
      </header>

      <MessageScrollerProvider autoScroll defaultScrollPosition="end">
        <MessageScroller class="min-h-0 flex-1">
          <MessageScrollerViewport aria-label={zh.value ? `与 ${conversation.value.name} 的消息` : `Messages with ${conversation.value.name}`}>
            <MessageScrollerContent aria-live={busy.value ? "off" as const : undefined}>
              <Marker variant="separator">
                <MarkerContent>{zh.value ? "今天" : "Today"}</MarkerContent>
              </Marker>
              {conversation.value.turns.map((t, i) => <MessageScrollerItem key={t.id} messageId={t.id} scrollAnchor={t.from === "me"}>
                  <TurnView turn={t} conversation={conversation.value} live={status.value === "streaming" && i === conversation.value.turns.length - 1 && t.from === "them"} />
                </MessageScrollerItem>)}
              {status.value === "submitted" ? <MessageScrollerItem messageId="typing">
                  <Message>
                    <MessageContent>
                      <Bubble variant="muted">
                        <BubbleContent seed="typing">
                          <TypingIndicator variant={conversation.value.kind === "assistant" ? "squiggle" as const : "dots" as const} label={zh.value ? `${conversation.value.replyFrom ?? conversation.value.name} 正在输入回复` : `${conversation.value.replyFrom ?? conversation.value.name} is writing a reply`} seed="typing" />
                        </BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem> : null}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>

      <p role="status" class="sr-only">
        {announce.value}
      </p>

      <div class="px-3 pt-1">
        <PromptInput seed="chat-composer" status={status.value} allowEmpty={files.value.length > 0} onStop={onStop.value} onSubmit={text => {
          onSend.value(text, files.value);
          setFiles([]);
        }}>
          <PromptInputAttachments>
            {files.value.map(f => <FileChip key={f.name} file={f}>
                <AttachmentActions>
                  <RemoveFile name={f.name} onRemove={() => setFiles(all => all.filter(x => x.name !== f.name))} />
                </AttachmentActions>
              </FileChip>)}
          </PromptInputAttachments>
          <PromptInputBody>
            <PromptInputTextarea aria-label={zh.value ? `给 ${conversation.value.name} 发消息` : `Message ${conversation.value.name}`} placeholder={zh.value ? "写点温柔的话" : "write something kind"} />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputButton size="icon-sm" aria-label={zh.value ? "添加文件" : "Attach a file"} disabled={files.value.length >= attachable.value.length} onClick={() => setFiles(all => all.length < attachable.value.length ? [...all, attachable.value[all.length]] : all)}>
                <Icon name="paperclip" />
              </PromptInputButton>
            </PromptInputTools>
            <PromptInputHint class="@max-3xl/chat:sr-only">{busy.value ? zh.value ? "按停止中断" as const : "Press stop to interrupt" as const : zh.value ? "按 Enter 发送，Shift+Enter 换行" as const : "Enter to send, Shift+Enter for a new line" as const}</PromptInputHint>
            <PromptInputSubmit />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </Paper>;
  };
});
