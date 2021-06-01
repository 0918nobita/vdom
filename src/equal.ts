export const equal = (a: any, b: any): boolean => {
    if (a === null) return b === null;

    switch (typeof a) {
        case 'bigint':
        case 'boolean':
        case 'function':
        case 'number':
        case 'string':
        case 'symbol':
        case 'undefined':
            return a === b;
        case 'object':
            const aKeys = Object.keys(a);
            const bKeys = Object.keys(b);
            if (aKeys.length !== bKeys.length) return false;
            for (let i = 0; i < aKeys.length; i++) {
                const aKey = aKeys[i]!;
                const bKey = bKeys[i]!;
                if (aKey !== bKey) return false;
                if (!equal(a[aKey], b[bKey])) return false;
            }
            return true;
    }
};
