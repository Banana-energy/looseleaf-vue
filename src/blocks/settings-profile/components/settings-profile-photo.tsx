// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef, useId } from "vue";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
const MAX_BYTES = 2 * 1024 * 1024;
export const SettingsProfilePhoto = defineUi<{
  name: string;
  photo?: string;
  onPhoto: (url: string | undefined) => void;
}>("SettingsProfilePhoto", ["name", "photo", "onPhoto"], (_props, {
  slots: _slots
}) => {
  const name = computed(() => _props["name"]);
  const photo = computed(() => _props["photo"]);
  const onPhoto = computed(() => _props["onPhoto"]);
  const input = shallowRef<HTMLInputElement | null>(null);
  const error = shallowRef(initialState(""));
  const setError = stateSetter(error);
  const help = useId();
  const onFile = computed(() => (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    (e.target as HTMLInputElement).value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Choose an image: JPG, PNG or GIF.");
    if (file.size > MAX_BYTES) return setError("That picture is over 2 MB. Try a smaller one.");
    setError("");
    onPhoto.value(URL.createObjectURL(file));
  });
  return () => {
    return <div class="flex items-center gap-5">
      <Avatar size="xl" seed="profile-photo" class="data-[size=xl]:size-20">
        {photo.value ? <AvatarImage src={photo.value} alt="" /> : null}
        <AvatarFallback name={name.value || "You"} class="group-data-[size=xl]/avatar:text-3xl" />
      </Avatar>
      <div class="grid gap-2">
        <p class="text-[15px] font-bold">Photo</p>
        <div class="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => input.value?.click()}>
            {photo.value ? "Choose another" as const : "Upload a photo" as const}
          </Button>
          {photo.value ? <Button type="button" variant="ghost" size="sm" onClick={() => {
            setError("");
            onPhoto.value(undefined);
          }}>
              Remove
            </Button> : null}
        </div>
        <p id={help} class="text-sm text-muted-foreground">
          JPG, PNG or GIF, up to 2 MB. Without one you get your initials.
        </p>
        {error.value ? <p role="alert" class="text-sm font-bold text-red">
            {error.value}
          </p> : null}
        <input ref={input} type="file" accept="image/*" hidden onChange={onFile.value} aria-describedby={help} />
      </div>
    </div>;
  };
});
