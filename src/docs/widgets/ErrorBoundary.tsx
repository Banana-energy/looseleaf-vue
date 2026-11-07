import { onErrorCaptured, shallowRef, watch } from 'vue'
import { defineUi } from '@/lib/component'
import type { VNodeChild } from 'vue'
import { Button, Callout } from '../kit'

// 页面与预览的异常在展示边界统一提示，重试只重新挂载当前内容。
export const ErrorBoundary = defineUi<{ resetKey?: unknown; title?: string; fallback?: (error: unknown, reset: () => void) => VNodeChild; onError?: (error: unknown, info: string) => void }>('ErrorBoundary', ['resetKey', 'title', 'fallback', 'onError'], (props, { slots }) => {
  const failure = shallowRef<unknown>()
  const failed = shallowRef(false)
  const version = shallowRef(0)
  const reset = () => { failed.value = false; version.value++ }
  onErrorCaptured((error, _instance, info) => { failure.value = error; failed.value = true; props.onError?.(error, info); return false })
  watch(() => props.resetKey, reset)
  return () => failed.value ? props.fallback ? props.fallback(failure.value, reset) : <Callout tone="error" title={props.title === undefined ? 'This part of the page crashed' : props.title} class="dk-boundary"><p class="dk-boundary-message">{String(failure.value)}</p><Button onClick={reset}>Try again</Button></Callout> : <div key={version.value} class="contents">{slots.default?.()}</div>
})

