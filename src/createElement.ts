import { ComponentClass } from './component';
import { EmptyObject } from './types';

// TODO (#7): Implement createVNode function
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function, @typescript-eslint/explicit-module-boundary-types */
export const createVNode = (
    _a: any,
    _b: any,
    _c: any,
    _d: any,
    _e: any
): any => {};
/* eslint-enable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function, @typescript-eslint/explicit-module-boundary-types */

export const Fragment = ((props: { children: unknown }) =>
    props.children) as unknown as ComponentClass<EmptyObject, EmptyObject>;
