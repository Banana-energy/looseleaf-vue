// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId, shallowRef } from "vue";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { Label } from "@/components/ui/label";
import { Paper } from "@/components/ui/paper";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import type { Mail } from "@/blocks/inbox/components/inbox-data";
export const NothingOpen = defineUi<{}>("NothingOpen", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Empty class="h-full">
      <EmptyHeader>
        <EmptyMedia doodle="paper-plane" size={88} />
        <EmptyTitle>Pick a letter to read</EmptyTitle>
        <EmptyDescription>It opens here, on a sheet of its own.</EmptyDescription>
      </EmptyHeader>
    </Empty>;
  };
});
export const ReadingPane = defineUi<{
  mail: Mail;
  onBack: () => void;
  onArchive: () => void;
  onRestore: () => void;
  onTrash: () => void;
  onUnread: (unread: boolean) => void;
  onStar: (starred: boolean) => void;
  onReply: (text: string) => void;
}>("ReadingPane", ["mail", "onBack", "onArchive", "onRestore", "onTrash", "onUnread", "onStar", "onReply"], (_props, {
  slots: _slots
}) => {
  const mail = computed(() => _props["mail"]);
  const onBack = computed(() => _props["onBack"]);
  const onArchive = computed(() => _props["onArchive"]);
  const onRestore = computed(() => _props["onRestore"]);
  const onTrash = computed(() => _props["onTrash"]);
  const onUnread = computed(() => _props["onUnread"]);
  const onStar = computed(() => _props["onStar"]);
  const onReply = computed(() => _props["onReply"]);
  const uid = useId();
  const draft = shallowRef(initialState(""));
  const setDraft = stateSetter(draft);
  const reply = shallowRef<HTMLTextAreaElement | null>(null);
  const inInbox = computed(() => mail.value.folder === "inbox");
  const first = computed(() => mail.value.from.split(" ")[0]);
  return () => {
    return <Paper as="article" stock="paper" tilt={false} seed={`inbox-${mail.value.id}`} aria-labelledby={`${uid}-subject`} class="flex min-h-full flex-col gap-4 p-5 sm:p-8">
      <div class="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" class="md:hidden" onClick={onBack.value}>
          <Icon name="arrow-left" />
          Back to the list
        </Button>
        <div class="ms-auto flex flex-wrap items-center gap-1" role="group" aria-label="What to do with this letter">
          {inInbox.value ? <Button variant="outline" size="sm" aria-label="Archive" onClick={onArchive.value}>
              <Icon name="archive" />
              <span class="hidden sm:inline">Archive</span>
            </Button> : <Button variant="outline" size="sm" aria-label="Move to inbox" onClick={onRestore.value}>
              <Icon name="inbox" />
              <span class="hidden sm:inline">Move to inbox</span>
            </Button>}
          {mail.value.folder !== "trash" ? <Button variant="outline" size="sm" aria-label="Delete" onClick={onTrash.value}>
              <Icon name="trash" />
              <span class="hidden sm:inline">Delete</span>
            </Button> : null}
          <Button variant="outline" size="sm" aria-label={mail.value.unread ? "Mark as read" as const : "Mark as unread" as const} onClick={() => onUnread.value(!mail.value.unread)}>
            <Icon name={mail.value.unread ? "mail-check" as const : "mail" as const} />
            <span class="hidden sm:inline">{mail.value.unread ? "Read" as const : "Unread" as const}</span>
          </Button>
          <Toggle variant="outline" size="sm" aria-label="Star" pressed={mail.value.starred} onPressedChange={onStar.value}>
            <Icon name="star" />
          </Toggle>
        </div>
      </div>

      <h2 id={`${uid}-subject`} data-mail-subject="" tabindex={-1} class="font-script text-3xl leading-tight font-bold text-balance outline-none sm:text-4xl">
        {mail.value.subject}
      </h2>

      <div class="flex items-center gap-3">
        <Avatar aria-hidden="true" size="lg">
          <AvatarFallback name={mail.value.from} />
        </Avatar>
        <div class="min-w-0">
          <p class="truncate font-bold">{mail.value.from}</p>
          <p class="truncate text-sm text-muted-foreground">
            {mail.value.address} · {mail.value.date}
          </p>
        </div>
      </div>

      <Separator variant="dashed" />

      <div class="flex flex-col gap-3 text-[17px] leading-relaxed">
        {mail.value.body.map((p, i) => <p key={i}>{p}</p>)}
      </div>

      {mail.value.attachments.length ? <ul role="list" aria-label="Attachments" class="flex flex-wrap gap-2">
          {mail.value.attachments.map(a => <li key={a} class="flex items-center gap-1.5 bg-hi-select/60 px-2.5 py-1 text-sm">
              <Icon name="paperclip" size={14} />
              {a}
            </li>)}
        </ul> : null}

      {mail.value.replies.length ? <section aria-label="Your replies" class="flex flex-col gap-2">
          {mail.value.replies.map((r, i) => <p key={i} class="ms-6 border-s-2 border-ink-you ps-3 text-ink-you">
              <span class="block text-sm text-muted-foreground">You wrote, just now</span>
              {r}
            </p>)}
        </section> : null}

      <form class="mt-auto flex flex-col gap-2 pt-2" onSubmit={(e: SubmitEvent) => {
        e.preventDefault();
        if (!draft.value.trim()) return;
        onReply.value(draft.value.trim());
        setDraft("");
        reply.value?.focus();
      }}>
        <Label for={`${uid}-reply`}>Reply to {first.value}</Label>
        <Textarea ref={reply} id={`${uid}-reply`} value={draft.value} onChange={(e: Event) => setDraft((e.target as HTMLTextAreaElement).value)} rows={3} placeholder={`Dear ${first.value},`} />
        <div class="flex justify-end">
          <Button type="submit" disabled={!draft.value.trim()}>
            <Icon name="send" />
            Send
          </Button>
        </div>
      </form>
    </Paper>;
  };
});
