import { VNode } from './component';
import { _catchError } from './diff/catchError';
import { AnyObject } from './types';

interface Options {
    _catchError: typeof _catchError;
    vnode?(_: VNode<AnyObject>): void;
}

export const options: Options = {
    _catchError,
};
