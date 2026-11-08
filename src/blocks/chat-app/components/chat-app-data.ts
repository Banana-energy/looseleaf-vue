// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
export type ChatPart = {
  kind: "text";
  text: string;
} | {
  kind: "tool";
  title: string;
  result: string;
} | {
  kind: "code";
  filename: string;
  code: string;
};
export type ChatFile = {
  name: string;
  size: string;
};
export type ChatTurn = {
  id: string;
  from: "me" | "them";
  who?: string;
  time: string;
  parts: ChatPart[];
  files?: ChatFile[];
};
export type Conversation = {
  id: string;
  name: string;
  kind: "assistant" | "person" | "group";
  subtitle: string;
  time: string;
  unread: number;
  turns: ChatTurn[];
  reply: ChatPart[];
  replyFrom?: string;
  attachable: ChatFile[];
};
const DIFF = `-const shown = notes;
+const shown = picked.size
+  ? notes.filter((n) => n.tags.some((t) => picked.has(t)))
+  : notes;`;
export const CONVERSATIONS: Conversation[] = [{
  id: "stubby" as const,
  name: "Stubby" as const,
  kind: "assistant" as const,
  subtitle: "the pencil stub, writing with you" as const,
  time: "9:43" as const,
  unread: 0,
  turns: [{
    id: "s0" as const,
    from: "them" as const,
    time: "9:40" as const,
    parts: [{
      kind: "text" as const,
      text: "Good morning. What are we making?" as const
    }]
  }, {
    id: "s1" as const,
    from: "me" as const,
    time: "9:41" as const,
    parts: [{
      kind: "text" as const,
      text: "Can you add tags to my notes, and a filter row above the list?" as const
    }],
    files: [{
      name: "field-notes.pdf" as const,
      size: "2.4 MB" as const
    }]
  }, {
    id: "s2" as const,
    from: "them" as const,
    time: "9:41" as const,
    parts: [{
      kind: "text" as const,
      text: "I read src/notes/list.tsx first. Tags become a string array on Note, and the chips sit in a row above the list." as const
    }, {
      kind: "tool" as const,
      title: "ran npm test" as const,
      result: "12 passed" as const
    }, {
      kind: "code" as const,
      filename: "src/notes/filter.ts" as const,
      code: DIFF
    }, {
      kind: "text" as const,
      text: "Try #recipes first: the list narrows to the notes that carry it, and the count at the top stays honest." as const
    }]
  }],
  reply: [{
    kind: "text" as const,
    text: "Good catch. The count came from the unfiltered list, so it lied for one render. I moved it below the filter." as const
  }, {
    kind: "tool" as const,
    title: "ran npm test" as const,
    result: "14 passed" as const
  }, {
    kind: "text" as const,
    text: "Twelve notes, eleven shown, and the number agrees with the page now." as const
  }],
  attachable: [{
    name: "tags-list.tsx" as const,
    size: "4 KB" as const
  }, {
    name: "recipes.csv" as const,
    size: "18 KB" as const
  }, {
    name: "harbour.jpg" as const,
    size: "1.8 MB" as const
  }]
}, {
  id: "nell" as const,
  name: "Nell Okafor" as const,
  kind: "person" as const,
  subtitle: "letterpress, mostly" as const,
  time: "9:05" as const,
  unread: 2,
  turns: [{
    id: "n0" as const,
    from: "them" as const,
    time: "8:52" as const,
    parts: [{
      kind: "text" as const,
      text: "did you see the proofs? the blue is almost right" as const
    }]
  }, {
    id: "n1" as const,
    from: "me" as const,
    time: "8:58" as const,
    parts: [{
      kind: "text" as const,
      text: "Almost is doing a lot of work in that sentence." as const
    }]
  }, {
    id: "n2" as const,
    from: "them" as const,
    time: "9:05" as const,
    parts: [{
      kind: "text" as const,
      text: "it is. bringing the good tape on saturday, and the small guillotine" as const
    }],
    files: [{
      name: "proofs-saturday.pdf" as const,
      size: "812 KB" as const
    }]
  }],
  reply: [{
    kind: "text" as const,
    text: "Saturday, ten o'clock. I will save you the stool by the window." as const
  }],
  attachable: [{
    name: "blue-swatch.jpg" as const,
    size: "640 KB" as const
  }]
}, {
  id: "club" as const,
  name: "Tuesday club" as const,
  kind: "group" as const,
  subtitle: "Nell, Mo, Ines and 2 more" as const,
  time: "Tue" as const,
  unread: 0,
  turns: [{
    id: "c0" as const,
    from: "them" as const,
    who: "Mo" as const,
    time: "18:20" as const,
    parts: [{
      kind: "text" as const,
      text: "The proofs are drying on the line. Come and look." as const
    }]
  }, {
    id: "c1" as const,
    from: "them" as const,
    who: "Ines" as const,
    time: "18:24" as const,
    parts: [{
      kind: "text" as const,
      text: "Photo or it did not happen." as const
    }]
  }, {
    id: "c2" as const,
    from: "me" as const,
    time: "18:31" as const,
    parts: [{
      kind: "text" as const,
      text: "On my way, with biscuits." as const
    }]
  }],
  reply: [{
    kind: "text" as const,
    text: "Biscuits get you the stool by the window. Nell says hello." as const
  }],
  replyFrom: "Mo" as const,
  attachable: [{
    name: "drying-line.jpg" as const,
    size: "2.1 MB" as const
  }]
}, {
  id: "jo" as const,
  name: "Jo Delacroix" as const,
  kind: "person" as const,
  subtitle: "paper supplier, very patient" as const,
  time: "Mon" as const,
  unread: 0,
  turns: [{
    id: "j0" as const,
    from: "them" as const,
    time: "11:02" as const,
    parts: [{
      kind: "text" as const,
      text: "Sent you the receipt for the paper order. Twelve reams, one damaged corner, no charge." as const
    }],
    files: [{
      name: "receipt-0925.pdf" as const,
      size: "96 KB" as const
    }]
  }, {
    id: "j1" as const,
    from: "me" as const,
    time: "11:10" as const,
    parts: [{
      kind: "text" as const,
      text: "Thank you! Paid on my side." as const
    }]
  }],
  reply: [{
    kind: "text" as const,
    text: "Lovely. I put a sheet of the good stock in the box for you." as const
  }],
  attachable: [{
    name: "order-list.csv" as const,
    size: "3 KB" as const
  }]
}, {
  id: "mum" as const,
  name: "Mum" as const,
  kind: "person" as const,
  subtitle: "always has the kettle on" as const,
  time: "Sun" as const,
  unread: 1,
  turns: [{
    id: "m0" as const,
    from: "them" as const,
    time: "16:40" as const,
    parts: [{
      kind: "text" as const,
      text: "Call me when you land? No rush, the kettle is on." as const
    }]
  }],
  reply: [{
    kind: "text" as const,
    text: "Lovely. The kettle is still on." as const
  }],
  attachable: [{
    name: "boarding-pass.pdf" as const,
    size: "120 KB" as const
  }]
}];

