// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Circled } from "@/components/ui/circled";
import { Doodle } from "@/components/ui/doodle";
import { Handwritten } from "@/components/ui/handwritten";
import { Highlight } from "@/components/ui/highlight";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Paper } from "@/components/ui/paper";
import { Separator } from "@/components/ui/separator";
import { Tape } from "@/components/ui/tape";
import { InkProvider } from "@/lib/ink/vue";
import { Stage } from "@/docs/kit";
import { Specimen } from "./layout";
export interface Law {
  n: number;
  title: string;
  rule: string;
  why: string;
  meet: string;
  specimen: () => UI.VueNode;
}
const Panel = defineUi<{
  n: number;
  label: string;
  desk?: boolean;
  children: UI.VueNode;
}>("Panel", ["n", "label", "desk"], (_props, {
  slots: _slots
}) => {
  const n = computed(() => _props["n"]);
  const label = computed(() => _props["label"]);
  const desk = computed(() => _props["desk"]);
  const children = renderValue(() => readSlot(_slots.default));
  return () => {
    return <Stage layout="center" surface={desk.value ? "desk" as const : "paper" as const} label={`Law ${n.value}: ${label.value}`}>
      {readSlot(_slots.default)}
    </Stage>;
  };
});
const UniformCheck = defineUi<{}>("UniformCheck", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <svg viewBox="0 0 24 24" width={96} height={96} aria-hidden="true" focusable="false" class="text-ink" fill="none" stroke="currentColor" stroke-width={2.2} stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 12.5 L9.5 18 L20 6" />
    </svg>;
  };
});
const SEEDS = ["a", "b", "c", "d", "e", "f"] as const;
const Ribbons = defineUi<{}>("Ribbons", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Panel n={1} label="lines are ribbons with pressure">
      <Specimen caption="a uniform svg stroke">
        <UniformCheck />
      </Specimen>
      <Specimen caption="a ribbon: it swells, thins and skips">
        <Icon name="check" size={96} />
      </Specimen>
      <Specimen caption="the same pen at 24 px, 16 px, 12 px">
        <span class="flex items-end gap-4 text-ink">
          <Icon name="pencil" size={24} />
          <Icon name="pencil" size={16} />
          <Icon name="pencil" size={12} />
        </span>
      </Specimen>
    </Panel>;
  };
});
const Ruled = defineUi<{}>("Ruled", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Panel n={2} label="ruled straight, eased at the ends">
      <Specimen caption="a rule drawn against a ruler">
        <Separator class="w-48" />
      </Specimen>
      <Specimen caption="a box that closes">
        <Button variant="outline">Cancel</Button>
      </Specimen>
      <Specimen caption="a hand loop, for notes only">
        <p class="m-0 text-xl">
          Please reply by <Circled tone="red">Friday</Circled>.
        </p>
      </Specimen>
    </Panel>;
  };
});
const Seeded = defineUi<{}>("Seeded", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Panel n={3} label="no two things are identical">
      {SEEDS.map(seed => <Doodle key={seed} name="star" size={64} seed={seed} />)}
      <p class="m-0 basis-full text-center text-sm text-pencil-text">six stars, six seeds. The same seed always draws the same star, on the server and in the browser.</p>
    </Panel>;
  };
});
const Offset = defineUi<{}>("Offset", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Panel n={4} label="fills are a separate layer, in register">
      <Specimen caption="solid fill, clean line">
        <Button>Save</Button>
      </Specimen>
      <Specimen caption="color inside the line">
        <Doodle name="heart" size={80} />
      </Specimen>
      <Specimen caption="a swipe behind the words">
        <p class="m-0 text-xl">
          the <Highlight>good bits</Highlight> get marked
        </p>
      </Specimen>
    </Panel>;
  };
});
const STOCKS = ["paper", "card", "slip", "graph", "kraft"] as const;
const Tooth = defineUi<{}>("Tooth", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Panel desk n={5} label="paper has tooth and light from the upper left">
      {STOCKS.map(stock => <Specimen onDesk key={stock} caption={stock}>
          <Paper stock={stock} tilt={false} class="grid h-24 w-32 place-items-center text-ink">
            <span class="font-script text-2xl">Aa</span>
          </Paper>
        </Specimen>)}
    </Panel>;
  };
});
const Shadows = defineUi<{}>("Shadows", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Panel desk n={6} label="shadows are warm and short">
      <Specimen onDesk caption="not this: cool, long, blurred">
        <div class="grid h-24 w-40 place-items-center bg-white text-ink shadow-[0_18px_40px_-8px_rgb(0_0_0/0.45)]">
          <span class="font-script text-2xl">a card</span>
        </div>
      </Specimen>
      <Specimen onDesk caption="this: umber, a hair of contact and a short lift">
        <Paper stock="card" tilt={false} class="grid h-24 w-40 place-items-center text-ink">
          <span class="font-script text-2xl">a card</span>
        </Paper>
      </Specimen>
    </Panel>;
  };
});
const Tilt = defineUi<{}>("Tilt", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Panel desk n={7} label="tilt paper, never text">
      <Specimen onDesk caption="the sheet turns 2 degrees, the most any sheet may; the words do not">
        <Paper stock="index-card" tilt={2} class="relative w-60 px-5 py-5 text-ink">
          <Tape kind="washi-dots" class="absolute -top-3 start-6" />
          <p class="m-0 font-script text-2xl leading-tight">Buy more ink</p>
          <p class="m-0 mt-1">Black, blue, and one red for corrections.</p>
        </Paper>
      </Specimen>
    </Panel>;
  };
});
const Hand = defineUi<{}>("Hand", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Panel n={8} label="handwriting on real baselines, lightly jittered">
      <Specimen caption="Handwritten: every word a hair off the baseline" class="max-w-sm">
        <Handwritten as="p" strength={1.5} class="m-0 font-script text-3xl leading-snug">
          Ask Sam about the pond, and bring the big umbrella!
        </Handwritten>
      </Specimen>
      <Specimen caption="strength 0: the same words, level" class="max-w-sm">
        <Handwritten as="p" strength={0} class="m-0 font-script text-3xl leading-snug">
          Ask Sam about the pond, and bring the big umbrella!
        </Handwritten>
      </Specimen>
    </Panel>;
  };
});
const Multiply = defineUi<{}>("Multiply", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Panel n={9} label="color is ink on paper, never a flat fill">
      <Specimen caption="not this: a flat rectangle hides the paper">
        <p class="m-0 text-xl">
          the <span class="bg-lemon px-1">good bits</span> get marked
        </p>
      </Specimen>
      <Specimen caption="this: a highlighter darkens what is under it">
        <p class="m-0 text-xl">
          the <Highlight>good bits</Highlight> get marked
        </p>
      </Specimen>
    </Panel>;
  };
});
const Form = defineUi<{
  id: string;
}>("Form", ["id"], (_props, {
  slots: _slots
}) => {
  const id = computed(() => _props["id"]);
  return () => {
    return <div class="flex w-64 flex-col gap-3 text-ink">
      <Label for={`${id.value}-name`}>Name</Label>
      <Input id={`${id.value}-name`} defaultValue="Ada" />
      <span class="flex items-center gap-2">
        <Checkbox id={`${id.value}-tick`} defaultChecked />
        <Label for={`${id.value}-tick`}>Send me the newsletter</Label>
      </span>
      <Button class="self-start">Sign</Button>
    </div>;
  };
});
const Calm = defineUi<{}>("Calm", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Panel n={10} label="calm where it matters">
      <Specimen caption="comfortable: marker fills, wobble, a little tilt (the default)">
        <InkProvider density="comfortable" defs={false}>
          <Form id="law10-comfortable" />
        </InkProvider>
      </Specimen>
      <Specimen caption="calm: pencil hairlines, no jitter, no fill offset. For dense data and long forms">
        <InkProvider density="calm" defs={false}>
          <Form id="law10-calm" />
        </InkProvider>
      </Specimen>
    </Panel>;
  };
});
export const LAWS: readonly Law[] = [{
  n: 1,
  title: "Lines are ribbons with pressure" as const,
  rule: "Never a uniform stroke." as const,
  why: "A felt-tip swells on the down-stroke, thins where it lifts and skips where it runs dry. Every line in the library is a filled shape with a changing width, so a 16 px icon and a 400 px rule both look pulled by a hand." as const,
  meet: "Every icon, underline, rule and outline." as const,
  specimen: () => <Ribbons />
}, {
  n: 2,
  title: "Straight lines are ruled" as const,
  rule: "Rules stay level, outlines close, ends ease off." as const,
  why: "A careful hand draws its straight lines against a ruler and closes its boxes. The hand still shows: every rule eases in and out at its ends, and a loop meets itself with a soft overlap instead of a hard join. Only notes, like a circled word, run past their start." as const,
  meet: "Every rule, divider and outline. Circled and Bracket are the loose exceptions." as const,
  specimen: () => <Ruled />
}, {
  n: 3,
  title: "No two things are identical" as const,
  rule: "Seed everything." as const,
  why: "Repetition is the tell of a stamp. Every drawing is generated from a seed, so two buttons differ, and the same seed always draws the same thing: server and browser agree, and a screenshot is stable." as const,
  meet: "The seed prop on any drawn part; by default a seed from useId()." as const,
  specimen: () => <Seeded />
}, {
  n: 4,
  title: "Fills are a separate layer" as const,
  rule: "Offset and imperfect." as const,
  why: "Marker is laid after the outline and misses it by a few pixels. Hover widens the miss; pressing snaps it into register. The gap between line and color is what reads as ink on paper." as const,
  meet: "Button, Checkbox, Badge, Highlight and every filled doodle." as const,
  specimen: () => <Offset />
}, {
  n: 5,
  title: "Paper has tooth" as const,
  rule: "Light from the upper left." as const,
  why: "A sheet is a stock color plus a baked relief tile lit from the top left, and one tile serves every color. Nothing sits on a flat fill." as const,
  meet: "Paper and Card stocks, Desk, and the sticky notes." as const,
  specimen: () => <Tooth />
}, {
  n: 6,
  title: "Shadows are warm umber and short" as const,
  rule: "Never a long gray blur." as const,
  why: "A sheet on a desk casts a hair of contact shadow and a soft short one, in brown. Long blurred shadows say floating screen, not paper." as const,
  meet: "The shadow prop of Paper and the --shadow-* tokens." as const,
  specimen: () => <Shadows />
}, {
  n: 7,
  title: "Tilt paper, never text" as const,
  rule: "The sheet turns; the words stay level." as const,
  why: "A note stuck on a wall is never quite straight, but you read it straight. Only the sheet layer rotates, by a fraction of a degree, and density calm turns even that off." as const,
  meet: "Paper tilt and the ll-tilt utilities." as const,
  specimen: () => <Tilt />
}, {
  n: 8,
  title: "Text is handwriting on real baselines" as const,
  rule: "Real text, lightly jittered." as const,
  why: "Kevin Sans for the interface, the titles and the stamps, tuned for each: all of them real DOM text you can select and search. The jitter is a transform per word, and it stops in calm density and under reduced motion." as const,
  meet: "Handwritten, the font-hand, font-script and font-type tokens." as const,
  specimen: () => <Hand />
}, {
  n: 9,
  title: "Color is ink, pencil and marker" as const,
  rule: "On paper, multiplied. Never a flat UI fill." as const,
  why: "Marker and highlighter darken the paper under them instead of covering it, so texture shows through. Saturated stationery colors are for the decoration layer only; the real interface stays calm." as const,
  meet: "The ll-multiply utility, --ll-blend, Highlight, and every marker fill." as const,
  specimen: () => <Multiply />
}, {
  n: 10,
  title: "Calm where it matters" as const,
  rule: "Charm is a dial, not a mandate." as const,
  why: "A long form or a table of numbers should not wobble. Density is one switch: comfortable, compact, or calm with hairline pencil rules, no jitter and no fill offset. Nothing else about a component changes." as const,
  meet: "data-density on any ancestor, or InkProvider density." as const,
  specimen: () => <Calm />
}];
