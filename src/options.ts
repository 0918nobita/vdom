import { VNode } from './component';
import { _catchError } from './diff/catchError';
import { AnyObject } from './types';

export interface Options {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debounceRendering?: any;
    vnode?(_: VNode<AnyObject>): void;
    _catchError: typeof _catchError;
}

export const createOptions = (): Options => ({
    _catchError,
});
