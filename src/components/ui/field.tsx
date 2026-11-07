// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { cva, type VariantProps } from "class-variance-authority";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { fieldErrorRecipe } from "@/lib/ink/recipes/field-error-ink";
import { fieldChoiceRecipe } from "@/lib/ink/recipes/field-ink";
import { cn } from "@/lib/utils";
const FieldSet = defineUi<UI.ComponentProps<"fieldset">>("FieldSet", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <fieldset data-slot="field-set" class={cn("flex flex-col gap-6 calm:gap-4", "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3", className.value)} {...domProps(props.value)}>{_slots.default?.()}</fieldset>;
  };
});
const FieldLegend = defineUi<UI.ComponentProps<"legend"> & {
  variant?: "legend" | "label";
}>("FieldLegend", ["class", "variant"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const variant = computed(() => _props["variant"] === undefined ? "legend" as const : _props["variant"]);
  const props = computed(() => omitProps(_props, ["class", "variant"]));
  return () => {
    return <legend data-slot="field-legend" data-variant={variant.value} class={cn("mb-3 font-bold", "data-[variant=legend]:font-script data-[variant=legend]:text-[1.6rem] data-[variant=legend]:leading-none", "data-[variant=label]:font-hand data-[variant=label]:text-[15px]", className.value)} {...domProps(props.value)}>{_slots.default?.()}</legend>;
  };
});
const FieldGroup = defineUi<UI.ComponentProps<"div">>("FieldGroup", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="field-group" class={cn("group/field-group @container/field-group flex w-full flex-col gap-7 calm:gap-5 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const fieldVariants = cva("group/field flex w-full gap-3 data-[invalid=true]:text-destructive", {
  variants: {
    orientation: {
      vertical: ["flex-col [&>*:not([data-slot=toggle-group])]:w-full [&>.sr-only]:w-auto"],
      horizontal: ["flex-row items-center", "[&>[data-slot=field-label]]:flex-auto", "has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"],
      responsive: ["flex-col @md/field-group:flex-row @md/field-group:items-center [&>*:not([data-slot=toggle-group])]:w-full @md/field-group:[&>*:not([data-slot=toggle-group])]:w-auto [&>.sr-only]:w-auto", "@md/field-group:[&>[data-slot=field-label]]:flex-auto", "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"]
    }
  },
  defaultVariants: {
    orientation: "vertical" as const
  }
});
const Field = defineUi<UI.ComponentProps<"div"> & VariantProps<typeof fieldVariants>>("Field", ["class", "orientation"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const orientation = computed(() => _props["orientation"] === undefined ? "vertical" as const : _props["orientation"]);
  const props = computed(() => omitProps(_props, ["class", "orientation"]));
  return () => {
    return <div role="group" data-slot="field" data-orientation={orientation.value} class={cn(fieldVariants({
      orientation: orientation.value
    }), className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const FieldContent = defineUi<UI.ComponentProps<"div">>("FieldContent", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="field-content" class={cn("group/field-content flex flex-1 flex-col gap-1.5 leading-snug", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const FieldLabel = defineUi<UI.ComponentProps<typeof Label> & {
  card?: boolean;
}>("FieldLabel", ["class", "card", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const card = computed(() => _props["card"]);
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "children", "card", "seed", "ref"]));
  const isCard = computed(() => card.value ?? Children.toArray(children.value).some(c => isValidElement(c) && c.type === Field));
  const content = computed(() => Children.map(children.value, c => isValidElement<{
    role?: string;
  }>(c) && c.type === Field ? cloneElement(c, {
    role: c.props.role ?? "none"
  }) : c));
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: fieldChoiceRecipe,
    params: {},
    kind: "card" as const,
    seed: seed.value,
    still: true
  }));
  return () => {
    return <Label data-slot="field-label" ref={useMergedRef<HTMLLabelElement>(isCard.value ? hostRef : undefined, ref.value as UI.Ref<HTMLLabelElement> | undefined)} {...domProps(isCard.value ? hostProps.value : {})} class={cn("group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:text-pencil-text", "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:outline-hidden [&>*]:data-[slot=field]:p-4", "has-data-[state=checked]:[&>svg>[data-layer=checked]]:visible has-data-[state=checked]:[&>svg>[data-layer=checked]]:scale-100 has-data-[state=checked]:[&>svg>[data-layer=checked]]:rotate-0 has-data-[state=checked]:[&>svg>[data-layer=checked]]:opacity-100", isCard.value && "cursor-pointer forced-colors:has-data-[state=checked]:bg-[Highlight] forced-colors:has-data-[state=checked]:text-[HighlightText]", className.value)} {...domProps(props.value)}>
      {isCard.value ? node.value : null}
      {content.value}
    </Label>;
  };
});
const FieldTitle = defineUi<UI.ComponentProps<"div">>("FieldTitle", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="field-label" class={cn("flex w-fit items-center gap-2 font-hand text-[15px] leading-snug font-bold group-data-[disabled=true]/field:text-pencil-text", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const FieldDescription = defineUi<UI.ComponentProps<"p">>("FieldDescription", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <p data-slot="field-description" class={cn("text-sm leading-normal font-normal text-muted-foreground group-has-[[data-orientation=horizontal]]/field:text-balance", "last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5", "[&>a]:text-link [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-link-hover", className.value)} {...domProps(props.value)}>{_slots.default?.()}</p>;
  };
});
const FieldSeparator = defineUi<UI.ComponentProps<"div"> & {
  children?: UI.ReactNode;
}>("FieldSeparator", ["class"], (_props, {
  slots: _slots
}) => {
  const children = renderValue(() => readSlot(_slots.default));
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["children", "class"]));
  return () => {
    return <div data-slot="field-separator" data-content={!!readSlot(_slots.default)} class={cn("relative -my-2 flex h-5 items-center text-sm group-data-[variant=outline]/field-group:-mb-2", className.value)} {...domProps(props.value)}>
      {readSlot(_slots.default) ? <Separator data-slot="field-separator-content">{readSlot(_slots.default)}</Separator> : <Separator />}
    </div>;
  };
});
const FieldError = defineUi<UI.ComponentProps<"div"> & {
  errors?: Array<{
    message?: string;
  } | undefined>;
  seed?: string | number;
}>("FieldError", ["class", "errors", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const errors = computed(() => _props["errors"]);
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "children", "errors", "seed", "ref"]));
  const content = renderValue(() => {
    if (children.value) {
      return children.value;
    }
    if (!errors.value?.length) {
      return null;
    }
    const uniqueErrors = [...new Map(errors.value.map(error => [error?.message, error])).values()];
    if (uniqueErrors?.length == 1) {
      return uniqueErrors[0]?.message;
    }
    return <ul class="ms-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map((error, index) => error?.message && <li key={index}>{error.message}</li>)}
      </ul>;
  });
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: fieldErrorRecipe,
    params: {},
    kind: "underline" as const,
    seed: seed.value,
    still: true
  }));
  const mergedRef = computed(() => useMergedRef<HTMLDivElement>(hostRef, ref.value));
  return () => {
    if (!content.value) {
      return null;
    }
    return <div role="alert" data-slot="field-error" ref={mergedRef.value} {...domProps(hostProps.value)} class={cn("relative isolate w-fit max-w-full pb-1 text-sm font-normal text-destructive outline-hidden forced-colors:underline forced-colors:decoration-wavy", className.value)} {...domProps(props.value)}>
      {node.value}
      {content.value}
    </div>;
  };
});
export { Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FieldLegend, FieldSeparator, FieldSet, FieldContent, FieldTitle };
