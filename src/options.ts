import { VNode } from './component';
import { _catchError } from './diff/catchError';
import { AnyObject } from './types';

export interface Options {
    _catchError: typeof _catchError;
    vnode?(_: VNode<AnyObject>): void;
}

export const createOptions = (): Options => ({
    _catchError,
});
