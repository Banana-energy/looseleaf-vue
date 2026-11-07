// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { AppSidebar } from "@/blocks/sidebar-09/components/sidebar-09-app-sidebar";
import { containedClasses } from "@/blocks/sidebar-shared/sidebar-contained";
import { mails, type MailFolder } from "@/blocks/sidebar-shared/sidebar-data";
import { PageBody, PageHeader, PageNote, PageSheet } from "@/blocks/sidebar-shared/sidebar-page";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
const Page = defineUi<{
  contained?: boolean;
}>("Page", ["contained"], (_props, {
  slots: _slots
}) => {
  const contained = computed(() => _props["contained"] === undefined ? false : _props["contained"]);
  const c = computed(() => containedClasses(contained.value));
  const folder = shallowRef<MailFolder>(initialState("Inbox"));
  const setFolder = stateSetter(folder);
  const selectedId = shallowRef<string | null>(initialState(null));
  const setSelectedId = stateSetter(selectedId);
  const unread = shallowRef<ReadonlySet<string>>(initialState(() => new Set(mails.filter(m => m.unread).map(m => m.id))));
  const setUnread = stateSetter(unread);
  const selected = computed(() => mails.find(m => m.id === selectedId.value) ?? null);
  const setRead = computed(() => (id: string, read: boolean) => setUnread(prev => {
    const next = new Set(prev);
    if (read) next.delete(id);else next.add(id);
    return next;
  }));
  return () => {
    return <SidebarProvider class={cn("overflow-x-clip", c.value.provider)} style={cssStyle({
      "--sidebar-width": "350px" as const
    } as UI.CSSProperties)}>
      <AppSidebar class={c.value.sidebar} folder={folder.value} onFolderChange={next => {
        setFolder(next);
        setSelectedId(null);
      }} mails={mails} unread={unread.value} selectedId={selectedId.value} onSelectMail={id => {
        setSelectedId(id);
        setRead.value(id, true);
      }} />
      <PageSheet class={c.value.inset}>
        <PageHeader crumbs={["All inboxes", folder.value]} sticky bordered />
        {selected.value ? <PageBody title={selected.value.subject} kicker={`From ${selected.value.name}`}>
            <article aria-label={selected.value.subject} class="grid max-w-prose gap-3 text-base">
              <p class="text-sm text-muted-foreground">
                {selected.value.name} &lt;{selected.value.email}&gt; &middot; {selected.value.date}
              </p>
              {selected.value.teaser.split("\n").map(line => <p key={line}>{line}</p>)}
              <div>
                <Button variant="outline" size="sm" onClick={() => setRead.value(selected.value.id, false)}>
                  Mark as unread
                </Button>
              </div>
            </article>
          </PageBody> : <PageBody title={folder.value} kicker="All inboxes">
            <PageNote title="No letter open" pose="idle">
              Pick a message from the list on the pad and it opens here, ready to read.
            </PageNote>
          </PageBody>}
      </PageSheet>
    </SidebarProvider>;
  };
});
export default Page;
