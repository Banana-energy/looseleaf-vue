// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { ContextMenu as ContextMenuPrimitive } from "@/lib/primitives";
import { Icon } from "@/components/ui/icon";
import { Kbd } from "@/components/ui/kbd";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { Separator } from "@/components/ui/separator";
import { useInkScope } from "@/lib/ink/vue";
import { MENU_CHOICE_ITEM, MENU_INDICATOR, MENU_ITEM, MENU_KEYCAP, MENU_LABEL, MENU_MARK, MENU_SEPARATOR, MENU_SHORTCUT, MENU_SUB_TRIGGER, menuContentClass, menuViewportClass, parseShortcut, splitMenuClass } from "@/lib/menu-styles";
import { cn } from "@/lib/utils";
type PaperLook = Pick<PaperProps, "stock" | "edge" | "tilt" | "tape" | "seed">;
const ContextMenu = defineUi<UI.ComponentProps<typeof ContextMenuPrimitive.Root>>("ContextMenu", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <ContextMenuPrimitive.Root data-slot="context-menu" {...domProps(props.value)}>{_slots.default?.()}</ContextMenuPrimitive.Root>;
  };
});
const ContextMenuTrigger = defineUi<UI.ComponentProps<typeof ContextMenuPrimitive.Trigger>>("ContextMenuTrigger", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...domProps(props.value)}>{_slots.default?.()}</ContextMenuPrimitive.Trigger>;
  };
});
const ContextMenuGroup = defineUi<UI.ComponentProps<typeof ContextMenuPrimitive.Group>>("ContextMenuGroup", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <ContextMenuPrimitive.Group data-slot="context-menu-group" {...domProps(props.value)}>{_slots.default?.()}</ContextMenuPrimitive.Group>;
  };
});
const ContextMenuPortal = defineUi<UI.ComponentProps<typeof ContextMenuPrimitive.Portal>>("ContextMenuPortal", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...domProps(props.value)}>{_slots.default?.()}</ContextMenuPrimitive.Portal>;
  };
});
const ContextMenuSub = defineUi<UI.ComponentProps<typeof ContextMenuPrimitive.Sub>>("ContextMenuSub", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...domProps(props.value)}>{_slots.default?.()}</ContextMenuPrimitive.Sub>;
  };
});
const ContextMenuRadioGroup = defineUi<UI.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>>("ContextMenuRadioGroup", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <ContextMenuPrimitive.RadioGroup data-slot="context-menu-radio-group" {...domProps(props.value)}>{_slots.default?.()}</ContextMenuPrimitive.RadioGroup>;
  };
});
const ContextMenuSubTrigger = defineUi<UI.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}>("ContextMenuSubTrigger", ["class", "inset"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const inset = computed(() => _props["inset"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "inset", "children"]));
  return () => {
    return <ContextMenuPrimitive.SubTrigger data-slot="context-menu-sub-trigger" data-inset={inset.value} class={cn(MENU_SUB_TRIGGER, className.value)} {...domProps(props.value)}>
      {readSlot(_slots.default)}
      <Icon name="chevron-right" size={16} class="ms-auto" />
    </ContextMenuPrimitive.SubTrigger>;
  };
});
const ContextMenuSubContent = defineUi<UI.ComponentProps<typeof ContextMenuPrimitive.SubContent> & PaperLook>("ContextMenuSubContent", ["class", "alignOffset", "stock", "edge", "tilt", "tape", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const alignOffset = computed(() => _props["alignOffset"] === undefined ? -4 : _props["alignOffset"]);
  const stock = computed(() => _props["stock"] === undefined ? "slip" as const : _props["stock"]);
  const edge = computed(() => _props["edge"]);
  const tilt = computed(() => _props["tilt"] === undefined ? true : _props["tilt"]);
  const tape = computed(() => _props["tape"]);
  const seed = computed(() => _props["seed"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "alignOffset", "stock", "edge", "tilt", "tape", "seed", "children"]));
  const scope = useInkScope();
  const split = computed(() => splitMenuClass(className.value));
  return () => {
    return <ContextMenuPrimitive.SubContent asChild alignOffset={alignOffset.value} {...domProps(props.value)}>
      <Paper data-slot="context-menu-sub-content" stock={stock.value} edge={edge.value} tilt={tilt.value} tape={tape.value} rules="none" seed={seed.value} {...domProps(scope.value)} class={cn(menuContentClass("context-menu"), split.value.content)}>
        <div data-slot="context-menu-viewport" class={menuViewportClass("context-menu", split.value.viewport)}>
          {readSlot(_slots.default)}
        </div>
      </Paper>
    </ContextMenuPrimitive.SubContent>;
  };
});
const ContextMenuContent = defineUi<UI.ComponentProps<typeof ContextMenuPrimitive.Content> & PaperLook>("ContextMenuContent", ["class", "stock", "edge", "tilt", "tape", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const stock = computed(() => _props["stock"] === undefined ? "slip" as const : _props["stock"]);
  const edge = computed(() => _props["edge"]);
  const tilt = computed(() => _props["tilt"] === undefined ? true : _props["tilt"]);
  const tape = computed(() => _props["tape"]);
  const seed = computed(() => _props["seed"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "stock", "edge", "tilt", "tape", "seed", "children"]));
  const scope = useInkScope();
  const split = computed(() => splitMenuClass(className.value));
  return () => {
    return <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content asChild {...domProps(props.value)}>
        <Paper data-slot="context-menu-content" stock={stock.value} edge={edge.value} tilt={tilt.value} tape={tape.value} rules="none" seed={seed.value} {...domProps(scope.value)} class={cn(menuContentClass("context-menu"), "data-[state=open]:animate-pop", split.value.content)}>
          <div data-slot="context-menu-viewport" class={menuViewportClass("context-menu", split.value.viewport)}>
            {readSlot(_slots.default)}
          </div>
        </Paper>
      </ContextMenuPrimitive.Content>
    </ContextMenuPrimitive.Portal>;
  };
});
const ContextMenuItem = defineUi<UI.ComponentProps<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}>("ContextMenuItem", ["class", "inset", "variant"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const inset = computed(() => _props["inset"]);
  const variant = computed(() => _props["variant"] === undefined ? "default" as const : _props["variant"]);
  const props = computed(() => omitProps(_props, ["class", "inset", "variant"]));
  return () => {
    return <ContextMenuPrimitive.Item data-slot="context-menu-item" data-inset={inset.value} data-variant={variant.value} class={cn(MENU_ITEM, className.value)} {...domProps(props.value)}>{_slots.default?.()}</ContextMenuPrimitive.Item>;
  };
});
const ContextMenuCheckboxItem = defineUi<UI.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>>("ContextMenuCheckboxItem", ["class", "checked"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const checked = computed(() => _props["checked"]);
  const props = computed(() => omitProps(_props, ["class", "children", "checked"]));
  return () => {
    return <ContextMenuPrimitive.CheckboxItem data-slot="context-menu-checkbox-item" class={cn(MENU_CHOICE_ITEM, className.value)} checked={checked.value} {...domProps(props.value)}>
      <span data-slot="context-menu-item-indicator" class={MENU_INDICATOR}>
        <Icon name="square" size={16} class="absolute text-pencil-mark forced-colors:text-[CanvasText]" />
        <ContextMenuPrimitive.ItemIndicator class={MENU_MARK}>
          <Icon name="check" size={22} class="-translate-y-px" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {readSlot(_slots.default)}
    </ContextMenuPrimitive.CheckboxItem>;
  };
});
const ContextMenuRadioItem = defineUi<UI.ComponentProps<typeof ContextMenuPrimitive.RadioItem>>("ContextMenuRadioItem", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "children"]));
  return () => {
    return <ContextMenuPrimitive.RadioItem data-slot="context-menu-radio-item" class={cn(MENU_CHOICE_ITEM, className.value)} {...domProps(props.value)}>
      <span data-slot="context-menu-item-indicator" class={MENU_INDICATOR}>
        <Icon name="circle" size={16} class="absolute text-pencil-mark forced-colors:text-[CanvasText]" />
        <ContextMenuPrimitive.ItemIndicator class={MENU_MARK}>
          <Icon name="dot" size={26} />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {readSlot(_slots.default)}
    </ContextMenuPrimitive.RadioItem>;
  };
});
const ContextMenuLabel = defineUi<UI.ComponentProps<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean;
}>("ContextMenuLabel", ["class", "inset"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const inset = computed(() => _props["inset"]);
  const props = computed(() => omitProps(_props, ["class", "inset"]));
  return () => {
    return <ContextMenuPrimitive.Label data-slot="context-menu-label" data-inset={inset.value} class={cn(MENU_LABEL, className.value)} {...domProps(props.value)}>{_slots.default?.()}</ContextMenuPrimitive.Label>;
  };
});
const ContextMenuSeparator = defineUi<UI.ComponentProps<typeof ContextMenuPrimitive.Separator>>("ContextMenuSeparator", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <ContextMenuPrimitive.Separator asChild {...domProps(props.value)}>
      <Separator data-slot="context-menu-separator" class={cn(MENU_SEPARATOR, className.value)} />
    </ContextMenuPrimitive.Separator>;
  };
});
const ContextMenuShortcut = defineUi<UI.ComponentProps<"span">>("ContextMenuShortcut", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "children"]));
  const keys = computed(() => typeof children.value === "string" ? parseShortcut(children.value) : null);
  return () => {
    return <span data-slot="context-menu-shortcut" class={cn(MENU_SHORTCUT, className.value)} {...domProps(props.value)}>
      {keys.value ? keys.value.map((k, i) => <Kbd key={i} class={MENU_KEYCAP}>
              {"icon" in k ? <Icon name={k.icon} label={k.label} /> : k.text}
            </Kbd>) : readSlot(_slots.default)}
    </span>;
  };
});
export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuCheckboxItem, ContextMenuRadioItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuShortcut, ContextMenuGroup, ContextMenuPortal, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuRadioGroup };
