// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { IndexCard, IndexCardContent, IndexCardFooter, IndexCardHeader, IndexCardTitle } from "@/components/ui/index-card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Paper } from "@/components/ui/paper";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ALL, NOTEBOOKS, stripMarks, type Note } from "@/blocks/notes-app/components/notes-app-data";
import { cn } from "@/lib/utils";
type Props = {
  notes: Note[];
  notebook: string;
  onNotebookChange: (id: string) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  headingRef?: UI.Ref<HTMLHeadingElement>;
  className?: string;
};
const inNotebook = (notes: Note[], id: string) => id === ALL ? notes : notes.filter(n => n.notebook === id);
const nameOf = (id: string) => NOTEBOOKS.find(n => n.id === id)?.name ?? id;
const NoteCard = defineUi<{
  note: Note;
  selected: boolean;
  onSelect: () => void;
}>("NoteCard", ["note", "selected", "onSelect"], (_props, {
  slots: _slots
}) => {
  const note = computed(() => _props["note"]);
  const selected = computed(() => _props["selected"]);
  const onSelect = computed(() => _props["onSelect"]);
  const title = computed(() => note.value.title || "Untitled");
  return () => {
    return <li>
      <IndexCard seed={note.value.id} flag={selected.value ? "lemon" as const : false} class="min-h-0 max-w-none px-4">
        <IndexCardHeader>
          <IndexCardTitle role="heading" aria-level={3} class="text-2xl @max-md/notes:text-[1.3rem]">
            {title.value}
          </IndexCardTitle>
        </IndexCardHeader>
        <IndexCardContent class="line-clamp-2 text-[15px]">{stripMarks(note.value.body).replace(/\s+/g, " ").trim() || "Nothing written yet."}</IndexCardContent>
        <IndexCardFooter>
          <span class="truncate">{nameOf(note.value.notebook)}</span>
          <span class="shrink-0">{note.value.updated}</span>
        </IndexCardFooter>
        <button type="button" aria-label={`Open ${title.value}`} aria-current={selected.value ? "true" as const : undefined} onClick={onSelect.value} class="absolute inset-0 z-10 cursor-pointer outline-offset-4 focus-visible:outline-2 focus-visible:outline-focus" />
      </IndexCard>
    </li>;
  };
});
export const NotesAppNoteList = defineUi<Props>("NotesAppNoteList", ["notes", "notebook", "onNotebookChange", "selectedId", "onSelect", "onNew", "headingRef", "class"], (_props, {
  slots: _slots
}) => {
  const notes = computed(() => _props["notes"]);
  const notebook = computed(() => _props["notebook"]);
  const onNotebookChange = computed(() => _props["onNotebookChange"]);
  const selectedId = computed(() => _props["selectedId"]);
  const onSelect = computed(() => _props["onSelect"]);
  const onNew = computed(() => _props["onNew"]);
  const headingRef = computed(() => _props["headingRef"]);
  const className = computed(() => _props["class"]);
  const heading = useId();
  const query = shallowRef(initialState(""));
  const setQuery = stateSetter(query);
  const q = computed(() => query.value.trim().toLowerCase());
  return () => {
    return <Paper as="aside" stock="pad" rules="none" tilt={-0.3} fastener="binder-clip" seed="notes-shelf" aria-labelledby={heading} data-slot="notes-app-list" class={cn("flex min-h-0 flex-col gap-3 pt-6 pb-3", className.value)}>
      <div class="flex items-center justify-between gap-3 px-4">
        <h2 id={heading} ref={headingRef.value} tabindex={-1} class="font-script text-[1.7rem] leading-none font-semibold outline-offset-4 focus-visible:outline-2 focus-visible:outline-focus">
          Notes
        </h2>
        <Button size="sm" onClick={onNew.value}>
          <Icon name="plus" />
          New page
        </Button>
      </div>
      <div class="px-4">
        <InputGroup>
          <InputGroupAddon>
            <Icon name="search" />
          </InputGroupAddon>
          <InputGroupInput type="search" placeholder="Search this notebook" aria-label="Search this notebook" value={query.value} onChange={(e: Event) => setQuery((e.target as HTMLInputElement).value)} />
        </InputGroup>
      </div>

      <Tabs orientation="vertical" value={notebook.value} onValueChange={onNotebookChange.value} class="min-h-0 flex-1 gap-2 ps-3 pe-1">
        <TabsList aria-label="Notebooks" class="w-28 shrink-0">
          {NOTEBOOKS.map(nb => <TabsTrigger key={nb.id} value={nb.id} seed={`nb-${nb.id}`}>
              {nb.name}
              <span class="ll-num ms-auto text-xs font-normal">{inNotebook(notes.value, nb.id).length}</span>
            </TabsTrigger>)}
        </TabsList>
        {NOTEBOOKS.map(nb => {
          const rows = inNotebook(notes.value, nb.id).filter(n => !q.value || `${n.title} ${stripMarks(n.body)}`.toLowerCase().includes(q.value));
          return <TabsContent key={nb.id} value={nb.id} class="min-h-0 min-w-0">
              <ScrollArea class="h-full" bleed>
                {rows.length === 0 ? <Empty seed={`empty-${nb.id}`} class="p-2 md:p-4">
                    <EmptyHeader>
                      <EmptyMedia pose={q.value ? "search" as const : "sleep" as const} size={88} />
                      <EmptyTitle>{q.value ? "No page says that" as const : "Nothing here yet" as const}</EmptyTitle>
                      <EmptyDescription>{q.value ? `Try a shorter word than “${query.value.trim()}”.` : `${nb.name} is a clean page waiting for a first line.`}</EmptyDescription>
                    </EmptyHeader>
                    {q.value ? null : <EmptyContent>
                        <Button size="sm" onClick={onNew.value}>
                          Start a page
                        </Button>
                      </EmptyContent>}
                  </Empty> : <ul aria-label={`${nb.name} pages`} class="grid grid-cols-1 gap-4">
                    {rows.map(n => <NoteCard key={n.id} note={n} selected={n.id === selectedId.value} onSelect={() => onSelect.value(n.id)} />)}
                  </ul>}
              </ScrollArea>
            </TabsContent>;
        })}
      </Tabs>
    </Paper>;
  };
});
