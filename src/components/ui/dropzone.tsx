// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, Fragment, toValue, type MaybeRefOrGetter, type ComputedRef, shallowRef } from "vue";
import { Icon } from "@/components/ui/icon";
import { Mascot } from "@/components/ui/mascot";
import { useFormReset } from "@/hooks/use-form-reset";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { dropzoneItemRecipe, dropzoneRecipe } from "@/lib/ink/recipes/dropzone-ink";
import { cn } from "@/lib/utils";
type ErrorCode = "file-invalid-type" | "file-too-large" | "file-too-small" | "too-many-files" | "validator";
interface FileError {
  code: ErrorCode;
  message: string;
}
interface FileRejection {
  file: File;
  errors: FileError[];
}
function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let v = bytes / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v >= 10 || Number.isInteger(v) ? Math.round(v) : v.toFixed(1)} ${units[i]}`;
}
const tokensOf = (accept?: string | readonly string[]): string[] => (typeof accept === "string" ? accept.split(",") : accept ? [...accept] : []).map(t => t.trim()).filter(Boolean);
function matchesAccept(file: Pick<File, "name" | "type">, accept?: string | readonly string[]): boolean {
  const tokens = tokensOf(accept).map(t => t.toLowerCase());
  if (tokens.length === 0) return true;
  const name = file.name.toLowerCase();
  const type = (file.type || "").toLowerCase();
  return tokens.some(t => t.startsWith(".") ? name.endsWith(t) : t.endsWith("/*") ? type.startsWith(t.slice(0, -1)) : type === t);
}
const sameFile = (a: File, b: File): boolean => a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;
type Messages = Partial<Record<ErrorCode, string | ((file: File) => string)>>;
function describeLimits(o: {
  accept?: string | readonly string[];
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
}): string {
  const tokens = tokensOf(o.accept);
  const kinds = tokens.map(t => {
    if (t.startsWith(".")) return t.slice(1).toUpperCase();
    if (t === "image/*") return "Images";
    if (t === "video/*") return "Videos";
    if (t === "audio/*") return "Audio";
    if (t === "text/*") return "Text files";
    const sub = t.split("/")[1];
    return sub && sub !== "*" ? sub.toUpperCase() : t;
  });
  const parts: string[] = [];
  if (kinds.length) parts.push(kinds.join(", "));
  if (o.maxSize) parts.push(`${parts.length ? "up to" as const : "Up to" as const} ${formatBytes(o.maxSize)}${o.multiple === false ? "" as const : " each" as const}`);
  if (o.maxFiles && o.multiple !== false) parts.push(`${parts.length ? "at most" as const : "At most" as const} ${o.maxFiles} file${o.maxFiles === 1 ? "" as const : "s" as const}`);
  return parts.join(" ");
}
interface DropzoneContextValue {
  files: File[];
  rejections: FileRejection[];
  isDragOver: boolean;
  setDragOver: (over: boolean) => void;
  disabled: boolean;
  invalid: boolean;
  multiple: boolean;
  accept?: string | readonly string[];
  maxSize?: number;
  maxFiles?: number;
  name?: string;
  inputId?: string;
  required?: boolean;
  add: (list: FileList | File[] | null | undefined) => void;
  remove: (file: File) => void;
  clear: () => void;
  clearRejections: () => void;
  open: () => void;
  inputRef: UI.RefObject<HTMLInputElement | null>;
}
const DropzoneContext = createContext<DropzoneContextValue | null>(null);
function useDropzone(): ComputedRef<DropzoneContextValue> {
  const ctx = useContext(DropzoneContext);
  return computed(() => {
    if (!ctx.value) console.error("Dropzone parts must be used inside <Dropzone>");
    return ctx.value;
  });
}
interface DropzoneProps extends Omit<UI.ComponentProps<"div">, "onDrop" | "defaultValue" | "children"> {
  files?: File[];
  defaultFiles?: File[];
  onFilesChange?: (files: File[]) => void;
  accept?: string | readonly string[];
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  minSize?: number;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  validator?: (file: File) => FileError | null;
  messages?: Messages;
  onDrop?: (accepted: File[], rejected: FileRejection[]) => void;
  onReject?: (rejected: FileRejection[]) => void;
  children?: UI.ReactNode;
}
const Dropzone = defineUi<DropzoneProps>("Dropzone", [], (_props, {
  slots: _slots
}) => {
  const props = _props;
  const _files = computed(() => props.files);
  const defaultFiles = computed(() => props.defaultFiles);
  const onFilesChange = computed(() => props.onFilesChange);
  const accept = computed(() => props.accept);
  const multiple = computed(() => props.multiple === undefined ? true : props.multiple);
  const maxFiles = computed(() => props.maxFiles);
  const maxSize = computed(() => props.maxSize);
  const minSize = computed(() => props.minSize);
  const disabled = computed(() => props.disabled === undefined ? false : props.disabled);
  const invalid = computed(() => props.invalid === undefined ? false : props.invalid);
  const required = computed(() => props.required);
  const name = computed(() => props.name);
  const id = computed(() => props.id);
  const validator = computed(() => props.validator);
  const messages = computed(() => props.messages);
  const onDrop = computed(() => props.onDrop);
  const onReject = computed(() => props.onReject);
  const className = computed(() => props.className);
  const children = renderValue(() => readSlot(_slots.default));
  const rest = computed(() => omitProps(props, ["files", "defaultFiles", "onFilesChange", "accept", "multiple", "maxFiles", "maxSize", "minSize", "disabled", "invalid", "required", "name", "id", "validator", "messages", "onDrop", "onReject", "className", "children"]));
  const controlled = computed(() => "files" in props);
  const inner = shallowRef<File[]>(initialState(defaultFiles.value ?? []));
  const setInner = stateSetter(inner);
  const files = computed(() => controlled.value ? props.files ?? [] : inner.value);
  const rejections = shallowRef<FileRejection[]>(initialState([]));
  const setRejections = stateSetter(rejections);
  const isDragOver = shallowRef(initialState(false));
  const setDragOver = stateSetter(isDragOver);
  const inputRef = shallowRef<HTMLInputElement | null | null>(null);
  const latest = shallowRef(files.value);
  const setFiles = (next: File[]) => {
    latest.value = next;
    if (!controlled.value) setInner(next);
    onFilesChange.value?.(next);
  };
  const say = computed(() => (code: ErrorCode, file: File, fallback: string): FileError => {
    const m = messages.value?.[code];
    return {
      code,
      message: m === undefined ? fallback : typeof m === "function" ? m(file) : m
    };
  });
  const add = computed(() => (list: FileList | File[] | null | undefined): void => {
    if (disabled.value || !list) return;
    const incoming = Array.from(list);
    if (incoming.length === 0) return;
    const accepted: File[] = [];
    const rejected: FileRejection[] = [];
    const room = multiple.value ? maxFiles.value === undefined ? Infinity : Math.max(0, maxFiles.value - latest.value.length) : 1;
    for (const file of incoming) {
      const errors: FileError[] = [];
      if (!matchesAccept(file, accept.value)) errors.push(say.value("file-invalid-type", file, `${file.name} is not a file type we take.`));
      if (maxSize.value !== undefined && file.size > maxSize.value) errors.push(say.value("file-too-large", file, `${file.name} is larger than ${formatBytes(maxSize.value)}.`));
      if (minSize.value !== undefined && file.size < minSize.value) errors.push(say.value("file-too-small", file, `${file.name} is smaller than ${formatBytes(minSize.value)}.`));
      const custom = errors.length === 0 ? validator.value?.(file) : null;
      if (custom) errors.push(custom);
      if (errors.length === 0 && accepted.length >= room) errors.push(say.value("too-many-files", file, multiple.value ? `Only ${maxFiles.value} file${maxFiles.value === 1 ? "" as const : "s" as const} at a time.` : "One file at a time." as const));
      if (errors.length) rejected.push({
        file,
        errors
      });else accepted.push(file);
    }
    setRejections(rejected);
    if (accepted.length) setFiles(multiple.value ? [...latest.value.filter(f => !accepted.some(a => sameFile(a, f))), ...accepted] : [accepted[0]]);
    onDrop.value?.(accepted, rejected);
    if (rejected.length) onReject.value?.(rejected);
  });
  const remove = computed(() => (file: File): void => {
    if (disabled.value) return;
    setFiles(latest.value.filter(f => f !== file));
    setRejections([]);
  });
  const clear = computed(() => (): void => {
    setFiles([]);
    setRejections([]);
  });
  const clearRejections = computed(() => (): void => setRejections([]));
  const open = computed(() => (): void => {
    if (!disabled.value) inputRef.value?.click();
  });
  useFormReset(() => () => inputRef.value, () => () => {
    if (!controlled.value) setInner(defaultFiles.value ?? []);
    setRejections([]);
  });
  watchDependencies(() => {
    const input = inputRef.value;
    if (!input || typeof DataTransfer === "undefined") return;
    try {
      const dt = new DataTransfer();
      for (const f of files.value) dt.items.add(f);
      input.files = dt.files;
    } catch {}
  }, () => [files.value], false);
  const ctx = computed<DropzoneContextValue>(() => ({
    files: files.value,
    rejections: rejections.value,
    isDragOver: isDragOver.value,
    setDragOver,
    disabled: disabled.value,
    invalid: invalid.value,
    multiple: multiple.value,
    accept: accept.value,
    maxSize: maxSize.value,
    maxFiles: maxFiles.value,
    name: name.value,
    inputId: id.value,
    required: required.value,
    add: add.value,
    remove: remove.value,
    clear: clear.value,
    clearRejections: clearRejections.value,
    open: open.value,
    inputRef
  }));
  return () => {
    void _files.value;
    latest.value = files.value;
    return <DropzoneContext.Provider value={ctx.value}>
      <style>
        {DROPZONE_CSS}
      </style>
      <div data-slot="dropzone" data-disabled={disabled.value ? "" as const : undefined} class={cn("flex w-full flex-col gap-3", className.value)} {...domProps(rest.value)}>
        {readSlot(_slots.default) ?? <>
            <DropzoneArea>
              <DropzoneIcon />
              <DropzoneTitle />
              <DropzoneDescription />
            </DropzoneArea>
            <DropzoneRejections />
            <DropzoneList />
          </>}
      </div>
    </DropzoneContext.Provider>;
  };
});
const DROPZONE_CSS = "@keyframes ll-dz-wiggle{0%,100%{rotate:0deg}25%{rotate:-.7deg}75%{rotate:.7deg}}" + "[data-slot=dropzone-area][data-drag-over]>svg[data-ink]{animation:ll-dz-wiggle calc(var(--ll-dur-boil) * 2) ease-in-out infinite}" + "[data-slot=dropzone-icon]{transition:translate var(--ll-dur-pop) var(--ll-ease-settle)}[data-slot=dropzone-area][data-drag-over] [data-slot=dropzone-icon]{translate:0 -3px}" + "@media (prefers-reduced-motion:reduce){[data-slot=dropzone-area][data-drag-over]>svg[data-ink]{animation:none}}[data-motion=reduced] [data-slot=dropzone-area][data-drag-over]>svg[data-ink]{animation:none}";
const DropzoneArea = defineUi<Omit<UI.ComponentProps<"label">, "children"> & {
  children?: UI.ReactNode;
  seed?: string | number;
  inputProps?: Omit<UI.ComponentProps<"input">, "type" | "ref">;
}>("DropzoneArea", ["class", "seed", "inputProps", "onDragenter", "onDragover", "onDragleave", "onDrop"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const seed = computed(() => _props["seed"]);
  const inputProps = computed(() => _props["inputProps"]);
  const ref = computed(() => _props["ref"]);
  const onDragenter = computed(() => _props["onDragenter"]);
  const onDragover = computed(() => _props["onDragover"]);
  const onDragleave = computed(() => _props["onDragleave"]);
  const onDrop = computed(() => _props["onDrop"]);
  const props = computed(() => omitProps(_props, ["class", "children", "seed", "inputProps", "ref", "onDragenter", "onDragover", "onDragleave", "onDrop"]));
  const ctx = useDropzone();
  const depth = shallowRef(0);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: dropzoneRecipe,
    params: {
      over: ctx.value.isDragOver && !ctx.value.disabled,
      invalid: ctx.value.invalid && !ctx.value.disabled,
      disabled: ctx.value.disabled
    },
    kind: "field" as const,
    seed: seed.value,
    still: true
  }));
  const hasFiles = computed(() => (e: DragEvent): boolean => Array.from(e.dataTransfer?.types ?? []).includes("Files"));
  return () => {
    return <label data-slot="dropzone-area" data-drag-over={ctx.value.isDragOver && !ctx.value.disabled ? "" as const : undefined} data-invalid={ctx.value.invalid ? "" as const : undefined} data-disabled={ctx.value.disabled ? "" as const : undefined} data-ink-focus="within" ref={useMergedRef<HTMLLabelElement>(hostRef, ref.value)} {...domProps(hostProps.value)} onDragenter={(e: DragEvent) => {
      onDragenter.value?.(e);
      if (ctx.value.disabled || !hasFiles.value(e)) return;
      e.preventDefault();
      depth.value++;
      ctx.value.setDragOver(true);
    }} onDragover={(e: DragEvent) => {
      onDragover.value?.(e);
      if (ctx.value.disabled || !hasFiles.value(e)) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    }} onDragleave={(e: DragEvent) => {
      onDragleave.value?.(e);
      if (ctx.value.disabled) return;
      depth.value = Math.max(0, depth.value - 1);
      if (depth.value === 0) ctx.value.setDragOver(false);
    }} onDrop={(e: DragEvent) => {
      onDrop.value?.(e);
      if (ctx.value.disabled) return;
      e.preventDefault();
      depth.value = 0;
      ctx.value.setDragOver(false);
      ctx.value.add(e.dataTransfer?.files);
    }} class={cn("group/dz relative isolate flex min-h-40 w-full cursor-pointer flex-col items-center justify-center gap-1.5 p-6 text-center font-hand text-base text-foreground has-disabled:cursor-not-allowed has-disabled:text-pencil-text compact:min-h-32 compact:p-5 calm:min-h-24 calm:p-3", "forced-colors:border forced-colors:border-dashed forced-colors:data-drag-over:border-solid", className.value)} {...domProps(props.value)}>
      {node.value}
      <input type="file" data-slot="dropzone-input" class="peer sr-only" ref={ctx.value.inputRef} multiple={ctx.value.multiple} accept={tokensOf(ctx.value.accept).join(",") || undefined} name={ctx.value.name} id={ctx.value.inputId} required={ctx.value.required && ctx.value.files.length === 0} disabled={ctx.value.disabled} aria-invalid={ctx.value.invalid || undefined} onChange={(e: Event) => {
        ctx.value.add((e.target as HTMLInputElement).files);
        if (typeof DataTransfer === "undefined") (e.target as HTMLInputElement).value = "";
      }} {...domProps(inputProps.value, true)} />
      {readSlot(_slots.default)}
    </label>;
  };
});
const DropzoneIcon = defineUi<UI.ComponentProps<"span">>("DropzoneIcon", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "children"]));
  const ctx = useDropzone();
  return () => {
    return <span data-slot="dropzone-icon" aria-hidden="true" class={cn("grid size-16 place-items-center text-ink-soft group-has-disabled/dz:text-pencil-text", className.value)} {...domProps(props.value)}>
      {readSlot(_slots.default) ?? (ctx.value.isDragOver && !ctx.value.disabled ? <Mascot pose="carry" size={64} /> : <Icon name="upload" size={32} weight={1.2} />)}
    </span>;
  };
});
const DropzoneTitle = defineUi<UI.ComponentProps<"span">>("DropzoneTitle", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "children"]));
  const ctx = useDropzone();
  return () => {
    return <span data-slot="dropzone-title" class={cn("font-script text-[1.45rem] leading-tight font-semibold", className.value)} {...domProps(props.value)}>
      {readSlot(_slots.default) ?? <>
          {ctx.value.multiple ? "Drop files here or " as const : "Drop a file here or " as const}
          <span class="text-ink-you underline decoration-wavy decoration-1 underline-offset-4">browse</span>
        </>}
    </span>;
  };
});
const DropzoneDescription = defineUi<UI.ComponentProps<"span">>("DropzoneDescription", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "children"]));
  const ctx = useDropzone();
  const text = computed(() => children.value ?? describeLimits({
    accept: ctx.value.accept,
    maxSize: ctx.value.maxSize,
    maxFiles: ctx.value.maxFiles,
    multiple: ctx.value.multiple
  }));
  return () => {
    if (!text.value) return null;
    return <span data-slot="dropzone-description" class={cn("text-sm text-muted-foreground", className.value)} {...domProps(props.value)}>
      {text.value}
    </span>;
  };
});
const DropzoneRejections = defineUi<UI.ComponentProps<"div">>("DropzoneRejections", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  const ctx = useDropzone();
  return () => {
    if (ctx.value.rejections.length === 0) return null;
    return <div data-slot="dropzone-rejections" role="alert" class={cn("font-hand text-sm text-red", className.value)} {...domProps(props.value)}>
      <ul class="grid gap-1">
        {ctx.value.rejections.map((r, i) => <li key={`${r.file.name}-${i}`} class="flex items-start gap-1.5">
            <Icon name="circle-alert" size={16} class="mt-0.5 shrink-0" />
            <span>{r.errors.map(e => e.message).join(" ")}</span>
          </li>)}
      </ul>
    </div>;
  };
});
const DropzoneList = defineUi<Omit<UI.ComponentProps<"ul">, "children"> & {
  children?: (file: File, index: number) => UI.ReactNode;
}>("DropzoneList", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = computed(() => _slots.default);
  const props = computed(() => omitProps(_props, ["class", "children"]));
  const ctx = useDropzone();
  return () => {
    if (ctx.value.files.length === 0) return null;
    return <ul data-slot="dropzone-list" aria-label="Selected files" class={cn("grid", className.value)} {...domProps(props.value)}>
      {ctx.value.files.map((f, i) => _slots.default ? <Fragment key={`${f.name}-${f.size}-${f.lastModified}-${i}`}>{_slots.default(f, i)}</Fragment> : <DropzoneItem key={`${f.name}-${f.size}-${f.lastModified}-${i}`} file={f} />)}
    </ul>;
  };
});
const iconFor = (file: File): string => file.type.startsWith("image/") ? "image" as const : /pdf|text|word|document/.test(file.type) ? "file-text" as const : /zip|compressed|tar/.test(file.type) ? "archive" as const : "file" as const;
const DropzoneItem = defineUi<Omit<UI.ComponentProps<"li">, "children"> & {
  file: File;
  progress?: number;
  status?: "idle" | "uploading" | "done" | "error";
  error?: string;
  thumbnail?: boolean;
  onRemove?: () => void;
  removeLabel?: string;
  seed?: string | number;
}>("DropzoneItem", ["file", "progress", "status", "error", "thumbnail", "onRemove", "removeLabel", "class", "seed"], (_props, {
  slots: _slots
}) => {
  const file = computed(() => _props["file"]);
  const progress = computed(() => _props["progress"]);
  const status = computed(() => _props["status"] === undefined ? "idle" as const : _props["status"]);
  const error = computed(() => _props["error"]);
  const thumbnail = computed(() => _props["thumbnail"] === undefined ? true : _props["thumbnail"]);
  const onRemove = computed(() => _props["onRemove"]);
  const removeLabel = computed(() => _props["removeLabel"]);
  const className = computed(() => _props["class"]);
  const seed = computed(() => _props["seed"]);
  const props = computed(() => omitProps(_props, ["file", "progress", "status", "error", "thumbnail", "onRemove", "removeLabel", "class", "seed"]));
  const ctx = useDropzone();
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: dropzoneItemRecipe,
    params: {
      status: status.value === "error" ? "error" as const : status.value === "done" ? "done" as const : "idle" as const
    },
    kind: "rule" as const,
    seed: seed.value,
    still: true
  }));
  const preview = shallowRef<string | null>(initialState(null));
  const setPreview = stateSetter(preview);
  watchDependencies(() => {
    if (!thumbnail.value || !file.value.type.startsWith("image/") || typeof URL === "undefined" || typeof URL.createObjectURL !== "function") return;
    let url: string;
    try {
      url = URL.createObjectURL(file.value);
    } catch {
      return;
    }
    setPreview(url);
    return () => {
      URL.revokeObjectURL(url);
      setPreview(null);
    };
  }, () => [file.value, thumbnail.value], false);
  return () => {
    return <li data-slot="dropzone-item" data-status={status.value} ref={hostRef} {...domProps(hostProps.value)} class={cn("relative isolate flex items-center gap-3 px-1 py-2.5 font-hand text-base", className.value)} {...domProps(props.value)}>
      {node.value}
      <span data-slot="dropzone-item-media" aria-hidden="true" class={cn("grid size-10 shrink-0 place-items-center overflow-hidden text-ink-soft", preview.value ? "rotate-[-2deg] border-2 border-photo bg-photo shadow-[0_1px_2px_rgb(var(--ll-shade)/.35)]" as const : "" as const)}>
        {preview.value ? <img src={preview.value} alt="" decoding="async" loading="lazy" class="size-full object-cover" /> : <Icon name={iconFor(file.value)} size={24} />}
      </span>
      <span class="grid min-w-0 flex-1 gap-0.5">
        <span class="truncate font-bold">{file.value.name}</span>
        <span class={cn("truncate text-sm", status.value === "error" ? "text-red" as const : "text-muted-foreground" as const)}>
          {status.value === "error" && error.value ? error.value : status.value === "done" ? `${formatBytes(file.value.size)}, done` : status.value === "uploading" && progress.value !== undefined ? `${formatBytes(file.value.size)}, ${Math.round(progress.value)}%` : formatBytes(file.value.size)}
        </span>
        {status.value === "uploading" && progress.value !== undefined && <span role="progressbar" aria-label={`Uploading ${file.value.name}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress.value)} class="mt-0.5 block h-1.5 w-full bg-pencil-mark/25">
            <span class="ll-swipe block h-full" style={cssStyle({
            width: `${Math.max(0, Math.min(100, progress.value))}%`
          })} />
          </span>}
      </span>
      {status.value === "done" && <Icon name="circle-check" size={18} class="shrink-0 text-green" />}
      {status.value === "error" && <Icon name="circle-alert" size={18} class="shrink-0 text-red" />}
      <button type="button" data-slot="dropzone-item-remove" aria-label={removeLabel.value ?? `Remove ${file.value.name}`} disabled={ctx.value.disabled} onClick={() => {
        if (onRemove.value) onRemove.value();else ctx.value.remove(file.value);
        ctx.value.inputRef.value?.focus({
          preventScroll: true
        });
      }} class="grid size-7 shrink-0 cursor-default place-items-center text-ink-soft outline-hidden hover:ll-swipe hover:text-ink focus-visible:ll-swipe focus-visible:text-ink focus-visible:[outline:2px_solid_var(--ll-focus)] focus-visible:outline-offset-[-2px] disabled:pointer-events-none disabled:text-pencil-text">
        <Icon name="x" size={14} />
      </button>
    </li>;
  };
});
export { Dropzone, DropzoneArea, DropzoneIcon, DropzoneTitle, DropzoneDescription, DropzoneRejections, DropzoneList, DropzoneItem, useDropzone, formatBytes, matchesAccept };
export type { DropzoneProps, FileError, FileRejection, ErrorCode as DropzoneErrorCode };
