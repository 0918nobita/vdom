import { ComponentClass } from './component';

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

// TODO (#8): Make the types more precise
/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any */
export const Fragment = ((props: any) =>
    props.children) as unknown as ComponentClass<
    Record<string, never>,
    Record<string, never>
>;
/* eslint-enable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any */
