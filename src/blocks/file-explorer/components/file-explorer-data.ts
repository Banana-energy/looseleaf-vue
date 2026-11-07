// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
export type Kind = "folder" | "doc" | "pdf" | "image" | "sheet" | "audio" | "video" | "code" | "archive";
export type FileNode = {
  id: string;
  parent: string;
  name: string;
  kind: Kind;
  size?: number;
  modified: string;
};
export const ROOTS: ReadonlyArray<{
  id: string;
  name: string;
}> = [{
  id: "projects" as const,
  name: "Projects" as const
}, {
  id: "receipts" as const,
  name: "Receipts" as const
}, {
  id: "photos" as const,
  name: "Photos" as const
}, {
  id: "music" as const,
  name: "Music" as const
}];
export const KIND_ICON: Record<Kind, string> = {
  folder: "folder" as const,
  doc: "file-text" as const,
  pdf: "file" as const,
  image: "image" as const,
  sheet: "table" as const,
  audio: "music" as const,
  video: "video" as const,
  code: "file-code" as const,
  archive: "archive" as const
};
export const KIND_LABEL: Record<Kind, string> = {
  folder: "Folder" as const,
  doc: "Document" as const,
  pdf: "PDF" as const,
  image: "Image" as const,
  sheet: "Spreadsheet" as const,
  audio: "Audio" as const,
  video: "Video" as const,
  code: "Code" as const,
  archive: "Archive" as const
};
const KB = 1024;
const MB = 1024 * KB;
export const nodes: FileNode[] = [{
  id: "f1" as const,
  parent: "projects" as const,
  name: "Autumn drop" as const,
  kind: "folder" as const,
  modified: "2026-09-25" as const
}, {
  id: "f2" as const,
  parent: "projects" as const,
  name: "Journal" as const,
  kind: "folder" as const,
  modified: "2026-09-22" as const
}, {
  id: "n1" as const,
  parent: "projects" as const,
  name: "brand-guide.pdf" as const,
  kind: "pdf" as const,
  size: 5.8 * MB,
  modified: "2026-09-02" as const
}, {
  id: "n2" as const,
  parent: "projects" as const,
  name: "notes-2026.txt" as const,
  kind: "doc" as const,
  size: 18 * KB,
  modified: "2026-09-24" as const
}, {
  id: "n3" as const,
  parent: "f1" as const,
  name: "price-tags.pdf" as const,
  kind: "pdf" as const,
  size: 1.2 * MB,
  modified: "2026-09-27" as const
}, {
  id: "n4" as const,
  parent: "f1" as const,
  name: "sticker-sheet-v3.png" as const,
  kind: "image" as const,
  size: 3.4 * MB,
  modified: "2026-09-25" as const
}, {
  id: "n5" as const,
  parent: "f1" as const,
  name: "newsletter-draft.doc" as const,
  kind: "doc" as const,
  size: 48 * KB,
  modified: "2026-09-25" as const
}, {
  id: "n6" as const,
  parent: "f1" as const,
  name: "launch-plan.xlsx" as const,
  kind: "sheet" as const,
  size: 96 * KB,
  modified: "2026-09-21" as const
}, {
  id: "n7" as const,
  parent: "f2" as const,
  name: "why-the-margin.md" as const,
  kind: "doc" as const,
  size: 7 * KB,
  modified: "2026-09-22" as const
}, {
  id: "n8" as const,
  parent: "f2" as const,
  name: "cover-sketches.zip" as const,
  kind: "archive" as const,
  size: 12.4 * MB,
  modified: "2026-09-10" as const
}, {
  id: "f3" as const,
  parent: "receipts" as const,
  name: "2026" as const,
  kind: "folder" as const,
  modified: "2026-09-30" as const
}, {
  id: "n9" as const,
  parent: "receipts" as const,
  name: "invoice-118.pdf" as const,
  kind: "pdf" as const,
  size: 210 * KB,
  modified: "2026-09-18" as const
}, {
  id: "n10" as const,
  parent: "receipts" as const,
  name: "washi-tape-order.pdf" as const,
  kind: "pdf" as const,
  size: 134 * KB,
  modified: "2026-09-14" as const
}, {
  id: "n11" as const,
  parent: "f3" as const,
  name: "september.pdf" as const,
  kind: "pdf" as const,
  size: 322 * KB,
  modified: "2026-09-25" as const
}, {
  id: "n12" as const,
  parent: "f3" as const,
  name: "august.pdf" as const,
  kind: "pdf" as const,
  size: 290 * KB,
  modified: "2026-08-31" as const
}, {
  id: "n13" as const,
  parent: "f3" as const,
  name: "july.pdf" as const,
  kind: "pdf" as const,
  size: 305 * KB,
  modified: "2026-07-31" as const
}, {
  id: "f4" as const,
  parent: "photos" as const,
  name: "Notebooks" as const,
  kind: "folder" as const,
  modified: "2026-09-24" as const
}, {
  id: "f5" as const,
  parent: "photos" as const,
  name: "Studio" as const,
  kind: "folder" as const,
  modified: "2026-09-12" as const
}, {
  id: "n14" as const,
  parent: "photos" as const,
  name: "ada-birthday.jpg" as const,
  kind: "image" as const,
  size: 2.9 * MB,
  modified: "2026-09-26" as const
}, {
  id: "n15" as const,
  parent: "f4" as const,
  name: "notebook-01.jpg" as const,
  kind: "image" as const,
  size: 3.1 * MB,
  modified: "2026-09-24" as const
}, {
  id: "n16" as const,
  parent: "f4" as const,
  name: "notebook-02.jpg" as const,
  kind: "image" as const,
  size: 2.8 * MB,
  modified: "2026-09-24" as const
}, {
  id: "n17" as const,
  parent: "f4" as const,
  name: "notebook-03.jpg" as const,
  kind: "image" as const,
  size: 3.4 * MB,
  modified: "2026-09-24" as const
}, {
  id: "n18" as const,
  parent: "f5" as const,
  name: "kiln-day.jpg" as const,
  kind: "image" as const,
  size: 4.2 * MB,
  modified: "2026-09-10" as const
}, {
  id: "n19" as const,
  parent: "f5" as const,
  name: "desk-in-the-morning.jpg" as const,
  kind: "image" as const,
  size: 3.7 * MB,
  modified: "2026-09-12" as const
}, {
  id: "n20" as const,
  parent: "music" as const,
  name: "Sunday morning.mp3" as const,
  kind: "audio" as const,
  size: 6.1 * MB,
  modified: "2026-08-16" as const
}, {
  id: "n21" as const,
  parent: "music" as const,
  name: "Field recording, rain.wav" as const,
  kind: "audio" as const,
  size: 41 * MB,
  modified: "2026-09-03" as const
}, {
  id: "n22" as const,
  parent: "music" as const,
  name: "kiln-playlist.m3u" as const,
  kind: "code" as const,
  size: 2 * KB,
  modified: "2026-09-10" as const
}, {
  id: "n23" as const,
  parent: "music" as const,
  name: "studio-tour.mov" as const,
  kind: "video" as const,
  size: 212 * MB,
  modified: "2026-09-19" as const
}];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function formatSize(bytes: number): string {
  if (bytes < KB) return `${Math.round(bytes)} B`;
  if (bytes < MB) return `${Math.round(bytes / KB)} KB`;
  const mb = bytes / MB;
  return `${mb >= 100 ? Math.round(mb) : Math.round(mb * 10) / 10} MB`;
}
export function formatDay(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${MONTHS[Number(m) - 1] ?? m} ${Number(d)}${y === "2026" ? "" as const : `, ${y}`}`;
}
export function withDescendants(list: readonly FileNode[], id: string): Set<string> {
  const out = new Set<string>([id]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const n of list) if (!out.has(n.id) && out.has(n.parent)) out.add(n.id), grew = true;
  }
  return out;
}
export const countIn = (list: readonly FileNode[], id: string): number => list.filter(n => n.parent === id).length;
