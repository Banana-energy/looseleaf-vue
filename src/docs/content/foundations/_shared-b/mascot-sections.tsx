// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Mascot } from "@/components/ui/mascot";
import { Paper } from "@/components/ui/paper";
import { useEnsureInkDefs } from "@/lib/ink/vue";
import { scenes } from "@/lib/ink/art/scenes";
import { AnchorHeading, Chip } from "@/docs/kit";
import { ArtShelf, type ShelfEntry } from "./art-shelf";
import { POSES, SCENE_ENTRIES, poseNote, type SceneEntry } from "./catalog";
import { Choice, ControlLabel } from "./controls";
import { CopyStatus, useCopyStatus } from "./gallery";
import { useNearViewport } from "./lazy";
import { emptySceneSnippet, importLine, mascotSnippet, mascotTierLabel } from "./snippets";
const STUDIO_SIZES = [24, 32, 48, 64, 96, 160] as const;
export const MascotStudio = defineUi<{
  pose: string;
  onPose: (pose: string) => void;
}>("MascotStudio", ["pose", "onPose"], (_props, {
  slots: _slots
}) => {
  const pose = computed(() => _props["pose"]);
  const onPose = computed(() => _props["onPose"]);
  const size = shallowRef<number>(initialState(96));
  const setSize = stateSetter(size);
  const _hook4 = useCopyStatus();
  const copied = computed(() => _hook4.value.copied);
  const message = computed(() => _hook4.value.message);
  const copy = computed(() => _hook4.value.copy);
  const note = computed(() => poseNote(pose.value));
  const snippet = computed(() => mascotSnippet(pose.value, {
    size: size.value
  }));
  return () => {
    return <div data-slot="mascot-studio">
      <div class="mb-4 flex flex-col gap-1.5">
        <ControlLabel>Pose</ControlLabel>
        <Choice label="Stubby's pose" value={pose.value} onChange={onPose.value} options={POSES.map(p => ({
          value: p,
          label: p
        }))} />
      </div>
      <div class="flex flex-wrap items-stretch gap-x-8 gap-y-6">
        <Paper stock="paper" tilt={false} class="grid min-h-72 min-w-64 flex-1 basis-72 place-items-center p-6">
          <Mascot pose={pose.value} size={size.value} />
        </Paper>
        <div class="flex min-w-64 flex-1 basis-72 flex-col gap-4">
          <div>
            <p class="m-0 font-script text-4xl leading-none text-ink">{pose.value}</p>
            <p class="mt-2 mb-0 text-ink">{note.value.does}</p>
            <p class="mt-1 mb-0 text-pencil-text">
              <strong class="text-ink">Belongs in:</strong> {note.value.serves}
            </p>
          </div>
          <div class="flex flex-col gap-1.5">
            <ControlLabel>Size</ControlLabel>
            <Choice label="Stubby's size" value={String(size.value)} onChange={v => setSize(Number(v))} options={STUDIO_SIZES.map(px => ({
              value: String(px),
              label: String(px),
              name: `${px} pixels`
            }))} />
            <p class="text-[15px] text-muted-foreground m-0">
              {size.value} px: {mascotTierLabel(size.value)}.
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <code class="font-mono text-sm break-all text-ink">{snippet.value}</code>
            <Button size="sm" onClick={() => void copy.value(pose.value, snippet.value)}>
              <Icon name={copied.value ? "check" as const : "copy" as const} />
              {copied.value ? "Copied" as const : "Copy JSX" as const}
            </Button>
            <code class="basis-full font-mono text-xs text-pencil-text">{importLine("Mascot")}</code>
          </div>
          <CopyStatus message={message.value} />
        </div>
      </div>
    </div>;
  };
});
interface PoseEntry extends ShelfEntry {
  text: string;
}
const POSE_ENTRIES: readonly PoseEntry[] = POSES.map(id => ({
  id,
  family: "poses" as const,
  tags: [],
  text: `${poseNote(id).does} ${poseNote(id).serves}`
}));
export const PoseSheet = defineUi<{
  selected: string;
  onPose: (pose: string) => void;
}>("PoseSheet", ["selected", "onPose"], (_props, {
  slots: _slots
}) => {
  const selected = computed(() => _props["selected"]);
  const onPose = computed(() => _props["onPose"]);
  return () => {
    return <ArtShelf<PoseEntry> slug="pose" noun="poses" entries={POSE_ENTRIES} families={[]} grouped={false} noFamilyFilter searchPlaceholder="Search poses: error, search, sleep, 404" tile={{
      min: 128,
      height: 150,
      art: 88
    }} renderArt={e => <Mascot pose={e.id} size={80} />} snippet={e => mascotSnippet(e.id)} template={mascotSnippet("name")} onPress={e => onPose.value(e.id)} selectedId={selected.value} />;
  };
});
type Tier = "full" | "compact";
type Composer = (id: string, def: unknown, opts?: {
  tier?: Tier;
  sheet?: boolean;
}) => {
  svg: string;
  w: number;
  h: number;
};
const COMPOSER_PATHS = ["/src/lib/ink/art/scenes/compose.ts", "/tools/lookdev/scene-compose.ts"] as const;
const composerModules = import.meta.glob<{
  composeScene: Composer;
}>(["/src/lib/ink/art/scenes/compose.ts", "/tools/lookdev/scene-compose.ts"]);
let composerPromise: Promise<Composer | null> | undefined;
export function loadSceneComposer(): Promise<Composer | null> {
  composerPromise ??= (async () => {
    const path = COMPOSER_PATHS.find(p => p in composerModules);
    if (!path) return null;
    try {
      return (await composerModules[path]!()).composeScene;
    } catch {
      return null;
    }
  })();
  return composerPromise;
}
type Status = {
  state: "waiting";
} | {
  state: "ready";
  compose: Composer;
} | {
  state: "missing";
};
export const SceneFigure = defineUi<{
  id: string;
  tier: Tier;
}>("SceneFigure", ["id", "tier"], (_props, {
  slots: _slots
}) => {
  const id = computed(() => _props["id"]);
  const tier = computed(() => _props["tier"]);
  useEnsureInkDefs();
  const _hook3 = useNearViewport<HTMLDivElement>(() => "400px 0px");
  const ref = computed(() => _hook3.value[0]);
  const near = computed(() => _hook3.value[1]);
  const status = shallowRef<Status>(initialState({
    state: "waiting" as const
  }));
  const setStatus = stateSetter(status);
  watchDependencies(() => {
    if (!near.value) return;
    let live = true;
    void loadSceneComposer().then(compose => {
      if (!live) return;
      setStatus(compose ? {
        state: "ready" as const,
        compose
      } : {
        state: "missing" as const
      });
    });
    return () => {
      live = false;
    };
  }, () => [near.value], false);
  const drawn = computed(() => {
    if (status.value.state !== "ready") return null;
    try {
      return status.value.compose(id.value, (scenes as Record<string, unknown>)[id.value], {
        tier: tier.value
      });
    } catch {
      return null;
    }
  });
  const w = computed(() => tier.value === "full" ? 240 : 120);
  const h = computed(() => tier.value === "full" ? 180 : 90);
  return () => {
    return <div ref={ref.value} class="relative w-full" style={cssStyle({
      aspectRatio: `${w.value} / ${h.value}`
    })} data-scene={id.value} data-state={drawn.value ? "drawn" as const : status.value.state}>
      {drawn.value ? <svg data-ink="illustration" aria-hidden="true" focusable="false" viewBox={`0 0 ${drawn.value.w} ${drawn.value.h}`} class="pointer-events-none block h-auto w-full overflow-visible" innerHTML={drawn.value.svg} /> : status.value.state === "missing" ? <p class="absolute inset-0 m-0 grid place-items-center text-center text-sm text-pencil-text">This build has no scene composer, so the drawing cannot be shown.</p> : null}
    </div>;
  };
});
const SceneCard = defineUi<{
  scene: SceneEntry;
  tier: Tier;
  copied: boolean;
  onCopy: (id: string, text: string) => void;
}>("SceneCard", ["scene", "tier", "copied", "onCopy"], (_props, {
  slots: _slots
}) => {
  const scene = computed(() => _props["scene"]);
  const tier = computed(() => _props["tier"]);
  const copied = computed(() => _props["copied"]);
  const onCopy = computed(() => _props["onCopy"]);
  const snippet = computed(() => scene.value.pose ? emptySceneSnippet(scene.value.pose, scene.value.title) : "" as const);
  return () => {
    return <li class="min-w-0">
      <Paper stock="card" class="flex h-full flex-col gap-3 p-3">
        <SceneFigure id={scene.value.id} tier={tier.value} />
        <div class="flex flex-1 flex-col gap-1">
          <h3 class="m-0 font-script text-2xl leading-tight text-ink">{scene.value.title}</h3>
          <p class="m-0 text-ink">{scene.value.use}</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <Chip tone="outline">{scene.value.id}</Chip>
          {scene.value.pose ? <Chip tone="outline">pose: {scene.value.pose}</Chip> : null}
          {scene.value.pose ? <Button variant="outline" size="xs" class="ms-auto" onClick={() => onCopy.value(scene.value.id, snippet.value)}>
              <Icon name={copied.value ? "check" as const : "copy" as const} />
              {copied.value ? "Copied" as const : "Copy Empty" as const}
            </Button> : null}
        </div>
      </Paper>
    </li>;
  };
});
export const SceneShelf = defineUi<{}>("SceneShelf", [], (_props, {
  slots: _slots
}) => {
  const tier = shallowRef<Tier>(initialState("full"));
  const setTier = stateSetter(tier);
  const _hook2 = useCopyStatus();
  const copied = computed(() => _hook2.value.copied);
  const message = computed(() => _hook2.value.message);
  const copy = computed(() => _hook2.value.copy);
  const min = computed(() => tier.value === "full" ? 280 : 200);
  return () => {
    return <div data-slot="scene-shelf">
      <CopyStatus message={message.value} />
      <div class="mb-4 flex flex-col gap-1.5">
        <ControlLabel>Tier</ControlLabel>
        <Choice label="Scene tier" value={tier.value} onChange={setTier} options={[{
          value: "full" as const,
          label: "240 x 180" as const,
          name: "full scene, 240 by 180" as const
        }, {
          value: "compact" as const,
          label: "120 x 90" as const,
          name: "compact scene, 120 by 90" as const
        }]} />
        <p class="text-[15px] text-muted-foreground m-0">The compact tier is laid out again around Stubby&apos;s 48 px drawing and one or two props: it is what a small Empty would use.</p>
      </div>
      <ul role="list" class="m-0 grid list-none gap-4 p-0" style={cssStyle({
        gridTemplateColumns: `repeat(auto-fill, minmax(min(${min.value}px, 100%), 1fr))`
      })}>
        {SCENE_ENTRIES.map(s => <SceneCard key={s.id} scene={s} tier={tier.value} copied={copied.value === s.id} onCopy={(id, text) => void copy.value(id, text)} />)}
      </ul>
    </div>;
  };
});
export const StubbySection = defineUi<{}>("StubbySection", [], (_props, {
  slots: _slots
}) => {
  const pose = shallowRef(initialState("idle"));
  const setPose = stateSetter(pose);
  return () => {
    return <>
      <MascotStudio pose={pose.value} onPose={setPose} />
      <AnchorHeading id="all-poses" level={3} class="mt-6">
        All {POSES.length} poses
      </AnchorHeading>
      <PoseSheet selected={pose.value} onPose={setPose} />
    </>;
  };
});
