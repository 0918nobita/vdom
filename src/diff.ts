import { equal } from './equal';
import { NodeType, PropsType, isVNode } from './vnode';

type Difference =
    | 'None'
    | 'NodeType'
    | 'TextNode'
    | 'NodeName'
    | 'InputValue'
    | 'Props';

export const computeDiff = <Props extends PropsType = {}>(
    a: NodeType<Props>,
    b: NodeType<Props>
): Difference => {
    if (typeof a !== typeof b) return 'NodeType';
    if (!isVNode(a) && a !== b) return 'TextNode';
    if (isVNode(a) && isVNode(b)) {
        if (a.type !== b.type) return 'NodeType';
        if (a.props['value'] !== b.props['value']) return 'InputValue';
        if (!equal(a.props, b.props)) return 'Props';
    }
    return 'None';
};
