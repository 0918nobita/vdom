import type { AnyObject } from '../types';
import type { Component, ComponentType } from './component';

export interface VNode<P extends AnyObject> {
    type: ComponentType<P> | string;
    _component: null | Component<P, AnyObject>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _parent: VNode<any> | null;
}
