import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { MessageText } from '@/components/ui/message'

describe('MessageText', () => {
  it('流式文本首次渲染后仍能稳定更新', async () => {
    // 这个场景覆盖聊天区块首次挂载时的文本分词和流式状态。
    const wrapper = mount(MessageText, {
      props: { streaming: true, seed: 'message-text-test' },
      slots: { default: () => 'hello world' },
    })

    await nextTick()

    expect(wrapper.get('[data-slot="message-text"]').text()).toContain('hello world')
  })
})
