// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Menubar as MenubarPrimitive } from "@/lib/primitives";
import { Icon } from "@/components/ui/icon";
import { Kbd } from "@/components/ui/kbd";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { Separator } from "@/components/ui/separator";
import { useInk, useInkScope, useMergedRef } from "@/lib/ink/vue";
import { menubarRecipe } from "@/lib/ink/recipes/menubar-ink";
import { MENU_CHOICE_ITEM, MENU_INDICATOR, MENU_ITEM, MENU_KEYCAP, MENU_LABEL, MENU_MARK, MENU_SEPARATOR, MENU_SHORTCUT, MENU_SUB_TRIGGER, menuContentClass, menuViewportClass, parseShortcut, splitMenuClass } from "@/lib/menu-styles";
import { cn } from "@/lib/utils";
type PaperLook = Pick<PaperProps, "stock" | "edge" | "tilt" | "tape" | "seed">;
const Menubar = defineUi<UI.ComponentProps<typeof MenubarPrimitive.Root> & {
  seed?: string | number;
}>("Menubar", ["class", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const seed = computed(() => _props["seed"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "seed", "children", "ref"]));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: menubarRecipe,
    params: {},
    kind: "bar" as const,
    seed: seed.value,
    still: true
  }));
  return () => {
    return <MenubarPrimitive.Root data-slot="menubar" ref={useMergedRef<HTMLDivElement>(hostRef, ref.value)} {...domProps(hostProps.value)} class={cn("relative isolate flex h-10 items-center gap-1 px-2 compact:h-9 calm:h-8", className.value)} {...domProps(props.value)}>
      {node.value}
      {readSlot(_slots.default)}
    </MenubarPrimitive.Root>;
  };
});
const MenubarMenu = defineUi<UI.ComponentProps<typeof MenubarPrimitive.Menu>>("MenubarMenu", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <MenubarPrimitive.Menu data-slot="menubar-menu" {...domProps(props.value)}>{_slots.default?.()}</MenubarPrimitive.Menu>;
  };
});
const MenubarGroup = defineUi<UI.ComponentProps<typeof MenubarPrimitive.Group>>("MenubarGroup", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <MenubarPrimitive.Group data-slot="menubar-group" {...domProps(props.value)}>{_slots.default?.()}</MenubarPrimitive.Group>;
  };
});
const MenubarPortal = defineUi<UI.ComponentProps<typeof MenubarPrimitive.Portal>>("MenubarPortal", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <MenubarPrimitive.Portal data-slot="menubar-portal" {...domProps(props.value)}>{_slots.default?.()}</MenubarPrimitive.Portal>;
  };
});
const MenubarRadioGroup = defineUi<UI.ComponentProps<typeof MenubarPrimitive.RadioGroup>>("MenubarRadioGroup", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...domProps(props.value)}>{_slots.default?.()}</MenubarPrimitive.RadioGroup>;
  };
});
const MenubarTrigger = defineUi<UI.ComponentProps<typeof MenubarPrimitive.Trigger>>("MenubarTrigger", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <MenubarPrimitive.Trigger data-slot="menubar-trigger" class={cn("flex min-h-7 items-center px-3 py-0.5 font-hand text-base leading-6 font-bold select-none hover:ll-swipe focus:ll-swipe data-[state=open]:ll-swipe", "forced-colors:[&:is(:hover,:focus,[data-state=open])]:bg-[color:Highlight]! forced-colors:[&:is(:hover,:focus,[data-state=open])]:text-[color:HighlightText]!", "calm:px-2.5 calm:text-[15px]", className.value)} {...domProps(props.value)}>{_slots.default?.()}</MenubarPrimitive.Trigger>;
  };
});
const MenubarContent = defineUi<UI.ComponentProps<typeof MenubarPrimitive.Content> & PaperLook>("MenubarContent", ["class", "align", "alignOffset", "sideOffset", "stock", "edge", "tilt", "tape", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const align = computed(() => _props["align"] === undefined ? "start" as const : _props["align"]);
  const alignOffset = computed(() => _props["alignOffset"] === undefined ? -4 : _props["alignOffset"]);
  const sideOffset = computed(() => _props["sideOffset"] === undefined ? 8 : _props["sideOffset"]);
  const stock = computed(() => _props["stock"] === undefined ? "slip" as const : _props["stock"]);
  const edge = computed(() => _props["edge"]);
  const tilt = computed(() => _props["tilt"] === undefined ? true : _props["tilt"]);
  const tape = computed(() => _props["tape"]);
  const seed = computed(() => _props["seed"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "align", "alignOffset", "sideOffset", "stock", "edge", "tilt", "tape", "seed", "children"]));
  const scope = useInkScope();
  const split = computed(() => splitMenuClass(className.value));
  return () => {
    return <MenubarPortal>
      <MenubarPrimitive.Content asChild align={align.value} alignOffset={alignOffset.value} sideOffset={sideOffset.value} {...domProps(props.value)}>
        <Paper data-slot="menubar-content" stock={stock.value} edge={edge.value} tilt={tilt.value} tape={tape.value} rules="none" seed={seed.value} {...domProps(scope.value)} class={cn(menuContentClass("menubar"), "min-w-48", split.value.content)}>
          <div data-slot="menubar-viewport" class={menuViewportClass("menubar", split.value.viewport)}>
            {readSlot(_slots.default)}
          </div>
        </Paper>
      </MenubarPrimitive.Content>
    </MenubarPortal>;
  };
});
const MenubarItem = defineUi<UI.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}>("MenubarItem", ["class", "inset", "variant"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const inset = computed(() => _props["inset"]);
  const variant = computed(() => _props["variant"] === undefined ? "default" as const : _props["variant"]);
  const props = computed(() => omitProps(_props, ["class", "inset", "variant"]));
  return () => {
    return <MenubarPrimitive.Item data-slot="menubar-item" data-inset={inset.value} data-variant={variant.value} class={cn(MENU_ITEM, className.value)} {...domProps(props.value)}>{_slots.default?.()}</MenubarPrimitive.Item>;
  };
});
const MenubarCheckboxItem = defineUi<UI.ComponentProps<typeof MenubarPrimitive.CheckboxItem>>("MenubarCheckboxItem", ["class", "checked"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const checked = computed(() => _props["checked"]);
  const props = computed(() => omitProps(_props, ["class", "children", "checked"]));
  return () => {
    return <MenubarPrimitive.CheckboxItem data-slot="menubar-checkbox-item" class={cn(MENU_CHOICE_ITEM, className.value)} checked={checked.value} {...domProps(props.value)}>
      <span data-slot="menubar-item-indicator" class={MENU_INDICATOR}>
        <Icon name="square" size={16} class="absolute text-pencil-mark forced-colors:text-[CanvasText]" />
        <MenubarPrimitive.ItemIndicator class={MENU_MARK}>
          <Icon name="check" size={22} class="-translate-y-px" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {readSlot(_slots.default)}
    </MenubarPrimitive.CheckboxItem>;
  };
});
const MenubarRadioItem = defineUi<UI.ComponentProps<typeof MenubarPrimitive.RadioItem>>("MenubarRadioItem", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "children"]));
  return () => {
    return <MenubarPrimitive.RadioItem data-slot="menubar-radio-item" class={cn(MENU_CHOICE_ITEM, className.value)} {...domProps(props.value)}>
      <span data-slot="menubar-item-indicator" class={MENU_INDICATOR}>
        <Icon name="circle" size={16} class="absolute text-pencil-mark forced-colors:text-[CanvasText]" />
        <MenubarPrimitive.ItemIndicator class={MENU_MARK}>
          <Icon name="dot" size={26} />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {readSlot(_slots.default)}
    </MenubarPrimitive.RadioItem>;
  };
});
const MenubarLabel = defineUi<UI.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean;
}>("MenubarLabel", ["class", "inset"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const inset = computed(() => _props["inset"]);
  const props = computed(() => omitProps(_props, ["class", "inset"]));
  return () => {
    return <MenubarPrimitive.Label data-slot="menubar-label" data-inset={inset.value} class={cn(MENU_LABEL, className.value)} {...domProps(props.value)}>{_slots.default?.()}</MenubarPrimitive.Label>;
  };
});
const MenubarSeparator = defineUi<UI.ComponentProps<typeof MenubarPrimitive.Separator>>("MenubarSeparator", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <MenubarPrimitive.Separator asChild {...domProps(props.value)}>
      <Separator data-slot="menubar-separator" class={cn(MENU_SEPARATOR, className.value)} />
    </MenubarPrimitive.Separator>;
  };
});
const MenubarShortcut = defineUi<UI.ComponentProps<"span">>("MenubarShortcut", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "children"]));
  const keys = computed(() => typeof children.value === "string" ? parseShortcut(children.value) : null);
  return () => {
    return <span data-slot="menubar-shortcut" class={cn(MENU_SHORTCUT, className.value)} {...domProps(props.value)}>
      {keys.value ? keys.value.map((k, i) => <Kbd key={i} class={MENU_KEYCAP}>
              {"icon" in k ? <Icon name={k.icon} label={k.label} /> : k.text}
            </Kbd>) : readSlot(_slots.default)}
    </span>;
  };
});
const MenubarSub = defineUi<UI.ComponentProps<typeof MenubarPrimitive.Sub>>("MenubarSub", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  return () => {
    return <MenubarPrimitive.Sub data-slot="menubar-sub" {...domProps(props.value)}>{_slots.default?.()}</MenubarPrimitive.Sub>;
  };
});
const MenubarSubTrigger = defineUi<UI.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean;
}>("MenubarSubTrigger", ["class", "inset"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const inset = computed(() => _props["inset"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "inset", "children"]));
  return () => {
    return <MenubarPrimitive.SubTrigger data-slot="menubar-sub-trigger" data-inset={inset.value} class={cn(MENU_SUB_TRIGGER, className.value)} {...domProps(props.value)}>
      {readSlot(_slots.default)}
      <Icon name="chevron-right" size={16} class="ms-auto" />
    </MenubarPrimitive.SubTrigger>;
  };
});
const MenubarSubContent = defineUi<UI.ComponentProps<typeof MenubarPrimitive.SubContent> & PaperLook>("MenubarSubContent", ["class", "alignOffset", "stock", "edge", "tilt", "tape", "seed"], (_props, {
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
    return <MenubarPrimitive.SubContent asChild alignOffset={alignOffset.value} {...domProps(props.value)}>
      <Paper data-slot="menubar-sub-content" stock={stock.value} edge={edge.value} tilt={tilt.value} tape={tape.value} rules="none" seed={seed.value} {...domProps(scope.value)} class={cn(menuContentClass("menubar"), split.value.content)}>
        <div data-slot="menubar-viewport" class={menuViewportClass("menubar", split.value.viewport)}>
          {readSlot(_slots.default)}
        </div>
      </Paper>
    </MenubarPrimitive.SubContent>;
  };
});
export { Menubar, MenubarPortal, MenubarMenu, MenubarTrigger, MenubarContent, MenubarGroup, MenubarSeparator, MenubarLabel, MenubarItem, MenubarShortcut, MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem, MenubarSub, MenubarSubTrigger, MenubarSubContent };
