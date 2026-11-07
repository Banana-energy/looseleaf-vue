// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { DropdownMenu as DropdownMenuPrimitive } from "@/lib/primitives";
import { Icon } from "@/components/ui/icon";
import { Kbd } from "@/components/ui/kbd";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { Separator } from "@/components/ui/separator";
import { useInkScope } from "@/lib/ink/vue";
import { MENU_CHOICE_ITEM, MENU_INDICATOR, MENU_ITEM, MENU_KEYCAP, MENU_LABEL, MENU_MARK, MENU_SEPARATOR, MENU_SHORTCUT, MENU_SUB_TRIGGER, menuContentClass, menuViewportClass, parseShortcut, splitMenuClass } from "@/lib/menu-styles";
import { cn } from "@/lib/utils";
type PaperLook = Pick<PaperProps, "stock" | "edge" | "tilt" | "tape" | "seed">;
const DropdownMenu = defineUi<UI.ComponentProps<typeof DropdownMenuPrimitive.Root>>("DropdownMenu", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...domProps(props.value)}>{_slots.default?.()}</DropdownMenuPrimitive.Root>;
  };
});
const DropdownMenuPortal = defineUi<UI.ComponentProps<typeof DropdownMenuPrimitive.Portal>>("DropdownMenuPortal", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...domProps(props.value)}>{_slots.default?.()}</DropdownMenuPrimitive.Portal>;
  };
});
const DropdownMenuTrigger = defineUi<UI.ComponentProps<typeof DropdownMenuPrimitive.Trigger>>("DropdownMenuTrigger", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...domProps(props.value)}>{_slots.default?.()}</DropdownMenuPrimitive.Trigger>;
  };
});
const DropdownMenuContent = defineUi<UI.ComponentProps<typeof DropdownMenuPrimitive.Content> & PaperLook>("DropdownMenuContent", ["class", "sideOffset", "stock", "edge", "tilt", "tape", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const sideOffset = computed(() => _props["sideOffset"] === undefined ? 6 : _props["sideOffset"]);
  const stock = computed(() => _props["stock"] === undefined ? "slip" as const : _props["stock"]);
  const edge = computed(() => _props["edge"]);
  const tilt = computed(() => _props["tilt"] === undefined ? true : _props["tilt"]);
  const tape = computed(() => _props["tape"]);
  const seed = computed(() => _props["seed"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "sideOffset", "stock", "edge", "tilt", "tape", "seed", "children"]));
  const scope = useInkScope();
  const split = computed(() => splitMenuClass(className.value));
  return () => {
    return <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content asChild sideOffset={sideOffset.value} {...domProps(props.value)}>
        <Paper data-slot="dropdown-menu-content" stock={stock.value} edge={edge.value} tilt={tilt.value} tape={tape.value} rules="none" seed={seed.value} {...domProps(scope.value)} class={cn(menuContentClass("dropdown-menu"), split.value.content)}>
          <div data-slot="dropdown-menu-viewport" class={menuViewportClass("dropdown-menu", split.value.viewport)}>
            {readSlot(_slots.default)}
          </div>
        </Paper>
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>;
  };
});
const DropdownMenuGroup = defineUi<UI.ComponentProps<typeof DropdownMenuPrimitive.Group>>("DropdownMenuGroup", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...domProps(props.value)}>{_slots.default?.()}</DropdownMenuPrimitive.Group>;
  };
});
const DropdownMenuItem = defineUi<UI.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}>("DropdownMenuItem", ["class", "inset", "variant"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const inset = computed(() => _props["inset"]);
  const variant = computed(() => _props["variant"] === undefined ? "default" as const : _props["variant"]);
  const props = computed(() => omitProps(_props, ["class", "inset", "variant"]));
  return () => {
    return <DropdownMenuPrimitive.Item data-slot="dropdown-menu-item" data-inset={inset.value} data-variant={variant.value} class={cn(MENU_ITEM, className.value)} {...domProps(props.value)}>{_slots.default?.()}</DropdownMenuPrimitive.Item>;
  };
});
const DropdownMenuCheckboxItem = defineUi<UI.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>>("DropdownMenuCheckboxItem", ["class", "checked"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const checked = computed(() => _props["checked"]);
  const props = computed(() => omitProps(_props, ["class", "children", "checked"]));
  return () => {
    return <DropdownMenuPrimitive.CheckboxItem data-slot="dropdown-menu-checkbox-item" class={cn(MENU_CHOICE_ITEM, className.value)} checked={checked.value} {...domProps(props.value)}>
      <span data-slot="dropdown-menu-item-indicator" class={MENU_INDICATOR}>
        <Icon name="square" size={16} class="absolute text-pencil-mark forced-colors:text-[CanvasText]" />
        <DropdownMenuPrimitive.ItemIndicator class={MENU_MARK}>
          <Icon name="check" size={22} class="-translate-y-px" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {readSlot(_slots.default)}
    </DropdownMenuPrimitive.CheckboxItem>;
  };
});
const DropdownMenuRadioGroup = defineUi<UI.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>>("DropdownMenuRadioGroup", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...domProps(props.value)}>{_slots.default?.()}</DropdownMenuPrimitive.RadioGroup>;
  };
});
const DropdownMenuRadioItem = defineUi<UI.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>>("DropdownMenuRadioItem", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "children"]));
  return () => {
    return <DropdownMenuPrimitive.RadioItem data-slot="dropdown-menu-radio-item" class={cn(MENU_CHOICE_ITEM, className.value)} {...domProps(props.value)}>
      <span data-slot="dropdown-menu-item-indicator" class={MENU_INDICATOR}>
        <Icon name="circle" size={16} class="absolute text-pencil-mark forced-colors:text-[CanvasText]" />
        <DropdownMenuPrimitive.ItemIndicator class={MENU_MARK}>
          <Icon name="dot" size={26} />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {readSlot(_slots.default)}
    </DropdownMenuPrimitive.RadioItem>;
  };
});
const DropdownMenuLabel = defineUi<UI.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}>("DropdownMenuLabel", ["class", "inset"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const inset = computed(() => _props["inset"]);
  const props = computed(() => omitProps(_props, ["class", "inset"]));
  return () => {
    return <DropdownMenuPrimitive.Label data-slot="dropdown-menu-label" data-inset={inset.value} class={cn(MENU_LABEL, className.value)} {...domProps(props.value)}>{_slots.default?.()}</DropdownMenuPrimitive.Label>;
  };
});
const DropdownMenuSeparator = defineUi<UI.ComponentProps<typeof DropdownMenuPrimitive.Separator>>("DropdownMenuSeparator", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <DropdownMenuPrimitive.Separator asChild {...domProps(props.value)}>
      <Separator data-slot="dropdown-menu-separator" class={cn(MENU_SEPARATOR, className.value)} />
    </DropdownMenuPrimitive.Separator>;
  };
});
const DropdownMenuShortcut = defineUi<UI.ComponentProps<"span">>("DropdownMenuShortcut", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "children"]));
  const keys = computed(() => typeof children.value === "string" ? parseShortcut(children.value) : null);
  return () => {
    return <span data-slot="dropdown-menu-shortcut" class={cn(MENU_SHORTCUT, className.value)} {...domProps(props.value)}>
      {keys.value ? keys.value.map((k, i) => <Kbd key={i} class={MENU_KEYCAP}>{"icon" in k ? <Icon name={k.icon} label={k.label} /> : k.text}</Kbd>) : readSlot(_slots.default)}
    </span>;
  };
});
const DropdownMenuSub = defineUi<UI.ComponentProps<typeof DropdownMenuPrimitive.Sub>>("DropdownMenuSub", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...domProps(props.value)}>{_slots.default?.()}</DropdownMenuPrimitive.Sub>;
  };
});
const DropdownMenuSubTrigger = defineUi<UI.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}>("DropdownMenuSubTrigger", ["class", "inset"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const inset = computed(() => _props["inset"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "inset", "children"]));
  return () => {
    return <DropdownMenuPrimitive.SubTrigger data-slot="dropdown-menu-sub-trigger" data-inset={inset.value} class={cn(MENU_SUB_TRIGGER, className.value)} {...domProps(props.value)}>
      {readSlot(_slots.default)}
      <Icon name="chevron-right" size={16} class="ms-auto" />
    </DropdownMenuPrimitive.SubTrigger>;
  };
});
const DropdownMenuSubContent = defineUi<UI.ComponentProps<typeof DropdownMenuPrimitive.SubContent> & PaperLook>("DropdownMenuSubContent", ["class", "alignOffset", "stock", "edge", "tilt", "tape", "seed"], (_props, {
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
    return <DropdownMenuPrimitive.SubContent asChild alignOffset={alignOffset.value} {...domProps(props.value)}>
      <Paper data-slot="dropdown-menu-sub-content" stock={stock.value} edge={edge.value} tilt={tilt.value} tape={tape.value} rules="none" seed={seed.value} {...domProps(scope.value)} class={cn(menuContentClass("dropdown-menu"), split.value.content)}>
        <div data-slot="dropdown-menu-viewport" class={menuViewportClass("dropdown-menu", split.value.viewport)}>
          {readSlot(_slots.default)}
        </div>
      </Paper>
    </DropdownMenuPrimitive.SubContent>;
  };
});
export { DropdownMenu, DropdownMenuPortal, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent };
