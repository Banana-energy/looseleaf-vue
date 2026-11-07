// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Paper } from "@/components/ui/paper";
const QUESTIONS = [{
  id: "free" as const,
  q: "Is there a free plan?" as const,
  a: "Yes. Teams of up to five can use everything, free, for as long as they like. Past five it is $6 a person a month. No card to start." as const
}, {
  id: "import" as const,
  q: "Can I bring my notes from other apps?" as const,
  a: "Drag in a folder of Markdown, or a Notion or Evernote export, and your pages and links come across, pictures too. A hundred pages takes about a minute." as const
}, {
  id: "offline" as const,
  q: "Does it work offline?" as const,
  a: "It does. Keep writing on the train and everything syncs when you are back. If two people changed the same line, you get both versions side by side." as const
}, {
  id: "privacy" as const,
  q: "Who can see my notebooks?" as const,
  a: "Only the people you invite. A page is private until you share it, and a shared link can be switched off whenever you like." as const
}, {
  id: "backups" as const,
  q: "How are my pages backed up?" as const,
  a: "Every change is saved and every version is kept for a year. We also take nightly backups in two places, and you can download everything as plain files." as const
}, {
  id: "cancel" as const,
  q: "Can I cancel any time?" as const,
  a: "In two clicks. Your notebooks stay readable and downloadable afterwards." as const
}];
const Faq01Sheet = defineUi<{}>("Faq01Sheet", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Paper stock="paper" rules="ruled" tape="corner" tapeKind="masking" seed="faq-sheet" class="pt-4 pe-5 pb-7 ps-14 text-[17px] leading-7 rtl:[&>[data-slot=paper-rules]]:-scale-x-100">
      <p class="font-type text-sm leading-7 text-pencil-text">Frequently asked</p>
      <Accordion type="single" collapsible defaultValue="free" class="w-full">
        {QUESTIONS.map(item => <AccordionItem key={item.id} value={item.id} class="pb-0 [&>[data-slot=accordion-rule]]:hidden">
            <AccordionTrigger class="min-h-14 items-end pt-7 pb-0 text-[17px] leading-7 [&:not(:focus-visible)]:outline-transparent [&>[data-chevron]]:mt-0 [&>[data-chevron]]:mb-1.5">{item.q}</AccordionTrigger>
            <AccordionContent class="pb-0 text-[17px] leading-7">
              <p>{item.a}</p>
            </AccordionContent>
          </AccordionItem>)}
      </Accordion>
    </Paper>;
  };
});
export { Faq01Sheet, QUESTIONS };
