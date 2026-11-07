import fs from 'node:fs'
import path from 'node:path'

// registry 内容从当前 Vue 源码生成，避免把上游 React 文件继续发布给 Vue 项目。
const root = process.cwd()
const source = JSON.parse(fs.readFileSync(path.join(root, 'tools/registry-source.json'), 'utf8'))
const resolveFile = file => {
  const relative = file.startsWith('src/') ? file : file.replace(/^@(?:ui|lib)\//, 'src/').replace(/^@\//, 'src/')
  const candidate = path.join(root, relative)
  return fs.existsSync(candidate) ? candidate : null
}
const cleanText = text => typeof text === 'string' ? text.replaceAll('import * as React from "react"', '').replaceAll('React.useState', 'ref').replaceAll('React.ReactNode', 'VNodeChild').replaceAll('className', 'class').replaceAll('Radix', 'Reka UI').replaceAll('radix-ui', 'reka-ui').replaceAll('@/lib/ink/react', '@/lib/ink/vue') : text
const clean = value => Array.isArray(value) ? value.map(clean) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, clean(entry)])) : cleanText(value)
const itemNames = new Set(source.items.map(item => item.name))
const normalizeRegistryDependency = dep => {
  if (typeof dep !== 'string') return dep
  const match = dep.match(/\/r\/([^/]+)\.json$/)
  return match && itemNames.has(match[1]) ? match[1] : dep
}
const items = source.items.map(item => ({
  ...clean(item),
  registryDependencies: (item.registryDependencies ?? []).map(normalizeRegistryDependency),
  dependencies: [...new Set((item.dependencies ?? []).filter(dep => !/^react|radix|cmdk|vaul|sonner|embla-carousel-react|input-otp|@hookform/.test(dep)).concat('vue', 'reka-ui'))],
  files: (item.files ?? []).flatMap(file => {
    const local = resolveFile(file.path)
    if (!local) return []
    const target = file.target ?? file.path
    const content = fs.readFileSync(local, 'utf8').replaceAll('@/lib/ink/react', '@/lib/ink/vue').replaceAll('React 19', 'Vue 3').replaceAll('React components', 'Vue components').replaceAll('Radix', 'Reka UI').replaceAll('react-hook-form', 'vee-validate').replaceAll('react-day-picker', 'Reka Calendar').replaceAll('from "react"', 'from "vue"')
    return [{ ...file, path: file.path, target, content }]
  }),
}))
const output = { ...source, name: 'looseleaf-vue', homepage: 'https://looseleaf-vue.banana-energy.cn', items }
fs.writeFileSync(path.join(root, 'registry.json'), JSON.stringify(output, null, 2) + '\n')
fs.mkdirSync(path.join(root, 'public/r'), { recursive: true })
for (const item of items) fs.writeFileSync(path.join(root, 'public/r', `${item.name}.json`), JSON.stringify({ $schema: source.$schema, ...item }, null, 2) + '\n')
console.log(`生成 Vue registry：${items.length} 个条目`)

