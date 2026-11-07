// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { z } from "zod";
export const TAKEN_USERNAMES = ["ada", "admin", "jo", "nell", "stubby"];
export const BIO_MAX = 160;
export const TIME_ZONES = [{
  value: "Europe/Lisbon" as const,
  label: "Lisbon (WET)" as const
}, {
  value: "Europe/London" as const,
  label: "London (GMT)" as const
}, {
  value: "America/New_York" as const,
  label: "New York (ET)" as const
}, {
  value: "America/Los_Angeles" as const,
  label: "Los Angeles (PT)" as const
}, {
  value: "Asia/Tokyo" as const,
  label: "Tokyo (JST)" as const
}, {
  value: "Australia/Sydney" as const,
  label: "Sydney (AEST)" as const
}];
export const PRONOUNS = [{
  value: "none" as const,
  label: "Rather not say" as const
}, {
  value: "she" as const,
  label: "she / her" as const
}, {
  value: "he" as const,
  label: "he / him" as const
}, {
  value: "they" as const,
  label: "they / them" as const
}];
export const profileSchema = z.object({
  name: z.string().trim().min(2, "Your name needs at least 2 letters.").max(40, "Keep your name to 40 letters or fewer."),
  username: z.string().trim().min(3, "Usernames need at least 3 characters.").max(20, "Usernames are 20 characters or fewer.").regex(/^[a-z0-9_]+$/i, "Use letters, numbers and underscores only.").refine(v => !TAKEN_USERNAMES.includes(v.toLowerCase()), "That username is taken. Try another."),
  email: z.email("Enter an address like ada@notes.dev."),
  bio: z.string().max(BIO_MAX, `Bios are ${BIO_MAX} characters or fewer.`),
  website: z.union([z.literal(""), z.url("Start with https:// so the link works.")]),
  pronouns: z.string(),
  timezone: z.string().min(1, "Pick a time zone."),
  discoverable: z.boolean()
});
export type ProfileValues = z.infer<typeof profileSchema>;
export const DEFAULT_PROFILE: ProfileValues = {
  name: "Jo Delacroix" as const,
  username: "jo_writes" as const,
  email: "jo@looseleaf.example" as const,
  bio: "I write in the margins. Letterpress on weekends, tea all week." as const,
  website: "https://jo.looseleaf.example" as const,
  pronouns: "she" as const,
  timezone: "Europe/Lisbon" as const,
  discoverable: true
};
