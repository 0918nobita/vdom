import type { AnyObject } from '../types';
import type { Component, ComponentType } from './component';

export interface VNode<P extends AnyObject> {
    type: ComponentType<P> | string;
    component: null | Component<P, AnyObject>;
    parent: VNode<AnyObject> | null;
}
