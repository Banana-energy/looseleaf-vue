// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentTitle } from "@/components/ui/attachment";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { CodeBlock } from "@/components/ui/code-block";
import { Icon } from "@/components/ui/icon";
import { Marker, MarkerContent } from "@/components/ui/marker";
import { Mascot } from "@/components/ui/mascot";
import { Message, MessageAvatar, MessageContent, MessageHeader, MessageText } from "@/components/ui/message";
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from "@/components/ui/message-scroller";
import { Paper } from "@/components/ui/paper";
import { PromptInput, PromptInputAttachments, PromptInputBody, PromptInputButton, PromptInputFooter, PromptInputHint, PromptInputSubmit, PromptInputTextarea, PromptInputTools, usePromptInput } from "@/components/ui/prompt-input";
import { TypingIndicator } from "@/components/ui/typing-indicator";
export const meta = {
  title: "A whole chat" as const,
  description: "Everything at once: a transcript that pins your message and follows the reply, streaming words that soak in, a tool-call note, a code slip with a diff, attachments, a typing pencil, day markers, and the composer with its paper plane and stop button." as const,
  layout: "full" as const,
  stage: "desk" as const,
  height: 780
};
type File = {
  name: string;
  size: string;
};
type Part = {
  kind: "text";
  text: string;
} | {
  kind: "tool";
  title: string;
  result: string;
} | {
  kind: "code";
  filename: string;
  code: string;
};
type Turn = {
  id: string;
  role: "user" | "assistant";
  parts: Part[];
  files?: File[];
  time: string;
};
const DIFF = `-const shown = notes;
+const shown = picked.size
+  ? notes.filter((n) => n.tags.some((t) => picked.has(t)))
+  : notes;`;
const SCRIPT: Part[] = [{
  kind: "text" as const,
  text: "I read src/notes/list.tsx first. Tags become a string array on Note, and the chips sit in a row above the list." as const
}, {
  kind: "tool" as const,
  title: "ran npm test" as const,
  result: "12 passed" as const
}, {
  kind: "code" as const,
  filename: "src/notes/filter.ts" as const,
  code: DIFF
}, {
  kind: "text" as const,
  text: "Try #recipes first: the list narrows to the notes that carry it, and the count at the top stays honest." as const
}];
const START: Turn[] = [{
  id: "a0" as const,
  role: "assistant" as const,
  time: "9:40" as const,
  parts: [{
    kind: "text" as const,
    text: "Good morning. What are we making?" as const
  }]
}, {
  id: "u1" as const,
  role: "user" as const,
  time: "9:41" as const,
  parts: [{
    kind: "text" as const,
    text: "Can you add tags to my notes, and a filter row above the list?" as const
  }],
  files: [{
    name: "field-notes.pdf" as const,
    size: "2.4 MB" as const
  }]
}, {
  id: "a1" as const,
  role: "assistant" as const,
  time: "9:41" as const,
  parts: SCRIPT
}];
type Step = {
  wait: number;
  apply: (parts: Part[]) => Part[];
};
const steps = (): Step[] => SCRIPT.flatMap((p): Step[] => p.kind === "text" ? p.text.split(" ").map((word, k) => ({
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
  apply: parts => [...parts, p]
}]);
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
      <BubbleContent class="flex items-center gap-2 px-4 py-2 font-type text-[13px] leading-snug" paper={{
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
const Files = defineUi<{
  files: File[];
}>("Files", ["files"], (_props, {
  slots: _slots
}) => {
  const files = computed(() => _props["files"]);
  return () => {
    return <div class="flex flex-wrap justify-end gap-3 pt-2">
      {files.value.map(f => <Attachment key={f.name} size="sm" seed={f.name}>
          <AttachmentMedia>
            <Icon name="file-text" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{f.name}</AttachmentTitle>
            <AttachmentDescription>{f.size}</AttachmentDescription>
          </AttachmentContent>
        </Attachment>)}
    </div>;
  };
});
const TurnView = defineUi<{
  turn: Turn;
  live: boolean;
}>("TurnView", ["turn", "live"], (_props, {
  slots: _slots
}) => {
  const turn = computed(() => _props["turn"]);
  const live = computed(() => _props["live"]);
  return () => {
    if (turn.value.role === "user") return <Message align="end">
        <MessageContent>
          <MessageHeader class="justify-end">you · {turn.value.time}</MessageHeader>
          <Bubble variant="outline" pen="you">
            <BubbleContent seed={turn.value.id}>{turn.value.parts[0].kind === "text" ? turn.value.parts[0].text : "" as const}</BubbleContent>
          </Bubble>
          {turn.value.files ? <Files files={turn.value.files} /> : null}
        </MessageContent>
      </Message>;
    return <Message>
      <MessageAvatar>
        <Mascot pose={live.value ? "write" as const : "idle" as const} size={36} seed="stubby" />
      </MessageAvatar>
      <MessageContent>
        <MessageHeader>Stubby · {turn.value.time}</MessageHeader>
        {turn.value.parts.map((p, i) => p.kind === "text" ? <Bubble key={i} variant="ghost" class="max-w-full">
              <BubbleContent>
                <MessageText streaming={live.value && i === turn.value.parts.length - 1} seed={`${turn.value.id}-${i}`}>
                  {p.text}
                </MessageText>
              </BubbleContent>
            </Bubble> : p.kind === "tool" ? <ToolNote key={i} title={p.title} result={p.result} /> : <CodeBlock key={i} diff language="ts" filename={p.filename} code={p.code} seed={`${turn.value.id}-${i}`} class="mt-3" />)}
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
const FILES: File[] = [{
  name: "tags-list.tsx" as const,
  size: "4 KB" as const
}, {
  name: "recipes.csv" as const,
  size: "18 KB" as const
}, {
  name: "harbour.jpg" as const,
  size: "1.8 MB" as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const turns = shallowRef<Turn[]>(initialState(START));
  const setTurns = stateSetter(turns);
  const status = shallowRef<"ready" | "submitted" | "streaming">(initialState("ready"));
  const setStatus = stateSetter(status);
  const files = shallowRef<File[]>(initialState([]));
  const setFiles = stateSetter(files);
  const announce = shallowRef(initialState(""));
  const setAnnounce = stateSetter(announce);
  const timers = shallowRef<number[]>([]);
  const counter = shallowRef(2);
  const stop = () => {
    timers.value.forEach(t => window.clearTimeout(t));
    timers.value = [];
    setStatus("ready");
  };
  watchDependencies(() => stop, () => [stop], false);
  const send = computed(() => (text: string) => {
    const n = counter.value++;
    const attached = files.value;
    setFiles([]);
    setTurns(t => [...t, {
      id: `u${n}`,
      role: "user" as const,
      time: "now" as const,
      parts: [{
        kind: "text" as const,
        text: text || "(the files)"
      }],
      files: attached.length ? attached : undefined
    }]);
    setStatus("submitted");
    setAnnounce("");
    const list = steps();
    let at = 700;
    timers.value.push(window.setTimeout(() => {
      setStatus("streaming");
      setTurns(t => [...t, {
        id: `a${n}`,
        role: "assistant" as const,
        time: "now" as const,
        parts: []
      }]);
    }, at));
    list.forEach((s, i) => {
      at += s.wait;
      timers.value.push(window.setTimeout(() => {
        setTurns(t => t.map((x, k) => k === t.length - 1 ? {
          ...x,
          parts: s.apply(x.parts)
        } : x));
        if (i === list.length - 1) {
          setStatus("ready");
          setAnnounce("Stubby replied");
        }
      }, at));
    });
  });
  const busy = computed(() => status.value !== "ready");
  return () => {
    return <div class="mx-auto flex h-[740px] w-full max-w-2xl flex-col">
      <Paper stock="card" tilt={false} class="flex min-h-0 flex-1 flex-col pt-4 pb-3">
        <div class="flex items-center gap-3 px-6 pb-2">
          <Mascot pose="idle" size={32} seed="header" />
          <h3 class="m-0 font-script text-[1.7rem] leading-none font-semibold">field-notes</h3>
          <span class="text-sm text-muted-foreground">on feature/tags</span>
        </div>
        <MessageScrollerProvider autoScroll defaultScrollPosition="end">
          <MessageScroller class="min-h-0 flex-1">
            <MessageScrollerViewport>
              <MessageScrollerContent aria-live={busy.value ? "off" as const : undefined}>
                <Marker variant="separator">
                  <MarkerContent>Today</MarkerContent>
                </Marker>
                {turns.value.map((t, i) => <MessageScrollerItem key={t.id} messageId={t.id} scrollAnchor={t.role === "user"}>
                    <TurnView turn={t} live={busy.value && i === turns.value.length - 1 && t.role === "assistant"} />
                  </MessageScrollerItem>)}
                {status.value === "submitted" ? <MessageScrollerItem messageId="typing">
                    <Message>
                      <MessageContent>
                        <Bubble variant="muted">
                          <BubbleContent seed="typing">
                            <TypingIndicator variant="squiggle" label="Stubby is writing a reply" seed="typing" />
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
          <PromptInput seed="chat" status={status.value} onSubmit={send.value} onStop={stop} allowEmpty={files.value.length > 0}>
            <PromptInputAttachments>
              {files.value.map(f => <Attachment key={f.name} size="sm" seed={f.name}>
                  <AttachmentMedia>
                    <Icon name="file-text" />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>{f.name}</AttachmentTitle>
                    <AttachmentDescription>{f.size}</AttachmentDescription>
                  </AttachmentContent>
                  <AttachmentActions>
                    <RemoveFile name={f.name} onRemove={() => setFiles(all => all.filter(x => x.name !== f.name))} />
                  </AttachmentActions>
                </Attachment>)}
            </PromptInputAttachments>
            <PromptInputBody>
              <PromptInputTextarea aria-label="Message" />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools>
                <PromptInputButton size="icon-sm" aria-label="Attach a file" disabled={files.value.length >= FILES.length} onClick={() => setFiles(all => all.length < FILES.length ? [...all, FILES[all.length]] : all)}>
                  <Icon name="paperclip" />
                </PromptInputButton>
              </PromptInputTools>
              <PromptInputHint>{busy.value ? "Press stop to interrupt" as const : "Enter to send" as const}</PromptInputHint>
              <PromptInputSubmit />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </Paper>
    </div>;
  };
});
export default Example;
