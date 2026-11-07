// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Badge } from "@/components/ui/badge";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Paper } from "@/components/ui/paper";
import { Sticker } from "@/components/ui/sticker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { FOLDERS, mails as sample, type Folder, type Mail } from "@/blocks/inbox/components/inbox-data";
import { MailList } from "@/blocks/inbox/components/inbox-list";
import { NothingOpen, ReadingPane } from "@/blocks/inbox/components/inbox-reading-pane";
const EMPTY: Record<Folder, {
  pose: "celebrate" | "sleep" | "shrug";
  title: string;
  text: string;
}> = {
  inbox: {
    pose: "celebrate" as const,
    title: "Inbox zero" as const,
    text: "Every letter answered or filed. Put the kettle on." as const
  },
  archive: {
    pose: "sleep" as const,
    title: "Nothing filed away" as const,
    text: "Letters you archive wait here, out of the way." as const
  },
  trash: {
    pose: "shrug" as const,
    title: "The bin is empty" as const,
    text: "Nothing to throw away, for once." as const
  }
};
const Inbox = defineUi<{
  as?: "main" | "div";
}>("Inbox", ["as"], (_props, {
  slots: _slots
}) => {
  const Root = computed(() => jsxTag(_props["as"] === undefined ? "main" as const : _props["as"]));
  const all = shallowRef<Mail[]>(initialState(sample));
  const setAll = stateSetter(all);
  const folder = shallowRef<Folder>(initialState("inbox"));
  const setFolder = stateSetter(folder);
  const unreadOnly = shallowRef(initialState(false));
  const setUnreadOnly = stateSetter(unreadOnly);
  const query = shallowRef(initialState(""));
  const setQuery = stateSetter(query);
  const openId = shallowRef<string | null>(initialState(null));
  const setOpenId = stateSetter(openId);
  const message = shallowRef(initialState(""));
  const setMessage = stateSetter(message);
  const phone = useIsMobile();
  const root = shallowRef<HTMLDivElement | null>(null);
  const landing = shallowRef<"letter" | {
    row: string | undefined;
  } | null | null>(null);
  watchDependencies(() => {
    const to = landing.value;
    if (!to) return;
    landing.value = null;
    if (to === "letter") return void root.value?.querySelector<HTMLElement>("[data-mail-subject]")?.focus();
    const rows = Array.from(root.value?.querySelectorAll<HTMLElement>("[data-mail-row]") ?? []);
    (rows.find(r => r.dataset.mailId === to.row) ?? rows[0] ?? root.value?.querySelector<HTMLElement>('[role="tab"][data-state="active"]'))?.focus();
  }, undefined, false);
  const visible = computed(() => {
    const q = query.value.trim().toLowerCase();
    return all.value.filter(m => m.folder === folder.value && (!unreadOnly.value || m.unread) && (!q || `${m.from} ${m.subject} ${m.body.join(" ")}`.toLowerCase().includes(q)));
  });
  const open = computed(() => all.value.find(m => m.id === openId.value && visible.value.some(v => v.id === m.id)) ?? null);
  const unreadCount = computed(() => all.value.filter(m => m.folder === "inbox" && m.unread).length);
  const patch = computed(() => (id: string, change: Partial<Mail>) => setAll(list => list.map(m => m.id === id ? {
    ...m,
    ...change
  } : m)));
  const empty = computed(() => EMPTY[folder.value]);
  return () => {
    function openMail(id: string) {
      setOpenId(id);
      patch.value(id, {
        unread: false
      });
      if (phone.value) landing.value = "letter";
    }
    function file(mail: Mail, to: Folder, verb: string) {
      const at = visible.value.findIndex(m => m.id === mail.id);
      const next = visible.value[at + 1] ?? visible.value[at - 1];
      patch.value(mail.id, {
        folder: to
      });
      setMessage(`${verb} “${mail.subject}”.`);
      if (next && !phone.value) {
        setOpenId(next.id);
        patch.value(next.id, {
          unread: false
        });
        landing.value = "letter";
      } else {
        setOpenId(null);
        landing.value = {
          row: next?.id
        };
      }
    }
    return <Root.value ref={root} class="mx-auto flex w-full max-w-6xl flex-col gap-4 p-4 sm:p-6 lg:p-8">
      <header class="flex flex-wrap items-end justify-between gap-3">
        <div class="flex items-center gap-4">
          <div>
            <p class="font-type text-sm tracking-wide text-ink-muted">Marigold Paper Co.</p>
            <h1 class="font-script text-4xl leading-none font-bold sm:text-5xl">The post</h1>
          </div>
          <Sticker name="envelope-heart" size={68} seed="inbox-envelope" class="hidden shrink-0 sm:block" />
        </div>
        <p class="text-muted-foreground">
          {unreadCount.value === 0 ? "All read." as const : unreadCount.value === 1 ? "One letter is waiting." as const : `${unreadCount.value} letters are waiting.`}
        </p>
      </header>

      <div class="grid gap-4 md:h-[38rem] md:grid-cols-[minmax(0,23rem)_minmax(0,1fr)]">
        <Paper stock="slip" tilt={false} seed="inbox-tray" class={cn("flex min-h-96 flex-col md:min-h-0", open.value && "max-md:hidden")}>
          <Tabs value={folder.value} onValueChange={v => {
            setFolder(v as Folder);
            setOpenId(null);
          }} class="min-h-0 flex-1 gap-0">
            <div class="flex flex-col gap-3 p-3 pb-0">
              <TabsList class="w-full" aria-label="Folders">
                {FOLDERS.map(f => <TabsTrigger key={f.id} value={f.id} class="max-[26rem]:px-2.5">
                    <Icon name={f.icon} class="max-[22rem]:hidden" />
                    {f.label}
                    {f.id === "inbox" && unreadCount.value ? <Badge variant="secondary" size="sm" count={unreadCount.value} /> : null}
                  </TabsTrigger>)}
              </TabsList>
              <div class="flex items-center gap-2">
                <Input type="search" aria-label="Search letters" placeholder="Search letters" class="min-w-0 flex-1" value={query.value} onChange={(e: Event) => setQuery((e.target as HTMLInputElement).value)} />
                <ToggleGroup type="single" variant="outline" size="sm" value={unreadOnly.value ? "unread" as const : "all" as const} onValueChange={v => v && setUnreadOnly(v === "unread")} aria-label="Show">
                  <ToggleGroupItem value="all">All</ToggleGroupItem>
                  <ToggleGroupItem value="unread">Unread</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
            {FOLDERS.map(f => <TabsContent key={f.id} value={f.id} class="flex min-h-0 flex-1 flex-col">
                {visible.value.length ? <MailList list={visible.value} selectedId={open.value?.id ?? null} onOpen={openMail} label={`${f.label}, newest first`} /> : <Empty class="flex-1">
                    <EmptyHeader>
                      <EmptyMedia pose={query.value || unreadOnly.value ? "search" as const : empty.value.pose} size={80} />
                      <EmptyTitle>{query.value || unreadOnly.value ? "No letters like that" as const : empty.value.title}</EmptyTitle>
                      <EmptyDescription>{query.value || unreadOnly.value ? "Try another word, or show everything." as const : empty.value.text}</EmptyDescription>
                    </EmptyHeader>
                  </Empty>}
              </TabsContent>)}
          </Tabs>
        </Paper>

        <div class={cn("min-h-96 min-w-0 overflow-y-auto p-3 md:-m-3 md:min-h-0", !open.value && "max-md:hidden")}>
          {open.value ? <ReadingPane key={open.value.id} mail={open.value} onBack={() => {
            landing.value = {
              row: open.value.id
            };
            setOpenId(null);
          }} onArchive={() => file(open.value, "archive", "Archived")} onRestore={() => file(open.value, "inbox", "Moved to the inbox:")} onTrash={() => file(open.value, "trash", "Deleted")} onUnread={unread => {
            patch.value(open.value.id, {
              unread
            });
            setMessage(`Marked “${open.value.subject}” as ${unread ? "unread" as const : "read" as const}.`);
          }} onStar={starred => patch.value(open.value.id, {
            starred
          })} onReply={text => {
            patch.value(open.value.id, {
              replies: [...open.value.replies, text]
            });
            setMessage(`Reply sent to ${open.value.from.split(" ")[0]}.`);
          }} /> : <Paper stock="paper" tilt={false} seed="inbox-empty" class="hidden h-full md:block">
              <NothingOpen />
            </Paper>}
        </div>
      </div>

      <p role="status" aria-label="Inbox updates" class="sr-only">
        {message.value}
      </p>
    </Root.value>;
  };
});
export default Inbox;
