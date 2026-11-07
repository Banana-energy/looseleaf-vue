// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef, useId } from "vue";
import { Button } from "@/components/ui/button";
import { Doodle } from "@/components/ui/doodle";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mascot } from "@/components/ui/mascot";
import { Paper } from "@/components/ui/paper";
import { Seal, sealMarkList, sealVariantList } from "@/components/ui/seal";
import { Stamp } from "@/components/ui/stamp";
import { Sticker } from "@/components/ui/sticker";
import { Switch } from "@/components/ui/switch";
import { Stage, cx } from "@/docs/kit";
import { ArtShelf } from "./art-shelf";
import { BADGE_ENTRIES, DOODLE_ENTRIES, DOODLE_FAMILIES, PEELABLE_ENTRIES, PEELABLE_FAMILIES, STAMP_ENTRIES } from "./catalog";
import { Choice, ControlLabel } from "./controls";
import { useCopyStatus, CopyStatus } from "./gallery";
import { customStampSnippet, doodleSnippet, doodleTierLabel, importLine, sealSnippet, stampSnippet, stickerSnippet, stickerTierLabel } from "./snippets";
const sizeOptions = (sizes: readonly number[]) => sizes.map(px => ({
  value: String(px),
  label: String(px),
  name: `${px} pixels`
}));
const Setting = defineUi<{
  label: string;
  children: UI.VueNode;
  hint?: UI.VueNode;
}>("Setting", ["label", "hint"], (_props, {
  slots: _slots
}) => {
  const label = computed(() => _props["label"]);
  const children = renderValue(() => readSlot(_slots.default));
  const hint = computed(() => _props["hint"]);
  return () => {
    return <div class="flex flex-col gap-1.5">
      <ControlLabel>{label.value}</ControlLabel>
      {readSlot(_slots.default)}
      {hint.value ? <p class="text-[15px] text-muted-foreground m-0">{hint.value}</p> : null}
    </div>;
  };
});
export const ArtCluster = defineUi<{}>("ArtCluster", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Stage layout="center" surface="desk" label="A sticker desk: line art on a sheet, stickers and a seal beside it">
      <Paper stock="graph" class="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 p-6">
        <Doodle name="star" size={72} rotate={-8} />
        <Mascot pose="celebrate" size={96} />
        <Stamp name="stamp-approved" />
      </Paper>
      <div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
        <Sticker name="rocket" size={96} peel />
        <Sticker name="cupcake" size={96} />
        <Sticker name="fox" size={96} />
        <Seal variant="rosette" text="BEST" tone="lemon" />
      </div>
    </Stage>;
  };
});
export const DoodleShelf = defineUi<{}>("DoodleShelf", [], (_props, {
  slots: _slots
}) => {
  const size = shallowRef(initialState(96));
  const setSize = stateSetter(size);
  const drawn = computed(() => size.value);
  const art = computed(() => Math.max(drawn.value, 48) + 8);
  return () => {
    return <ArtShelf slug="doodle" noun="doodles" entries={DOODLE_ENTRIES} families={DOODLE_FAMILIES} searchPlaceholder="Search doodles: star, arrow, flourish, cat" controls={<Setting label="Size" hint={`${size.value} px: ${doodleTierLabel(size.value)}. Below 72 px a doodle is redrawn with one identifying detail; from 120 px some gain extra detail.`}>
          <Choice label="Doodle size" value={String(size.value)} onChange={v => setSize(Number(v))} options={sizeOptions([48, 72, 96, 128])} />
        </Setting>} tile={{
      min: Math.max(120, art.value + 24),
      height: art.value + 60,
      art: art.value
    }} eager renderArt={e => <Doodle name={e.id} size={drawn.value} />} snippet={e => doodleSnippet(e.id, {
      size: size.value
    })} template={doodleSnippet("name", {
      size: size.value
    })} />;
  };
});
const TURNS = {
  auto: "auto" as const,
  flat: 0,
  left: -10,
  right: 10
} as const;
type Turn = keyof typeof TURNS;
export const StickerShelf = defineUi<{}>("StickerShelf", [], (_props, {
  slots: _slots
}) => {
  const size = shallowRef(initialState(96));
  const setSize = stateSetter(size);
  const peel = shallowRef(initialState(false));
  const setPeel = stateSetter(peel);
  const turn = shallowRef<Turn>(initialState("auto"));
  const setTurn = stateSetter(turn);
  const drawn = computed(() => size.value);
  const art = computed(() => drawn.value + 24);
  const rotate = computed(() => TURNS[turn.value]);
  const peelId = useId();
  return () => {
    return <ArtShelf slug="sticker" noun="stickers" entries={PEELABLE_ENTRIES} families={PEELABLE_FAMILIES} searchPlaceholder="Search stickers: rocket, coffee, fox, done" controls={<div class="flex flex-wrap items-start gap-x-8 gap-y-4">
          <Setting label="Size" hint={`${size.value} px: ${stickerTierLabel(size.value)}`}>
            <Choice label="Sticker size" value={String(size.value)} onChange={v => setSize(Number(v))} options={sizeOptions([64, 96, 128])} />
          </Setting>
          <Setting label="Rotate" hint="auto: a small seeded tilt, flattened in calm density">
            <Choice label="Rotation" value={turn.value} onChange={setTurn} options={[{
          value: "auto" as const,
          label: "auto" as const
        }, {
          value: "flat" as const,
          label: "flat" as const
        }, {
          value: "left" as const,
          label: "-10 deg" as const,
          name: "minus ten degrees" as const
        }, {
          value: "right" as const,
          label: "10 deg" as const,
          name: "ten degrees" as const
        }]} />
          </Setting>
          <Setting label="Peel">
            <div class="flex min-h-9 items-center gap-3">
              <Switch id={peelId} checked={peel.value} onCheckedChange={setPeel} />
              <Label for={peelId}>Lift the corner</Label>
            </div>
          </Setting>
        </div>} tile={{
      min: Math.max(136, art.value + 24),
      height: art.value + 64,
      art: art.value
    }} renderArt={e => <Sticker name={e.id} size={drawn.value} peel={peel.value} rotate={rotate.value} />} snippet={e => stickerSnippet(e.id, {
      size: size.value,
      peel: peel.value,
      rotate: rotate.value
    })} template={stickerSnippet("name", {
      size: size.value,
      peel: peel.value,
      rotate: rotate.value
    })} chunk={12} />;
  };
});
const SHAPES = ["rect", "round", "burst", "void"] as const;
const INKS = ["red", "ink-you", "green", "ink"] as const;
type StampShape = typeof SHAPES[number];
type StampInk = typeof INKS[number];
const TextField = defineUi<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  maxLength: number;
  placeholder?: string;
}>("TextField", ["label", "value", "onChange", "maxLength", "placeholder"], (_props, {
  slots: _slots
}) => {
  const label = computed(() => _props["label"]);
  const value = computed(() => _props["value"]);
  const onChange = computed(() => _props["onChange"]);
  const maxLength = computed(() => _props["maxLength"]);
  const placeholder = computed(() => _props["placeholder"]);
  const id = useId();
  return () => {
    return <div class="flex min-w-40 flex-1 flex-col gap-1.5">
      <label for={id}>
        <ControlLabel>{label.value}</ControlLabel>
      </label>
      <Input id={id} value={value.value} maxlength={maxLength.value} placeholder={placeholder.value} onChange={(e: Event) => onChange.value((e.target as HTMLInputElement).value)} autocomplete="off" spellcheck={false} />
    </div>;
  };
});
const SnippetBar = defineUi<{
  snippet: string;
  importAs: Parameters<typeof importLine>[0];
}>("SnippetBar", ["snippet", "importAs"], (_props, {
  slots: _slots
}) => {
  const snippet = computed(() => _props["snippet"]);
  const importAs = computed(() => _props["importAs"]);
  const _hook2 = useCopyStatus();
  const copied = computed(() => _hook2.value.copied);
  const message = computed(() => _hook2.value.message);
  const copy = computed(() => _hook2.value.copy);
  return () => {
    return <div class="mt-4 flex flex-wrap items-center gap-3">
      <code class="min-w-0 flex-1 font-mono text-sm break-all text-ink">{snippet.value}</code>
      <Button size="sm" onClick={() => void copy.value("lab", snippet.value)}>
        <Icon name={copied.value ? "check" as const : "copy" as const} />
        {copied.value ? "Copied" as const : "Copy JSX" as const}
      </Button>
      <code class="basis-full font-mono text-xs break-all text-pencil-text">{importLine(importAs.value)}</code>
      <CopyStatus message={message.value} />
    </div>;
  };
});
export const StampShelf = defineUi<{}>("StampShelf", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <ArtShelf slug="stamp" noun="stamps" entries={STAMP_ENTRIES} families={[]} grouped={false} noFamilyFilter searchPlaceholder="Search stamps: paid, urgent, void" tile={{
      min: 210,
      height: 150,
      art: [190, 96]
    }} renderArt={e => <Stamp name={e.id} />} snippet={e => stampSnippet(e.id)} template={stampSnippet("name")} />;
  };
});
export const StampLab = defineUi<{}>("StampLab", [], (_props, {
  slots: _slots
}) => {
  const text = shallowRef(initialState("Approved"));
  const setText = stateSetter(text);
  const sub = shallowRef(initialState(""));
  const setSub = stateSetter(sub);
  const ring = shallowRef(initialState("PAID IN FULL * THANK YOU * MAR 2026"));
  const setRing = stateSetter(ring);
  const shape = shallowRef<StampShape>(initialState("rect"));
  const setShape = stateSetter(shape);
  const ink = shallowRef<StampInk>(initialState("green"));
  const setInk = stateSetter(ink);
  const tilt = shallowRef<"-8" | "0" | "8">(initialState("-8"));
  const setTilt = stateSetter(tilt);
  const ghost = shallowRef(initialState(false));
  const setGhost = stateSetter(ghost);
  const dashed = shallowRef(initialState(false));
  const setDashed = stateSetter(dashed);
  const ghostId = useId();
  const dashedId = useId();
  const t = computed(() => text.value.trim());
  const snippet = computed(() => customStampSnippet({
    text: t.value,
    sub: sub.value.trim() || undefined,
    ring: ring.value.trim() || undefined,
    shape: shape.value,
    ink: ink.value,
    tilt: Number(tilt.value),
    ghost: ghost.value,
    dashed: dashed.value
  }));
  return () => {
    return <div data-slot="stamp-lab">
      <div class="flex flex-wrap items-start gap-x-8 gap-y-6">
        <div class="flex min-w-64 flex-1 flex-col gap-4">
          <div class="flex flex-wrap gap-4">
            <TextField label="Words" value={text.value} onChange={setText} maxLength={14} placeholder="Approved" />
            <TextField label="Small line" value={sub.value} onChange={setSub} maxLength={22} placeholder="* 03.14.26 *" />
          </div>
          {shape.value === "round" ? <TextField label="Around the rim" value={ring.value} onChange={setRing} maxLength={44} /> : null}
          <Setting label="Shape">
            <Choice label="Stamp shape" value={shape.value} onChange={setShape} options={SHAPES.map(s => ({
              value: s,
              label: s
            }))} />
          </Setting>
          <Setting label="Ink">
            <Choice label="Stamp ink" value={ink.value} onChange={setInk} options={INKS.map(s => ({
              value: s,
              label: s
            }))} />
          </Setting>
          <Setting label="Tilt">
            <Choice label="Stamp tilt" value={tilt.value} onChange={setTilt} options={[{
              value: "-8" as const,
              label: "left" as const,
              name: "tilted left" as const
            }, {
              value: "0" as const,
              label: "level" as const
            }, {
              value: "8" as const,
              label: "right" as const,
              name: "tilted right" as const
            }]} />
          </Setting>
          <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span class="flex items-center gap-3">
              <Switch id={ghostId} checked={ghost.value} onCheckedChange={setGhost} />
              <Label for={ghostId}>Ghost of a first try</Label>
            </span>
            <span class="flex items-center gap-3">
              <Switch id={dashedId} checked={dashed.value} onCheckedChange={setDashed} />
              <Label for={dashedId}>Dashed inner rule</Label>
            </span>
          </div>
        </div>
        <Paper stock="paper" tilt={false} class="grid min-h-56 min-w-64 flex-1 place-items-center p-6" aria-live="polite">
          {t.value ? <Stamp text={t.value} sub={sub.value.trim() || undefined} ring={shape.value === "round" ? ring.value.trim() || undefined : undefined} shape={shape.value} ink={ink.value} tilt={Number(tilt.value)} ghost={ghost.value} dashed={dashed.value} /> : <p class="text-[15px] text-muted-foreground m-0">Type some words to stamp.</p>}
        </Paper>
      </div>
      <SnippetBar snippet={snippet.value} importAs="Stamp" />
    </div>;
  };
});
export const BadgeShelf = defineUi<{}>("BadgeShelf", [], (_props, {
  slots: _slots
}) => {
  const size = shallowRef(initialState(96));
  const setSize = stateSetter(size);
  const drawn = computed(() => size.value);
  const art = computed(() => drawn.value + 24);
  return () => {
    return <ArtShelf slug="badge" noun="badges" entries={BADGE_ENTRIES} families={[]} grouped={false} noFamilyFilter searchPlaceholder="Search badges: new, winner, 100" controls={<Setting label="Size">
          <Choice label="Badge size" value={String(size.value)} onChange={v => setSize(Number(v))} options={sizeOptions([64, 96, 128])} />
        </Setting>} tile={{
      min: Math.max(136, art.value + 24),
      height: art.value + 64,
      art: art.value
    }} renderArt={e => <Sticker name={e.id} size={drawn.value} />} snippet={e => stickerSnippet(e.id, {
      size: size.value
    })} template={stickerSnippet("name", {
      size: size.value
    })} chunk={16} />;
  };
});
const TONES = ["tomato", "tangerine", "lemon", "grass", "teal", "sky", "grape", "bubblegum"] as const;
type Tone = typeof TONES[number];
type Mark = "none" | typeof sealMarkList[number];
export const SealLab = defineUi<{}>("SealLab", [], (_props, {
  slots: _slots
}) => {
  const variant = shallowRef<typeof sealVariantList[number]>(initialState("rosette"));
  const setVariant = stateSetter(variant);
  const tone = shallowRef<Tone>(initialState("lemon"));
  const setTone = stateSetter(tone);
  const text = shallowRef(initialState("BEST"));
  const setText = stateSetter(text);
  const mark = shallowRef<Mark>(initialState("none"));
  const setMark = stateSetter(mark);
  const size = shallowRef(initialState(96));
  const setSize = stateSetter(size);
  const t = computed(() => text.value.trim());
  const snippet = computed(() => sealSnippet({
    variant: variant.value,
    text: mark.value === "none" ? t.value : undefined,
    mark: mark.value === "none" ? undefined : mark.value,
    tone: tone.value,
    size: size.value
  }));
  return () => {
    return <div data-slot="seal-lab">
      <div class="flex flex-wrap items-start gap-x-8 gap-y-6">
        <div class="flex min-w-64 flex-1 flex-col gap-4">
          <Setting label="Shape">
            <Choice label="Seal shape" value={variant.value} onChange={setVariant} options={sealVariantList.map(v => ({
              value: v,
              label: v
            }))} />
          </Setting>
          <Setting label="Color" hint="Ink on tomato and grape is 3.95 to 1: keep the words large, or pick another color.">
            <Choice label="Seal color" value={tone.value} onChange={setTone} options={TONES.map(v => ({
              value: v,
              label: v
            }))} />
          </Setting>
          <div class="flex flex-wrap items-end gap-4">
            <TextField label="Words" value={text.value} onChange={setText} maxLength={10} placeholder="BEST" />
            <Setting label="Or a hand-drawn mark">
              <Choice label="Seal mark" value={mark.value} onChange={setMark} options={[{
                value: "none" as const,
                label: "words" as const
              }, ...sealMarkList.map(m => ({
                value: m,
                label: m
              }))]} />
            </Setting>
          </div>
          <Setting label="Size" hint="Below 80 px the seal is redrawn smaller. A mark holds up at 16 px where letters do not.">
            <Choice label="Seal size" value={String(size.value)} onChange={v => setSize(Number(v))} options={sizeOptions([16, 32, 64, 96, 128])} />
          </Setting>
        </div>
        <Paper stock="paper" tilt={false} class={cx("grid min-h-56 min-w-64 flex-1 place-items-center p-6")}>
          <Seal variant={variant.value} tone={tone.value} size={size.value} text={mark.value === "none" ? t.value || undefined : undefined} mark={mark.value === "none" ? undefined : mark.value} />
        </Paper>
      </div>
      <SnippetBar snippet={snippet.value} importAs="Seal" />
    </div>;
  };
});
