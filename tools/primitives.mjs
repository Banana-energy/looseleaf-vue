import fs from 'node:fs'
import path from 'node:path'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import * as Reka from 'reka-ui'

// 从固定上游的实际引用生成明确映射，缺少的基础组件直接报告，避免猜测替代组件。
const root = process.argv[2]
const groups = new Map()
for (const file of fs.readdirSync(`${root}/src/components/ui`).filter(name => name.endsWith('.tsx'))) {
  const ast = parse(fs.readFileSync(path.join(root, 'src/components/ui', file), 'utf8'), { sourceType: 'module', plugins: ['typescript', 'jsx'] })
  const aliases = new Map()
  traverse(ast, {
    ImportDeclaration(p) {
      if (p.node.source.value !== 'radix-ui') return
      for (const specifier of p.node.specifiers) if (specifier.type === 'ImportSpecifier') aliases.set(specifier.local.name, specifier.imported.name)
    },
    JSXMemberExpression(p) {
      const group = aliases.get(p.node.object.name)
      if (!group) return
      if (!groups.has(group)) groups.set(group, new Set())
      groups.get(group).add(p.node.property.name)
    },
  })
}
const singles = { Label: 'Label', Separator: 'Separator', AspectRatio: 'AspectRatio', Toggle: 'Toggle' }
const aliases = { 'Direction.DirectionProvider': 'ConfigProvider' }
const output = []
for (const [group, parts] of groups) {
  if (group === 'Slot') continue
  const entries = []
  for (const part of parts) {
    const key = aliases[`${group}.${part}`] ?? (part === 'Root' && singles[group] ? singles[group] : part.startsWith(group) ? part : `${group}${part}`)
    if (!(key in Reka)) { process.stdout.write(`MISSING ${group}.${part} (${key})\n`); continue }
    entries.push(`${JSON.stringify(part)}: primitive(Reka.${key}, ${JSON.stringify(group)}, ${JSON.stringify(part)})`)
  }
  output.push(`export const ${group} = { ${entries.join(', ')} }`)
}
fs.writeFileSync('src/lib/primitives.tsx', `// Reka UI 与上游组件部件的对应关系，由实际源码引用生成。\nimport * as Reka from 'reka-ui'\nimport { primitive } from './primitive-adapter'\nexport { Slot } from './primitive-adapter'\n${output.join('\n')}\n`)
