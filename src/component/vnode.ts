import type { AnyObject } from '../types';
import type { ComponentType, IComponent } from './component';

export interface VNode<P extends AnyObject = AnyObject> {
    type: ComponentType<P> | string;
    component: null | IComponent<P, AnyObject>;
    parent: VNode<AnyObject> | null;
    depth: number | null;
}
