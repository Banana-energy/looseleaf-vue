// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
import { H2, H3, H4, Prose as TypedProse } from "@/components/ui/typography";
import { useAnchorHref } from "../core/router";
import { cx } from "./cx";
export interface AnchorHeadingProps extends Omit<UI.ComponentProps<"h2">, "id"> {
  id: string;
  level?: 2 | 3 | 4;
}
const HEADING = {
  2: H2,
  3: H3,
  4: H4
} as const;
const SIZE = {
  2: "text-3xl sm:text-[2rem]" as const,
  3: "text-2xl sm:text-[1.65rem]" as const,
  4: "text-lg" as const
} as const;
export const AnchorHeading = defineUi<AnchorHeadingProps>("AnchorHeading", ["id", "level", "class"], (_props, {
  slots: _slots
}) => {
  const id = computed(() => _props["id"]);
  const level = computed(() => _props["level"] === undefined ? 2 : _props["level"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["id", "level", "class", "children"]));
  const href = useAnchorHref(() => id.value);
  const Heading = computed(() => jsxTag(HEADING[level.value]));
  return () => {
    return <Heading.value id={id.value} tabindex={-1} data-level={level.value} class={cx("dk-heading group/heading outline-offset-4", SIZE[level.value], className.value)} {...domProps(props.value)}>
      <a href={href.value} class="dk-anchor decoration-marker decoration-2 underline-offset-4 hover:underline">
        {readSlot(_slots.default)}
        <Icon name="link" size={16} class="ms-2 inline-block align-baseline opacity-0 transition-opacity duration-(--ll-dur-hover) group-focus-within/heading:opacity-60 group-hover/heading:opacity-60" />
      </a>
    </Heading.value>;
  };
});
export interface SectionProps {
  id: string;
  title: string;
  level?: 2 | 3;
  description?: UI.VueNode;
  actions?: UI.VueNode;
  className?: string;
  children?: UI.VueNode;
}
export const Section = defineUi<SectionProps>("Section", ["id", "title", "level", "description", "actions", "class"], (_props, {
  slots: _slots
}) => {
  const id = computed(() => _props["id"]);
  const title = computed(() => _props["title"]);
  const level = computed(() => _props["level"] === undefined ? 2 : _props["level"]);
  const description = computed(() => _props["description"]);
  const actions = computed(() => _props["actions"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  return () => {
    return <section class={cx("dk-section flex min-w-0 flex-col gap-4", className.value)} aria-labelledby={id.value} data-level={level.value}>
      <div class="dk-section-head flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <AnchorHeading id={id.value} level={level.value}>
          {title.value}
        </AnchorHeading>
        {actions.value}
      </div>
      {description.value ? <p class="dk-section-desc max-w-prose text-muted-foreground">{description.value}</p> : null}
      {readSlot(_slots.default)}
    </section>;
  };
});
export const Prose = defineUi<UI.ComponentProps<"div">>("Prose", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <TypedProse class={cx("dk-prose", className.value)} {...domProps(props.value)}>{_slots.default?.()}</TypedProse>;
  };
});
