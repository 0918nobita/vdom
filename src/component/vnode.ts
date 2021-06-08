import type { AnyObject } from '../types';
import type {
    ComponentChildren,
    ComponentType,
    IComponent,
    Key,
} from './component';
import type { Ref } from './ref';
import type { VDOMElement } from './vdomElement';

export interface VNode<P extends AnyObject = AnyObject> {
    type: ComponentType<P> | string | null;
    props: P & { children: ComponentChildren };
    key: Key | null;
    ref: Ref<unknown> | null;
    children: Array<VNode | null>;
    parent: VNode | null;
    depth: number;
    dom: VDOMElement | null;
    nextDom: VDOMElement | null;
    component: null | IComponent<P>;
    hydrating: boolean | null;
    constructor: undefined;
    original: number;
}
