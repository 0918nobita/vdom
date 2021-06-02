import { computeDiff } from './diff';
import { Fragment } from './fragment';
import { NodeType, PropsType, VNode, isVNode } from './vnode';

const isEventProp = (prop: string): boolean => /^on/.test(prop);

const setAttributes = (target: HTMLElement, props: PropsType): void => {
    for (const prop in props) {
        if (isEventProp(prop)) {
            const eventName = prop.slice(2).toLowerCase();
            target.addEventListener(eventName, props[prop] as EventListener);
            return;
        }
        target.setAttribute(prop, props[prop] as string);
    }
};

const updateAttributes = <Props extends PropsType = {}>(
    target: HTMLElement,
    oldProps: Props,
    newProps: Props
) => {
    for (const prop in oldProps) target.removeAttribute(prop);
    for (const prop in newProps)
        if (!isEventProp(prop))
            target.setAttribute(prop, newProps[prop] as string);
};

const createElement = <Props extends PropsType = {}>(
    node: NodeType<Props>
): Node | Text => {
    if (!isVNode(node)) return document.createTextNode(node.toString());

    // TODO: Implement functional components
    if (typeof node.type === 'function') throw new Error('Not implemented');

    let el: Node;
    if (node.type instanceof Fragment) {
        el = document.createDocumentFragment();
    } else {
        el = document.createElement(node.type);
        setAttributes(el as HTMLElement, node.props);
    }

    for (const child of node.children) el.appendChild(createElement(child));
    return el;
};

const updateValue = (target: HTMLInputElement, newValue: string) => {
    target.value = newValue;
};

export const updateElement = <Props extends PropsType = {}>(
    parent: HTMLElement,
    oldNode: NodeType<Props> | undefined,
    newNode: NodeType<Props> | undefined,
    index = 0
): void => {
    if (oldNode === undefined) {
        if (newNode === undefined) return;
        parent.appendChild(createElement(newNode));
        return;
    }
    const target = parent.childNodes[index];
    if (target === undefined) throw new Error('Failed to get child node');
    if (!newNode) {
        parent.removeChild(target);
        return;
    }
    const diff = computeDiff(oldNode, newNode);
    switch (diff) {
        case 'NodeType':
        case 'TextNode':
        case 'NodeName':
            parent.replaceChild(createElement(newNode), target);
            break;
        case 'InputValue':
            updateValue(
                target as HTMLInputElement,
                (newNode as VNode<Props>).props['value'] as string
            );
            break;
        case 'Props':
            updateAttributes(
                target as HTMLElement,
                (oldNode as VNode<Props>).props,
                (newNode as VNode<Props>).props
            );
            break;
    }
    if (isVNode(oldNode) && isVNode(newNode)) {
        for (
            let i = 0;
            i < newNode.children.length || i < oldNode.children.length;
            i++
        ) {
            updateElement(
                target as HTMLElement,
                oldNode.children[i],
                newNode.children[i],
                i
            );
        }
    }
};
