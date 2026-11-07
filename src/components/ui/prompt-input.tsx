// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, type ComputedRef, shallowRef, useId } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { TextareaControl } from "@/components/ui/textarea";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { promptInputBodyRecipe } from "@/lib/ink/recipes/prompt-input-ink";
import { cn } from "@/lib/utils";
type PromptInputStatus = "ready" | "submitted" | "streaming" | "error";
type PromptInputTrigger = string | {
  char: string;
  atStart?: boolean;
};
type PromptInputActiveTrigger = {
  char: string;
  query: string;
  from: number;
  to: number;
};
type PromptInputContextValue = {
  value: string;
  setValue: (value: string) => void;
  status: PromptInputStatus;
  busy: boolean;
  disabled: boolean;
  allowEmpty: boolean;
  lockWhileStreaming: boolean;
  submitOn: "enter" | "mod-enter";
  flight: number;
  textareaRef: UI.RefObject<HTMLTextAreaElement | null>;
  submit: () => void;
  stop: () => void;
  focus: () => void;
  trigger: PromptInputActiveTrigger | null;
  setCaret: (n: number) => void;
  replaceTrigger: (text: string, options?: {
    space?: boolean;
  }) => void;
  dismissTrigger: () => void;
  listId: string;
  list: HTMLElement | null;
  setList: (el: HTMLElement | null) => void;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  composing: UI.RefObject<boolean>;
};
const PromptInputContext = createContext<PromptInputContextValue | null>(null);
function usePromptInput(): ComputedRef<PromptInputContextValue> {
  const c = useContext(PromptInputContext);
  return computed(() => {
    if (!c.value) console.error("usePromptInput must be used inside <PromptInput>");
    return c.value;
  });
}
function detectTrigger(value: string, caret: number, triggers: readonly PromptInputTrigger[]): PromptInputActiveTrigger | null {
  if (!triggers.length || caret < 1 || caret > value.length) return null;
  let start = caret;
  while (start > 0 && !/\s/.test(value[start - 1])) start--;
  const word = value.slice(start, caret);
  for (const t of triggers) {
    const char = typeof t === "string" ? t : t.char;
    const atStart = typeof t === "string" ? false : !!t.atStart;
    if (char && word.startsWith(char) && (!atStart || start === 0)) return {
      char,
      query: word.slice(char.length),
      from: start,
      to: caret
    };
  }
  return null;
}
const KEYFRAMES = `
@keyframes ll-plane{0%{transform:none;opacity:1}46%{transform:translate(20px,-18px) rotate(-16deg) scale(.85);opacity:0}47%{transform:translate(-16px,12px) rotate(8deg) scale(.85);opacity:0}100%{transform:none;opacity:1}}
`;
type PromptInputProps = Omit<PaperProps, "as" | "onSubmit" | "children" | "ref"> & Omit<UI.ComponentProps<"form">, "onSubmit" | "className" | "style" | "children" | "ref" | "defaultValue"> & {
  ref?: UI.Ref<HTMLFormElement>;
  children?: UI.ReactNode;
  onSubmit?: (value: string, event: UI.FormEvent<HTMLFormElement>) => void;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  status?: PromptInputStatus;
  onStop?: () => void;
  disabled?: boolean;
  allowEmpty?: boolean;
  clearOnSubmit?: boolean;
  lockWhileStreaming?: boolean;
  submitOn?: "enter" | "mod-enter";
  triggers?: readonly PromptInputTrigger[];
  onTriggerChange?: (trigger: PromptInputActiveTrigger | null) => void;
};
const PromptInput = defineUi<PromptInputProps>("PromptInput", ["class", "onSubmit", "value", "defaultValue", "onValueChange", "status", "onStop", "disabled", "allowEmpty", "clearOnSubmit", "lockWhileStreaming", "submitOn", "triggers", "onTriggerChange", "stock", "seed"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const onSubmit = computed(() => _props["onSubmit"]);
  const valueProp = computed(() => _props["value"]);
  const defaultValue = computed(() => _props["defaultValue"] === undefined ? "" as const : _props["defaultValue"]);
  const onValueChange = computed(() => _props["onValueChange"]);
  const status = computed(() => _props["status"] === undefined ? "ready" as const : _props["status"]);
  const onStop = computed(() => _props["onStop"]);
  const disabled = computed(() => _props["disabled"] === undefined ? false : _props["disabled"]);
  const allowEmpty = computed(() => _props["allowEmpty"] === undefined ? false : _props["allowEmpty"]);
  const clearOnSubmit = computed(() => _props["clearOnSubmit"] === undefined ? true : _props["clearOnSubmit"]);
  const lockWhileStreaming = computed(() => _props["lockWhileStreaming"] === undefined ? false : _props["lockWhileStreaming"]);
  const submitOn = computed(() => _props["submitOn"] === undefined ? "enter" as const : _props["submitOn"]);
  const triggers = computed(() => _props["triggers"] === undefined ? [] : _props["triggers"]);
  const onTriggerChange = computed(() => _props["onTriggerChange"]);
  const stock = computed(() => _props["stock"] === undefined ? "napkin" as const : _props["stock"]);
  const seed = computed(() => _props["seed"]);
  const ref = computed(() => _props["ref"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "onSubmit", "value", "defaultValue", "onValueChange", "status", "onStop", "disabled", "allowEmpty", "clearOnSubmit", "lockWhileStreaming", "submitOn", "triggers", "onTriggerChange", "stock", "seed", "ref", "children"]));
  const controlled = computed(() => valueProp.value !== undefined);
  const inner = shallowRef(initialState(defaultValue.value));
  const setInner = stateSetter(inner);
  const value = computed(() => valueProp.value !== undefined ? valueProp.value : inner.value);
  const flight = shallowRef(initialState(0));
  const setFlight = stateSetter(flight);
  const caret = shallowRef(initialState(0));
  const setCaret = stateSetter(caret);
  const dismissed = shallowRef<{
    from: number;
    char: string;
  } | null>(initialState(null));
  const setDismissed = stateSetter(dismissed);
  const list = shallowRef<HTMLElement | null>(initialState(null));
  const setList = stateSetter(list);
  const activeId = shallowRef<string | null>(initialState(null));
  const setActiveId = stateSetter(activeId);
  const formRef = shallowRef<HTMLFormElement | null | null>(null);
  const textareaRef = shallowRef<HTMLTextAreaElement | null | null>(null);
  const composing = shallowRef(false);
  const pendingCaret = shallowRef<number | null | null>(null);
  const listId = useId();
  const busy = computed(() => status.value === "submitted" || status.value === "streaming");
  const setValue = (v: string) => {
    if (!controlled.value) setInner(v);
    onValueChange.value?.(v);
  };
  const found = computed(() => detectTrigger(value.value, caret.value, triggers.value));
  const trigger = computed(() => found.value && dismissed.value && dismissed.value.from === found.value.from && dismissed.value.char === found.value.char ? null : found.value);
  const lastTrigger = shallowRef<PromptInputActiveTrigger | null | null>(null);
  watchDependencies(() => {
    const prev = lastTrigger.value;
    const same = prev === trigger.value || prev && trigger.value && prev.char === trigger.value.char && prev.query === trigger.value.query && prev.from === trigger.value.from;
    lastTrigger.value = trigger.value;
    if (!same) onTriggerChange.value?.(trigger.value);
  }, () => [trigger.value, onTriggerChange.value], false);
  watchDependencies(() => {
    if (dismissed.value && (!found.value || found.value.from !== dismissed.value.from || found.value.char !== dismissed.value.char)) setDismissed(null);
  }, () => [found.value, dismissed.value], false);
  watchDependencies(() => {
    const pos = pendingCaret.value;
    const el = textareaRef.value;
    if (pos !== null && el) {
      pendingCaret.value = null;
      el.setSelectionRange(pos, pos);
      setCaret(pos);
    }
  }, undefined, true);
  const replaceTrigger = (text: string, options?: {
    space?: boolean;
  }) => {
    if (!trigger.value) return;
    const before = value.value.slice(0, trigger.value.from);
    const after = value.value.slice(trigger.value.to);
    const insert = text + (options?.space !== false && !after.startsWith(" ") ? " " as const : "" as const);
    pendingCaret.value = before.length + insert.length;
    setValue(before + insert + after);
    textareaRef.value?.focus();
  };
  const dismissTrigger = () => {
    if (trigger.value) setDismissed({
      from: trigger.value.from,
      char: trigger.value.char
    });
  };
  const focus = () => textareaRef.value?.focus();
  const submit = () => {
    if (disabled.value || busy.value) return;
    if (!allowEmpty.value && !value.value.trim()) return;
    formRef.value?.requestSubmit();
  };
  const stop = () => onStop.value?.();
  const ctx = computed<PromptInputContextValue>(() => ({
    value: value.value,
    setValue,
    status: status.value,
    busy: busy.value,
    disabled: disabled.value,
    allowEmpty: allowEmpty.value,
    lockWhileStreaming: lockWhileStreaming.value,
    submitOn: submitOn.value,
    flight: flight.value,
    textareaRef,
    submit,
    stop,
    focus,
    trigger: trigger.value,
    setCaret,
    replaceTrigger,
    dismissTrigger,
    listId,
    list: list.value,
    setList,
    activeId: activeId.value,
    setActiveId,
    composing
  }));
  const handleSubmit = computed(() => (e: SubmitEvent) => {
    e.preventDefault();
    if (disabled.value || busy.value) return;
    if (!allowEmpty.value && !value.value.trim()) return;
    onSubmit.value?.(value.value, e);
    if (!controlled.value && clearOnSubmit.value) setInner("");
    setFlight(f => f + 1);
    setCaret(0);
    textareaRef.value?.focus();
  });
  return () => {
    return <PromptInputContext.Provider value={ctx.value}>
      <style>
        {KEYFRAMES}
      </style>
      <Paper as="form" data-slot="prompt-input" data-status={status.value} data-disabled={disabled.value ? "" as const : undefined} stock={stock.value} seed={seed.value} ref={useMergedRef<HTMLElement>(formRef, ref.value as UI.Ref<HTMLElement> | undefined) as UI.Ref<HTMLElement>} class={cn("group/prompt-input relative flex w-full min-w-0 flex-col gap-1 px-5 py-3 font-hand text-foreground compact:px-4 compact:py-2.5 calm:px-3 calm:py-2", className.value)} onSubmit={handleSubmit.value as never} {...domProps(props.value as object)}>
        {readSlot(_slots.default)}
      </Paper>
    </PromptInputContext.Provider>;
  };
});
const PromptInputAttachments = defineUi<UI.ComponentProps<"div">>("PromptInputAttachments", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="prompt-input-attachments" class={cn("flex flex-wrap gap-3 px-1 pt-3 empty:hidden", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const PromptInputBody = defineUi<UI.ComponentProps<"div">>("PromptInputBody", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "children", "ref"]));
  const _hook4 = usePromptInput();
  const disabled = computed(() => _hook4.value.disabled);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: promptInputBodyRecipe,
    params: {
      disabled: disabled.value
    },
    kind: "field" as const,
    still: true
  }));
  return () => {
    return <div data-slot="prompt-input-body" data-ink-focus="within" ref={useMergedRef<HTMLElement>(hostRef, ref.value as UI.Ref<HTMLElement> | undefined) as UI.Ref<HTMLDivElement>} {...domProps(hostProps.value)} class={cn("relative isolate flex min-h-12 min-w-0 flex-1 pb-2", className.value)} {...domProps(props.value)}>
      {node.value}
      {readSlot(_slots.default)}
    </div>;
  };
});
const PromptInputTextarea = defineUi<Omit<UI.ComponentProps<"textarea">, "value" | "defaultValue"> & {
  minRows?: number;
  maxRows?: number;
}>("PromptInputTextarea", ["class", "onKeydown", "onChange", "onSelect", "onCompositionstart", "onCompositionend", "onBlur", "placeholder", "name", "minRows", "maxRows"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const onKeydown = computed(() => _props["onKeydown"]);
  const onChange = computed(() => _props["onChange"]);
  const onSelect = computed(() => _props["onSelect"]);
  const onCompositionstart = computed(() => _props["onCompositionstart"]);
  const onCompositionend = computed(() => _props["onCompositionend"]);
  const onBlur = computed(() => _props["onBlur"]);
  const placeholder = computed(() => _props["placeholder"] === undefined ? "what are we making?" as const : _props["placeholder"]);
  const name = computed(() => _props["name"] === undefined ? "message" as const : _props["name"]);
  const minRows = computed(() => _props["minRows"] === undefined ? 1 : _props["minRows"]);
  const maxRows = computed(() => _props["maxRows"] === undefined ? 8 : _props["maxRows"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "onKeydown", "onChange", "onSelect", "onCompositionstart", "onCompositionend", "onBlur", "placeholder", "name", "minRows", "maxRows", "ref"]));
  const c = usePromptInput();
  const localRef = shallowRef<HTMLTextAreaElement | null | null>(null);
  const merged = computed(() => useMergedRef<HTMLTextAreaElement>(localRef, c.value.textareaRef, ref.value));
  const optionsOpen = computed(() => !!c.value.trigger && !!c.value.list?.isConnected && c.value.list.querySelector('[role="option"]:not([aria-disabled="true"])') !== null);
  watchDependencies(() => {
    const el = localRef.value;
    if (!el || typeof CSS !== "undefined" && CSS.supports?.("field-sizing", "content")) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, () => [c.value.value], true);
  const options = computed(() => (): HTMLElement[] => c.value.list ? Array.from(c.value.list.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])')) : []);
  const move = computed(() => (dir: 1 | -1) => {
    const all = options.value();
    if (!all.length) return;
    const at = all.findIndex(o => o.id === c.value.activeId);
    const next = all[(at + dir + all.length) % all.length];
    c.value.setActiveId(next.id);
    next.scrollIntoView?.({
      block: "nearest" as const
    });
  });
  return () => {
    return <TextareaControl data-slot="prompt-input-textarea" dir="auto" ref={merged.value} name={name.value} rows={minRows.value} placeholder={placeholder.value} value={c.value.value} disabled={c.value.disabled} readonly={c.value.lockWhileStreaming && c.value.busy} aria-label={props.value["aria-label"] === undefined && props.value["aria-labelledby"] === undefined && props.value.id === undefined ? "Message" as const : undefined} aria-autocomplete={c.value.trigger ? "list" as const : undefined} aria-haspopup={c.value.trigger ? "listbox" as const : undefined} aria-controls={optionsOpen.value ? c.value.listId : undefined} aria-activedescendant={optionsOpen.value && c.value.activeId ? c.value.activeId : undefined} style={cssStyle({
      maxHeight: `calc(${maxRows.value} * 2rem + 1rem)`
    })} class={cn("resize-none overflow-y-auto px-1 py-1.5 font-script text-[1.65rem] leading-8 text-ink-you caret-ink-you placeholder:text-pencil-text compact:text-[1.5rem] calm:text-[1.35rem] calm:leading-7", className.value)} onChange={(e: Event) => {
      c.value.setValue((e.currentTarget as HTMLTextAreaElement).value);
      c.value.setCaret((e.currentTarget as HTMLTextAreaElement).selectionStart ?? (e.currentTarget as HTMLTextAreaElement).value.length);
      onChange.value?.(e);
    }} onSelect={(e: Event) => {
      c.value.setCaret((e.currentTarget as HTMLTextAreaElement).selectionStart ?? 0);
      onSelect.value?.(e);
    }} onCompositionstart={e => {
      c.value.composing.value = true;
      onCompositionstart.value?.(e);
    }} onCompositionend={e => {
      c.value.composing.value = false;
      onCompositionend.value?.(e);
    }} onBlur={(e: FocusEvent) => {
      c.value.composing.value = false;
      onBlur.value?.(e);
    }} onKeydown={(e: KeyboardEvent) => {
      onKeydown.value?.(e);
      if (e.defaultPrevented) return;
      if (e.isComposing || c.value.composing.value || e.keyCode === 229) return;
      if (optionsOpen.value) {
        if (e.key === "ArrowDown") return void (e.preventDefault(), move.value(1));
        if (e.key === "ArrowUp") return void (e.preventDefault(), move.value(-1));
        if (e.key === "Escape") return void (e.preventDefault(), c.value.dismissTrigger());
        if (e.key === "Enter" && !e.shiftKey || e.key === "Tab") {
          const active = options.value().find(o => o.id === c.value.activeId) ?? options.value()[0];
          if (active) return void (e.preventDefault(), active.click());
        }
      }
      if (e.key !== "Enter" || e.shiftKey) return;
      const mod = e.ctrlKey || e.metaKey;
      if (c.value.submitOn === "enter" ? !mod && !e.altKey : mod) {
        e.preventDefault();
        if (!e.repeat) c.value.submit();
      }
    }} {...domProps(props.value)}>{_slots.default?.()}</TextareaControl>;
  };
});
const PromptInputFooter = defineUi<UI.ComponentProps<"div">>("PromptInputFooter", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="prompt-input-footer" class={cn("flex items-center justify-between gap-2 pt-1", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const PromptInputTools = defineUi<UI.ComponentProps<"div">>("PromptInputTools", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="prompt-input-tools" role="group" class={cn("flex items-center gap-1", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const PromptInputButton = defineUi<UI.ComponentProps<typeof Button>>("PromptInputButton", ["variant", "size", "class"], (_props, {
  slots: _slots
}) => {
  const variant = computed(() => _props["variant"] === undefined ? "ghost" as const : _props["variant"]);
  const size = computed(() => _props["size"] === undefined ? "sm" as const : _props["size"]);
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["variant", "size", "class"]));
  return () => {
    return <Button data-slot="prompt-input-button" type="button" variant={variant.value} size={size.value} class={cn(className.value)} {...domProps(props.value)}>{_slots.default?.()}</Button>;
  };
});
const PromptInputHint = defineUi<UI.ComponentProps<"p">>("PromptInputHint", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <p data-slot="prompt-input-hint" class={cn("m-0 px-1 text-sm text-muted-foreground", className.value)} {...domProps(props.value)}>{_slots.default?.()}</p>;
  };
});
const PromptInputSubmit = defineUi<Omit<UI.ComponentProps<typeof Button>, "type">>("PromptInputSubmit", ["class", "onClick"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const onClick = computed(() => _props["onClick"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "children", "onClick", "ref"]));
  const c = usePromptInput();
  const stopping = computed(() => c.value.busy);
  const empty = computed(() => !c.value.allowEmpty && !c.value.value.trim());
  const self = shallowRef<HTMLButtonElement | null | null>(null);
  const wasStopping = shallowRef(stopping.value);
  const focus = computed(() => c.value.focus);
  watchDependencies(() => {
    if (wasStopping.value && !stopping.value && self.value && document.activeElement === self.value) focus.value();
    wasStopping.value = stopping.value;
  }, () => [stopping.value, focus.value], false);
  return () => {
    return <Button ref={useMergedRef<HTMLButtonElement>(self, ref.value as UI.Ref<HTMLButtonElement> | undefined)} data-slot="prompt-input-submit" data-status={c.value.status} type={stopping.value ? "button" as const : "submit" as const} size="icon" variant={stopping.value ? "outline" as const : "default" as const} aria-label={stopping.value ? "Stop generating" as const : "Send message" as const} disabled={!stopping.value && (c.value.disabled || empty.value)} class={cn(className.value)} onClick={e => {
      onClick.value?.(e);
      if (stopping.value && !e.defaultPrevented) c.value.stop();
    }} {...domProps(props.value)}>
      {readSlot(_slots.default) ?? <span key={c.value.flight} data-flying={c.value.flight ? "" as const : undefined} class="inline-flex data-flying:animate-[ll-plane_0.9s_ease-in-out_both]">
          <Icon name={stopping.value ? "square" as const : "send" as const} size={18} />
        </span>}
    </Button>;
  };
});
const PromptInputSuggestions = defineUi<UI.ComponentProps<"div"> & {
  trigger?: string;
  open?: boolean;
}>("PromptInputSuggestions", ["trigger", "open", "class"], (_props, {
  slots: _slots
}) => {
  const only = computed(() => _props["trigger"]);
  const open = computed(() => _props["open"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["trigger", "open", "class", "children", "ref"]));
  const c = usePromptInput();
  const show = computed(() => open.value ?? (!!c.value.trigger && (only.value === undefined || c.value.trigger.char === only.value)));
  const setList = computed(() => c.value.setList);
  const setActiveId = computed(() => c.value.setActiveId);
  const activeId = computed(() => c.value.activeId);
  const localRef = shallowRef<HTMLDivElement | null | null>(null);
  const merged = computed(() => useMergedRef<HTMLDivElement>(localRef, ref.value));
  watchDependencies(() => {
    if (!show.value) return;
    setList.value(localRef.value);
    return () => setList.value(null);
  }, () => [show.value, setList.value], true);
  watchDependencies(() => {
    if (!show.value) return;
    const ids = Array.from(localRef.value?.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])') ?? []).map(o => o.id);
    if (ids.length === 0) {
      if (activeId.value !== null) setActiveId.value(null);
    } else if (!activeId.value || !ids.includes(activeId.value)) setActiveId.value(ids[0]);
  }, undefined, true);
  return () => {
    if (!show.value) return null;
    return <Paper data-slot="prompt-input-suggestions" role="listbox" aria-label="Suggestions" id={c.value.listId} ref={merged.value as UI.Ref<HTMLElement>} stock="slip" tilt={false} class={cn("absolute inset-x-2 bottom-full z-(--ll-z-raised) mb-3 max-h-60 overflow-y-auto p-1.5", className.value)} onMousedown={(e: MouseEvent) => e.preventDefault()} {...domProps(props.value as object)}>
      {readSlot(_slots.default)}
    </Paper>;
  };
});
const PromptInputSuggestion = defineUi<Omit<UI.ComponentProps<"div">, "onSelect"> & {
  onSelect?: () => void;
  disabled?: boolean;
}>("PromptInputSuggestion", ["onSelect", "disabled", "class", "onClick", "onPointermove"], (_props, {
  slots: _slots
}) => {
  const onSelect = computed(() => _props["onSelect"]);
  const disabled = computed(() => _props["disabled"]);
  const className = computed(() => _props["class"]);
  const onClick = computed(() => _props["onClick"]);
  const onPointermove = computed(() => _props["onPointermove"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["onSelect", "disabled", "class", "onClick", "onPointermove", "children"]));
  const c = usePromptInput();
  const id = useId();
  const active = computed(() => c.value.activeId === id);
  return () => {
    return <div data-slot="prompt-input-suggestion" role="option" id={id} aria-selected={active.value} aria-disabled={disabled.value || undefined} data-active={active.value ? "" as const : undefined} class={cn("flex cursor-pointer items-center gap-2 px-3 py-1.5 text-[15px] select-none data-[active]:ll-swipe aria-disabled:cursor-not-allowed aria-disabled:text-pencil-text", className.value)} onPointermove={(e: PointerEvent) => {
      if (!disabled.value && !active.value) c.value.setActiveId(id);
      onPointermove.value?.(e);
    }} onClick={(e: PointerEvent) => {
      onClick.value?.(e);
      if (!disabled.value && !e.defaultPrevented) onSelect.value?.();
    }} {...domProps(props.value)}>
      {readSlot(_slots.default)}
    </div>;
  };
});
export { PromptInput, PromptInputAttachments, PromptInputBody, PromptInputTextarea, PromptInputFooter, PromptInputTools, PromptInputButton, PromptInputHint, PromptInputSubmit, PromptInputSuggestions, PromptInputSuggestion, usePromptInput };
export type { PromptInputProps, PromptInputStatus, PromptInputTrigger, PromptInputActiveTrigger, PromptInputContextValue };
