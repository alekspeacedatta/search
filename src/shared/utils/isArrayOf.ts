    export const isArrayOf = <T>(item: (v: unknown) => v is T) =>  (v: unknown): v is T[] => Array.isArray(v) && v.every(item)
    