import { cloneVNode, h, isVNode, Teleport, type Component, type VNode, type VNodeChild } from 'vue'

// 子节点操作在框架边界转换为 Vue VNode，维持上游组合组件的节点顺序。
function flatten(children: VNodeChild): VNodeChild[] {
  return Array.isArray(children) ? children.flatMap(flatten) : children === null || children === undefined || typeof children === 'boolean' ? [] : [children]
}
export const Children = {
  toArray: flatten,
  count: (children: VNodeChild) => flatten(children).length,
  map: <T>(children: VNodeChild, mapper: (child: VNodeChild, index: number) => T) => flatten(children).map(mapper),
  forEach: (children: VNodeChild, callback: (child: VNodeChild, index: number) => void) => flatten(children).forEach(callback),
  only: (children: VNodeChild) => flatten(children)[0],
}
export function isValidElement<P>(node: unknown): node is VNode & { props: P } { return isVNode(node) }
export function cloneElement(node: VNode, props: object, ...children: VNodeChild[]) {
  const mapped: Record<string, unknown> = { ...props }
  if ('className' in mapped) { mapped.class = mapped.className; delete mapped.className }
  const cloned = cloneVNode(node, mapped, true)
  if (children.length) cloned.children = children as VNode['children']
  return cloned
}
export function createElement(component: any, props: object | null, ...children: VNodeChild[]) {
  return h(component, props, children)
}
export function createPortal(children: VNodeChild, container: Element) { return h(Teleport, { to: container }, { default: () => children }) }
