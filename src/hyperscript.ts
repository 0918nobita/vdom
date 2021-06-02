import { Fragment } from './fragment';
import { ComponentType, NodeType, PropsType, VNode } from './vnode';

export const h = <Props extends PropsType = {}>(
    type: string | Fragment | ComponentType<Props>,
    props: Props,
    ...children: NodeType[]
): VNode<Props> => ({ type, props, children, _component: null });
