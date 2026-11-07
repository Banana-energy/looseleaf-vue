// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef, useId } from "vue";
import { zodResolver } from "@/lib/schema-bridge";
import { useForm } from "@/lib/form-bridge";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Page, PageDescription, PageHeader, PageTitle } from "@/components/ui/page";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sticker } from "@/components/ui/sticker";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SettingsProfileCard } from "@/blocks/settings-profile/components/settings-profile-card";
import { SettingsProfilePhoto } from "@/blocks/settings-profile/components/settings-profile-photo";
import { BIO_MAX, DEFAULT_PROFILE, PRONOUNS, TIME_ZONES, profileSchema, type ProfileValues } from "@/blocks/settings-profile/components/settings-profile-schema";
import { cn } from "@/lib/utils";
type Props = {
  className?: string;
  defaultValues?: ProfileValues;
  onSave?: (values: ProfileValues) => void | Promise<void>;
};
const demoSave = () => new Promise<void>(resolve => window.setTimeout(resolve, 450));
const SettingsProfile = defineUi<Props>("SettingsProfile", ["class", "defaultValues", "onSave"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const defaultValues = computed(() => _props["defaultValues"] === undefined ? DEFAULT_PROFILE : _props["defaultValues"]);
  const onSave = computed(() => _props["onSave"] === undefined ? demoSave : _props["onSave"]);
  const form = useForm<ProfileValues>(() => ({
    resolver: zodResolver(profileSchema),
    defaultValues: defaultValues.value,
    mode: "onTouched" as const
  }));
  const values = computed(() => form.value.watch());
  const photo = shallowRef<string>(initialState(undefined));
  const setPhoto = stateSetter(photo);
  const saved = shallowRef(initialState(false));
  const setSaved = stateSetter(saved);
  const failure = shallowRef(initialState(""));
  const setFailure = stateSetter(failure);
  const isDirty = computed(() => form.value.formState.isDirty);
  const isSubmitting = computed(() => form.value.formState.isSubmitting);
  const titleId = useId();
  watchDependencies(() => {
    const sub = form.value.watch(() => {
      setSaved(false);
      setFailure("");
    });
    return () => sub.unsubscribe();
  }, () => [form.value], false);
  watchDependencies(() => () => photo.value ? URL.revokeObjectURL(photo.value) : undefined, () => [photo.value], false);
  const submit = computed(() => form.value.handleSubmit(async v => {
    try {
      await onSave.value(v);
    } catch (err) {
      setFailure(err instanceof Error && err.message ? err.message : "Your changes were not saved. Nothing was lost, so try again in a moment." as const);
      return;
    }
    setFailure("");
    form.value.reset(v);
    setSaved(true);
  }));
  return () => {
    return <div class="w-full overflow-x-clip px-2">
      <Page as="section" width="xl" holes reinforced seed="settings-profile" aria-labelledby={titleId} class={cn("my-6", className.value)}>
        <PageHeader>
          <PageTitle as="h2" id={titleId} seed="profile-title">
            Profile
          </PageTitle>
          <PageDescription>This is how you sign the pages you share. Nothing changes for anyone until you save.</PageDescription>
        </PageHeader>

        <div class="@container/settings">
          <div class="grid items-start gap-10 @3xl/settings:grid-cols-[minmax(0,1fr)_17rem]">
            <Form {...domProps(form.value)}>
              <form novalidate onSubmit={submit.value} aria-label="Profile settings" class="@container/form grid gap-6">
                <SettingsProfilePhoto name={values.value.name} photo={photo.value} onPhoto={setPhoto} />
                <Separator variant="dashed" />

                <div class="grid gap-6 @lg/form:grid-cols-2">
                  <FormField control={form.value.control} name="name" render={({
                    field
                  }) => <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input autocomplete="name" placeholder="Ada Lovelace" {...domProps(field)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                  <FormField control={form.value.control} name="username" render={({
                    field
                  }) => <FormItem>
                        <FormLabel>Username</FormLabel>
                        <InputGroup>
                          <InputGroupAddon>
                            <InputGroupText>@</InputGroupText>
                          </InputGroupAddon>
                          <FormControl>
                            <InputGroupInput autocomplete="username" spellcheck={false} placeholder="ada_writes" {...domProps(field)} />
                          </FormControl>
                        </InputGroup>
                        <FormMessage />
                      </FormItem>} />
                </div>

                <FormField control={form.value.control} name="email" render={({
                  field
                }) => <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" autocomplete="email" placeholder="ada@notes.dev" {...domProps(field)} />
                      </FormControl>
                      <FormDescription>Receipts and sign-in links go here. It is never shown on your card.</FormDescription>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.value.control} name="bio" render={({
                  field
                }) => <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea rows={3} placeholder="A line or two, in your own words." showCount={({
                      length
                    }) => <span class={cn("ll-num", length > BIO_MAX && "font-bold text-red")}>
                              {length}/{BIO_MAX}
                            </span>} {...domProps(field)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <div class="grid gap-6 @lg/form:grid-cols-2">
                  <FormField control={form.value.control} name="pronouns" render={({
                    field
                  }) => <FormItem>
                        <FormLabel>Pronouns</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger class="w-full">
                              <SelectValue placeholder="Rather not say" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent position="popper">
                            {PRONOUNS.map(p => <SelectItem key={p.value} value={p.value}>
                                {p.label}
                              </SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>} />
                  <FormField control={form.value.control} name="timezone" render={({
                    field
                  }) => <FormItem>
                        <FormLabel>Time zone</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger class="w-full">
                              <SelectValue placeholder="Pick a time zone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent position="popper">
                            {TIME_ZONES.map(z => <SelectItem key={z.value} value={z.value}>
                                {z.label}
                              </SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>} />
                </div>

                <FormField control={form.value.control} name="website" render={({
                  field
                }) => <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input type="url" inputmode="url" autocomplete="url" placeholder="https://" {...domProps(field)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <Separator variant="dashed" />

                <FormField control={form.value.control} name="discoverable" render={({
                  field
                }) => <FormItem class="flex items-start justify-between gap-6">
                      <div class="grid gap-1">
                        <FormLabel>Show me in search</FormLabel>
                        <FormDescription>Anyone can find your card by name. Turn it off and only people with the link can.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} class="mt-0.5" />
                      </FormControl>
                    </FormItem>} />

                <div class="flex flex-wrap items-center gap-3">
                  <Button type="submit" aria-busy={isSubmitting.value}>
                    {isSubmitting.value ? "Saving…" as const : "Save changes" as const}
                  </Button>
                  {isDirty.value ? <Button type="button" variant="ghost" onClick={() => form.value.reset()}>
                      Undo changes
                    </Button> : null}
                  <p role="status" class="flex items-center gap-2 text-sm font-bold text-green">
                    {saved.value ? <>
                        <Icon name="circle-check" />
                        Saved. Your card is up to date.
                      </> : null}
                  </p>
                  {failure.value ? <p role="alert" class="flex basis-full items-center gap-2 text-sm font-bold text-red">
                      <Icon name="circle-alert" />
                      {failure.value}
                    </p> : null}
                </div>
              </form>
            </Form>

            <aside aria-label="Preview" class="relative grid gap-3 @3xl/settings:sticky @3xl/settings:top-6">
              <p class="font-script text-2xl leading-none font-semibold">How others see you</p>
              <SettingsProfileCard values={values.value} photo={photo.value} />
              {saved.value ? <Sticker name="done" size={64} rotate={8} class="absolute -end-2 -bottom-8" /> : null}
            </aside>
          </div>
        </div>
      </Page>
    </div>;
  };
});
export default SettingsProfile;