const ZH_TEXT: Record<string, string> = {
  s0: "早上好。今天想做点什么？", s1: "可以给我的笔记加上标签，并在列表上方增加筛选行吗？", s2: "我先查看了 src/notes/list.tsx。标签会成为 Note 上的字符串数组，筛选项会显示在列表上方。", s3: "先试试 #recipes：列表会缩小到带有这个标签的笔记，顶部计数也会保持准确。", n0: "你看到校样了吗？蓝色已经快调对了。", n1: "‘快调对了’这句话里可是大有文章。", n2: "确实如此。周六带上好胶带和那把小裁纸刀。", c0: "校样正在晾线上晾着，过来看看。", c1: "没有照片就等于没发生。", c2: "我这就来，带着饼干。", j0: "纸张订单的收据发给你了。十二令，损坏一个角，不收费。", j1: "谢谢！我这边已经付款了。", m0: "落地后给我打电话？不着急，水壶已经烧上了。", "reply-s": "说得好。之前的计数来自未筛选列表，所以有一次显示不对。我把它移到了筛选器下面。", "reply-s-2": "十二条笔记，显示十一条，现在数字和页面一致了。", "reply-n": "周六十点。我会替你留好窗边的凳子。", "reply-c": "带饼干就能坐窗边的凳子。Nell 向你问好。", "reply-j": "很好。我在箱子里给你放了一张质量最好的纸。", "reply-m": "真好。水壶还在烧着。"
};

// 聊天区块的示例数据也参与文档本地化，避免中文界面仍显示整段英文对话。
export function conversationsForLocale(locale: "en" | "zh-CN"): Conversation[] {
  if (locale === "en") return CONVERSATIONS;
  const text = (id: string, fallback: string) => ZH_TEXT[id] ?? fallback;
  return CONVERSATIONS.map(conversation => ({
    ...conversation,
    name: conversation.id === "club" ? "周二小组" : conversation.name,
    subtitle: ({ stubby: "正在和你一起写作的铅笔头", nell: "主要做活字印刷", club: "Nell、Mo、Ines 和另外 2 人", jo: "纸张供应商，非常有耐心", mum: "总是烧着水壶" } as Record<string, string>)[conversation.id] ?? conversation.subtitle,
    turns: conversation.turns.map(turn => ({
      ...turn,
      parts: turn.parts.map((part, index) => part.kind === "text" ? { ...part, text: turn.id === "s2" && index === 3 && locale === "zh-CN" ? "先试试 #recipes：列表会缩小到带有这个标签的笔记，顶部计数也会保持准确。" : text(turn.id, part.text) } : part)
    })),
    reply: conversation.reply.map((part, index) => part.kind === "text" ? { ...part, text: text(`reply-${conversation.id}${index ? "-2" : ""}`, part.text) } : part)
  }));
}

export function snippet(c: Conversation): string {
  const last = c.turns[c.turns.length - 1];
  if (!last) return "Nothing written yet";
  const text = [...last.parts].reverse().find(p => p.kind === "text");
  const line = text && text.kind === "text" ? text.text : last.files?.[0]?.name ?? "An attachment";
  const who = last.from === "me" ? "You: " as const : last.who ? `${last.who}: ` : "" as const;
  return who + line;
}
