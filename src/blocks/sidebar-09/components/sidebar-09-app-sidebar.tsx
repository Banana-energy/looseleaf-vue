// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef, useId } from "vue";
import { BrandTile } from "@/blocks/sidebar-shared/sidebar-brand";
import { appUser, mailFolders, type Mail, type MailFolder } from "@/blocks/sidebar-shared/sidebar-data";
import { NavUser } from "@/blocks/sidebar-shared/sidebar-user-menu";
import { Icon } from "@/components/ui/icon";
import { Label } from "@/components/ui/label";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarInput, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
const matches = (mail: Mail, query: string) => {
  const q = query.trim().toLowerCase();
  return !q || [mail.name, mail.subject, mail.teaser].some(text => text.toLowerCase().includes(q));
};
export const AppSidebar = defineUi<UI.ComponentProps<typeof Sidebar> & {
  folder: MailFolder;
  onFolderChange: (folder: MailFolder) => void;
  mails: Mail[];
  unread: ReadonlySet<string>;
  selectedId: string | null;
  onSelectMail: (id: string) => void;
}>("AppSidebar", ["folder", "onFolderChange", "mails", "unread", "selectedId", "onSelectMail"], (_props, {
  slots: _slots
}) => {
  const folder = computed(() => _props["folder"]);
  const onFolderChange = computed(() => _props["onFolderChange"]);
  const mails = computed(() => _props["mails"]);
  const unread = computed(() => _props["unread"]);
  const selectedId = computed(() => _props["selectedId"]);
  const onSelectMail = computed(() => _props["onSelectMail"]);
  const props = computed(() => omitProps(_props, ["folder", "onFolderChange", "mails", "unread", "selectedId", "onSelectMail"]));
  const _hook7 = useSidebar();
  const setOpen = computed(() => _hook7.value.setOpen);
  const isMobile = computed(() => _hook7.value.isMobile);
  const setOpenMobile = computed(() => _hook7.value.setOpenMobile);
  const unreadOnly = shallowRef(initialState(false));
  const setUnreadOnly = stateSetter(unreadOnly);
  const query = shallowRef(initialState(""));
  const setQuery = stateSetter(query);
  const switchId = useId();
  const visible = computed(() => mails.value.filter(mail => mail.folder === folder.value && (!unreadOnly.value || unread.value.has(mail.id)) && matches(mail, query.value)));
  return () => {
    return <Sidebar collapsible="icon" role="navigation" aria-label="Mail" {...domProps(props.value)}>
      <div class="flex h-full min-h-0 w-full flex-row">
        <div data-slot="mail-rail" class="flex h-full w-[var(--sidebar-width-icon,3rem)] shrink-0 flex-col">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild class="h-8 justify-center p-0">
                  <a href="#studio" aria-label="Looseleaf Studio">
                    <BrandTile icon="mail" />
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent class="px-1.5 md:px-0">
                <SidebarMenu>
                  {mailFolders.map(item => <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton tooltip={isMobile.value ? undefined : {
                      children: item.title,
                      hidden: false
                    }} isActive={folder.value === item.title} aria-current={folder.value === item.title ? "true" as const : undefined} class="px-2.5 md:px-2" onClick={() => {
                      onFolderChange.value(item.title);
                      setOpen.value(true);
                    }}>
                        <Icon name={item.icon} />
                        <span class="truncate">{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>)}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <NavUser user={appUser} iconOnly />
          </SidebarFooter>
        </div>

        <Sidebar collapsible="none" stock="card" aria-label={`${folder.value} messages`} role="region" class="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
          <SidebarHeader class="gap-3.5 border-b border-sidebar-border p-4">
            <div class="flex w-full items-center justify-between gap-2">
              <div class="font-script text-2xl leading-none font-semibold">{folder.value}</div>
              <Label for={switchId} class="flex items-center gap-2 text-sm">
                <span>Unreads</span>
                <Switch id={switchId} size="sm" checked={unreadOnly.value} onCheckedChange={setUnreadOnly} />
              </Label>
            </div>
            <SidebarInput type="search" aria-label="Search mail" placeholder="Type to search..." value={query.value} onChange={event => setQuery(event.target.value)} />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup class="px-0">
              <SidebarGroupContent>
                {visible.value.length ? <ul aria-label={`${folder.value} messages`}>
                    {visible.value.map(mail => {
                    const isUnread = unread.value.has(mail.id);
                    return <li key={mail.id} class="border-b border-sidebar-border last:border-b-0">
                          <button type="button" aria-current={selectedId.value === mail.id ? "true" as const : undefined} onClick={() => {
                        onSelectMail.value(mail.id);
                        if (isMobile.value) setOpenMobile.value(false);
                      }} class="flex w-full flex-col items-start gap-1.5 p-4 text-start text-sm leading-tight hover:ll-swipe focus-visible:ll-swipe aria-[current=true]:ll-swipe">
                            <span class="flex w-full items-center gap-2">
                              {isUnread ? <Icon name="dot" size={12} class="-ms-3.5 -me-1.5 shrink-0 text-marker" /> : null}
                              <span class={cn("truncate", isUnread && "font-bold")}>
                                {isUnread ? <span class="sr-only">Unread. </span> : null}
                                {mail.name}
                              </span>
                              <span class="ms-auto shrink-0 text-sm text-muted-foreground">{mail.date}</span>
                            </span>
                            <span class="w-full truncate font-bold">{mail.subject}</span>
                            <span class="line-clamp-2 w-full text-sm whitespace-break-spaces text-muted-foreground">{mail.teaser}</span>
                          </button>
                        </li>;
                  })}
                  </ul> : <p role="status" class="p-4 text-sm text-muted-foreground">
                    No letters here. Try another folder, or clear the search.
                  </p>}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>
    </Sidebar>;
  };
});
