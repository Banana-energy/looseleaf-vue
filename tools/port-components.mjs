import fs from 'node:fs'
import path from 'node:path'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import generate from '@babel/generator'
import * as t from '@babel/types'

// 机械迁移只负责语法和响应性转换；迁移清单另行记录人工核对及交互验收结果。
const upstream = process.argv[2]
const names = process.argv.slice(3).flatMap(name => name.startsWith('--tree=') ? fs.readdirSync(path.join(upstream, name.slice(7)), { recursive: true }).filter(file => /\.(?:ts|tsx)$/.test(file) && !file.endsWith('.d.ts')).map(file => `${name.slice(7)}/${file.replaceAll('\\', '/')}`) : [name])

const id = name => t.identifier(name)
const call = (name, args = []) => t.callExpression(id(name), args)
const value = name => { const root = id(name); root._portedRef = true; return t.memberExpression(root, id('value')) }
const getter = expression => t.arrowFunctionExpression([], expression)

for (const name of names) {
  try {
  if (name === 'form') { process.stdout.write('MANUAL form\n'); continue }
  if (['src/docs/main.tsx', 'src/docs/widgets/ErrorBoundary.tsx'].includes(name)) { process.stdout.write(`MANUAL ${name}\n`); continue }
  const relative = name.includes('/') ? name : `src/components/ui/${name}.tsx`
  const file = path.join(upstream, relative)
  const source = fs.readFileSync(file, 'utf8')
  const ast = parse(source, { sourceType: 'module', plugins: ['typescript', 'jsx'] })
  const refs = new WeakSet()
  const native = new Set(['useInk', 'useInkCore', 'useInkFaces', 'useInkSeed', 'useDensity', 'useInkTier', 'useInkScope', 'useInkContext', 'useIconSize', 'useInkKnobs', 'useLooseleafDirection'])
  const vueImports = new Set(['computed'])
  let unsupported = false
  const customHooks = new Set()
  const contexts = new Set()
  // Vue 已自行追踪渲染依赖，不需要 React.memo 包装；先还原为统一的函数声明。
  traverse(ast, { VariableDeclaration(p) {
    if (p.getFunctionParent() || p.node.declarations.length !== 1) return
    const declaration = p.node.declarations[0]
    let fn = declaration.init
    if (t.isCallExpression(fn) && t.isMemberExpression(fn.callee) && fn.callee.object.name === 'React' && fn.callee.property.name === 'memo') fn = fn.arguments[0]
    if (!t.isIdentifier(declaration.id) || !/^(?:[A-Z]|use[A-Z])/.test(declaration.id.name) || !(t.isFunctionExpression(fn) || t.isArrowFunctionExpression(fn))) return
    const body = t.isBlockStatement(fn.body) ? fn.body : t.blockStatement([t.returnStatement(fn.body)])
    const next = t.functionDeclaration(declaration.id, fn.params, body)
    next.typeParameters = fn.typeParameters
    next.returnType = fn.returnType
    p.scope.removeBinding(declaration.id.name)
    p.replaceWith(next)
  } })
  traverse(ast, { FunctionDeclaration(p) { if (p.node.id && /^use[A-Z]/.test(p.node.id.name)) customHooks.add(p.node.id.name) } })
  const reactBindings = new Map()
  for (const node of ast.program.body) if (t.isImportDeclaration(node)) {
    for (const specifier of node.specifiers) if (t.isImportSpecifier(specifier)) {
      if (node.source.value === 'react') reactBindings.set(specifier.local.name, specifier.imported.name)
      if ((node.source.value.startsWith('@/') || node.source.value.startsWith('.')) && /^use[A-Z]/.test(specifier.imported.name) && !native.has(specifier.imported.name) && !['useMergedRef', 'useContext', 'useEnsureInkDefs'].includes(specifier.imported.name)) customHooks.add(specifier.local.name)
    }
    if (node.source.value === 'embla-carousel-react') customHooks.add('useEmblaCarousel')
    if (node.source.value === 'cmdk') customHooks.add('useCommandState')
    if (node.source.value === 'react-day-picker') customHooks.add('useDayPicker')
    if (node.source.value === 'react-hook-form') for (const specifier of node.specifiers) if (t.isImportSpecifier(specifier) && /^use[A-Z]/.test(specifier.imported.name)) customHooks.add(specifier.local.name)
  }
  traverse(ast, {
    VariableDeclarator(p) { if (t.isIdentifier(p.node.id) && t.isCallExpression(p.node.init) && (p.node.init.callee.name === 'createContext' || t.isMemberExpression(p.node.init.callee) && p.node.init.callee.object.name === 'React' && p.node.init.callee.property.name === 'createContext')) contexts.add(p.node.id.name) },
    ReferencedIdentifier(p) {
      const imported = reactBindings.get(p.node.name)
      if (!imported || p.findParent(parent => parent.isImportDeclaration())) return
      if (p.findParent(parent => parent.isTSType())) return
      if (['createContext', 'createElement', 'cloneElement', 'isValidElement', 'Children'].includes(imported)) return
      if (imported === 'Fragment' || imported === 'StrictMode') { if (p.node.name !== 'Fragment') p.replaceWith(p.isJSXIdentifier() ? t.jsxIdentifier('Fragment') : id('Fragment')); vueImports.add('Fragment'); p.skip(); return }
      if (imported === 'Suspense') return
      if (imported === 'lazy' || imported === 'memo' || imported === 'startTransition') { p.replaceWith(id(`vue${imported[0].toUpperCase()}${imported.slice(1)}`)); return }
      p.replaceWith(t.memberExpression(id('React'), id(imported)))
    },
    TSTypeReference(p) {
      if (t.isIdentifier(p.node.typeName) && reactBindings.has(p.node.typeName.name)) p.node.typeName = t.tsQualifiedName(id('UI'), id(reactBindings.get(p.node.typeName.name)))
    },
    TSInterfaceHeritage(p) {
      if (t.isIdentifier(p.node.expression) && reactBindings.has(p.node.expression.name)) p.node.expression = t.memberExpression(id('UI'), id(reactBindings.get(p.node.expression.name)))
    },
  })

  // 统一 JSX 与类型名称，保留原版 CSS 字符串和所有绘制参数。
  traverse(ast, {
    ImportDeclaration(p) {
      const module = p.node.source.value
      if (module === 'react') { p.remove(); return }
      if (module === 'radix-ui') { p.node.source.value = '@/lib/primitives'; return }
      if (module === 'react-dom') { p.node.source.value = '@/lib/vnode'; return }
      const adapters = { 'embla-carousel-react': '@/lib/carousel-primitive', vaul: '@/lib/drawer-primitive', sonner: '@/lib/sonner-primitive', cmdk: '@/lib/command-primitive', 'input-otp': '@/lib/otp-primitive', 'react-resizable-panels': '@/lib/resizable-primitive', 'react-day-picker': '@/lib/calendar-primitive', 'react-hook-form': '@/lib/form-bridge', '@hookform/resolvers/zod': '@/lib/schema-bridge' }
      if (adapters[module]) p.node.source.value = adapters[module]
      if (module.startsWith('@/lib/ink/react')) p.node.source.value = module.replace('@/lib/ink/react', '@/lib/ink/vue')
    },
    ExportNamedDeclaration(p) { if (p.node.source?.value === 'react-resizable-panels') p.node.source.value = '@/lib/resizable-primitive' },
    JSXAttribute(p) {
      if (p.node.name.name === 'className') p.node.name.name = 'class'
      if (p.node.name.name === 'htmlFor') p.node.name.name = 'for'
      if (p.node.name.name === 'tabIndex') p.node.name.name = 'tabindex'
      const attributes = { inputMode: 'inputmode', readOnly: 'readonly', noValidate: 'novalidate', autoComplete: 'autocomplete', autoFocus: 'autofocus', maxLength: 'maxlength', minLength: 'minlength', colSpan: 'colspan', rowSpan: 'rowspan', contentEditable: 'contenteditable', spellCheck: 'spellcheck' }
      const tag = p.parent.name?.name
      if (attributes[p.node.name.name] && tag && (/^[a-z]/.test(tag) || ['Input', 'InputControl', 'Textarea', 'TextareaControl', 'InputGroupInput', 'InputGroupTextarea', 'PasswordInput', 'InputOTP', 'SelectNative', 'TableCell', 'TableHead'].includes(tag))) p.node.name.name = attributes[p.node.name.name]
      const svgAttributes = { strokeWidth: 'stroke-width', strokeLinecap: 'stroke-linecap', strokeLinejoin: 'stroke-linejoin', strokeDasharray: 'stroke-dasharray', strokeDashoffset: 'stroke-dashoffset', strokeOpacity: 'stroke-opacity', fillOpacity: 'fill-opacity', fillRule: 'fill-rule', clipRule: 'clip-rule', clipPath: 'clip-path', vectorEffect: 'vector-effect', pathLength: 'pathLength' }
      if (svgAttributes[p.node.name.name]) p.node.name.name = svgAttributes[p.node.name.name]
      if (p.node.name.name === 'style' && t.isJSXExpressionContainer(p.node.value)) p.node.value.expression = call('cssStyle', [p.node.value.expression])
      if (['href', 'precedence'].includes(p.node.name.name) && p.parentPath.node.name.name === 'style') { p.remove(); return }
      if (p.node.name.name === 'suppressHydrationWarning') { p.remove(); return }
      if (p.node.name.name === 'dangerouslySetInnerHTML') {
        p.node.name.name = 'innerHTML'
        const expression = p.node.value.expression
        p.node.value.expression = t.isObjectExpression(expression) ? expression.properties[0].value : t.memberExpression(expression, id('__html'))
      }
    },
    OptionalMemberExpression(p) { if (!p.node.computed && p.node.property.name === 'current') p.node.property.name = 'value' },
    Identifier(p) {
      if (p.node.name === 'onDoubleClick') { p.node.name = 'onDblclick'; return }
      const events = ['PointerDown','PointerUp','PointerMove','PointerEnter','PointerLeave','PointerCancel','PointerOver','PointerOut','KeyDown','KeyUp','MouseDown','MouseUp','MouseMove','MouseEnter','MouseLeave','TouchStart','TouchEnd','TouchMove','TouchCancel','FocusIn','FocusOut','DoubleClick','DragStart','DragEnd','DragOver','DragLeave','DragEnter','AnimationEnd','AnimationStart','TransitionEnd','CompositionStart','CompositionEnd','ContextMenu','LostPointerCapture','GotPointerCapture','Wheel']
      for (const event of events) for (const suffix of ['', 'Capture']) if (p.node.name === `on${event}${suffix}`) p.node.name = `on${event[0]}${event.slice(1).toLowerCase()}${suffix}`
    },
    JSXIdentifier(p) {
      if (p.node.name === 'onDoubleClick') { p.node.name = 'onDblclick'; return }
      const events = ['PointerDown','PointerUp','PointerMove','PointerEnter','PointerLeave','PointerCancel','PointerOver','PointerOut','KeyDown','KeyUp','MouseDown','MouseUp','MouseMove','MouseEnter','MouseLeave','TouchStart','TouchEnd','TouchMove','TouchCancel','FocusIn','FocusOut','DoubleClick','DragStart','DragEnd','DragOver','DragLeave','DragEnter','AnimationEnd','AnimationStart','TransitionEnd','CompositionStart','CompositionEnd','ContextMenu','LostPointerCapture','GotPointerCapture','Wheel']
      for (const event of events) for (const suffix of ['', 'Capture']) if (p.node.name === `on${event}${suffix}`) p.node.name = `on${event[0]}${event.slice(1).toLowerCase()}${suffix}`
    },
    StringLiteral(p) { if (p.node.value.includes('--radix-')) p.node.value = p.node.value.replaceAll('--radix-', '--reka-') },
    BinaryExpression(p) {
      if (p.node.operator === '!==' && t.isUnaryExpression(p.node.left, { operator: 'typeof' }) && t.isMemberExpression(p.node.left.argument) && p.node.left.argument.property.name === 'default' && t.isStringLiteral(p.node.right, { value: 'function' })) {
        p.replaceWith(t.logicalExpression('&&', p.node, t.binaryExpression('!==', t.cloneNode(p.node.left), t.stringLiteral('object')))); p.skip()
      }
    },
    TSQualifiedName(p) {
      if (t.isIdentifier(p.node.left, { name: 'React' })) p.replaceWith(t.tsQualifiedName(id('UI'), p.node.right))
    },
    JSXSpreadAttribute(p) { p.node.argument = call('domProps', [p.node.argument, ...(['input', 'textarea'].includes(p.parent.name?.name) ? [t.booleanLiteral(true)] : [])]); p.skip() },
    MemberExpression(p) {
      if (!p.node.computed && p.node.property.name === 'current' && !(name === 'rating' && t.isIdentifier(p.node.object, { name: 'c' }))) p.node.property.name = 'value'
      if (t.isIdentifier(p.node.object, { name: 'React' }) && p.node.property.name === 'Fragment') { p.replaceWith(id('Fragment')); vueImports.add('Fragment') }
      if (t.isIdentifier(p.node.object, { name: 'React' }) && p.node.property.name === 'createContext') p.replaceWith(id('createContext'))
      if (t.isIdentifier(p.node.object, { name: 'React' }) && ['lazy', 'memo', 'startTransition'].includes(p.node.property.name)) { const name = p.node.property.name; p.replaceWith(id(`vue${name[0].toUpperCase()}${name.slice(1)}`)) }
      if (t.isIdentifier(p.node.object, { name: 'React' }) && ['Children', 'cloneElement', 'createElement', 'isValidElement'].includes(p.node.property.name)) p.replaceWith(id(p.node.property.name))
      if (t.isIdentifier(p.node.object, { name: 'Direction' }) && p.node.property.name === 'useDirection') p.replaceWith(id('useLooseleafDirection'))
    },
    JSXMemberExpression(p) { if (p.node.object.name === 'React' && p.node.property.name === 'Fragment') { p.replaceWith(t.jsxIdentifier('Fragment')); vueImports.add('Fragment') } },
    JSXOpeningElement(p) { if (t.isJSXIdentifier(p.node.name) && contexts.has(p.node.name.name)) p.node.name = t.jsxMemberExpression(p.node.name, t.jsxIdentifier('Provider')) },
    JSXClosingElement(p) { if (t.isJSXIdentifier(p.node.name) && contexts.has(p.node.name.name)) p.node.name = t.jsxMemberExpression(p.node.name, t.jsxIdentifier('Provider')) },
  })
  // React 事件类型把 currentTarget 收窄到宿主；Vue 使用原生事件，在读取处保留这个已知宿主类型。
  traverse(ast, { JSXAttribute(p) {
    if (!t.isJSXExpressionContainer(p.node.value) || !t.isArrowFunctionExpression(p.node.value.expression)) return
    const fn = p.get('value.expression')
    const parameter = fn.node.params[0]
    if (!t.isIdentifier(parameter) || parameter.typeAnnotation) return
    const event = String(p.node.name.name).replace(/Capture$/, '')
    const events = { onClick: 'PointerEvent', onChange: 'Event', onInput: 'Event', onSelect: 'Event', onSubmit: 'SubmitEvent', onFocus: 'FocusEvent', onBlur: 'FocusEvent', onKeydown: 'KeyboardEvent', onKeyup: 'KeyboardEvent', onPointerdown: 'PointerEvent', onPointerup: 'PointerEvent', onPointermove: 'PointerEvent', onPointerenter: 'PointerEvent', onPointerleave: 'PointerEvent', onPointercancel: 'PointerEvent', onMousedown: 'MouseEvent', onMouseup: 'MouseEvent', onMouseenter: 'MouseEvent', onMouseleave: 'MouseEvent', onDragover: 'DragEvent', onDragenter: 'DragEvent', onDragleave: 'DragEvent', onDrop: 'DragEvent' }
    if (!events[event]) return
    const hostName = p.parent.name?.name
    // 自定义组件的回调可能传字符串或日期；只有原生宿主及输入控件使用 DOM 事件。
    if (!hostName || !/^[a-z]/.test(hostName) && !['Input', 'InputControl', 'Textarea', 'TextareaControl', 'InputGroupInput', 'InputGroupTextarea'].includes(hostName)) return
    parameter.typeAnnotation = t.tsTypeAnnotation(t.tsTypeReference(id(events[event])))
    const name = p.parent.name?.name
    const tag = { input: 'HTMLInputElement', textarea: 'HTMLTextAreaElement', select: 'HTMLSelectElement', button: 'HTMLButtonElement', form: 'HTMLFormElement', Input: 'HTMLInputElement', InputControl: 'HTMLInputElement', Textarea: 'HTMLTextAreaElement', TextareaControl: 'HTMLTextAreaElement', InputGroupInput: 'HTMLInputElement', InputGroupTextarea: 'HTMLTextAreaElement' }[name] ?? 'HTMLElement'
    for (const reference of fn.scope.getBinding(parameter.name)?.referencePaths ?? []) {
      const member = reference.parentPath
      if (member.isMemberExpression() && ['currentTarget', 'target'].includes(member.node.property.name) && !member.parentPath.isTSAsExpression()) member.replaceWith(t.tsAsExpression(member.node, t.tsTypeReference(id(tag))))
    }
  } })
  traverse(ast, { Function(p) {
    for (const parameter of p.node.params) {
      if (!t.isIdentifier(parameter) || !t.isTSTypeReference(parameter.typeAnnotation?.typeAnnotation)) continue
      const annotation = parameter.typeAnnotation.typeAnnotation
      if (!t.isTSQualifiedName(annotation.typeName) || annotation.typeName.left.name !== 'UI') continue
      const event = annotation.typeName.right.name
      if (!['MouseEvent', 'PointerEvent', 'KeyboardEvent', 'FocusEvent', 'ChangeEvent', 'FormEvent', 'DragEvent'].includes(event)) continue
      const host = annotation.typeArguments?.params[0] ?? t.tsTypeReference(id('Element'))
      parameter.typeAnnotation = t.tsTypeAnnotation(t.tsTypeReference(id(event === 'FormEvent' ? 'SubmitEvent' : event === 'ChangeEvent' ? 'Event' : event)))
      const binding = p.scope.getBinding(parameter.name)
      for (const reference of binding?.referencePaths ?? []) {
        const member = reference.parentPath
        if (member.isMemberExpression() && ['currentTarget', 'target'].includes(member.node.property.name) && !member.parentPath.isTSAsExpression()) member.replaceWith(t.tsAsExpression(member.node, t.cloneNode(host)))
      }
    }
  }, VariableDeclarator(p) { if (t.isIdentifier(p.node.init, { name: 'useLooseleafDirection' })) p.node.id.typeAnnotation = null } })

  const components = []
  traverse(ast, { FunctionDeclaration(p) {
    if (!p.node.id || !/^(?:[A-Z]|use[A-Z])/.test(p.node.id.name) || p.getFunctionParent()) return
    components.push(p)
  } })

  for (const component of components) {
    const functionName = component.node.id.name
    const dynamicTags = new Set()
    component.traverse({ JSXOpeningElement(p) { if (t.isJSXIdentifier(p.node.name) && /^[A-Z]/.test(p.node.name.name)) dynamicTags.add(p.node.name.name) } })
    const isHook = /^use[A-Z]/.test(functionName)
    let renderChildren = false
    component.traverse({
      CallExpression(p) { if (t.isIdentifier(p.node.callee, { name: 'children' })) renderChildren = true },
      UnaryExpression(p) { if (p.node.operator === 'typeof' && t.isIdentifier(p.node.argument, { name: 'children' }) && t.isBinaryExpression(p.parent) && t.isStringLiteral(p.parent.right, { value: 'function' })) renderChildren = true },
    })
    const parameter = t.isAssignmentPattern(component.node.params[0]) ? component.node.params[0].left : component.node.params[0]
    const propsType = parameter?.typeAnnotation?.typeAnnotation ?? t.tsTypeLiteral([])
    const keys = []
    const setup = []
    const render = []
    const reactiveNames = new Set()
    const replacements = new Map()
    const lifted = []
    const forceNames = []
    // 将受控状态判定保留在同一表达式内，TypeScript 才能证明其值已经存在。
    const controlTests = new Map()
    component.traverse({ VariableDeclarator(p) {
      if (t.isIdentifier(p.node.id) && t.isBinaryExpression(p.node.init, { operator: '!==' }) && t.isIdentifier(p.node.init.right, { name: 'undefined' })) controlTests.set(p.node.id.name, p.node.init)
    } })
    component.traverse({ ConditionalExpression(p) { if (t.isIdentifier(p.node.test) && controlTests.has(p.node.test.name)) p.node.test = t.cloneNode(controlTests.get(p.node.test.name), true) } })
    component.traverse({ CallExpression(p) {
      if (p.getFunctionParent() !== component) return
      const reactHook = t.isMemberExpression(p.node.callee) && p.node.callee.object.name === 'React' && /^use[A-Z]/.test(p.node.callee.property.name)
      const customHook = t.isIdentifier(p.node.callee) && customHooks.has(p.node.callee.name)
      const nativeHook = t.isIdentifier(p.node.callee) && native.has(p.node.callee.name)
      if (!reactHook && !customHook && !nativeHook) return
      if (p.parentPath.isVariableDeclarator() || p.parentPath.isExpressionStatement()) return
      const local = id(`_nestedHook${lifted.length}`)
      const statement = p.getStatementParent()
      const declaration = t.variableDeclaration('const', [t.variableDeclarator(local, p.node)])
      lifted.push({ statement, declaration })
      p.replaceWith(t.cloneNode(local))
    } })
    // 在原语句前提升嵌套 hook，维持它对前文状态与上下文的依赖顺序。
    for (const { statement, declaration } of lifted) statement.insertBefore(declaration)
    if (lifted.length) component.scope.crawl()
    const addRef = (name, init, annotation) => {
      const binding = component.scope.getBinding(name)
      const ident = id(name)
      if (annotation && t.isCallExpression(init)) init.typeArguments = t.tsTypeParameterInstantiation([annotation.typeAnnotation])
      if (dynamicTags.has(name) && t.isCallExpression(init) && init.callee.name === 'computed' && t.isArrowFunctionExpression(init.arguments[0]) && !t.isBlockStatement(init.arguments[0].body)) init.arguments[0].body = call('jsxTag', [init.arguments[0].body])
      setup.push(t.variableDeclaration('const', [t.variableDeclarator(ident, init)]))
      reactiveNames.add(name)
      if (binding) replacements.set(binding, name)
    }
    const bindPattern = (pattern, expression) => {
      if (t.isIdentifier(pattern)) { addRef(pattern.name, call('computed', [getter(expression)]), pattern.typeAnnotation); return }
      if (t.isAssignmentPattern(pattern)) { bindPattern(pattern.left, t.conditionalExpression(t.binaryExpression('===', expression, id('undefined')), pattern.right, expression)); return }
      if (t.isObjectPattern(pattern)) {
        const keys = pattern.properties.filter(t.isObjectProperty).map(prop => prop.key.name ?? prop.key.value)
        for (const prop of pattern.properties) {
          if (t.isRestElement(prop)) bindPattern(prop.argument, call('omitProps', [expression, t.arrayExpression(keys.map(key => t.stringLiteral(key)))]))
          else bindPattern(prop.value, t.memberExpression(expression, prop.key, prop.computed || t.isStringLiteral(prop.key)))
        }
        return
      }
      if (t.isArrayPattern(pattern)) { pattern.elements.forEach((element, index) => { if (t.isRestElement(element)) bindPattern(element.argument, t.callExpression(t.memberExpression(expression, id('slice')), [t.numericLiteral(index)])); else if (element) bindPattern(element, t.memberExpression(expression, t.numericLiteral(index), true)) }); return }
      unsupported = true
    }
    const hookParams = []
    if (isHook) {
      vueImports.add('toValue')
      vueImports.add('type MaybeRefOrGetter')
      for (let index = 0; index < component.node.params.length; index++) {
        const param = component.node.params[index]
        const actual = t.isAssignmentPattern(param) ? param.left : param
        const sourceName = `_source${index}`
        const sourceParam = id(sourceName)
        sourceParam.optional = actual.optional
        if (actual.typeAnnotation) sourceParam.typeAnnotation = t.tsTypeAnnotation(t.tsTypeReference(id('MaybeRefOrGetter'), t.tsTypeParameterInstantiation([actual.typeAnnotation.typeAnnotation])))
        else if (t.isAssignmentPattern(param)) {
          const kind = t.isStringLiteral(param.right) ? t.tsStringKeyword() : t.isNumericLiteral(param.right) ? t.tsNumberKeyword() : t.isBooleanLiteral(param.right) ? t.tsBooleanKeyword() : null
          if (kind) sourceParam.typeAnnotation = t.tsTypeAnnotation(t.tsTypeReference(id('MaybeRefOrGetter'), t.tsTypeParameterInstantiation([t.tsUnionType([kind, t.tsUndefinedKeyword()])])))
        }
        hookParams.push(t.isAssignmentPattern(param) ? t.assignmentPattern(sourceParam, param.right) : sourceParam)
        if (t.isIdentifier(actual)) {
          const resolved = call('toValue', [id(sourceName)])
          addRef(actual.name, call('computed', [getter(t.isAssignmentPattern(param) ? t.conditionalExpression(t.binaryExpression('===', t.cloneNode(resolved, true), id('undefined')), param.right, resolved) : resolved)]))
        }
        else if (t.isObjectPattern(actual)) {
          for (const prop of actual.properties) {
            if (!t.isObjectProperty(prop)) { unsupported = true; continue }
            const local = t.isAssignmentPattern(prop.value) ? prop.value.left.name : prop.value.name
            let access = t.memberExpression(call('toValue', [id(sourceName)]), prop.key, prop.computed)
            if (t.isAssignmentPattern(prop.value)) access = t.conditionalExpression(t.binaryExpression('===', access, id('undefined')), prop.value.right, access)
            addRef(local, call('computed', [getter(access)]))
          }
        }
      }
    } else if (t.isObjectPattern(parameter)) {
      for (const property of parameter.properties) {
        if (t.isRestElement(property)) {
          addRef(property.argument.name, call('computed', [getter(call('omitProps', [id('_props'), t.arrayExpression(parameter.properties.filter(t.isObjectProperty).map(p => { const key = p.key.name ?? p.key.value; return t.stringLiteral(key === 'className' ? 'class' : key) }))]))]))
          continue
        }
        const key = property.key.name ?? property.key.value
        keys.push(key === 'className' ? 'class' : key)
        const local = t.isAssignmentPattern(property.value) ? property.value.left.name : property.value.name
        let access = t.memberExpression(id('_props'), t.stringLiteral(key === 'className' ? 'class' : key), true)
        if (t.isAssignmentPattern(property.value)) access = t.conditionalExpression(t.binaryExpression('===', access, id('undefined')), property.value.right, access)
        addRef(local, call('computed', [getter(access)]))
      }
    } else if (t.isIdentifier(parameter)) {
      setup.push(t.variableDeclaration('const', [t.variableDeclarator(id(parameter.name), id('_props'))]))
    }

    // 将原组件词法绑定替换为 Vue ref 访问，事件闭包始终读取当前值。
    const markBinding = (binding, name) => {
      for (const ref of binding.referencePaths) {
        if (ref.removed || ref.findParent(p => p.isTSType())) continue
        if (!((t.isIdentifier(ref.node) || t.isJSXIdentifier(ref.node)) && ref.node.name === name)) continue
        if ((t.isMemberExpression(ref.parent) || t.isOptionalMemberExpression(ref.parent)) && ref.key === 'property' && !ref.parent.computed) continue
        if ((ref.parentPath.isMemberExpression() || ref.parentPath.isOptionalMemberExpression()) && ref.key === 'property' && !ref.parent.computed) continue
        if (ref.parentPath.isObjectProperty() && ref.key === 'key' && !ref.parent.computed) continue
        if (ref.isJSXIdentifier()) {
          ref.replaceWith(t.jsxMemberExpression(t.jsxIdentifier(name), t.jsxIdentifier('value')))
        } else {
          if (ref.parentPath.isObjectProperty() && ref.parent.shorthand) ref.parent.shorthand = false
          ref.replaceWith(value(name))
        }
      }
      for (const violation of binding.constantViolations) {
        if (violation.isAssignmentExpression() && t.isIdentifier(violation.node.left, { name })) violation.node.left = value(name)
      }
    }

    // 无参数的注入函数必须在 setup 调用，表达式只读取它们的 computed 值。
    let injected = 0
    component.traverse({ CallExpression(p) {
      if (!t.isIdentifier(p.node.callee) || !['useDensity', 'useInkTier', 'useInkScope', 'useInkContext', 'useIconSize', 'useInkKnobs'].includes(p.node.callee.name)) return
      if (p.parentPath.isVariableDeclarator() && p.parent.init === p.node) return
      const name = `_injected${injected++}`
      setup.push(t.variableDeclaration('const', [t.variableDeclarator(id(name), p.node)]))
      p.replaceWith(value(name))
      p.skip()
    } })
    let guardedRender = false
    for (const statementPath of component.get('body.body')) {
      const statement = statementPath.node
      if (!t.isVariableDeclaration(statement)) {
        if (t.isIfStatement(statement)) {
          let exits = false
          statementPath.traverse({ ReturnStatement() { exits = true } })
          if (exits) guardedRender = true
        }
        if (t.isExpressionStatement(statement) && t.isCallExpression(statement.expression) && t.isIdentifier(statement.expression.callee) && /^use[A-Z]/.test(statement.expression.callee.name)) {
          if (customHooks.has(statement.expression.callee.name)) statement.expression.arguments = statement.expression.arguments.map(argument => getter(argument))
          setup.push(statement); continue
        }
        if (t.isExpressionStatement(statement) && t.isCallExpression(statement.expression) && t.isMemberExpression(statement.expression.callee) && statement.expression.callee.object.name === 'React' && ['useEffect', 'useLayoutEffect'].includes(statement.expression.callee.property.name)) {
          const effect = statement.expression
          setup.push(t.expressionStatement(call('watchDependencies', [effect.arguments[0], effect.arguments.length > 1 ? getter(effect.arguments[1]) : id('undefined'), t.booleanLiteral(effect.callee.property.name === 'useLayoutEffect')])))
        } else if (t.isExpressionStatement(statement) && t.isAssignmentExpression(statement.expression, { operator: '??=' }) && t.isNewExpression(statement.expression.right)) {
          // ref 的一次性对象初始化属于 setup，必须先于依赖它的订阅与计算。
          setup.push(statement)
        } else if (t.isExpressionStatement(statement) && t.isCallExpression(statement.expression) && t.isMemberExpression(statement.expression.callee) && statement.expression.callee.object.name === 'React' && statement.expression.callee.property.name === 'useImperativeHandle') {
          setup.push(t.expressionStatement(call('useImperativeHandle', statement.expression.arguments.slice(0, 2))))
        } else render.push(statement)
        continue
      }
      for (const declaration of statement.declarations) {
        const init = declaration.init
        if (!init) { render.push(t.variableDeclaration(statement.kind, [declaration])); continue }
        const isReact = t.isCallExpression(init) && t.isMemberExpression(init.callee) && t.isIdentifier(init.callee.object, { name: 'React' })
        const hook = isReact ? init.callee.property.name : t.isCallExpression(init) && t.isIdentifier(init.callee) ? init.callee.name : ''
        if (guardedRender && !isReact && !customHooks.has(hook) && !native.has(hook)) {
          // 渲染守卫之后的派生值留在当前作用域，保留空值与联合类型的收窄。
          render.push(t.variableDeclaration(statement.kind, [declaration]))
        } else if (hook === 'useReducer') {
          const [stateElement, setter] = declaration.id.elements
          const state = stateElement ?? id(`_state${setup.length}`)
          if (!stateElement) forceNames.push(state.name)
          vueImports.add('shallowRef')
          addRef(state.name, call('shallowRef', [init.arguments[1]]))
          setup.push(t.variableDeclaration('const', [t.variableDeclarator(setter, t.arrowFunctionExpression([t.restElement(id('args'))], t.blockStatement([t.expressionStatement(t.assignmentExpression('=', value(state.name), t.callExpression(init.arguments[0], [value(state.name), t.spreadElement(id('args'))])))])))]))
        } else if (hook === 'useState') {
          vueImports.add('shallowRef')
          const [stateElement, setter] = declaration.id.elements
          const state = stateElement ?? id(`_state${setup.length}`)
          if (!stateElement) forceNames.push(state.name)
          const initial = init.arguments.length ? init.arguments[0] : id('undefined')
          const stateInit = call('initialState', [initial])
          const stateCall = call('shallowRef', [stateInit])
          stateCall.typeArguments = init.typeArguments
          addRef(state.name, stateCall)
          if (setter) setup.push(t.variableDeclaration('const', [t.variableDeclarator(setter, call('stateSetter', [id(state.name)]))]))
        } else if (hook === 'useRef') {
          vueImports.add('shallowRef')
          const invocation = call('shallowRef', init.arguments)
          invocation.typeArguments = init.typeArguments && t.isNullLiteral(init.arguments[0]) ? t.tsTypeParameterInstantiation(init.typeArguments.params.map(type => t.tsUnionType([type, t.tsNullKeyword()]))) : init.typeArguments
          setup.push(t.variableDeclaration('const', [t.variableDeclarator(declaration.id, invocation)]))
          const binding = component.scope.getBinding(declaration.id.name)
          for (const ref of binding.referencePaths) {
            if (ref.parentPath.isMemberExpression() && ref.parent.property.name === 'current') ref.parent.property.name = 'value'
          }
        } else if (hook === 'useDeferredValue') {
          addRef(declaration.id.name, call('computed', [getter(init.arguments[0])]))
        } else if (hook === 'useMemo') {
          if (t.isIdentifier(declaration.id)) { const computedCall = call('computed', [init.arguments[0]]); computedCall.typeArguments = init.typeArguments; addRef(declaration.id.name, computedCall) }
          else {
            for (const prop of declaration.id.properties) {
              addRef(prop.value.name, call('computed', [getter(t.memberExpression(t.callExpression(init.arguments[0], []), prop.key, prop.computed))]))
            }
          }
        } else if (hook === 'useCallback') {
          setup.push(t.variableDeclaration('const', [t.variableDeclarator(declaration.id, init.arguments[0])]))
        } else if (hook === 'useContext') {
          if (t.isIdentifier(declaration.id)) addRef(declaration.id.name, call('useContext', init.arguments))
          else {
            const contextName = `_context${setup.length}`
            setup.push(t.variableDeclaration('const', [t.variableDeclarator(id(contextName), call('useContext', init.arguments))]))
            bindPattern(declaration.id, value(contextName))
          }
        } else if (hook === 'useId') {
          vueImports.add('useId')
          setup.push(t.variableDeclaration('const', [t.variableDeclarator(declaration.id, call('useId'))]))
        } else if (hook === 'useSyncExternalStore') {
          addRef(declaration.id.name, call('useExternalStore', init.arguments.slice(0, 2)))
        } else if (customHooks.has(hook)) {
          if (/Ref$/.test(hook) && t.isIdentifier(declaration.id)) for (const ref of component.scope.getBinding(declaration.id.name)?.referencePaths ?? []) if ((ref.parentPath.isMemberExpression() || ref.parentPath.isOptionalMemberExpression()) && ref.parent.property.name === 'current') ref.parent.property.name = 'value'
          init.arguments = init.arguments.map(argument => getter(argument))
          if (t.isIdentifier(declaration.id)) addRef(declaration.id.name, init)
          else {
            const resultName = `_hook${setup.length}`
            setup.push(t.variableDeclaration('const', [t.variableDeclarator(id(resultName), init)]))
            bindPattern(declaration.id, value(resultName))
          }
        } else if (native.has(hook)) {
          if (['useInk', 'useInkCore', 'useInkFaces', 'useInkSeed', 'useLooseleafDirection'].includes(hook) && init.arguments.length) init.arguments[0] = getter(init.arguments[0])
          if (t.isObjectPattern(declaration.id)) {
            if (hook === 'useInkContext') {
              const contextName = `_inkContext${setup.length}`
              setup.push(t.variableDeclaration('const', [t.variableDeclarator(id(contextName), init)]))
              for (const prop of declaration.id.properties) addRef(prop.value.name, call('computed', [getter(t.memberExpression(value(contextName), prop.key, prop.computed))]))
              continue
            }
            setup.push(t.variableDeclaration('const', [declaration]))
            for (const prop of declaration.id.properties) if (prop.key.name !== 'hostRef') {
              const binding = component.scope.getBinding(prop.value.name)
              if (binding) replacements.set(binding, prop.value.name)
              reactiveNames.add(prop.value.name)
            }
          } else if (['useInk', 'useInkCore', 'useInkFaces'].includes(hook)) {
            vueImports.add('proxyRefs')
            const coreName = `_${declaration.id.name}Core`
            setup.push(t.variableDeclaration('const', [t.variableDeclarator(id(coreName), init)]))
            addRef(declaration.id.name, call('computed', [getter(call('proxyRefs', [id(coreName)]))]))
          } else addRef(declaration.id.name, init)
        } else if (isReact) {
          unsupported = true
        } else if (t.isIdentifier(declaration.id)) {
          // 普通派生值也使用 computed；CSS 参数和 JSX 会随 props 与状态更新。
          if (statement.kind !== 'const') { vueImports.add('shallowRef'); addRef(declaration.id.name, call('shallowRef', [init]), declaration.id.typeAnnotation) }
          else addRef(declaration.id.name, call('computed', [getter(init)]), declaration.id.typeAnnotation)
        } else if (t.isObjectPattern(declaration.id)) {
          bindPattern(declaration.id, init)
        } else if (t.isArrayPattern(declaration.id)) bindPattern(declaration.id, init)
        else unsupported = true
      }
    }
    if (unsupported) break
    // 重新构建词法作用域后统一替换，避免 AST 共享节点的旧引用路径失效。

    // 所有插槽均保持惰性执行，避免 Vue 子组件收不到更新后的插槽内容。
    const renderAst = t.file(t.program([t.expressionStatement(t.arrowFunctionExpression([], t.blockStatement(render)))]))
    traverse(renderAst, {
      ReferencedIdentifier(p) {
        if (p.node.name === 'children' && !p.findParent(parent => parent.isTSType())) p.replaceWith(renderChildren ? t.memberExpression(id('_slots'), id('default')) : call('readSlot', [t.memberExpression(id('_slots'), id('default'))]))
      },
      JSXElement(p) {
        const tag = p.node.openingElement.name
        const isVoid = t.isJSXIdentifier(tag) && ['input', 'img', 'br', 'hr', 'meta', 'link', 'source', 'area', 'base', 'col', 'embed', 'param', 'track', 'wbr'].includes(tag.name)
        const html = p.node.openingElement.attributes.some(a => t.isJSXAttribute(a) && a.name.name === 'innerHTML')
        if (!isVoid && !html && p.node.openingElement.selfClosing && p.node.openingElement.attributes.some(a => { if (!t.isJSXSpreadAttribute(a)) return false; const argument = t.isCallExpression(a.argument) && a.argument.callee.name === 'domProps' ? a.argument.arguments[0] : a.argument; return t.isIdentifier(argument, { name: 'props' }) || t.isMemberExpression(argument) && argument.object.name === 'props' })) {
          p.node.openingElement.selfClosing = false
          p.node.closingElement = t.jsxClosingElement(t.cloneNode(p.node.openingElement.name))
          p.node.children.push(t.jsxExpressionContainer(t.optionalCallExpression(t.memberExpression(id('_slots'), id('default')), [], true)))
        }
      },
      MemberExpression(p) {
        if (t.isIdentifier(p.node.object, { name: 'children' }) && p.node.property.name === 'value') p.replaceWith(t.optionalCallExpression(t.memberExpression(id('_slots'), id('default')), [], true))
      },
    })
    const childrenDeclaration = setup.flatMap(node => node.declarations ?? []).find(d => d.id.name === 'children')
    if (childrenDeclaration) childrenDeclaration.init = call('computed', [getter(renderChildren ? t.memberExpression(id('_slots'), id('default')) : call('readSlot', [t.memberExpression(id('_slots'), id('default'))]))])
    setup.push(t.returnStatement(isHook ? call('computed', [t.arrowFunctionExpression([], t.blockStatement(render))]) : t.arrowFunctionExpression([], t.blockStatement(render))))
    const callback = t.arrowFunctionExpression([id('_props'), t.objectPattern([t.objectProperty(id('slots'), id('_slots'))])], t.blockStatement(setup))
    // 重建后的词法树再次解析绑定，覆盖被包入 getter 的原始参数引用。
    const callbackAst = t.file(t.program([t.expressionStatement(callback)]))
    traverse(callbackAst, {
      ReferencedIdentifier(p) {
        const name = p.node.name
        if (p.findParent(parent => parent.isTSType())) return
        if (!reactiveNames.has(name) || p.node._portedRef) return
        const binding = p.scope.getBinding(name)
        if (!binding || binding.scope.block !== callback) return
        if (p.parentPath.isCallExpression() && p.parent.callee.name === 'stateSetter') return
        if (p.isJSXIdentifier()) {
          if (p.parentPath.isJSXMemberExpression() && p.parent.property.name === 'value') return
          p.replaceWith(t.jsxMemberExpression(t.jsxIdentifier(name), t.jsxIdentifier('value'))); p.skip(); return
        }
        if (p.parentPath.isObjectProperty() && p.parent.shorthand) p.parent.shorthand = false
        p.replaceWith(value(name)); p.skip()
      },
      AssignmentExpression(p) {
        if (t.isIdentifier(p.node.left) && reactiveNames.has(p.node.left.name)) p.node.left = value(p.node.left.name)
      },
      ObjectProperty(p) {
        if (p.node.key.name === 'className' && t.isCallExpression(p.node.value) && p.node.value.callee.name === 'cn') p.node.key.name = 'class'
      },
    })
    // VNode 必须在当前渲染上下文创建，缓存 JSX 会丢失 ref 的所属实例。
    traverse(callbackAst, { CallExpression(p) {
      if (!t.isIdentifier(p.node.callee, { name: 'computed' })) return
      let createsNodes = false
      p.traverse({ JSXElement() { createsNodes = true }, JSXFragment() { createsNodes = true }, CallExpression(q) { if (t.isIdentifier(q.node.callee, { name: 'readSlot' })) createsNodes = true } })
      if (createsNodes) p.node.callee = id('renderValue')
    } })
    if (forceNames.length) traverse(callbackAst, { CallExpression(p) {
      if (!t.isIdentifier(p.node.callee, { name: 'computed' })) return
      const fn = p.node.arguments[0]
      if (!t.isArrowFunctionExpression(fn)) return
      const reads = forceNames.map(name => t.expressionStatement(t.unaryExpression('void', value(name))))
      fn.body = t.isBlockStatement(fn.body) ? t.blockStatement([...reads, ...fn.body.body]) : t.blockStatement([...reads, t.returnStatement(fn.body)])
    } })
    if (isHook) {
      const fn = t.functionDeclaration(id(functionName), hookParams, callback.body)
      fn.typeParameters = component.node.typeParameters
      if (component.node.returnType) { vueImports.add('type ComputedRef'); fn.returnType = t.tsTypeAnnotation(t.tsTypeReference(id('ComputedRef'), t.tsTypeParameterInstantiation([component.node.returnType.typeAnnotation]))) }
      component.replaceWith(fn)
      continue
    }
    const invocation = call('defineUi', [t.stringLiteral(functionName), t.arrayExpression(keys.filter(k => k !== 'children' && k !== 'ref').map(k => t.stringLiteral(k))), callback])
    invocation.typeArguments = t.tsTypeParameterInstantiation([propsType])
    // 泛型组件在工厂内部保留类型参数，避免 ChartSpec 等关联类型丢失作用域。
    let initializer = invocation
    if (component.node.typeParameters) {
      const factory = t.arrowFunctionExpression([], t.blockStatement([t.returnStatement(invocation)]))
      factory.typeParameters = component.node.typeParameters
      initializer = t.callExpression(factory, [])
    }
    const declaration = t.variableDeclaration('const', [t.variableDeclarator(id(functionName), initializer)])
    if (component.parentPath.isExportDefaultDeclaration()) component.parentPath.replaceWithMultiple([declaration, t.exportDefaultDeclaration(id(functionName))])
    else component.replaceWith(declaration)
  }
  traverse(ast, { MemberExpression(p) { if (t.isIdentifier(p.node.object, { name: 'React' })) unsupported = true } })
  if (unsupported) { process.stdout.write(`MANUAL ${name}\n`); continue }
  ast.program.directives = []
  ast.program.body.unshift(
    t.importDeclaration([t.importNamespaceSpecifier(id('UI'))], t.stringLiteral('@/lib/types')),
    t.importDeclaration(['defineUi', 'omitProps', 'domProps', 'elementRef', 'jsxTag'].map(name => t.importSpecifier(id(name), id(name))), t.stringLiteral('@/lib/component')),
    t.importDeclaration(['createContext', 'useContext', 'watchDependencies', 'stateSetter', 'initialState', 'readSlot', 'renderValue', 'useExternalStore', 'useImperativeHandle', 'useLooseleafDirection', 'Suspense', 'lazy', 'memo', 'startTransition'].map(name => t.importSpecifier(id(['lazy', 'memo', 'startTransition'].includes(name) ? `vue${name[0].toUpperCase()}${name.slice(1)}` : name), id(name))), t.stringLiteral('@/lib/composables')),
    t.importDeclaration(['Children', 'cloneElement', 'createElement', 'isValidElement'].map(name => t.importSpecifier(id(name), id(name))), t.stringLiteral('@/lib/vnode')),
    t.importDeclaration([t.importSpecifier(id('cssStyle'), id('cssStyle'))], t.stringLiteral('@/lib/css')),
    t.importDeclaration([...vueImports].map(name => { const specifier = t.importSpecifier(id(name.replace('type ', '')), id(name.replace('type ', ''))); if (name.startsWith('type ')) specifier.importKind = 'type'; return specifier }), t.stringLiteral('vue')),
  )
  traverse(ast, {
    TSQualifiedName(p) { if (t.isIdentifier(p.node.left, { name: 'React' })) p.node.left = id('UI') },
    TSTypeQuery(p) {
      // typeof 响应式局部变量描述其解包值，而非 ComputedRef 容器。
      if (!t.isIdentifier(p.node.exprName)) return
      const binding = p.scope.getBinding(p.node.exprName.name)
      if (binding?.path.isVariableDeclarator() && t.isCallExpression(binding.path.node.init) && binding.path.node.init.callee.name === 'computed') p.replaceWith(t.tsIndexedAccessType(t.cloneNode(p.node), t.tsLiteralType(t.stringLiteral('value'))))
      p.skip()
    },
    MemberExpression(p) {
      // 原生事件本身即 nativeEvent；JSX 宿主通过 Vue 运行时动态解析。
      if (!p.node.computed && p.node.property.name === 'nativeEvent') p.replaceWith(p.node.object)
    },
    JSXIdentifier(p) { if (p.node.name === 'IconSizeContext') p.node.name = 'IconSizeProvider' },
    ImportSpecifier(p) { if (p.node.imported.name === 'IconSizeContext') { p.node.imported.name = 'IconSizeProvider'; p.node.local.name = 'IconSizeProvider' } },
  })
  // 对象参数中的字符串保留字面量类型，避免 getter 引入的 TypeScript 推断拓宽。
  traverse(ast, {
    ObjectProperty(p) { if (t.isStringLiteral(p.node.value)) p.node.value = t.tsAsExpression(p.node.value, t.tsTypeReference(id('const'))) },
    StringLiteral(p) { if (p.parentPath.isConditionalExpression() && ['consequent', 'alternate'].includes(p.key)) { p.replaceWith(t.tsAsExpression(p.node, t.tsTypeReference(id('const')))); p.skip() } },
  })
  const output = '// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。\n' + generate(ast, { comments: true }).code + '\n'
  const destination = path.resolve(relative)
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.writeFileSync(destination, output)
  process.stdout.write(`PORTED ${name}\n`)
  } catch (error) { process.stdout.write(`MANUAL ${name}: ${error.message}\n`) }
}
