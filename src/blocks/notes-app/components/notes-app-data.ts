// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
export type Notebook = {
  id: string;
  name: string;
};
export type Note = {
  id: string;
  notebook: string;
  title: string;
  body: string;
  updated: string;
  reads: number;
};
export const ALL = "all";
export const FEATURED = "owning-books";
export const NOTEBOOKS: Notebook[] = [{
  id: ALL,
  name: "Everything" as const
}, {
  id: "recipes" as const,
  name: "Recipes" as const
}, {
  id: "garden" as const,
  name: "Garden" as const
}, {
  id: "reading" as const,
  name: "Reading" as const
}, {
  id: "trips" as const,
  name: "Trips" as const
}, {
  id: "scraps" as const,
  name: "Scraps" as const
}];
export const NOTES: Note[] = [{
  id: "owning-books" as const,
  notebook: "reading" as const,
  title: "On owning books" as const,
  body: `Most of what I remember from a book is in the ((margins)): an arrow, a question mark, a small argument with a dead author.

The good bits get ==a swipe of yellow== so I can find them on the next read, and the parts I do not believe get __a red pencil__.

By the third reading the book is more mine than the ~~writer's~~, which is the whole point of owning one.`,
  updated: "10 minutes ago" as const,
  reads: 7
}, {
  id: "porridge" as const,
  notebook: "recipes" as const,
  title: "Porridge, the slow way" as const,
  body: `Oats, water, a pinch of salt. Nothing else until the end.

Bring the water to a ==small boil==, then turn it down until it just shivers. Stir with the wooden spoon, ((always the same direction)). My gran was firm about it.

Twelve minutes. Honey, a splash of cold milk, and __eat it standing at the window__.`,
  updated: "2 hours ago" as const,
  reads: 7
}, {
  id: "soup" as const,
  notebook: "recipes" as const,
  title: "Soup that forgives" as const,
  body: `Any sad vegetables, one onion, plenty of butter.

Cook the onion until it gives up, ==then add everything else==. Water to cover. Salt, a bay leaf, patience.

~~Cream~~ Not needed. A spoon of yoghurt and black pepper on top.`,
  updated: "Yesterday" as const,
  reads: 3
}, {
  id: "toast" as const,
  notebook: "recipes" as const,
  title: "Toast, honestly" as const,
  body: `Good bread, ((thick)) slices, a toaster you trust.

Butter goes on while it is __still too hot to hold__. Jam only if you mean it.`,
  updated: "Last week" as const,
  reads: 12
}, {
  id: "beds" as const,
  notebook: "garden" as const,
  title: "What went in this week" as const,
  body: `Sunday: sweet peas along the fence, ==nine of them==, in the wet corner.
Monday: rain. Nothing.
Wednesday: the first radishes are up. ((Already.))

Still to do: move the rosemary before it sulks.`,
  updated: "Tuesday" as const,
  reads: 4
}, {
  id: "slugs" as const,
  notebook: "garden" as const,
  title: "Slugs: a truce" as const,
  body: `They get the outer lettuce. I get the inner ones. __Everyone eats.__

~~Beer traps~~ Did not work, and smelled.`,
  updated: "Last month" as const,
  reads: 2
}, {
  id: "lisbon" as const,
  notebook: "trips" as const,
  title: "Lisbon, three days" as const,
  body: `Day one: tram 28 before the crowds, then ==pastel de nata==. Two, not one.
Day two: walk uphill on purpose. ((Bring the good shoes.))
Day three: a bookshop with a cat, and __no plan at all__.

Ask Jo about the tiles.`,
  updated: "3 days ago" as const,
  reads: 5
}, {
  id: "scrap-1" as const,
  notebook: "scraps" as const,
  title: "Things to ask the printer" as const,
  body: `Is the blue ==actually== that blue?
Deckle edge: extra, or included?
Proofs by Thursday, ((please)).`,
  updated: "Monday" as const,
  reads: 1
}];
export type MarkKind = "highlight" | "underline" | "circle" | "strike";
export const MARKS: Record<MarkKind, {
  open: string;
  close: string;
  label: string;
}> = {
  highlight: {
    open: "==" as const,
    close: "==" as const,
    label: "Highlight" as const
  },
  underline: {
    open: "__" as const,
    close: "__" as const,
    label: "Underline" as const
  },
  circle: {
    open: "((" as const,
    close: "))" as const,
    label: "Circle" as const
  },
  strike: {
    open: "~~" as const,
    close: "~~" as const,
    label: "Cross out" as const
  }
};
export type Piece = {
  text: string;
  mark?: MarkKind;
};
const MARK_RE = /==(.+?)==|__(.+?)__|\(\((.+?)\)\)|~~(.+?)~~/g;
const ORDER: MarkKind[] = ["highlight", "underline", "circle", "strike"];
export function parseLine(line: string): Piece[] {
  const out: Piece[] = [];
  let at = 0;
  for (const m of line.matchAll(MARK_RE)) {
    const i = m.index ?? 0;
    if (i > at) out.push({
      text: line.slice(at, i)
    });
    const k = m.findIndex((g, n) => n > 0 && g !== undefined) - 1;
    out.push({
      text: m[k + 1] ?? "",
      mark: ORDER[k]
    });
    at = i + m[0].length;
  }
  if (at < line.length) out.push({
    text: line.slice(at)
  });
  return out;
}
export function stripMarks(body: string): string {
  return body.split("\n").map(l => parseLine(l).map(p => p.text).join("")).join("\n");
}
export const wordCount = (body: string): number => stripMarks(body).split(/\s+/).filter(Boolean).length;
export type Selection = {
  text: string;
  start: number;
  end: number;
};
export function toggleMark(text: string, start: number, end: number, kind: MarkKind): Selection | null {
  const {
    open,
    close
  } = MARKS[kind];
  if (end <= start) return null;
  const selected = text.slice(start, end);
  if (text.slice(start - open.length, start) === open && text.slice(end, end + close.length) === close) {
    const next = text.slice(0, start - open.length) + selected + text.slice(end + close.length);
    return {
      text: next,
      start: start - open.length,
      end: end - open.length
    };
  }
  if (selected.length > open.length + close.length && selected.startsWith(open) && selected.endsWith(close)) {
    const inner = selected.slice(open.length, selected.length - close.length);
    return {
      text: text.slice(0, start) + inner + text.slice(end),
      start,
      end: start + inner.length
    };
  }
  const parts: {
    from: number;
    to: number;
  }[] = [];
  let cursor = start;
  for (const line of selected.split("\n")) {
    const lead = line.length - line.trimStart().length;
    const body = line.trim();
    if (body) parts.push({
      from: cursor + lead,
      to: cursor + lead + body.length
    });
    cursor += line.length + 1;
  }
  if (!parts.length) return null;
  let next = text;
  for (const p of [...parts].reverse()) next = next.slice(0, p.from) + open + next.slice(p.from, p.to) + close + next.slice(p.to);
  const added = parts.length * (open.length + close.length);
  return {
    text: next,
    start: parts[0].from + open.length,
    end: parts[parts.length - 1].to + added - close.length
  };
}
