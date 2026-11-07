// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Sticker } from "@/components/ui/sticker";
import { StickerPicker, StickerPickerContent, StickerPickerTrigger } from "@/components/ui/sticker-picker";
import { Textarea } from "@/components/ui/textarea";
export const meta = {
  title: "In a comment box" as const,
  description: "The picker as a composer tool: choose a sticker, it waits beside the text (click it to take it off), and posting sends both. Recent stickers come first next time." as const,
  layout: "stack" as const,
  stage: "desk" as const,
  height: 640
};
interface Post {
  who: string;
  text: string;
  sticker?: string;
}
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const text = shallowRef(initialState(""));
  const setText = stateSetter(text);
  const sticker = shallowRef<string | null>(initialState(null));
  const setSticker = stateSetter(sticker);
  const recent = shallowRef<string[]>(initialState(["stamp-approved"]));
  const setRecent = stateSetter(recent);
  const posts = shallowRef<Post[]>(initialState([{
    who: "Maya" as const,
    text: "The new cover reads much better." as const,
    sticker: "stamp-approved" as const
  }]));
  const setPosts = stateSetter(posts);
  const post = computed(() => () => {
    if (!text.value.trim() && !sticker.value) return;
    setPosts(all => [...all, {
      who: "You" as const,
      text: text.value.trim(),
      sticker: sticker.value ?? undefined
    }]);
    setText("");
    setSticker(null);
  });
  return () => {
    return <Card class="w-full max-w-lg gap-3 p-4">
      <ul role="list" class="flex flex-col gap-3" aria-label="Comments">
        {posts.value.map((p, i) => <li key={i} class="flex items-start gap-3">
            <span class="font-script text-xl leading-tight text-ink-you">{p.who}</span>
            <div class="min-w-0 flex-1">
              {p.text ? <p>{p.text}</p> : null}
              {p.sticker ? <Sticker name={p.sticker} size={p.sticker.startsWith("stamp-") ? 96 : 72} label={p.sticker} class="mt-1" /> : null}
            </div>
          </li>)}
      </ul>
      <Textarea value={text.value} onChange={(e: Event) => setText((e.target as HTMLTextAreaElement).value)} placeholder="Write a comment" aria-label="Comment" rows={2} />
      <div class="flex items-center gap-2">
        <StickerPicker value={sticker.value} recent={recent.value} onSelect={s => {
          setSticker(s.name);
          setRecent(r => [s.name, ...r.filter(n => n !== s.name)].slice(0, 5));
        }}>
          <StickerPickerTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Add a sticker">
              <Icon name="sparkles" />
            </Button>
          </StickerPickerTrigger>
          <StickerPickerContent />
        </StickerPicker>
        {sticker.value ? <button type="button" onClick={() => setSticker(null)} aria-label="Remove the sticker" class="rounded-sm outline-offset-2 hover:opacity-70">
            <Sticker name={sticker.value} size={40} />
          </button> : null}
        <Button class="ms-auto" onClick={post.value} disabled={!text.value.trim() && !sticker.value}>
          Post
        </Button>
      </div>
    </Card>;
  };
});
export default Example;
