// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef, useId } from "vue";
import { Annotate } from "@/components/ui/annotate";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Icon } from "@/components/ui/icon";
import { InputControl } from "@/components/ui/input";
import { Notebook, NotebookPage, NotebookTitle } from "@/components/ui/notebook";
import { Paper } from "@/components/ui/paper";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tally } from "@/components/ui/tally";
import { TextareaControl } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MARKS, toggleMark, wordCount, type MarkKind, type Note } from "@/blocks/notes-app/components/notes-app-data";
import { MARK_LOOK, NotesAppMarked } from "@/blocks/notes-app/components/notes-app-marked";
import { cn } from "@/lib/utils";
export type EditorMode = "page" | "write";
type Props = {
  note: Note;
  notebookName: string;
  mode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
  onChange: (patch: Partial<Pick<Note, "title" | "body" | "reads">>) => void;
  onDelete: () => void;
  onBack: () => void;
  className?: string;
};
const MARK_ORDER: MarkKind[] = ["highlight", "underline", "circle", "strike"];
export const NotesAppEditor = defineUi<Props>("NotesAppEditor", ["note", "notebookName", "mode", "onModeChange", "onChange", "onDelete", "onBack", "class"], (_props, {
  slots: _slots
}) => {
  const note = computed(() => _props["note"]);
  const notebookName = computed(() => _props["notebookName"]);
  const mode = computed(() => _props["mode"]);
  const onModeChange = computed(() => _props["onModeChange"]);
  const onChange = computed(() => _props["onChange"]);
  const onDelete = computed(() => _props["onDelete"]);
  const onBack = computed(() => _props["onBack"]);
  const className = computed(() => _props["class"]);
  const area = shallowRef<HTMLTextAreaElement | null>(null);
  const title = shallowRef<HTMLInputElement | null>(null);
  const restore = shallowRef<{
    start: number;
    end: number;
  } | null | null>(null);
  const focusSoon = shallowRef(initialState(false));
  const setFocusSoon = stateSetter(focusSoon);
  const hint = useId();
  watchDependencies(() => {
    if (mode.value === "write" && !note.value.title && !note.value.body) title.value?.focus();
  }, () => [], false);
  watchDependencies(() => {
    const el = area.value;
    if (!el) return;
    if (restore.value) {
      el.setSelectionRange(restore.value.start, restore.value.end);
      restore.value = null;
    }
    if (focusSoon.value) {
      el.focus();
      setFocusSoon(false);
    }
  }, undefined, true);
  const mark = computed(() => (kind: MarkKind) => {
    if (mode.value !== "write") {
      onModeChange.value("write");
      setFocusSoon(true);
      return;
    }
    const el = area.value;
    if (!el) return;
    const next = toggleMark(el.value, el.selectionStart, el.selectionEnd, kind);
    if (!next) {
      el.focus();
      return;
    }
    restore.value = {
      start: next.start,
      end: next.end
    };
    onChange.value({
      body: next.text
    });
    setFocusSoon(true);
  });
  return () => {
    return <section aria-label="Editor" data-slot="notes-app-editor" tabindex={-1} class={cn("flex min-h-0 flex-col gap-3 outline-none", className.value)}>
      <TooltipProvider delayDuration={300}>
        <Paper stock="slip" tilt={-0.2} seed="notes-toolbar" class="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2">
          <Button variant="ghost" size="icon-sm" class="@4xl/notes:hidden" onClick={onBack.value} aria-label="Back to notes">
            <Icon name="arrow-left" class="rtl:-scale-x-100" />
          </Button>
          <ToggleGroup type="single" size="sm" variant="outline" value={mode.value} onValueChange={v => v && onModeChange.value(v as EditorMode)} aria-label="View">
            <ToggleGroupItem value="page">Page</ToggleGroupItem>
            <ToggleGroupItem value="write">Write</ToggleGroupItem>
          </ToggleGroup>
          <ButtonGroup aria-label="Marks">
            {MARK_ORDER.map(kind => {
              const look = MARK_LOOK[kind];
              return <Tooltip key={kind}>
                  <TooltipTrigger asChild>
                    <Button type="button" variant="outline" size="sm" aria-label={MARKS[kind].label} aria-describedby={hint} onMousedown={e => e.preventDefault()} onClick={() => mark.value(kind)}>
                      <Annotate type={look.type} color={look.color} kind={look.kind} seed={`tool-${kind}`} class="px-1">
                        Aa
                      </Annotate>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent seed={`tip-${kind}`}>{MARKS[kind].label}</TooltipContent>
                </Tooltip>;
            })}
          </ButtonGroup>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon-sm" class="ms-auto" aria-label="Tear this page out">
                <Icon name="trash" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent tone="danger" seed="tear-out">
              <AlertDialogHeader>
                <AlertDialogMedia tone="danger">
                  <Icon name="trash" />
                </AlertDialogMedia>
                <AlertDialogTitle>Tear this page out?</AlertDialogTitle>
                <AlertDialogDescription>“{note.value.title || "Untitled"}” goes in the bin with everything written on it.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep it</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={onDelete.value}>
                  Tear it out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <p id={hint} class="basis-full text-sm text-muted-foreground">
            Select some words in Write, then press a mark. Press it again to take it off.
          </p>
        </Paper>
      </TooltipProvider>

      <ScrollArea class="min-h-0 flex-1" bleed>
        <Notebook as="div" binding="spiral" pages={2} tilt={0.15} seed={`notes-page`} class="ms-3 min-h-[30rem]">
          <NotebookPage aria-label={note.value.title || "Untitled"}>
            <NotebookTitle>
              {mode.value === "write" ? <InputControl ref={title} aria-label="Title" placeholder="Untitled" value={note.value.title} onChange={(e: Event) => onChange.value({
                title: (e.target as HTMLInputElement).value
              })} class="block h-7 w-full bg-transparent p-0 font-script text-[1.75rem] leading-7 font-bold text-ink-you outline-offset-2 placeholder:text-pencil-text focus-visible:outline-2 focus-visible:outline-focus" /> : note.value.title || "Untitled"}
            </NotebookTitle>
            {mode.value === "write" ? <TextareaControl ref={area} aria-label="Note" aria-describedby={hint} placeholder="Start writing on the first line." rows={10} value={note.value.body} onChange={(e: Event) => onChange.value({
              body: (e.target as HTMLTextAreaElement).value
            })} class="block min-h-70 w-full resize-none p-0 text-[17px] leading-7 text-ink-you" /> : <div onDblclick={() => onModeChange.value("write")}>
                <NotesAppMarked body={note.value.body} seed={note.value.id} />
              </div>}
            <div class="mt-7 flex h-7 items-center gap-3 text-sm text-muted-foreground">
              <span>times I have read it</span>
              <Tally count={note.value.reads} size="md" label={`Read ${note.value.reads} times`} seed={`${note.value.id}-reads`} />
              <Button size="xs" variant="ghost" onClick={() => onChange.value({
                reads: note.value.reads + 1
              })} aria-label="Count another read">
                +1
              </Button>
            </div>
            <p class="ll-num h-7 text-sm text-muted-foreground">
              {wordCount(note.value.body)} words · {notebookName.value}
            </p>
          </NotebookPage>
        </Notebook>
      </ScrollArea>
    </section>;
  };
});
