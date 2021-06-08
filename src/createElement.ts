import type { ComponentClass, VNode } from './component';
import type { Options } from './options';
import type { AnyObject } from './types';

export interface ElementCreationEnv {
    vnodeId: number;
}

export const createEnv = (): ElementCreationEnv => ({ vnodeId: 0 });

// TODO (#10): Make the type more precise
interface CreateVNodeArgs {
    env: ElementCreationEnv;
    options: Options;
    vnode: Pick<VNode, 'type' | 'props' | 'key' | 'ref'> & {
        original: number | null;
    };
}

export const createVNode = ({
    env,
    options,
    vnode: { type, props, key, ref, original },
}: CreateVNodeArgs): VNode => {
    const vnode: VNode = {
        type,
        props,
        key,
        ref,
        children: [],
        parent: null,
        depth: 0,
        dom: null,
        nextDom: null,
        component: null,
        hydrating: null,
        constructor: undefined,
        original: original ?? ++env.vnodeId,
    };
    if (options.vnode) options.vnode(vnode);
    return vnode;
};

export const Fragment = ((props: { children: unknown }) =>
    props.children) as unknown as ComponentClass<AnyObject, AnyObject>;
