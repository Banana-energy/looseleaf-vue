// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Polaroid, PolaroidCaption, PolaroidImage } from "@/components/ui/polaroid";
import { Paper } from "@/components/ui/paper";
import { Tally } from "@/components/ui/tally";
import { STATS, STREAK_DAYS, type Profile } from "@/blocks/profile-page/components/profile-page-data";
const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]!.toUpperCase()).join("");
export const ProfilePageHeader = defineUi<{
  profile: Profile;
  following: boolean;
  onFollow: (next: boolean) => void;
  onMessage?: () => void;
}>("ProfilePageHeader", ["profile", "following", "onFollow", "onMessage"], (_props, {
  slots: _slots
}) => {
  const profile = computed(() => _props["profile"]);
  const following = computed(() => _props["following"]);
  const onFollow = computed(() => _props["onFollow"]);
  const onMessage = computed(() => _props["onMessage"]);
  const followers = computed(() => profile.value.followers + (following.value ? 1 : 0));
  const stats = computed(() => profile.value.stats ?? STATS);
  const streak = computed(() => profile.value.streakDays ?? STREAK_DAYS);
  return () => {
    return <div class="grid gap-10">
      <div class="grid items-center gap-8 @2xl/profile:grid-cols-[auto_minmax(0,1fr)] @2xl/profile:gap-12">
        <Polaroid tape="top" tilt={-2.5} seed="profile-polaroid" class="w-60 justify-self-center @2xl/profile:justify-self-start">
          <PolaroidImage date="'26 9 25" seed="profile-window">
            {profile.value.photo ? <img src={profile.value.photo} alt="" class="size-full object-cover" /> : <span aria-hidden class="grid size-full place-items-center bg-hi/60 font-script text-8xl leading-none font-bold text-ink">
                {initials(profile.value.name)}
              </span>}
          </PolaroidImage>
          <PolaroidCaption>{profile.value.name.split(/\s+/)[0]}, at the desk</PolaroidCaption>
        </Polaroid>

        <div class="grid gap-4">
          <div class="grid gap-1">
            <h2 class="ll-riso font-script text-5xl leading-none font-bold text-balance @lg/profile:text-6xl">{profile.value.name}</h2>
            <p class="ll-num text-muted-foreground">
              @{profile.value.handle} · {profile.value.pronouns}
            </p>
          </div>
          <p class="max-w-prose text-lg text-pretty">{profile.value.bio}</p>
          <ul class="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground" aria-label="About">
            <li class="flex items-center gap-1.5">
              <Icon name="map" size={16} />
              {profile.value.place}
            </li>
            <li class="flex items-center gap-1.5">
              <Icon name="calendar" size={16} />
              Writing here since {profile.value.joined}
            </li>
            <li class="flex items-center gap-1.5">
              <Icon name="link" size={16} />
              {profile.value.website}
            </li>
          </ul>
          <ul class="flex flex-wrap gap-2" aria-label="Writes about">
            {profile.value.topics.map(t => <li key={t}>
                <Badge variant="secondary">{t}</Badge>
              </li>)}
          </ul>
          <div class="flex flex-wrap items-center gap-x-4 gap-y-3">
            <Button aria-pressed={following.value} variant={following.value ? "outline" as const : "default" as const} onClick={() => onFollow.value(!following.value)}>
              <Icon name={following.value ? "check" as const : "user-plus" as const} />
              {following.value ? "Following" as const : "Follow" as const}
            </Button>
            <Button variant="outline" onClick={onMessage.value}>
              <Icon name="message-square" />
              Message
            </Button>
            <p class="ll-num text-sm text-muted-foreground">
              <b class="text-foreground">{followers.value}</b> followers · <b class="text-foreground">{profile.value.following}</b> following
            </p>
          </div>
        </div>
      </div>

      <dl class="grid grid-cols-2 gap-3 @xl/profile:gap-5 @5xl/profile:grid-cols-4">
        {stats.value.map((s, i) => <Paper key={s.id} stock={i === 1 ? "index-card" as const : "slip" as const} rules={i === 1 ? "none" as const : undefined} seed={`stat-${s.id}`} class="grid content-start gap-1 px-4 py-4 @xl/profile:px-5">
            <dt class="text-sm text-muted-foreground">{s.label}</dt>
            <dd class="ll-num font-script text-4xl leading-none font-bold @xl/profile:text-5xl">{s.value}</dd>
            <dd class="text-sm text-pretty text-muted-foreground">{s.note}</dd>
          </Paper>)}
        <Paper stock="slip" seed="stat-streak" class="grid content-start gap-1 px-4 py-4 @xl/profile:px-5">
          <dt class="text-sm text-muted-foreground">Writing streak</dt>
          <dd class="ll-num font-script text-4xl leading-none font-bold @xl/profile:text-5xl">{streak.value} days</dd>
          <dd>
            <Tally count={streak.value} size="sm" tone="marker" label={`${streak.value} days in a row`} seed="streak" />
          </dd>
        </Paper>
      </dl>
    </div>;
  };
});
