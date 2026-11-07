// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
export const REFERENCE_DAY = "2026-09-25";
export const visitorRows: ReadonlyArray<readonly [string, number, number]> = [["2026-06-27", 143, 255], ["2026-06-28", 171, 259], ["2026-06-29", 256, 185], ["2026-06-30", 270, 154], ["2026-07-01", 323, 165], ["2026-07-02", 243, 220], ["2026-07-03", 359, 182], ["2026-07-04", 175, 325], ["2026-07-05", 174, 298], ["2026-07-06", 340, 197], ["2026-07-07", 244, 191], ["2026-07-08", 341, 189], ["2026-07-09", 301, 210], ["2026-07-10", 280, 180], ["2026-07-11", 202, 253], ["2026-07-12", 134, 285], ["2026-07-13", 250, 196], ["2026-07-14", 301, 246], ["2026-07-15", 401, 169], ["2026-07-16", 250, 252], ["2026-07-17", 262, 214], ["2026-07-18", 144, 305], ["2026-07-19", 135, 288], ["2026-07-20", 260, 223], ["2026-07-21", 340, 174], ["2026-07-22", 291, 210], ["2026-07-23", 335, 247], ["2026-07-24", 377, 251], ["2026-07-25", 165, 245], ["2026-07-26", 190, 321], ["2026-07-27", 354, 223], ["2026-07-28", 345, 172], ["2026-07-29", 347, 216], ["2026-07-30", 356, 259], ["2026-07-31", 279, 249], ["2026-08-01", 202, 358], ["2026-08-02", 214, 386], ["2026-08-03", 269, 263], ["2026-08-04", 423, 201], ["2026-08-05", 323, 264], ["2026-08-06", 427, 288], ["2026-08-07", 277, 279], ["2026-08-08", 195, 321], ["2026-08-09", 169, 367], ["2026-08-10", 340, 207], ["2026-08-11", 297, 262], ["2026-08-12", 452, 273], ["2026-08-13", 303, 183], ["2026-08-14", 370, 244], ["2026-08-15", 223, 347], ["2026-08-16", 177, 422], ["2026-08-17", 453, 214], ["2026-08-18", 341, 289], ["2026-08-19", 288, 267], ["2026-08-20", 374, 248], ["2026-08-21", 328, 191], ["2026-08-22", 188, 268], ["2026-08-23", 160, 309], ["2026-08-24", 415, 251], ["2026-08-25", 488, 196], ["2026-08-26", 478, 240], ["2026-08-27", 462, 227], ["2026-08-28", 324, 215], ["2026-08-29", 168, 369], ["2026-08-30", 166, 423], ["2026-08-31", 327, 254], ["2026-09-01", 305, 261], ["2026-09-02", 468, 305], ["2026-09-03", 446, 232], ["2026-09-04", 427, 328], ["2026-09-05", 172, 280], ["2026-09-06", 239, 375], ["2026-09-07", 324, 272], ["2026-09-08", 497, 215], ["2026-09-09", 423, 220], ["2026-09-10", 354, 280], ["2026-09-11", 423, 309], ["2026-09-12", 268, 387], ["2026-09-13", 188, 435], ["2026-09-14", 499, 273], ["2026-09-15", 491, 346], ["2026-09-16", 528, 276], ["2026-09-17", 341, 352], ["2026-09-18", 412, 243], ["2026-09-19", 181, 303], ["2026-09-20", 182, 455], ["2026-09-21", 384, 319], ["2026-09-22", 351, 231], ["2026-09-23", 393, 315], ["2026-09-24", 403, 298], ["2026-09-25", 498, 265]];
export const visitors = visitorRows.map(([date, desktop, mobile]) => ({
  date,
  desktop,
  mobile
}));
export type Section = {
  id: number;
  header: string;
  type: string;
  status: "Done" | "In Process" | "Not Started";
  target: string;
  limit: string;
  reviewer: string;
};
export const UNASSIGNED = "Assign reviewer";
export const SECTION_TYPES = ["Cover page", "Table of contents", "Narrative", "Technical content", "Visual", "Legal"] as const;
export const REVIEWERS = ["Eddie Lake", "Jamik Tashpulatov", "Emily Whalen"] as const;
export const sections: Section[] = [{
  id: 1,
  header: "Cover page" as const,
  type: "Cover page" as const,
  status: "In Process" as const,
  target: "18" as const,
  limit: "5" as const,
  reviewer: "Eddie Lake" as const
}, {
  id: 2,
  header: "Table of contents" as const,
  type: "Table of contents" as const,
  status: "Done" as const,
  target: "29" as const,
  limit: "24" as const,
  reviewer: "Eddie Lake" as const
}, {
  id: 3,
  header: "Executive summary" as const,
  type: "Narrative" as const,
  status: "Done" as const,
  target: "10" as const,
  limit: "13" as const,
  reviewer: "Eddie Lake" as const
}, {
  id: 4,
  header: "Technical approach" as const,
  type: "Narrative" as const,
  status: "Done" as const,
  target: "27" as const,
  limit: "23" as const,
  reviewer: "Jamik Tashpulatov" as const
}, {
  id: 5,
  header: "Design" as const,
  type: "Narrative" as const,
  status: "In Process" as const,
  target: "2" as const,
  limit: "16" as const,
  reviewer: "Jamik Tashpulatov" as const
}, {
  id: 6,
  header: "Capabilities" as const,
  type: "Narrative" as const,
  status: "In Process" as const,
  target: "20" as const,
  limit: "8" as const,
  reviewer: "Jamik Tashpulatov" as const
}, {
  id: 7,
  header: "Integration with existing systems" as const,
  type: "Narrative" as const,
  status: "In Process" as const,
  target: "19" as const,
  limit: "21" as const,
  reviewer: "Jamik Tashpulatov" as const
}, {
  id: 8,
  header: "Innovation and Advantages" as const,
  type: "Narrative" as const,
  status: "Done" as const,
  target: "25" as const,
  limit: "26" as const,
  reviewer: UNASSIGNED
}, {
  id: 9,
  header: "Overview of EMR's Innovative Solutions" as const,
  type: "Technical content" as const,
  status: "Done" as const,
  target: "7" as const,
  limit: "23" as const,
  reviewer: UNASSIGNED
}, {
  id: 10,
  header: "Advanced Algorithms and Machine Learning" as const,
  type: "Narrative" as const,
  status: "Done" as const,
  target: "30" as const,
  limit: "28" as const,
  reviewer: UNASSIGNED
}, {
  id: 11,
  header: "Adaptive Communication Protocols" as const,
  type: "Narrative" as const,
  status: "Done" as const,
  target: "9" as const,
  limit: "31" as const,
  reviewer: "Emily Whalen" as const
}, {
  id: 12,
  header: "Advantages Over Current Technologies" as const,
  type: "Narrative" as const,
  status: "Done" as const,
  target: "12" as const,
  limit: "0" as const,
  reviewer: "Emily Whalen" as const
}, {
  id: 13,
  header: "Past Performance" as const,
  type: "Narrative" as const,
  status: "Done" as const,
  target: "22" as const,
  limit: "33" as const,
  reviewer: "Emily Whalen" as const
}, {
  id: 14,
  header: "Customer Feedback and Satisfaction Levels" as const,
  type: "Narrative" as const,
  status: "Done" as const,
  target: "15" as const,
  limit: "34" as const,
  reviewer: "Emily Whalen" as const
}, {
  id: 15,
  header: "Implementation Challenges and Solutions" as const,
  type: "Narrative" as const,
  status: "Done" as const,
  target: "3" as const,
  limit: "35" as const,
  reviewer: "Jamik Tashpulatov" as const
}, {
  id: 16,
  header: "Security Measures and Data Protection Policies" as const,
  type: "Narrative" as const,
  status: "In Process" as const,
  target: "6" as const,
  limit: "36" as const,
  reviewer: UNASSIGNED
}, {
  id: 17,
  header: "Scalability and Future Proofing" as const,
  type: "Narrative" as const,
  status: "Done" as const,
  target: "4" as const,
  limit: "37" as const,
  reviewer: UNASSIGNED
}, {
  id: 18,
  header: "Cost-Benefit Analysis" as const,
  type: "Narrative" as const,
  status: "Done" as const,
  target: "14" as const,
  limit: "38" as const,
  reviewer: "Eddie Lake" as const
}, {
  id: 19,
  header: "User Training and Onboarding Experience" as const,
  type: "Narrative" as const,
  status: "Done" as const,
  target: "17" as const,
  limit: "39" as const,
  reviewer: "Eddie Lake" as const
}, {
  id: 20,
  header: "Future Development Roadmap" as const,
  type: "Narrative" as const,
  status: "Done" as const,
  target: "11" as const,
  limit: "40" as const,
  reviewer: "Jamik Tashpulatov" as const
}, {
  id: 21,
  header: "System Architecture Overview" as const,
  type: "Technical content" as const,
  status: "In Process" as const,
  target: "24" as const,
  limit: "18" as const,
  reviewer: "Emily Whalen" as const
}, {
  id: 22,
  header: "Risk Management Plan" as const,
  type: "Narrative" as const,
  status: "Not Started" as const,
  target: "15" as const,
  limit: "22" as const,
  reviewer: UNASSIGNED
}, {
  id: 23,
  header: "Compliance Documentation" as const,
  type: "Legal" as const,
  status: "Not Started" as const,
  target: "31" as const,
  limit: "27" as const,
  reviewer: "Emily Whalen" as const
}, {
  id: 24,
  header: "API Documentation" as const,
  type: "Technical content" as const,
  status: "Done" as const,
  target: "8" as const,
  limit: "12" as const,
  reviewer: "Jamik Tashpulatov" as const
}, {
  id: 25,
  header: "User Interface Mockups" as const,
  type: "Visual" as const,
  status: "In Process" as const,
  target: "19" as const,
  limit: "25" as const,
  reviewer: "Eddie Lake" as const
}];
export const monthly = [{
  month: "January" as const,
  desktop: 186,
  mobile: 80
}, {
  month: "February" as const,
  desktop: 305,
  mobile: 200
}, {
  month: "March" as const,
  desktop: 237,
  mobile: 120
}, {
  month: "April" as const,
  desktop: 73,
  mobile: 190
}, {
  month: "May" as const,
  desktop: 209,
  mobile: 130
}, {
  month: "June" as const,
  desktop: 214,
  mobile: 140
}];
export const user = {
  name: "Jo Delacroix" as const,
  email: "jo@inkwell.example" as const
};
