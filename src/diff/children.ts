import type { VNode } from '../component';
import type { ElementCreationEnv } from '../createElement';
import { createVNode, Fragment } from '../createElement';
import type { Options } from '../options';
import { diff } from './index';

// TODO (#6): Implement diffChildren function
interface DiffChildrenArgs {
    env: ElementCreationEnv;
    options: Options;
    parentDom: unknown;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderResult: any[];
    newParentVNode: VNode;
    oldParentVNode: VNode;
    globalContext: unknown;
    isSvg: boolean;
    excessDomChildren: unknown;
    commitQueue: unknown;
    oldDom: unknown;
    isHydrating: boolean;
}

export const diffChildren = ({
    env,
    options,
    parentDom,
    renderResult,
    newParentVNode,
    oldParentVNode,
    globalContext,
    isSvg,
    excessDomChildren,
    commitQueue,
    oldDom,
    isHydrating,
}: DiffChildrenArgs): void => {
    let oldVNode;
    const oldChildren = (oldParentVNode && oldParentVNode.children) || [];
    const { length: oldChildrenLength } = oldChildren;
    newParentVNode.children = [];

    for (let i = 0; i < renderResult.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        let childVNode: VNode | null = renderResult[i];

        if (childVNode === null || typeof childVNode === 'boolean') {
            childVNode = newParentVNode.children[i] = null;
        } else if (
            typeof childVNode === 'string' ||
            typeof childVNode === 'number' ||
            typeof childVNode === 'bigint'
        ) {
            childVNode = newParentVNode.children[i] = createVNode({
                env,
                options,
                vnode: {
                    type: null,
                    props: childVNode,
                    key: null,
                    ref: null,
                    original: childVNode,
                },
            });
        } else if (Array.isArray(childVNode)) {
            childVNode = newParentVNode.children[i] = createVNode({
                env,
                options,
                vnode: {
                    type: Fragment,
                    props: { children: childVNode },
                    key: null,
                    ref: null,
                    original: null,
                },
            });
        } else if (childVNode.depth > 0) {
            childVNode = newParentVNode.children[i] = createVNode({
                env,
                options,
                vnode: {
                    type: childVNode.type,
                    props: childVNode.props,
                    key: childVNode.key,
                    ref: null,
                    original: childVNode.original,
                },
            });
        } else {
            childVNode = newParentVNode.children[i] = childVNode;
        }

        if (childVNode === null) continue;

        childVNode.parent = newParentVNode;
        childVNode.depth = newParentVNode.depth + 1;
        oldVNode = oldChildren[i];

        if (
            oldVNode === null ||
            (oldVNode &&
                childVNode.key === oldVNode.key &&
                childVNode.type === oldVNode.type)
        ) {
            oldChildren[i] = null;
        } else {
            for (let j = 0; j < oldChildrenLength; j++) {
                oldVNode = oldChildren[j];
                if (
                    oldVNode &&
                    childVNode.key === oldVNode.key &&
                    childVNode.type === oldVNode.type
                ) {
                    oldChildren[j] = null;
                    break;
                }
                oldVNode = null;
            }
        }
        oldVNode = oldVNode || {};
        diff({
            parentDom,
            childVNode,
            oldVNode,
            globalContext,
            isSvg,
            excessDomChildren,
            commitQueue,
            oldDom,
            isHydrating,
        });
    }
};
