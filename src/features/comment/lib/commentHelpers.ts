import { isObject } from '@/shared/lib/utils'
import type { IComment } from '../model/types'

export function isComment(obj: unknown): obj is IComment {
    return isObject(obj) && 'content' in obj
}
