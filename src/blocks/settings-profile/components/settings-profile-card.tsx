// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { IndexCard, IndexCardContent, IndexCardFooter, IndexCardHeader, IndexCardTitle } from "@/components/ui/index-card";
import { PRONOUNS, TIME_ZONES, type ProfileValues } from "@/blocks/settings-profile/components/settings-profile-schema";
export const SettingsProfileCard = defineUi<{
  values: ProfileValues;
  photo?: string;
}>("SettingsProfileCard", ["values", "photo"], (_props, {
  slots: _slots
}) => {
  const values = computed(() => _props["values"]);
  const photo = computed(() => _props["photo"]);
  const name = computed(() => values.value.name.trim() || "Your name");
  const pronouns = computed(() => PRONOUNS.find(p => p.value === values.value.pronouns));
  const zone = computed(() => TIME_ZONES.find(z => z.value === values.value.timezone));
  return () => {
    return <IndexCard hole flag="grape" seed="profile-card" tilt={-0.2} aria-label="Preview of your profile card" role="group" class="min-h-[254px] max-w-none">
      <IndexCardHeader>
        <IndexCardTitle>{name.value}</IndexCardTitle>
        <Avatar size="sm" ring="none">
          {photo.value ? <AvatarImage src={photo.value} alt="" /> : null}
          <AvatarFallback name={name.value} />
        </Avatar>
      </IndexCardHeader>
      <IndexCardContent class="text-[15px]">
        <p class="ll-num text-muted-foreground">
          @{values.value.username.trim() || "username"}
          {pronouns.value && pronouns.value.value !== "none" ? ` · ${pronouns.value.label}` : "" as const}
        </p>
        <p class="line-clamp-3 wrap-break-word">{values.value.bio.trim() || "A line or two about you goes here."}</p>
      </IndexCardContent>
      <IndexCardFooter class="flex-wrap content-start justify-start gap-x-4">
        {values.value.website ? <span class="inline-flex h-[30px] max-w-full min-w-0 items-center gap-1.5">
            <Icon name="link" size={14} class="shrink-0" />
            <span class="truncate">{values.value.website.replace(/^https?:\/\//, "")}</span>
          </span> : null}
        {zone.value ? <span class="inline-flex h-[30px] items-center gap-1.5">
            <Icon name="globe" size={14} class="shrink-0" />
            {zone.value.label}
          </span> : null}
        {!values.value.discoverable ? <span class="h-[30px] text-ink-soft">not in search</span> : null}
      </IndexCardFooter>
    </IndexCard>;
  };
});
