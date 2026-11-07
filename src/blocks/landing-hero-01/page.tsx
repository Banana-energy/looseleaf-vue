// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId } from "vue";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Annotate } from "@/components/ui/annotate";
import { Icon } from "@/components/ui/icon";
import { Lettering } from "@/components/ui/lettering";
import { Paper } from "@/components/ui/paper";
import { Rating } from "@/components/ui/rating";
import { LandingHero01Collage } from "@/blocks/landing-hero-01/components/landing-hero-01-collage";
import { LandingHero01Nav } from "@/blocks/landing-hero-01/components/landing-hero-01-nav";
const people = ["Ada Lovelace", "Jo Okafor", "Mika Kobayashi", "Sam Reyes"];
const LandingHero01 = defineUi<{}>("LandingHero01", [], (_props, {
  slots: _slots
}) => {
  const titleId = useId();
  return () => {
    return <div class="@container relative w-full overflow-x-clip">
      <div class="p-8">
        <Paper as="section" aria-labelledby={titleId} stock="paper" tilt={false} tape="both" tapeKind="washi-dots" seed="landing-hero-01" class="mx-auto w-full max-w-6xl px-5 pb-14 @xl:px-10 @xl:pb-16">
          <LandingHero01Nav />

          <div class="mt-10 grid items-center gap-12 @5xl:mt-14 @5xl:grid-cols-[minmax(0,1fr)_26rem] @5xl:gap-12">
            <div class="min-w-0">
              <p class="font-type text-sm text-pencil-text">Notes and tasks for small teams</p>
              <Lettering as="h1" id={titleId} size="xl" tone="marker" wobble={0.5} seed="hero-title" class="mt-3">
                Write it down.
              </Lettering>
              <p class="mt-5 max-w-xl text-xl/8 text-balance text-ink-soft @xl:text-[22px]/9">
                Penmark keeps your team&rsquo;s notes, tasks and half-formed ideas on{" "}
                <Annotate type="underline" kind="wavy" color="blue" animate delay={600} seed="hero-underline">
                  one calm page
                </Annotate>
                , so the good stuff gets{" "}
                <Annotate type="highlight" color="yellow" animate delay={1100} seed="hero-highlight">
                  found
                </Annotate>
                , not lost.
              </p>

              <div class="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
                <Button asChild size="lg">
                  <a href="#start">
                    Start a notebook
                    <Icon name="arrow-right" class="rtl:-scale-x-100" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#tour">
                    <Icon name="circle-play" />
                    Watch the tour
                  </a>
                </Button>
              </div>
              <p class="mt-4 text-[15px] text-ink-muted">
                <Annotate type="circle" color="red" animate delay={1600} seed="hero-free" class="mx-1">
                  Free
                </Annotate>{" "}
                for teams of five. No card, no catch.
              </p>

              <div class="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
                <AvatarGroup class="[--ll-avatar-group-ring:var(--ll-paper)] [&>*+*]:-ms-0.5">
                  {people.map(name => <Avatar key={name}>
                      <AvatarFallback name={name} />
                    </Avatar>)}
                  <AvatarGroupCount>+4k</AvatarGroupCount>
                </AvatarGroup>
                <div>
                  <Rating readOnly value={4.5} allowHalf size="sm" aria-label="Rated 4.5 out of 5 by our customers" />
                  <p class="text-sm text-ink-muted">Loved by 4,200 small teams</p>
                </div>
              </div>
            </div>

            <LandingHero01Collage />
          </div>
        </Paper>
      </div>
    </div>;
  };
});
export default LandingHero01;
