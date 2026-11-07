// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { zodResolver } from "@/lib/schema-bridge";
import { Controller, useForm } from "@/lib/form-bridge";
import { toast } from "@/lib/sonner-primitive";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
export const meta = {
  title: "Vue Hook Form: select" as const,
  description: "shadcn's `form-rhf-select`: a Reka UI Select is not a native input, so `name`, `value` and `onValueChange` are passed by hand and `aria-invalid` goes on the trigger. \"Auto\" is a value the schema refuses." as const,
  layout: "center" as const,
  height: 420
};
const spokenLanguages = [{
  label: "English" as const,
  value: "en" as const
}, {
  label: "Spanish" as const,
  value: "es" as const
}, {
  label: "French" as const,
  value: "fr" as const
}, {
  label: "German" as const,
  value: "de" as const
}, {
  label: "Italian" as const,
  value: "it" as const
}, {
  label: "Chinese" as const,
  value: "zh" as const
}, {
  label: "Japanese" as const,
  value: "ja" as const
}] as const;
const formSchema = z.object({
  language: z.string().min(1, "Please select your spoken language.").refine(val => val !== "auto", {
    message: "Auto-detection is not allowed. Please select a specific language." as const
  })
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const form = useForm<z.infer<typeof formSchema>>(() => ({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: "" as const
    }
  }));
  return () => {
    function onSubmit(data: z.infer<typeof formSchema>) {
      toast("You submitted the following values:", {
        toasterId: "form-rhf-select" as const,
        description: <pre class="mt-2 w-[320px] overflow-x-auto bg-paper-shade p-4 font-mono text-sm text-foreground">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>,
        position: "bottom-right" as const
      });
    }
    return <Card class="w-full sm:max-w-lg">
      <CardHeader>
        <CardTitle>Language Preferences</CardTitle>
        <CardDescription>Select your preferred spoken language.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-select" onSubmit={form.value.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller name="language" control={form.value.control} render={({
              field,
              fieldState
            }) => <Field orientation="responsive" data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel for="form-rhf-select-language">Spoken Language</FieldLabel>
                    <FieldDescription>For best results, select the language you speak.</FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                  <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="form-rhf-select-language" aria-invalid={fieldState.invalid} class="min-w-[120px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectSeparator />
                      {spokenLanguages.map(language => <SelectItem key={language.value} value={language.value}>
                          {language.label}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>} />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.value.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-select">
            Save
          </Button>
        </Field>
      </CardFooter>
      <Toaster id="form-rhf-select" />
    </Card>;
  };
});
export default Example;
