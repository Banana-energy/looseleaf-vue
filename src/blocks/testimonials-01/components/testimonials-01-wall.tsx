// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { IndexCard, IndexCardContent, IndexCardFooter, IndexCardHeader, IndexCardTitle } from "@/components/ui/index-card";
import { Napkin, NapkinContent } from "@/components/ui/napkin";
import { Paper } from "@/components/ui/paper";
import { Polaroid, PolaroidCaption, PolaroidImage } from "@/components/ui/polaroid";
import { Quote, QuoteAttribution, QuoteText } from "@/components/ui/quote";
import { StickyNote } from "@/components/ui/sticky-note";
const author = (name: string, role: string) => <>
    <span class="font-bold text-ink">{name}</span>, {role}
  </>;
const Testimonials01Wall = defineUi<{}>("Testimonials01Wall", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <ul role="list" class="grid list-none items-start gap-x-8 gap-y-14 @2xl:grid-cols-2 @4xl:grid-cols-3" data-slot="testimonials-wall">
      <li>
        <StickyNote as="figure" color="yellow" fastener="pin" seed="t-priya" class="mx-auto w-full max-w-64">
          <blockquote class="flex-1 text-2xl leading-[1.15]">&ldquo;I stopped losing meeting notes. That&rsquo;s it. That&rsquo;s the review.&rdquo;</blockquote>
          <figcaption class="pt-2 font-hand text-[15px] leading-snug text-ink-soft">{author("Priya Nair", "ops lead at Kiln")}</figcaption>
        </StickyNote>
      </li>

      <li class="@4xl:mt-10">
        <Paper stock="paper" edge={{
          bottom: "torn" as const
        }} tape="corner" tapeKind="masking" seed="t-tomas" class="mx-auto w-full max-w-sm px-8 pt-10 pb-9">
          <Quote>
            <QuoteText size="md">We moved forty people off three different tools in a week. Nobody asked to go back, which has never happened before.</QuoteText>
            <QuoteAttribution>{author("Tomas Berg", "COO at Northwind Ink")}</QuoteAttribution>
          </Quote>
        </Paper>
      </li>

      <li>
        <Polaroid as="figure" tape="top" tapeKind="washi-dots" seed="t-lena" class="mx-auto w-full max-w-64">
          <PolaroidImage scene="sea" seed="t-sea" />
          <PolaroidCaption class="flex-col gap-1">
            <blockquote>&ldquo;finally, a place we all write&rdquo;</blockquote>
            <span class="font-hand text-sm leading-tight font-normal text-ink-soft">{author("Lena Fischer", "Brindle")}</span>
          </PolaroidCaption>
        </Polaroid>
      </li>

      <li>
        <Napkin as="figure" fold="quarter" stain seed="t-omar" class="mx-auto w-full max-w-72">
          <NapkinContent>
            <blockquote>&ldquo;We run the whole caf&eacute; off one page. The tape is a nice touch.&rdquo;</blockquote>
          </NapkinContent>
          <figcaption class="font-hand text-[15px] leading-snug text-ink-soft">{author("Omar Haddad", "owner, The Tea Room")}</figcaption>
        </Napkin>
      </li>

      <li class="@4xl:mt-10">
        <StickyNote as="figure" color="pink" tape="top" tapeKind="washi-stripes" seed="t-yuki" class="mx-auto w-full max-w-64">
          <blockquote class="flex-1 text-2xl leading-[1.15]">&ldquo;It looks like something a person made, and works like something a team built.&rdquo;</blockquote>
          <figcaption class="pt-2 font-hand text-[15px] leading-snug text-ink-soft">{author("Yuki Tanaka", "designer at Loom & Lantern")}</figcaption>
        </StickyNote>
      </li>

      <li>
        <IndexCard as="figure" seed="t-kofi" fastener="clip" class="mx-auto min-h-0">
          <IndexCardHeader>
            <IndexCardTitle>Kofi says</IndexCardTitle>
          </IndexCardHeader>
          <IndexCardContent>
            <blockquote>&ldquo;Search finds the thing I half-remember. It&rsquo;s witchcraft, honestly.&rdquo;</blockquote>
          </IndexCardContent>
          <IndexCardFooter>
            <figcaption>{author("Kofi Mensah", "founder, Salt Studio")}</figcaption>
          </IndexCardFooter>
        </IndexCard>
      </li>
    </ul>;
  };
});
export { Testimonials01Wall };
