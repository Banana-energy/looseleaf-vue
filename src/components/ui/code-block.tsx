// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, toValue, type MaybeRefOrGetter, type ComputedRef, useId, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Paper, type PaperProps } from "@/components/ui/paper";
import { diffResult, diffStats, langFromFileName, normaliseLang, parseDiff, tokenizeLines, type DiffLine, type Lang, type Token, type TokenType } from "@/lib/code-highlight";
import { useInk, useMergedRef } from "@/lib/ink/vue";
import { makeRng } from "@/lib/ink/rng";
import { codeBodyRecipe, codeRuleRecipe } from "@/lib/ink/recipes/code-block-ink";
import { cn } from "@/lib/utils";
const TOKEN_CLASS: Partial<Record<TokenType, string>> = {
  keyword: "text-(--ll-code-keyword)" as const,
  literal: "text-(--ll-code-literal)" as const,
  number: "text-(--ll-code-number)" as const,
  tag: "text-(--ll-code-tag)" as const,
  function: "text-(--ll-code-function)" as const,
  type: "text-(--ll-code-type)" as const,
  attr: "text-(--ll-code-attr)" as const,
  variable: "text-(--ll-code-variable)" as const,
  string: "text-(--ll-code-string)" as const,
  comment: "text-(--ll-code-comment)" as const,
  punct: "text-(--ll-code-punct)" as const
};
type Model = {
  code: string;
  language: Lang;
  diff: boolean;
  lines: Array<{
    tokens: Token[];
    kind: DiffLine["kind"] | "plain";
    n: number | null;
  }>;
  text: string;
  stats: {
    added: number;
    removed: number;
  } | null;
};
function buildModel(code: string, language: Lang, diff: boolean, startLine: number): Model {
  if (diff) {
    const rows = parseDiff(code);
    const tokens = tokenizeLines(rows.map(r => r.text).join("\n"), language === "diff" ? "text" as const : language);
    let n = startLine;
    const lines = rows.map((r, i) => ({
      tokens: tokens[i] ?? [],
      kind: r.kind,
      n: r.kind === "del" || r.kind === "meta" ? null : n++
    }));
    return {
      code,
      language,
      diff,
      lines,
      text: diffResult(rows),
      stats: diffStats(rows)
    };
  }
  const text = code.endsWith("\n") ? code.slice(0, -1) : code;
  const tokens = tokenizeLines(text, language);
  return {
    code,
    language,
    diff,
    lines: tokens.map((t, i) => ({
      tokens: t,
      kind: "plain" as const,
      n: startLine + i
    })),
    text,
    stats: null
  };
}
type Ctx = {
  model: Model;
  filename?: string;
  lineNumbers: boolean;
  wrap: boolean;
  seed: string;
};
const CodeBlockContext = createContext<Ctx | null>(null);
function useCode(): ComputedRef<Ctx> {
  const c = useContext(CodeBlockContext);
  return computed(() => {
    if (!c.value) console.error("CodeBlock parts must be used inside <CodeBlock>");
    return c.value;
  });
}
function strikePath(seed: string): {
  a: string;
  b: string;
} {
  const r = makeRng(seed);
  const y = (v: number) => (4 + v + r.gauss(0, 0.35)).toFixed(2);
  return {
    a: `M0 ${y(0.1)} C24 ${y(-0.8)} 44 ${y(0.9)} 66 ${y(-0.2)} S92 ${y(0.6)} 100 ${y(-0.4)}`,
    b: `M2 ${y(1.1)} C30 ${y(0.4)} 58 ${y(1.6)} 98 ${y(0.9)}`
  };
}
function tickPath(seed: string): string {
  const r = makeRng(seed);
  const j = () => r.gauss(0, 0.5);
  return `M${(1.6 + j()).toFixed(2)} ${(7.4 + j()).toFixed(2)} L${(5.1 + j()).toFixed(2)} ${(11.4 + j()).toFixed(2)} L${(12.6 + j()).toFixed(2)} ${(2.2 + j()).toFixed(2)}`;
}
const Strike = defineUi<{
  seed: string;
}>("Strike", ["seed"], (_props, {
  slots: _slots
}) => {
  const seed = computed(() => _props["seed"]);
  const p = computed(() => strikePath(seed.value));
  return () => {
    return <svg aria-hidden="true" focusable="false" viewBox="0 0 100 8" preserveAspectRatio="none" class="pointer-events-none absolute inset-x-[-2px] top-1/2 h-2 w-[calc(100%+4px)] -translate-y-1/2 overflow-visible text-red">
      <path d={p.value.b} fill="none" stroke="currentColor" stroke-width={1} stroke-linecap="round" opacity={0.5} vector-effect="non-scaling-stroke" />
      <path d={p.value.a} fill="none" stroke="currentColor" stroke-width={1.7} stroke-linecap="round" vector-effect="non-scaling-stroke" />
    </svg>;
  };
});
const Tick = defineUi<{
  seed: string;
}>("Tick", ["seed"], (_props, {
  slots: _slots
}) => {
  const seed = computed(() => _props["seed"]);
  return () => {
    return <svg aria-hidden="true" focusable="false" viewBox="0 0 14 14" class="pointer-events-none absolute start-1.5 top-1/2 size-3.5 -translate-y-1/2 overflow-visible text-green">
      <path d={tickPath(seed.value)} fill="none" stroke="currentColor" stroke-width={1.9} stroke-linecap="round" stroke-linejoin="round" />
    </svg>;
  };
});
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const was = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.setAttribute("aria-hidden", "true");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.append(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      was?.focus({
        preventScroll: true
      });
      return ok;
    } catch {
      return false;
    }
  }
}
function selectCodeOf(button: Element): void {
  const code = button.closest('[data-slot="code-block"]')?.querySelector('[data-slot="code-block-code"]');
  const selection = typeof window === "undefined" ? null : window.getSelection?.();
  if (!code || !selection) return;
  const range = document.createRange();
  range.selectNodeContents(code);
  selection.removeAllRanges();
  selection.addRange(range);
}
type CodeBlockProps = Omit<PaperProps, "as" | "children"> & {
  code?: string;
  language?: string;
  filename?: string;
  lineNumbers?: boolean;
  diff?: boolean;
  wrap?: boolean;
  startLine?: number;
  copyable?: boolean;
  tone?: "dark" | "paper";
  children?: UI.ReactNode;
};
const CodeBlock = defineUi<CodeBlockProps>("CodeBlock", ["code", "language", "filename", "lineNumbers", "diff", "wrap", "startLine", "copyable", "stock", "tape", "tone", "seed", "class"], (_props, {
  slots: _slots
}) => {
  const code = computed(() => _props["code"] === undefined ? "" as const : _props["code"]);
  const language = computed(() => _props["language"]);
  const filename = computed(() => _props["filename"]);
  const lineNumbers = computed(() => _props["lineNumbers"] === undefined ? false : _props["lineNumbers"]);
  const diff = computed(() => _props["diff"]);
  const wrap = computed(() => _props["wrap"] === undefined ? false : _props["wrap"]);
  const startLine = computed(() => _props["startLine"] === undefined ? 1 : _props["startLine"]);
  const copyable = computed(() => _props["copyable"] === undefined ? true : _props["copyable"]);
  const stock = computed(() => _props["stock"] === undefined ? "slip" as const : _props["stock"]);
  const tape = computed(() => _props["tape"] === undefined ? "top" as const : _props["tape"]);
  const tone = computed(() => _props["tone"] === undefined ? "dark" as const : _props["tone"]);
  const seed = computed(() => _props["seed"]);
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["code", "language", "filename", "lineNumbers", "diff", "wrap", "startLine", "copyable", "stock", "tape", "tone", "seed", "class", "children", "ref"]));
  const id = useId();
  const s = computed(() => seed.value === undefined ? id : String(seed.value));
  const lang = computed<Lang>(() => language.value ? normaliseLang(language.value) : filename.value ? langFromFileName(filename.value) : "text" as const);
  const isDiff = computed(() => diff.value ?? lang.value === "diff");
  const model = computed(() => buildModel(code.value, lang.value, isDiff.value, startLine.value));
  const ctx = computed<Ctx>(() => ({
    model: model.value,
    filename: filename.value,
    lineNumbers: lineNumbers.value,
    wrap: wrap.value,
    seed: s.value
  }));
  return () => {
    return <CodeBlockContext.Provider value={ctx.value}>
      <Paper as="figure" data-slot="code-block" data-tone={tone.value} data-language={lang.value} data-diff={isDiff.value ? "" as const : undefined} stock={stock.value} tape={tape.value} seed={s.value} ref={ref.value} aria-label={filename.value ?? (lang.value === "text" ? "Code" as const : `${lang.value} code`)} class={cn("m-0 flex max-w-full min-w-0 flex-col text-ink", className.value)} {...domProps(props.value)}>
        {readSlot(_slots.default) ?? <>
            <CodeBlockHeader>
              <CodeBlockTitle />
              <CodeBlockStats />
              {copyable.value ? <CodeBlockActions>
                  <CodeBlockCopy />
                </CodeBlockActions> : null}
            </CodeBlockHeader>
            <CodeBlockContent />
          </>}
      </Paper>
    </CodeBlockContext.Provider>;
  };
});
const CodeBlockHeader = defineUi<UI.ComponentProps<"div">>("CodeBlockHeader", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["class", "children", "ref"]));
  const _hook4 = useCode();
  const seed = computed(() => _hook4.value.seed);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: codeRuleRecipe,
    params: {},
    kind: "rule" as const,
    seed: `${seed.value}|rule`,
    still: true
  }));
  return () => {
    return <div data-slot="code-block-header" ref={useMergedRef<HTMLElement>(hostRef, ref.value as UI.Ref<HTMLElement> | undefined) as UI.Ref<HTMLDivElement>} {...domProps(hostProps.value)} class={cn("relative isolate flex min-w-0 items-center gap-3 px-4 pt-3.5 pb-2.5 font-type text-[13px] tracking-wide text-ink-muted forced-colors:border-b forced-colors:border-dashed forced-colors:border-[CanvasText] forced-colors:outline-none!", className.value)} {...domProps(props.value)}>
      {node.value}
      {readSlot(_slots.default)}
    </div>;
  };
});
const CodeBlockTitle = defineUi<UI.ComponentProps<"span">>("CodeBlockTitle", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const props = computed(() => omitProps(_props, ["class", "children"]));
  const _hook3 = useCode();
  const filename = computed(() => _hook3.value.filename);
  const model = computed(() => _hook3.value.model);
  return () => {
    return <span data-slot="code-block-title" class={cn("ll-ink-room min-w-0 flex-1 truncate", className.value)} {...domProps(props.value)}>
      {readSlot(_slots.default) ?? filename.value ?? model.value.language}
    </span>;
  };
});
const CodeBlockStats = defineUi<UI.ComponentProps<"span">>("CodeBlockStats", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  const _hook2 = useCode();
  const model = computed(() => _hook2.value.model);
  return () => {
    if (!model.value.stats) return null;
    return <span data-slot="code-block-stats" class={cn("flex shrink-0 gap-2 tabular-nums", className.value)} {...domProps(props.value)}>
      <span class="text-green">
        <span aria-hidden="true">+</span>
        <span class="sr-only">Added </span>
        {model.value.stats.added}
      </span>
      <span class="text-red">
        <span aria-hidden="true">-</span>
        <span class="sr-only">Removed </span>
        {model.value.stats.removed}
      </span>
    </span>;
  };
});
const CodeBlockActions = defineUi<UI.ComponentProps<"div">>("CodeBlockActions", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <div data-slot="code-block-actions" class={cn("flex shrink-0 items-center gap-1", className.value)} {...domProps(props.value)}>{_slots.default?.()}</div>;
  };
});
const CodeBlockCopy = defineUi<UI.ComponentProps<typeof Button>>("CodeBlockCopy", ["class", "onClick"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const children = renderValue(() => readSlot(_slots.default));
  const onClick = computed(() => _props["onClick"]);
  const props = computed(() => omitProps(_props, ["class", "children", "onClick"]));
  const _hook4 = useCode();
  const model = computed(() => _hook4.value.model);
  const state = shallowRef<"idle" | "copied" | "failed">(initialState("idle"));
  const setState = stateSetter(state);
  const timer = shallowRef<number | undefined>(undefined);
  watchDependencies(() => () => window.clearTimeout(timer.value), () => [], false);
  return () => {
    return <>
      <Button data-slot="code-block-copy" type="button" variant="ghost" size="xs" aria-label="Copy code" class={cn("font-type font-normal tracking-wide text-ink-muted", className.value)} onClick={e => {
        onClick.value?.(e);
        if (e.defaultPrevented) return;
        const button = e.currentTarget;
        void copyText(model.value.text).then(ok => {
          if (!ok) selectCodeOf(button);
          setState(ok ? "copied" as const : "failed" as const);
          window.clearTimeout(timer.value);
          timer.value = window.setTimeout(() => setState("idle"), 1800);
        });
      }} {...domProps(props.value)}>
        {readSlot(_slots.default) ?? <>
            <Icon name={state.value === "copied" ? "check" as const : "copy" as const} />
            {state.value === "copied" ? "copied" as const : state.value === "failed" ? "press Ctrl+C" as const : "copy" as const}
          </>}
      </Button>
      <span data-slot="code-block-status" role="status" class="sr-only">
        {state.value === "copied" ? "Copied" as const : state.value === "failed" ? "Could not copy" as const : "" as const}
      </span>
    </>;
  };
});
const CodeBlockContent = defineUi<UI.ComponentProps<"pre"> & {
  code?: string;
  language?: string;
}>("CodeBlockContent", ["code", "language", "class"], (_props, {
  slots: _slots
}) => {
  const code = computed(() => _props["code"]);
  const language = computed(() => _props["language"]);
  const className = computed(() => _props["class"]);
  const ref = computed(() => _props["ref"]);
  const props = computed(() => omitProps(_props, ["code", "language", "class", "ref"]));
  const ctx = useCode();
  const own = computed(() => code.value !== undefined ? buildModel(code.value, language.value ? normaliseLang(language.value) : ctx.value.model.language, ctx.value.model.diff, 1) : null);
  const model = computed(() => own.value ?? ctx.value.model);
  const {
    hostRef,
    hostProps,
    node
  } = useInk(() => ({
    recipe: codeBodyRecipe,
    params: {},
    kind: "code" as const,
    seed: `${ctx.value.seed}|body`,
    still: true
  }));
  return () => {
    return <div data-slot="code-block-body" data-ink-focus="within" ref={hostRef} {...domProps(hostProps.value)} class="relative isolate min-w-0">
      {node.value}
      <pre data-slot="code-block-pre" ref={ref.value} dir="ltr" tabindex={0} class={cn("m-0 max-w-full min-w-0 overflow-x-auto px-4 pt-3 pb-4 font-mono text-[13.5px] leading-[1.7] text-ink outline-hidden [scrollbar-width:thin] calm:text-[13px] calm:leading-[1.6]", ctx.value.wrap ? "whitespace-pre-wrap [overflow-wrap:anywhere]" as const : "whitespace-pre" as const, className.value)} {...domProps(props.value)}>
        <code data-slot="code-block-code" class={cn("block", ctx.value.wrap ? "w-full" as const : "w-max min-w-full" as const, "[&>[data-slot=code-line]:nth-child(7n+3)]:opacity-[0.94] [&>[data-slot=code-line]:nth-child(11n+6)]:opacity-[0.9]")}>
          {model.value.lines.map((l, i) => {
            const removed = l.kind === "del";
            const added = l.kind === "add";
            const meta = l.kind === "meta";
            const Row = added ? "ins" as const : removed ? "del" as const : "span" as const;
            const body = l.tokens.map((t, k) => <span key={k} class={TOKEN_CLASS[t.type]}>
                {t.text}
              </span>);
            return <Row key={i} data-slot="code-line" data-line={ctx.value.lineNumbers && l.n !== null ? l.n : undefined} data-diff={added ? "add" as const : removed ? "del" as const : undefined} class={cn("relative block min-h-lh no-underline", ctx.value.lineNumbers ? model.value.diff ? "ps-14" as const : "ps-11" as const : model.value.diff ? "ps-7" as const : undefined, ctx.value.lineNumbers && "before:pointer-events-none before:absolute before:w-8 before:text-end before:text-pencil-text before:tabular-nums before:select-none before:content-[attr(data-line)]", ctx.value.lineNumbers && (model.value.diff ? "before:start-5" as const : "before:start-0" as const), meta && "text-pencil-text")}>
                {model.value.diff && added ? <Tick seed={`${ctx.value.seed}|t${i}`} /> : null}
                {model.value.diff && added ? <span class="sr-only select-none">Added: </span> : null}
                {removed ? <span class="sr-only select-none">Removed: </span> : null}
                {removed ? <span class="relative inline-block max-w-full text-ink-muted">
                    {body}
                    <Strike seed={`${ctx.value.seed}|s${i}`} />
                  </span> : body}
                {i < model.value.lines.length - 1 ? "\n" as const : null}
              </Row>;
          })}
        </code>
      </pre>
    </div>;
  };
});
export { CodeBlock, CodeBlockHeader, CodeBlockTitle, CodeBlockStats, CodeBlockActions, CodeBlockCopy, CodeBlockContent };
export type { CodeBlockProps };
