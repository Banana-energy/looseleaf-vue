// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfilePageActivity } from "@/blocks/profile-page/components/profile-page-activity";
import { PROFILE, type Profile } from "@/blocks/profile-page/components/profile-page-data";
import { ProfilePageHeader } from "@/blocks/profile-page/components/profile-page-header";
import { ProfilePageNotebooks, ProfilePageStickers } from "@/blocks/profile-page/components/profile-page-shelf";
import { cn } from "@/lib/utils";
type Props = {
  className?: string;
  profile?: Profile;
  defaultFollowing?: boolean;
  onFollowChange?: (following: boolean) => void;
  onMessage?: () => void;
};
const ProfilePage = defineUi<Props>("ProfilePage", ["class", "profile", "defaultFollowing", "onFollowChange", "onMessage"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const profile = computed(() => _props["profile"] === undefined ? PROFILE : _props["profile"]);
  const defaultFollowing = computed(() => _props["defaultFollowing"] === undefined ? false : _props["defaultFollowing"]);
  const onFollowChange = computed(() => _props["onFollowChange"]);
  const onMessage = computed(() => _props["onMessage"]);
  const following = shallowRef(initialState(defaultFollowing.value));
  const setFollowing = stateSetter(following);
  return () => {
    return <section aria-label={`${profile.value.name}, profile`} class={cn("@container/profile mx-auto grid w-full max-w-6xl gap-12 px-4 py-12 sm:px-8", className.value)}>
      <ProfilePageHeader profile={profile.value} following={following.value} onFollow={next => {
        setFollowing(next);
        onFollowChange.value?.(next);
      }} onMessage={onMessage.value} />
      <Tabs defaultValue="activity" class="gap-6">
        <TabsList variant="line" aria-label="Profile sections">
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="notebooks">Notebooks</TabsTrigger>
          <TabsTrigger value="stickers">Stickers</TabsTrigger>
        </TabsList>
        <TabsContent value="activity">
          <ProfilePageActivity weeks={profile.value.weeks} feed={profile.value.feed} />
        </TabsContent>
        <TabsContent value="notebooks">
          <ProfilePageNotebooks shelf={profile.value.shelf} />
        </TabsContent>
        <TabsContent value="stickers">
          <ProfilePageStickers badges={profile.value.badges} />
        </TabsContent>
      </Tabs>
    </section>;
  };
});
export default ProfilePage;
