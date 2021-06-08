import type { VNode } from './vnode';

export interface VDOMElement extends HTMLElement {
    _children: VNode | null;
    listeners: Record<string, (e: Event) => void> | null;
    ownerSVGElement: SVGElement | null;
    data: string | number | null;
}
