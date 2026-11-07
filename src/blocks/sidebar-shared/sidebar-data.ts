// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
export interface NavLink {
  title: string;
  url: string;
  isActive?: boolean;
}
export interface NavSection {
  title: string;
  url: string;
  items: NavLink[];
}
export interface AppNavItem {
  title: string;
  url: string;
  icon: string;
  isActive?: boolean;
  badge?: string;
  items?: NavLink[];
}
export interface Team {
  name: string;
  icon: string;
  plan: string;
}
export interface Project {
  name: string;
  url: string;
  icon: string;
}
export interface Person {
  name: string;
  email: string;
}
export const docsVersions = ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"];
export const docsNav: NavSection[] = [{
  title: "Getting started" as const,
  url: "#getting-started" as const,
  items: [{
    title: "Welcome" as const,
    url: "#welcome" as const
  }, {
    title: "Sharpen your first pencil" as const,
    url: "#sharpen-your-first-pencil" as const
  }]
}, {
  title: "Writing on paper" as const,
  url: "#writing-on-paper" as const,
  items: [{
    title: "Pens & pencils" as const,
    url: "#pens-and-pencils" as const
  }, {
    title: "Paper stocks" as const,
    url: "#paper-stocks" as const
  }, {
    title: "Margins" as const,
    url: "#margins" as const,
    isActive: true
  }, {
    title: "Sticky notes" as const,
    url: "#sticky-notes" as const
  }, {
    title: "Tape & pins" as const,
    url: "#tape-and-pins" as const
  }, {
    title: "Stamps" as const,
    url: "#stamps" as const
  }, {
    title: "Doodles" as const,
    url: "#doodles" as const
  }, {
    title: "Highlighting" as const,
    url: "#highlighting" as const
  }, {
    title: "Erasing" as const,
    url: "#erasing" as const
  }, {
    title: "Printing" as const,
    url: "#printing" as const
  }, {
    title: "Sharing" as const,
    url: "#sharing" as const
  }, {
    title: "Archiving" as const,
    url: "#archiving" as const
  }]
}, {
  title: "Pen reference" as const,
  url: "#pen-reference" as const,
  items: [{
    title: "Felt tip" as const,
    url: "#felt-tip" as const
  }, {
    title: "Fineliner" as const,
    url: "#fineliner" as const
  }, {
    title: "Graphite" as const,
    url: "#graphite" as const
  }, {
    title: "Highlighter" as const,
    url: "#highlighter" as const
  }, {
    title: "Brush pen" as const,
    url: "#brush-pen" as const
  }, {
    title: "Chalk" as const,
    url: "#chalk" as const
  }]
}, {
  title: "Behind the scenes" as const,
  url: "#behind-the-scenes" as const,
  items: [{
    title: "How lines wobble" as const,
    url: "#how-lines-wobble" as const
  }, {
    title: "Reading order" as const,
    url: "#reading-order" as const
  }, {
    title: "Density" as const,
    url: "#density" as const
  }, {
    title: "Keyboard" as const,
    url: "#keyboard" as const
  }]
}, {
  title: "Pen pals" as const,
  url: "#pen-pals" as const,
  items: [{
    title: "How to contribute" as const,
    url: "#how-to-contribute" as const
  }]
}];
export const docsTrail = ["Writing on paper", "Margins"];
export const pageOutline: NavSection[] = [{
  title: "Why margins" as const,
  url: "#why-margins" as const,
  items: [{
    title: "Room to think" as const,
    url: "#room-to-think" as const
  }, {
    title: "Room to disagree" as const,
    url: "#room-to-disagree" as const
  }]
}, {
  title: "Drawing a margin" as const,
  url: "#drawing-a-margin" as const,
  items: [{
    title: "The pencil rule" as const,
    url: "#the-pencil-rule" as const,
    isActive: true
  }, {
    title: "Wide, narrow, none" as const,
    url: "#wide-narrow-none" as const
  }, {
    title: "Left-handers and right-to-left" as const,
    url: "#left-handers-and-right-to-left" as const
  }]
}, {
  title: "Notes in the margin" as const,
  url: "#notes-in-the-margin" as const,
  items: [{
    title: "Stars and asterisks" as const,
    url: "#stars-and-asterisks" as const
  }, {
    title: "Arrows that point somewhere" as const,
    url: "#arrows-that-point-somewhere" as const
  }]
}, {
  title: "Going further" as const,
  url: "#going-further" as const,
  items: [{
    title: "Sticky notes" as const,
    url: "#sticky-notes" as const
  }]
}];
export const appUser: Person = {
  name: "Jo Delacroix" as const,
  email: "jo@looseleaf.example" as const
};
export const appTeams: Team[] = [{
  name: "Looseleaf Studio" as const,
  icon: "book-open" as const,
  plan: "Notebook" as const
}, {
  name: "Pen Pals Co." as const,
  icon: "pencil" as const,
  plan: "Team" as const
}, {
  name: "Attic Press" as const,
  icon: "bookmark" as const,
  plan: "Free" as const
}];
export const appNav: AppNavItem[] = [{
  title: "Sketchbook" as const,
  url: "#sketchbook" as const,
  icon: "pencil" as const,
  isActive: true,
  items: [{
    title: "Recent" as const,
    url: "#recent" as const
  }, {
    title: "Starred" as const,
    url: "#starred" as const
  }, {
    title: "Drafts" as const,
    url: "#drafts" as const
  }]
}, {
  title: "Paper stocks" as const,
  url: "#paper-stocks" as const,
  icon: "file-text" as const,
  items: [{
    title: "Cream" as const,
    url: "#cream" as const
  }, {
    title: "Kraft" as const,
    url: "#kraft" as const
  }, {
    title: "Graph" as const,
    url: "#graph" as const
  }, {
    title: "Ledger" as const,
    url: "#ledger" as const
  }]
}, {
  title: "Field guide" as const,
  url: "#field-guide" as const,
  icon: "book-open" as const,
  items: [{
    title: "Introduction" as const,
    url: "#introduction" as const
  }, {
    title: "Get started" as const,
    url: "#get-started" as const
  }, {
    title: "Tutorials" as const,
    url: "#tutorials" as const
  }, {
    title: "Changelog" as const,
    url: "#changelog" as const
  }]
}, {
  title: "Studio settings" as const,
  url: "#studio-settings" as const,
  icon: "settings-2" as const,
  items: [{
    title: "General" as const,
    url: "#general" as const
  }, {
    title: "Team" as const,
    url: "#team" as const
  }, {
    title: "Billing" as const,
    url: "#billing" as const
  }, {
    title: "Limits" as const,
    url: "#limits" as const
  }]
}];
export const appProjects: Project[] = [{
  name: "Spring catalog" as const,
  url: "#spring-catalogue" as const,
  icon: "frame" as const
}, {
  name: "Postcard club" as const,
  url: "#postcard-club" as const,
  icon: "mail" as const
}, {
  name: "Field trip" as const,
  url: "#field-trip" as const,
  icon: "map" as const
}];
export const appSecondary = [{
  title: "Support" as const,
  url: "#support" as const,
  icon: "life-buoy" as const
}, {
  title: "Feedback" as const,
  url: "#feedback" as const,
  icon: "send" as const
}];
export interface NotesPage {
  name: string;
  url: string;
  icon: string;
}
export interface NotesWorkspace {
  name: string;
  icon: string;
  pages: NotesPage[];
}
export const notesNav: AppNavItem[] = [{
  title: "Search" as const,
  url: "#search" as const,
  icon: "search" as const
}, {
  title: "Ask Stubby" as const,
  url: "#ask-stubby" as const,
  icon: "sparkles" as const
}, {
  title: "Home" as const,
  url: "#home" as const,
  icon: "house" as const,
  isActive: true
}, {
  title: "Inbox" as const,
  url: "#inbox" as const,
  icon: "inbox" as const,
  badge: "10" as const
}];
export const notesSecondary: AppNavItem[] = [{
  title: "Calendar" as const,
  url: "#calendar" as const,
  icon: "calendar" as const
}, {
  title: "Settings" as const,
  url: "#settings" as const,
  icon: "settings-2" as const
}, {
  title: "Templates" as const,
  url: "#templates" as const,
  icon: "layout-grid" as const
}, {
  title: "Trash" as const,
  url: "#trash" as const,
  icon: "trash" as const
}, {
  title: "Help" as const,
  url: "#help" as const,
  icon: "life-buoy" as const
}];
export const notesFavorites: NotesPage[] = [{
  name: "Project plan & to-dos" as const,
  url: "#project-plan-and-to-dos" as const,
  icon: "chart-column" as const
}, {
  name: "Family recipe box" as const,
  url: "#family-recipe-box" as const,
  icon: "heart" as const
}, {
  name: "Reading list" as const,
  url: "#reading-list" as const,
  icon: "book-open" as const
}, {
  name: "Garden diary" as const,
  url: "#garden-diary" as const,
  icon: "sun" as const
}, {
  name: "Trip to Lisbon" as const,
  url: "#trip-to-lisbon" as const,
  icon: "map" as const
}];
export const notesWorkspaces: NotesWorkspace[] = [{
  name: "Home life" as const,
  icon: "house" as const,
  pages: [{
    name: "Daily journal" as const,
    url: "#daily-journal" as const,
    icon: "pencil" as const
  }, {
    name: "Health & wellness" as const,
    url: "#health-and-wellness" as const,
    icon: "heart" as const
  }, {
    name: "Things to learn" as const,
    url: "#things-to-learn" as const,
    icon: "lightbulb" as const
  }]
}, {
  name: "Work" as const,
  icon: "folder" as const,
  pages: [{
    name: "Career milestones" as const,
    url: "#career-milestones" as const,
    icon: "flag" as const
  }, {
    name: "Training log" as const,
    url: "#training-log" as const,
    icon: "timer" as const
  }, {
    name: "People I met" as const,
    url: "#people-i-met" as const,
    icon: "users" as const
  }]
}, {
  name: "Making things" as const,
  icon: "sparkles" as const,
  pages: [{
    name: "Story outlines" as const,
    url: "#story-outlines" as const,
    icon: "file-text" as const
  }, {
    name: "Portfolio" as const,
    url: "#portfolio" as const,
    icon: "image" as const
  }, {
    name: "Practice log" as const,
    url: "#practice-log" as const,
    icon: "music" as const
  }]
}];
export const pageActions: {
  label: string;
  icon: string;
}[][] = [[{
  label: "Customize page" as const,
  icon: "settings-2" as const
}, {
  label: "Turn into wiki" as const,
  icon: "file-text" as const
}], [{
  label: "Copy link" as const,
  icon: "link" as const
}, {
  label: "Duplicate" as const,
  icon: "copy" as const
}, {
  label: "Move to" as const,
  icon: "arrow-right" as const
}, {
  label: "Move to trash" as const,
  icon: "trash" as const
}], [{
  label: "Undo" as const,
  icon: "undo-2" as const
}, {
  label: "View analytics" as const,
  icon: "chart-line" as const
}, {
  label: "Version history" as const,
  icon: "rotate-ccw-clock" as const
}, {
  label: "Show delete pages" as const,
  icon: "eye" as const
}, {
  label: "Notifications" as const,
  icon: "bell" as const
}], [{
  label: "Import" as const,
  icon: "upload" as const
}, {
  label: "Export" as const,
  icon: "download" as const
}]];
export type MailFolder = "Inbox" | "Drafts" | "Sent" | "Junk" | "Trash";
export interface Mail {
  id: string;
  name: string;
  email: string;
  subject: string;
  date: string;
  teaser: string;
  folder: MailFolder;
  unread?: boolean;
}
export const mailFolders: {
  title: MailFolder;
  icon: string;
}[] = [{
  title: "Inbox" as const,
  icon: "inbox" as const
}, {
  title: "Drafts" as const,
  icon: "file" as const
}, {
  title: "Sent" as const,
  icon: "send" as const
}, {
  title: "Junk" as const,
  icon: "archive" as const
}, {
  title: "Trash" as const,
  icon: "trash" as const
}];
export const mails: Mail[] = [{
  id: "m1" as const,
  name: "Ada Lovelace" as const,
  email: "ada@looseleaf.example" as const,
  subject: "Meeting tomorrow" as const,
  date: "09:34" as const,
  teaser: "Hi team, a reminder about tomorrow at ten.\nPlease bring your sketchbooks and one good pen." as const,
  folder: "Inbox" as const,
  unread: true
}, {
  id: "m2" as const,
  name: "Mika Kobayashi" as const,
  email: "mika@looseleaf.example" as const,
  subject: "Re: Postcard proofs" as const,
  date: "Yesterday" as const,
  teaser: "The proofs look lovely. The blue is a touch loud on kraft.\nCan we try the graphite version too?" as const,
  folder: "Inbox" as const,
  unread: true
}, {
  id: "m3" as const,
  name: "Sam Reyes" as const,
  email: "sam@looseleaf.example" as const,
  subject: "Weekend plans" as const,
  date: "2 days ago" as const,
  teaser: "Thinking of a sketch walk on Saturday.\nHills or harbour, you choose. Bring a flask." as const,
  folder: "Inbox" as const
}, {
  id: "m4" as const,
  name: "Emily Davis" as const,
  email: "emily@looseleaf.example" as const,
  subject: "Re: Question about the budget" as const,
  date: "2 days ago" as const,
  teaser: "I went through the numbers you sent.\nCould we have a quick call about the paper costs?" as const,
  folder: "Inbox" as const
}, {
  id: "m5" as const,
  name: "Michael Wilson" as const,
  email: "michael@looseleaf.example" as const,
  subject: "Big announcement" as const,
  date: "1 week ago" as const,
  teaser: "All hands on Friday at three.\nThere is news about the new studio, and there will be cake." as const,
  folder: "Inbox" as const,
  unread: true
}, {
  id: "m6" as const,
  name: "Sarah Brown" as const,
  email: "sarah@looseleaf.example" as const,
  subject: "Feedback on the proposal" as const,
  date: "1 week ago" as const,
  teaser: "Thank you for the proposal. I have a few thoughts.\nCould we meet so I can walk you through them?" as const,
  folder: "Inbox" as const
}, {
  id: "m7" as const,
  name: "You" as const,
  email: "jo@looseleaf.example" as const,
  subject: "Draft: Spring catalog intro" as const,
  date: "Tuesday" as const,
  teaser: "Every spring the studio opens its windows, and the pens come out of their tins.\nThis year we made something a bit different." as const,
  folder: "Drafts" as const
}, {
  id: "m8" as const,
  name: "You" as const,
  email: "jo@looseleaf.example" as const,
  subject: "Draft: Thank-you notes" as const,
  date: "Last week" as const,
  teaser: "Dear all, thank you for a wonderful season.\nA list of what we learned is enclosed." as const,
  folder: "Drafts" as const
}, {
  id: "m9" as const,
  name: "To: Ada Lovelace" as const,
  email: "ada@looseleaf.example" as const,
  subject: "Re: Meeting tomorrow" as const,
  date: "09:41" as const,
  teaser: "Ten is perfect. I will bring the kraft pad and the good pen." as const,
  folder: "Sent" as const
}, {
  id: "m10" as const,
  name: "To: Mika Kobayashi" as const,
  email: "mika@looseleaf.example" as const,
  subject: "Postcard proofs" as const,
  date: "Monday" as const,
  teaser: "Attached are the proofs for the spring run.\nTell me what you think of the wobble on the border." as const,
  folder: "Sent" as const
}, {
  id: "m11" as const,
  name: "Stationery Deals" as const,
  email: "deals@example.com" as const,
  subject: "You have won a lifetime of ink" as const,
  date: "3 days ago" as const,
  teaser: "Click here to claim your free lifetime supply of ink.\nOffer ends tonight." as const,
  folder: "Junk" as const
}, {
  id: "m12" as const,
  name: "Old Newsletter" as const,
  email: "news@example.com" as const,
  subject: "Last month at the paper mill" as const,
  date: "2 weeks ago" as const,
  teaser: "A roundup of what happened at the mill.\nYou are receiving this because you signed up in 2019." as const,
  folder: "Trash" as const
}];
export interface CalendarGroup {
  name: string;
  items: {
    name: string;
    tone: string;
  }[];
}
export const calendarGroups: CalendarGroup[] = [{
  name: "My calendars" as const,
  items: [{
    name: "Personal" as const,
    tone: "text-ink-you" as const
  }, {
    name: "Work" as const,
    tone: "text-orange-text" as const
  }, {
    name: "Family" as const,
    tone: "text-green" as const
  }]
}, {
  name: "Favorites" as const,
  items: [{
    name: "Holidays" as const,
    tone: "text-red" as const
  }, {
    name: "Birthdays" as const,
    tone: "text-grape" as const
  }]
}, {
  name: "Other" as const,
  items: [{
    name: "Travel" as const,
    tone: "text-ink-you" as const
  }, {
    name: "Reminders" as const,
    tone: "text-orange-text" as const
  }, {
    name: "Deadlines" as const,
    tone: "text-red" as const
  }]
}];
export interface FileNode {
  name: string;
  children?: FileNode[];
}
export const fileChanges = [{
  file: "README.md" as const,
  state: "M" as const
}, {
  file: "api/hello/route.ts" as const,
  state: "U" as const
}, {
  file: "app/layout.tsx" as const,
  state: "M" as const
}];
export const fileTree: FileNode[] = [{
  name: "app" as const,
  children: [{
    name: "api" as const,
    children: [{
      name: "hello" as const,
      children: [{
        name: "route.ts" as const
      }]
    }]
  }, {
    name: "page.tsx" as const
  }, {
    name: "layout.tsx" as const
  }, {
    name: "blog" as const,
    children: [{
      name: "page.tsx" as const
    }]
  }]
}, {
  name: "components" as const,
  children: [{
    name: "ui" as const,
    children: [{
      name: "button.tsx" as const
    }, {
      name: "card.tsx" as const
    }]
  }, {
    name: "header.tsx" as const
  }, {
    name: "footer.tsx" as const
  }]
}, {
  name: "lib" as const,
  children: [{
    name: "util.ts" as const
  }]
}, {
  name: "public" as const,
  children: [{
    name: "favicon.ico" as const
  }, {
    name: "pencil.svg" as const
  }]
}, {
  name: ".eslintrc.json" as const
}, {
  name: ".gitignore" as const
}, {
  name: "next.config.js" as const
}, {
  name: "tailwind.config.js" as const
}, {
  name: "package.json" as const
}, {
  name: "README.md" as const
}];
export interface SettingsSection {
  name: string;
  icon: string;
  intro: string;
  toggles: {
    id: string;
    label: string;
    hint: string;
    on: boolean;
  }[];
}
export const settingsSections: SettingsSection[] = [{
  name: "Notifications" as const,
  icon: "bell" as const,
  intro: "Decide what is worth a tap on the shoulder." as const,
  toggles: [{
    id: "n-mentions" as const,
    label: "Mentions" as const,
    hint: "When somebody writes your name in the margin." as const,
    on: true
  }, {
    id: "n-replies" as const,
    label: "Replies" as const,
    hint: "When a thread you started gets an answer." as const,
    on: true
  }, {
    id: "n-digest" as const,
    label: "Friday digest" as const,
    hint: "One postcard with the week in it." as const,
    on: false
  }]
}, {
  name: "Appearance" as const,
  icon: "sun" as const,
  intro: "How the notebook looks on your desk." as const,
  toggles: [{
    id: "a-tilt" as const,
    label: "Tilt the paper" as const,
    hint: "Sheets sit at a slight angle. Text never does." as const,
    on: true
  }, {
    id: "a-grain" as const,
    label: "Paper grain" as const,
    hint: "Turn off for a flatter, calmer page." as const,
    on: true
  }, {
    id: "a-motion" as const,
    label: "Reduce motion" as const,
    hint: "No swishing pages or drawn-on lines." as const,
    on: false
  }]
}, {
  name: "Messages & media" as const,
  icon: "message-circle" as const,
  intro: "What arrives with a message, and what does not." as const,
  toggles: [{
    id: "m-previews" as const,
    label: "Link previews" as const,
    hint: "Show a small card under links." as const,
    on: true
  }, {
    id: "m-autoplay" as const,
    label: "Play stickers" as const,
    hint: "Let animated stickers move." as const,
    on: false
  }, {
    id: "m-images" as const,
    label: "Show images inline" as const,
    hint: "Otherwise they arrive as a paperclip." as const,
    on: true
  }]
}, {
  name: "Language & region" as const,
  icon: "globe" as const,
  intro: "Words, dates and which way the page reads." as const,
  toggles: [{
    id: "l-24h" as const,
    label: "24-hour clock" as const,
    hint: "Show 17:30 instead of 5:30 pm." as const,
    on: false
  }, {
    id: "l-week" as const,
    label: "Weeks start on Monday" as const,
    hint: "Your calendars follow along." as const,
    on: true
  }, {
    id: "l-rtl" as const,
    label: "Write right to left" as const,
    hint: "Mirror the notebook for Arabic and Hebrew." as const,
    on: false
  }]
}, {
  name: "Accessibility" as const,
  icon: "command" as const,
  intro: "Make it easy on your eyes and your hands." as const,
  toggles: [{
    id: "x-contrast" as const,
    label: "Heavier pens" as const,
    hint: "Thicker lines and darker ink." as const,
    on: false
  }, {
    id: "x-focus" as const,
    label: "Always show focus" as const,
    hint: "Draw a ring on whatever the keyboard is on." as const,
    on: true
  }, {
    id: "x-keys" as const,
    label: "Single-key shortcuts" as const,
    hint: "Press ? anywhere to see them." as const,
    on: true
  }]
}, {
  name: "Privacy & visibility" as const,
  icon: "lock" as const,
  intro: "Who can read over your shoulder." as const,
  toggles: [{
    id: "p-online" as const,
    label: "Show when I am online" as const,
    hint: "A small dot next to your name." as const,
    on: true
  }, {
    id: "p-read" as const,
    label: "Read receipts" as const,
    hint: "Let people know you saw their note." as const,
    on: false
  }, {
    id: "p-index" as const,
    label: "Appear in search" as const,
    hint: "Let teammates find you by name." as const,
    on: true
  }]
}];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const formatDay = (date: Date) => `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;
export const formatMonth = (date: Date) => `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
