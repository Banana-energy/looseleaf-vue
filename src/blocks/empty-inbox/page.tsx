// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Circled } from "@/components/ui/circled";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { Mascot } from "@/components/ui/mascot";
import { Sticker } from "@/components/ui/sticker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
type EmptyInboxProps = {
  onCompose?: () => void;
  onRefresh?: () => void;
};
const EmptyInbox = defineUi<EmptyInboxProps>("EmptyInbox", ["onCompose", "onRefresh"], (_props, {
  slots: _slots
}) => {
  const onCompose = computed(() => _props["onCompose"]);
  const onRefresh = computed(() => _props["onRefresh"]);
  const titleId = useId();
  const checks = shallowRef(initialState(0));
  const setChecks = stateSetter(checks);
  return () => {
    return <section aria-labelledby={titleId} class="@container w-full">
      <div class="px-7 py-10 @xl:px-8 @xl:py-14">
        <Card tape="top" tapeKind="washi-dots" seed="empty-inbox" class="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>
              <h2 id={titleId}>Inbox</h2>
            </CardTitle>
            <CardDescription role="status">{checks.value === 0 ? "Checked just now" as const : "Checked again. Still nothing new." as const}</CardDescription>
            <CardAction>
              <Button type="button" variant="ghost" size="icon-sm" aria-label="Check for new mail" onClick={() => {
                setChecks(n => n + 1);
                onRefresh.value?.();
              }}>
                <Icon name="rotate-cw" />
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="all" class="gap-2">
              <TabsList variant="line" aria-label="Filter mail">
                <TabsTrigger value="all">All mail</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="starred">Starred</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia class="mb-1 gap-1">
                      <Circled tone="red" weight="brush" seed="inbox-zero" class="mx-2 px-1 font-script text-5xl leading-none font-bold" aria-hidden="true">
                        0
                      </Circled>
                      <Mascot pose="celebrate" size={112} />
                      <Sticker name="done" size={50} rotate={9} class="-ms-3 mt-8" />
                    </EmptyMedia>
                    <EmptyTitle>Inbox zero</EmptyTitle>
                    <EmptyDescription>You have read everything. Go stretch, or put the kettle on.</EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <div class="flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
                      <Button type="button" onClick={onCompose.value}>
                        <Icon name="pencil" />
                        Write a message
                      </Button>
                      <Button asChild variant="ghost">
                        <a href="#archive">Visit the archive</a>
                      </Button>
                    </div>
                  </EmptyContent>
                </Empty>
              </TabsContent>

              <TabsContent value="unread">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia pose="sleep" size={124} />
                    <EmptyTitle>All quiet</EmptyTitle>
                    <EmptyDescription>Nothing unread. Enjoy it while it lasts.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </TabsContent>

              <TabsContent value="starred">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia pose="peek" size={124} />
                    <EmptyTitle>Nothing starred yet</EmptyTitle>
                    <EmptyDescription>Star a message to keep it close. It will wait for you here.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>;
  };
});
export default EmptyInbox;
export type { EmptyInboxProps };
