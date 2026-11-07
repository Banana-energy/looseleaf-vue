// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
export type Folder = "inbox" | "archive" | "trash";
export type Mail = {
  id: string;
  from: string;
  address: string;
  subject: string;
  date: string;
  body: string[];
  unread: boolean;
  starred: boolean;
  folder: Folder;
  attachments: string[];
  replies: string[];
};
export const FOLDERS: ReadonlyArray<{
  id: Folder;
  label: string;
  icon: string;
}> = [{
  id: "inbox" as const,
  label: "Inbox" as const,
  icon: "inbox" as const
}, {
  id: "archive" as const,
  label: "Archive" as const,
  icon: "archive" as const
}, {
  id: "trash" as const,
  label: "Trash" as const,
  icon: "trash" as const
}];
export const mails: Mail[] = [{
  id: "m1" as const,
  from: "Ada Lovelace" as const,
  address: "ada@marigold.example" as const,
  subject: "The sticker sheet, finally" as const,
  date: "9:12" as const,
  body: ["Jo,", "I drew the snail. He is smug, which I think is right. Have a look before we send the sheet to print? I would like to keep the shell as it is.", "Ada"],
  unread: true,
  starred: false,
  folder: "inbox" as const,
  attachments: ["snail-sticker.png"],
  replies: []
}, {
  id: "m2" as const,
  from: "Post Office, rue Cler" as const,
  address: "noreply@laposte.example" as const,
  subject: "Your parcel is waiting for you" as const,
  date: "8:03" as const,
  body: ["A parcel addressed to Marigold Paper Co. is at the counter.", "Please bring a piece of identification. We are open until six, and until noon on Saturdays."],
  unread: true,
  starred: false,
  folder: "inbox" as const,
  attachments: [],
  replies: []
}, {
  id: "m3" as const,
  from: "Mika Kobayashi" as const,
  address: "mika@marigold.example" as const,
  subject: "Photos of the field notebooks" as const,
  date: "Sep 24" as const,
  body: ["Hello!", "The light was lovely at four, so I took the whole set again against the kraft paper. They are in the shared folder, the ones marked with a small star are my favorites.", "M."],
  unread: false,
  starred: true,
  folder: "inbox" as const,
  attachments: ["field-notebooks-contact-sheet.pdf"],
  replies: []
}, {
  id: "m4" as const,
  from: "Sam Reyes" as const,
  address: "sam@marigold.example" as const,
  subject: "Postal code field is fixed" as const,
  date: "Sep 23" as const,
  body: ["It was a stray space after the city name. Nothing more mysterious than that.", "It is live now; two customers who got stuck have been written to."],
  unread: false,
  starred: false,
  folder: "inbox" as const,
  attachments: [],
  replies: []
}, {
  id: "m5" as const,
  from: "Lyon Paper Fair" as const,
  address: "stands@lyonpapier.example" as const,
  subject: "Your stand is confirmed" as const,
  date: "Sep 22" as const,
  body: ["We are delighted to confirm stand 14 (two meters by three) for the first and second of October.", "Set-up begins at 7:30 on the Thursday. There is a coffee cart by the main door, and it is very good."],
  unread: false,
  starred: true,
  folder: "inbox" as const,
  attachments: ["stand-plan.pdf", "set-up-times.pdf"],
  replies: []
}, {
  id: "m6" as const,
  from: "Ada Lovelace" as const,
  address: "ada@marigold.example" as const,
  subject: "Supper on Saturday?" as const,
  date: "Sep 21" as const,
  body: ["Birthday supper at mine, half past seven. Nothing fancy, and please do not bring a present. Bring the good bread if you pass the bakery."],
  unread: false,
  starred: false,
  folder: "inbox" as const,
  attachments: [],
  replies: []
}, {
  id: "m7" as const,
  from: "Bank of the Left Bank" as const,
  address: "statements@bank.example" as const,
  subject: "Your statement is ready" as const,
  date: "Sep 20" as const,
  body: ["Your September statement is ready to read. It is not very exciting, which is how we like it."],
  unread: false,
  starred: false,
  folder: "inbox" as const,
  attachments: [],
  replies: []
}, {
  id: "m8" as const,
  from: "Mum" as const,
  address: "mum@family.example" as const,
  subject: "Did you eat?" as const,
  date: "Sep 19" as const,
  body: ["Just checking. Also the plum tree has gone mad, so there will be jam. Come and get some jam.", "x"],
  unread: false,
  starred: true,
  folder: "inbox" as const,
  attachments: [],
  replies: []
}, {
  id: "m9" as const,
  from: "Pemberton & Sons" as const,
  address: "accounts@pemberton.example" as const,
  subject: "Invoice 118, paid with thanks" as const,
  date: "Sep 18" as const,
  body: ["Payment for invoice 118 has gone out today. A receipt is attached for your files."],
  unread: false,
  starred: false,
  folder: "archive" as const,
  attachments: ["receipt-118.pdf"],
  replies: []
}, {
  id: "m10" as const,
  from: "Stationery Weekly" as const,
  address: "editor@stationeryweekly.example" as const,
  subject: "Ten pens you will not need" as const,
  date: "Sep 12" as const,
  body: ["A list of ten pens, all of which you will want anyway."],
  unread: false,
  starred: false,
  folder: "trash" as const,
  attachments: [],
  replies: []
}];
