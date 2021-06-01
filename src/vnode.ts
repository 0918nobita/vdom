import { equal } from './equal';

type NodeType = VNode | string | number;
type Attributes = Record<string, string | Function>;

export interface VNode {
    nodeName: string;
    attributes: Attributes;
    children: NodeType[];
}

const isVNode = (node: NodeType): node is VNode =>
    typeof node !== 'string' && typeof node !== 'number';

export const h = (nodeName: string, attributes: Attributes, ...children: NodeType[]): VNode =>
    ({ nodeName, attributes, children });

const isEventAttr = (attr: string): boolean => /^on/.test(attr);

const setAttributes = (target: HTMLElement, attrs: Attributes): void => {
    for (const attr in attrs) {
        if (isEventAttr(attr)) {
            const eventName = attr.slice(2).toLowerCase();
            target.addEventListener(eventName, attrs[attr] as EventListener);
            return;
        }
        target.setAttribute(attr, attrs[attr] as string);
    }
};

const createElement = (node: NodeType): HTMLElement | Text => {
    if (!isVNode(node))
        return document.createTextNode(node.toString());

    const el: HTMLElement = document.createElement(node.nodeName);
    setAttributes(el, node.attributes);
    for (const child of node.children)
        el.appendChild(createElement(child));
    return el;
};

type Difference = 'none' | 'nodeType' | 'textNode' | 'nodeName' | 'inputValue' | 'attr';

const computeDiff = (a: NodeType, b: NodeType): Difference => {
    if (typeof a !== typeof b) return 'nodeType';
    if (!isVNode(a) && a !== b) return 'textNode';
    if (isVNode(a) && isVNode(b)) {
        if (a.nodeName !== b.nodeName) return 'nodeName';
        if (a.attributes['value'] !== b.attributes['value']) return 'inputValue';
        if (!equal(a.attributes, b.attributes)) return 'attr';
    }
    return 'none';
};

const updateValue = (target: HTMLInputElement, newValue: string) => {
    target.value = newValue;
};

const updateAttributes = (target: HTMLElement, oldAttrs: Attributes, newAttrs: Attributes) => {
    for (const attr in oldAttrs) target.removeAttribute(attr);
    for (const attr in newAttrs)
        if (!isEventAttr(attr)) target.setAttribute(attr, newAttrs[attr] as string);
};

export const updateElement = (
    parent: HTMLElement,
    oldNode: NodeType | undefined,
    newNode: NodeType | undefined,
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
        case 'nodeType':
        case 'textNode':
        case 'nodeName':
            parent.replaceChild(createElement(newNode), target);
            break;
        case 'inputValue':
            updateValue(target as HTMLInputElement, (newNode as VNode).attributes['value'] as string);
            break;
        case 'attr':
            updateAttributes(
                target as HTMLElement,
                (oldNode as VNode).attributes,
                (newNode as VNode).attributes);
            break;
    }
    if (isVNode(oldNode) && isVNode(newNode)) {
        for (let i = 0; i < newNode.children.length || i < oldNode.children.length; i++) {
            updateElement(target as HTMLElement, oldNode.children[i], newNode.children[i], i);
        }
    }
};
