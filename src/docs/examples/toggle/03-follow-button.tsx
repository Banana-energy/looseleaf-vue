// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Toggle } from "@/components/ui/toggle";
export const meta = {
  title: "A follow button" as const,
  description: "A controlled toggle: the state lives in your component, the label says what pressing does, and a status line says what happened, so nothing depends on the highlighter." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const following = shallowRef(initialState(false));
  const setFollowing = stateSetter(following);
  const muted = shallowRef(initialState(false));
  const setMuted = stateSetter(muted);
  return () => {
    return <Card class="mx-auto w-full max-w-sm" seed="follow">
      <CardHeader>
        <CardTitle>Field notes</CardTitle>
        <CardDescription>Sketches, half-thoughts and pressed flowers, twice a month.</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <div class="flex flex-wrap items-center gap-3">
          <Toggle variant="outline" pressed={following.value} onPressedChange={setFollowing} aria-label="Follow Field notes">
            <Icon name="bell" />
            {following.value ? "Following" as const : "Follow" as const}
          </Toggle>
          <Toggle pressed={muted.value} onPressedChange={setMuted} disabled={!following.value} aria-label="Mute new posts">
            <Icon name="eye-off" />
            Mute
          </Toggle>
        </div>
        <p role="status" class="text-sm text-muted-foreground">
          {!following.value ? "You will not hear about new notes." as const : muted.value ? "Following, with new notes muted." as const : "You will get an email for every new note." as const}
        </p>
      </CardContent>
    </Card>;
  };
});
export default Example;
