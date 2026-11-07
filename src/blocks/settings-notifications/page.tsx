// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId, shallowRef } from "vue";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Page, PageDescription, PageHeader, PageTitle } from "@/components/ui/page";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CHANNELS, DAYS, DEFAULT_PREFS, EVENTS, MODES, TIMES, rowEnabled, validate, type Channel, type Mode, type Prefs, type Problems } from "@/blocks/settings-notifications/components/settings-notifications-data";
import { cn } from "@/lib/utils";
type Props = {
  className?: string;
  defaultValue?: Prefs;
  onSave?: (prefs: Prefs) => void | Promise<void>;
  onTest?: (prefs: Prefs) => void | Promise<void>;
};
const Section = defineUi<{
  title: string;
  description: string;
  children: UI.ReactNode;
}>("Section", ["title", "description"], (_props, {
  slots: _slots
}) => {
  const title = computed(() => _props["title"]);
  const description = computed(() => _props["description"]);
  const children = renderValue(() => readSlot(_slots.default));
  const id = useId();
  return () => {
    return <div role="group" aria-labelledby={id} class="grid gap-x-10 gap-y-4 @2xl/settings:grid-cols-[13rem_minmax(0,1fr)]">
      <div class="grid content-start gap-1">
        <h3 id={id} class="font-script text-[1.6rem] leading-none font-bold">
          {title.value}
        </h3>
        <p class="text-sm text-muted-foreground">{description.value}</p>
      </div>
      <div class="grid min-w-0 gap-4">{readSlot(_slots.default)}</div>
    </div>;
  };
});
const SettingsNotifications = defineUi<Props>("SettingsNotifications", ["class", "defaultValue", "onSave", "onTest"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const defaultValue = computed(() => _props["defaultValue"] === undefined ? DEFAULT_PREFS : _props["defaultValue"]);
  const onSave = computed(() => _props["onSave"]);
  const onTest = computed(() => _props["onTest"]);
  const prefs = shallowRef<Prefs>(initialState(defaultValue.value));
  const setPrefs = stateSetter(prefs);
  const problems = shallowRef<Problems>(initialState({}));
  const setProblems = stateSetter(problems);
  const status = shallowRef<"idle" | "saved" | "tested">(initialState("idle"));
  const setStatus = stateSetter(status);
  const busy = shallowRef(initialState(false));
  const setBusy = stateSetter(busy);
  const failure = shallowRef(initialState(""));
  const setFailure = stateSetter(failure);
  const ids = useId();
  const change = computed(() => (next: Prefs) => {
    setPrefs(next);
    setStatus("idle");
    setProblems({});
    setFailure("");
  });
  const toggle = computed(() => (event: string, channel: Channel, on: boolean) => {
    const now = prefs.value.on[event] ?? [];
    change.value({
      ...prefs.value,
      on: {
        ...prefs.value.on,
        [event]: on ? [...now.filter(c => c !== channel), channel] : now.filter(c => c !== channel)
      }
    });
  });
  const save = computed(() => async (e: SubmitEvent) => {
    e.preventDefault();
    const found = validate(prefs.value);
    setProblems(found);
    if (found.channels || found.quiet) return;
    setBusy(true);
    setFailure("");
    try {
      await onSave.value?.(prefs.value);
      setStatus("saved");
    } catch (err) {
      setFailure(err instanceof Error && err.message ? err.message : "Your choices were not saved. Nothing has changed, so try again in a moment." as const);
    } finally {
      setBusy(false);
    }
  });
  const muted = computed(() => prefs.value.mode === "nothing");
  return () => {
    return <div class="w-full overflow-x-clip px-2">
      <Page as="section" width="xl" torn="top" seed="settings-notifications" aria-labelledby={`${ids}-title`} class={cn("my-6", className.value)}>
        <PageHeader>
          <PageTitle as="h2" id={`${ids}-title`} underline="wavy" seed="notify-title">
            Notifications
          </PageTitle>
          <PageDescription>Decide what is worth a tap on the shoulder, and where it arrives. Everything is quiet until you say otherwise.</PageDescription>
        </PageHeader>

        <form novalidate onSubmit={save.value} aria-label="Notification settings" class="@container/settings grid gap-8">
          <Section title="How much" description="The biggest dial. The boxes below fine-tune it.">
            <RadioGroup value={prefs.value.mode} onValueChange={v => change.value({
              ...prefs.value,
              mode: v as Mode
            })} aria-label="How much to hear about" class="gap-3">
              {MODES.map(m => <FieldLabel key={m.id} for={`${ids}-mode-${m.id}`}>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>{m.title}</FieldTitle>
                      <FieldDescription>{m.help}</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value={m.id} id={`${ids}-mode-${m.id}`} />
                  </Field>
                </FieldLabel>)}
            </RadioGroup>
          </Section>

          <Separator variant="dashed" />

          <Section title="What goes where" description="Tick a box to send that kind of news by that route.">
            <Table aria-label="What goes where">
              <TableHeader>
                <TableRow>
                  <TableHead>News</TableHead>
                  {CHANNELS.map(c => <TableHead key={c.id} class="w-14 px-1 text-center leading-tight whitespace-normal @xl/settings:w-24 @xl/settings:px-3">
                      {c.label}
                    </TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {EVENTS.map(ev => {
                  const live = rowEnabled(prefs.value.mode, ev.personal);
                  return <TableRow key={ev.id} class={cn(!live && "opacity-60")}>
                      <TableCell class="whitespace-normal">
                        <p class="font-bold">{ev.label}</p>
                        <p class="text-sm font-normal text-muted-foreground">{live ? ev.help : muted.value ? "Muted above." as const : "Only about you, so not sent in “Just me”." as const}</p>
                      </TableCell>
                      {CHANNELS.map(c => <TableCell key={c.id} class="px-1 text-center [&:has([role=checkbox])]:pe-1 @xl/settings:px-3 @xl/settings:[&:has([role=checkbox])]:pe-3">
                          <Checkbox aria-label={`${ev.label} by ${c.label.toLowerCase()}`} checked={(prefs.value.on[ev.id] ?? []).includes(c.id)} disabled={!live} aria-invalid={!!problems.value.channels && live} onCheckedChange={v => toggle.value(ev.id, c.id, v === true)} />
                        </TableCell>)}
                    </TableRow>;
                })}
              </TableBody>
            </Table>
            <FieldError>{problems.value.channels}</FieldError>
          </Section>

          <Separator variant="dashed" />

          <Section title="Quiet hours" description="Nothing buzzes, nothing pings. It all waits in the app.">
            <FieldGroup>
              <Field orientation="horizontal" data-disabled={muted.value || undefined}>
                <FieldContent>
                  <FieldLabel for={`${ids}-quiet`}>Hush the desk at night</FieldLabel>
                  <FieldDescription>Push and email are held back; the in-app list keeps filling.</FieldDescription>
                </FieldContent>
                <Switch id={`${ids}-quiet`} checked={prefs.value.quiet.on && !muted.value} disabled={muted.value} onCheckedChange={on => change.value({
                  ...prefs.value,
                  quiet: {
                    ...prefs.value.quiet,
                    on
                  }
                })} />
              </Field>
              {prefs.value.quiet.on && !muted.value ? <>
                  <div class="grid gap-4 @xl/settings:grid-cols-2">
                    {(["from", "to"] as const).map(k => <Field key={k} data-invalid={!!problems.value.quiet || undefined}>
                        <FieldLabel for={`${ids}-${k}`}>{k === "from" ? "From" as const : "Until" as const}</FieldLabel>
                        <NativeSelect id={`${ids}-${k}`} value={prefs.value.quiet[k]} aria-invalid={!!problems.value.quiet} onChange={e => change.value({
                      ...prefs.value,
                      quiet: {
                        ...prefs.value.quiet,
                        [k]: e.target.value
                      }
                    })}>
                          {TIMES.map(t => <NativeSelectOption key={t.value} value={t.value}>
                              {t.label}
                            </NativeSelectOption>)}
                        </NativeSelect>
                      </Field>)}
                  </div>
                  <Field data-invalid={!!problems.value.quiet || undefined}>
                    <FieldLabel id={`${ids}-days`}>On these days</FieldLabel>
                    <ToggleGroup type="multiple" variant="outline" aria-labelledby={`${ids}-days`} value={prefs.value.quiet.days} onValueChange={days => change.value({
                    ...prefs.value,
                    quiet: {
                      ...prefs.value.quiet,
                      days
                    }
                  })} class="w-fit!">
                      {DAYS.map(d => <ToggleGroupItem key={d.id} value={d.id} aria-label={d.label}>
                          {d.short}
                        </ToggleGroupItem>)}
                    </ToggleGroup>
                    <FieldError>{problems.value.quiet}</FieldError>
                  </Field>
                </> : null}
            </FieldGroup>
          </Section>

          <Separator variant="dashed" />

          <Section title="Weekly summary" description="One email that says what you wrote and who read it.">
            <FieldGroup>
              <Field data-disabled={muted.value || undefined}>
                <FieldLabel for={`${ids}-day`}>Send it on</FieldLabel>
                <Select value={prefs.value.summary.day} disabled={muted.value} onValueChange={day => change.value({
                  ...prefs.value,
                  summary: {
                    ...prefs.value.summary,
                    day
                  }
                })}>
                  <SelectTrigger id={`${ids}-day`} class="w-full @xl/settings:w-56">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {DAYS.map(d => <SelectItem key={d.id} value={d.id}>
                        {d.label}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field orientation="horizontal" data-disabled={muted.value || undefined}>
                <Checkbox id={`${ids}-tally`} checked={prefs.value.summary.tally} disabled={muted.value} onCheckedChange={v => change.value({
                  ...prefs.value,
                  summary: {
                    ...prefs.value.summary,
                    tally: v === true
                  }
                })} />
                <FieldContent>
                  <FieldLabel for={`${ids}-tally`}>Count my pages in tally marks</FieldLabel>
                  <FieldDescription>Four strokes and a slash, the way you keep score.</FieldDescription>
                </FieldContent>
              </Field>
            </FieldGroup>
          </Section>

          {failure.value ? <Alert variant="destructive">
              <Icon name="circle-alert" />
              <AlertTitle>That did not go through</AlertTitle>
              <AlertDescription>{failure.value}</AlertDescription>
            </Alert> : null}

          {status.value === "tested" ? <Alert variant="success">
              <Icon name="circle-check" />
              <AlertTitle>A test note is on its way</AlertTitle>
              <AlertDescription>It follows the choices above, so if it does not arrive, look at what is ticked.</AlertDescription>
            </Alert> : null}

          <div class="flex flex-wrap items-center gap-3">
            <Button type="submit" aria-busy={busy.value}>
              {busy.value ? "Saving…" as const : "Save preferences" as const}
            </Button>
            <Button type="button" variant="outline" onClick={async () => {
              setFailure("");
              try {
                await onTest.value?.(prefs.value);
                setStatus("tested");
              } catch (err) {
                setFailure(err instanceof Error && err.message ? err.message : "The test note could not be sent. Try again in a moment." as const);
              }
            }}>
              Send a test
            </Button>
            <p role="status" class="flex items-center gap-2 text-sm font-bold text-green">
              {status.value === "saved" ? <>
                  <Icon name="circle-check" />
                  Saved. We will follow these from now on.
                </> : null}
            </p>
          </div>
        </form>
      </Page>
    </div>;
  };
});
export default SettingsNotifications;
