import type { VNode } from './component';
import { catchError } from './diff/catchError';
import type { AnyObject } from './types';

export interface Options {
    catchError: typeof catchError;
    debounceRendering: ((proc: (this: void) => void) => void) | null;
    vnode: ((vnode: VNode<AnyObject>) => void) | null;
}

export const createOptions = (): Options => ({
    debounceRendering: null,
    catchError,
    vnode: null,
});
