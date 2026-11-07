import type { z } from 'zod'
import type { TypedSchema } from 'vee-validate'

export type Resolver<T> = (values: T, context: unknown, options: unknown) => Promise<{ values: T | Record<string, never>; errors: Record<string, { message: string }> }>

// 同一个 Zod 解析器支持 vee-validate 公开接口和原示例动态选择 schema 的调用形式。
export function zodResolver<T extends Record<string, unknown>>(schema: z.ZodType<T>): TypedSchema<T, T> & Resolver<T> {
  const parse: TypedSchema<T, T>['parse'] = async values => {
    const result = await schema.safeParseAsync(values)
    return result.success ? { value: result.data, errors: [] } : { errors: result.error.issues.map(issue => ({ path: issue.path.join('.'), errors: [issue.message] })) }
  }
  const resolver: Resolver<T> = async values => {
    const result = await parse(values, { formData: values })
    return { values: result.value === undefined ? {} : result.value, errors: Object.fromEntries(result.errors.map(issue => [issue.path, { message: issue.errors[0] }])) }
  }
  return Object.assign(resolver, { __type: 'VVTypedSchema' as const, parse })
}
