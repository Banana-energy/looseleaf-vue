import useEmbla from 'embla-carousel-vue'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import type { EmblaCarouselType, EmblaOptionsType, EmblaPluginType } from 'embla-carousel'
import { toElement } from './ink/vue'

export type UseEmblaCarouselType = [(element: Parameters<typeof toElement>[0]) => void, EmblaCarouselType | undefined]
export type { EmblaOptionsType, EmblaPluginType }
// Embla 的 Vue 绑定负责销毁与选项更新；只把宿主 ref 转成原组件需要的回调形状。
export default function useEmblaCarousel(options: MaybeRefOrGetter<EmblaOptionsType>, plugins: MaybeRefOrGetter<EmblaPluginType[] | undefined>) {
  // Embla 的公开默认插件列表为空；转成可观察数组后随配置变化重新初始化。
  const [element, api] = useEmbla(computed(() => toValue(options)), computed(() => toValue(plugins) === undefined ? [] : toValue(plugins)!))
  const attach = (node: Parameters<typeof toElement>[0]) => { element.value = toElement(node) ?? undefined }
  return computed<UseEmblaCarouselType>(() => [attach, api.value])
}
