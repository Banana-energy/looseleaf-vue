// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Avatar as AvatarPrimitive } from "@/lib/primitives";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { avatarBadgeRecipe, avatarCountRecipe, avatarFallbackRecipe, avatarRingRecipe, avatarTone, initials, type AvatarRing, type AvatarStatus, type AvatarTone } from "@/lib/ink/recipes/avatar-ink";
import { cn } from "@/lib/utils";
const CUT = "shadow-[0_0_0_2px_var(--ll-avatar-ring,transparent)]";
const Avatar = defineUi<UI.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: "default" | "sm" | "lg" | "xl";
  ring?: AvatarRing | "none";
  seed?: string | number;
}>("Avatar", ["class", "size", "ring", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const size = computed(() => _props["size"] === undefined ? "default" as const : _props["size"]);
  const ring = computed(() => _props["ring"] === undefined ? "ink" as const : _props["ring"]);
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "size", "ring", "seed", "ref", "children"]));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: avatarRingRecipe,
    params: {
      ring: ring.value === "none" ? "ink" as const : ring.value
    },
    kind: "avatar" as const,
    seed: seed.value,
    still: true
  }));
  const drawn = computed(() => ring.value !== "none");
  return () => {
    return <AvatarPrimitive.Root data-slot="avatar" data-size={size.value} ref={useMergedRef<HTMLSpanElement>(drawn.value ? hostRef : undefined, ref.value)} {...domProps(drawn.value && node.value ? hostProps.value : {})} class={cn("group/avatar relative isolate flex size-8 shrink-0 rounded-full select-none data-[size=lg]:size-10 data-[size=sm]:size-6 data-[size=xl]:size-14 forced-colors:outline-0!", CUT, className.value)} {...domProps(props.value)}>
      {drawn.value ? node.value : null}
      {readSlot(_slots.default)}
    </AvatarPrimitive.Root>;
  };
});
const AvatarImage = defineUi<UI.ComponentProps<typeof AvatarPrimitive.Image>>("AvatarImage", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <AvatarPrimitive.Image data-slot="avatar-image" class={cn("aspect-square size-full rounded-full object-cover", className.value)} {...domProps(props.value)}>{_slots.default?.()}</AvatarPrimitive.Image>;
  };
});
const AvatarFallback = defineUi<UI.ComponentProps<typeof AvatarPrimitive.Fallback> & {
  name?: string;
  tone?: AvatarTone;
  seed?: string | number;
}>("AvatarFallback", ["class", "name", "tone", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const name = computed(() => _props["name"]);
  const tone = computed(() => _props["tone"]);
  const seed = computed(() => _props["seed"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "name", "tone", "seed", "children", "ref"]));
  const basis = computed(() => name.value ?? (typeof children.value === "string" ? children.value : "" as const));
  const t = computed(() => tone.value ?? avatarTone(basis.value));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: avatarFallbackRecipe,
    params: {
      tone: t.value
    },
    kind: "disc" as const,
    seed: seed.value ?? (basis.value || undefined),
    still: true
  }));
  return () => {
    return <AvatarPrimitive.Fallback data-slot="avatar-fallback" data-tone={t.value} ref={useMergedRef<HTMLSpanElement>(hostRef, ref.value)} {...domProps(node.value ? hostProps.value : {})} class={cn("relative isolate flex size-full items-center justify-center rounded-full font-hand text-sm font-bold text-ink forced-colors:outline-0! group-data-[size=sm]/avatar:text-xs group-data-[size=lg]/avatar:text-base group-data-[size=xl]/avatar:text-xl", className.value)} {...domProps(props.value)}>
      {node.value}
      {name.value && readSlot(_slots.default) === undefined ? <>
          <span aria-hidden="true">{initials(name.value)}</span>
          <span class="sr-only">{name.value}</span>
        </> : readSlot(_slots.default)}
    </AvatarPrimitive.Fallback>;
  };
});
const AvatarBadge = defineUi<UI.ComponentProps<"span"> & {
  status?: AvatarStatus;
  seed?: string | number;
}>("AvatarBadge", ["class", "status", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const status = computed(() => _props["status"] === undefined ? "marker" as const : _props["status"]);
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "status", "seed", "ref", "children"]));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: avatarBadgeRecipe,
    params: {
      status: status.value
    },
    kind: "dot" as const,
    seed: seed.value,
    still: true
  }));
  return () => {
    return <span data-slot="avatar-badge" data-status={status.value} ref={useMergedRef<HTMLSpanElement>(hostRef, ref.value)} {...domProps(node.value ? hostProps.value : {})} class={cn("absolute end-0 bottom-0 z-10 isolate inline-flex items-center justify-center rounded-full text-ink select-none forced-colors:outline-0!", "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden", "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg:not(.absolute)]:size-2", "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg:not(.absolute)]:size-2", "group-data-[size=xl]/avatar:size-3.5 group-data-[size=xl]/avatar:[&>svg:not(.absolute)]:size-2.5", className.value)} {...domProps(props.value)}>
      {node.value}
      {readSlot(_slots.default)}
    </span>;
  };
});
const AvatarGroup = defineUi<UI.ComponentProps<"div">>("AvatarGroup", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="avatar-group" class={cn("group/avatar-group flex items-center *:data-[slot=avatar]:[--ll-avatar-ring:var(--ll-avatar-group-ring,var(--card))] [&>*+*]:-ms-1.5 has-data-[size=sm]:[&>*+*]:-ms-1 has-data-[size=lg]:[&>*+*]:-ms-2 has-data-[size=xl]:[&>*+*]:-ms-3.5", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const AvatarGroupCount = defineUi<UI.ComponentProps<"div"> & {
  seed?: string | number;
}>("AvatarGroupCount", ["class", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "seed", "ref", "children"]));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: avatarCountRecipe,
    params: {},
    kind: "disc" as const,
    seed: seed.value,
    still: true
  }));
  return () => {
    return <div data-slot="avatar-group-count" ref={useMergedRef<HTMLDivElement>(hostRef, ref.value)} {...domProps(node.value ? hostProps.value : {})} class={cn("relative isolate flex size-8 shrink-0 items-center justify-center rounded-full font-hand text-sm font-bold text-ink-soft [--ll-avatar-ring:var(--ll-avatar-group-ring,var(--card))] forced-colors:outline-0!", CUT, "group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 group-has-data-[size=xl]/avatar-group:size-14 group-has-data-[size=sm]/avatar-group:text-xs [&>svg:not(.absolute)]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg:not(.absolute)]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg:not(.absolute)]:size-3", className.value)} {...domProps(props.value)}>
      {node.value}
      {readSlot(_slots.default)}
    </div>;
  };
});
export { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount };
