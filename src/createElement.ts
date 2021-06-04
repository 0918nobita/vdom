import { ComponentClass } from './component';
import { options } from './options';
import { EmptyObject } from './types';

let vnodeId = 0;

// TODO (#10): Make the type more precise
/* eslint-disable @typescript-eslint/no-explicit-any */
interface CreateVNodeArgs {
    type: any;
    props: any;
    key: any;
    ref: any;
    original: any;
}
export const createVNode = ({
    type,
    props,
    key,
    ref,
    original,
}: CreateVNodeArgs): any => {
    /* eslint-enable @typescript-eslint/no-explicit-any */
    const vnode = {
        /* eslint-disable @typescript-eslint/no-unsafe-assignment */
        type,
        props,
        key,
        ref,
        _children: null,
        _parent: null,
        _depth: 0,
        _dom: null,
        _nextDom: undefined,
        _component: null,
        _hydrating: null,
        constructor: undefined,
        _original: original ?? ++vnodeId,
        /* eslint-enable @typescript-eslint/no-unsafe-assignment */
    };
    if (options.vnode) options.vnode(vnode);
    return vnode;
};

export const Fragment = ((props: { children: unknown }) =>
    props.children) as unknown as ComponentClass<EmptyObject, EmptyObject>;
