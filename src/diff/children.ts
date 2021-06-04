import { CreateElementEnv, createVNode, Fragment } from '../createElement';
import { Options } from '../options';
import { diff } from './index';

// TODO (#6): Implement diffChildren function
interface DiffChildrenArgs {
    env: CreateElementEnv;
    options: Options;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    parentDom: any;
    renderResult: any;
    newParentVNode: any;
    oldParentVNode: any;
    globalContext: any;
    isSvg: boolean;
    excessDomChildren: any;
    commitQueue: any;
    oldDom: any;
    isHydrating: boolean;
    /* eslint-enable @typescript-eslint/no-explicit-any */
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
    let oldVNode /*, newDom, firstChildDom, refs*/;
    /* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
    const oldChildren = (oldParentVNode && oldParentVNode._children) || [];
    const { length: oldChildrenLength } = oldChildren;
    newParentVNode._children = [];
    for (let i = 0; i < renderResult.length; i++) {
        let childVNode = renderResult[i];
        if (childVNode === null || typeof childVNode === 'boolean') {
            childVNode = newParentVNode._children[i] = null;
        } else if (
            typeof childVNode === 'string' ||
            typeof childVNode === 'number' ||
            typeof childVNode === 'bigint'
        ) {
            childVNode = newParentVNode._children[i] = createVNode({
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
            childVNode = newParentVNode._children[i] = createVNode({
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
        } else if (childVNode._depth > 0) {
            childVNode = newParentVNode._children[i] = createVNode({
                env,
                options,
                vnode: {
                    type: childVNode.type,
                    props: childVNode.props,
                    key: childVNode.key,
                    ref: null,
                    original: childVNode._original,
                },
            });
        } else {
            childVNode = newParentVNode._children[i] = childVNode;
        }

        if (childVNode === null) continue;

        childVNode._parent = newParentVNode;
        childVNode._depth = (newParentVNode._depth as number) + 1;
        oldVNode = oldChildren[i];
        if (
            oldVNode === null ||
            (oldVNode &&
                childVNode.key === oldVNode.key &&
                childVNode.type === oldVNode.type)
        ) {
            oldChildren[i] = undefined;
        } else {
            for (let j = 0; j < oldChildrenLength; j++) {
                oldVNode = oldChildren[j];
                if (
                    oldVNode &&
                    childVNode.key === oldVNode.key &&
                    childVNode.type === oldVNode.type
                ) {
                    oldChildren[j] = undefined;
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
    /* eslint-enable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
};
