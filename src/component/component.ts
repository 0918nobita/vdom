import type { Options } from '../options';
import type { AnyObject } from '../types';
import type { Context } from './context';
import { enqueueRender } from './enqueueRender';
import type { ComponentEnv } from './env';
import type { Ref } from './ref';
import type { VNode } from './vnode';

type ComponentChild =
    | VNode<AnyObject>
    | AnyObject
    | string
    | number
    | bigint
    | boolean
    | null
    | undefined;

export type ComponentChildren = ComponentChild[] | ComponentChild;

interface Attributes {
    key?: string | number;
    jsx?: boolean;
}

type RenderableProps<P, RefType> = P &
    Readonly<Attributes & { children?: ComponentChildren; ref?: Ref<RefType> }>;

export interface FunctionComponent<P> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (props: RenderableProps<P, any>, context?: any): VNode<any> | null;
    displayName?: string;
    defaultProps?: Partial<P>;
}

export type ComponentType<P extends AnyObject> =
    | ComponentClass<P, AnyObject>
    | FunctionComponent<P>;

export interface ComponentClass<P extends AnyObject, S extends AnyObject> {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    new (props: P, context: any): Component<P, S>;
    displayName?: string;
    defaultProps?: Partial<P>;
    contextType?: Context<any>;
    getDerivedStateFromProps?(
        props: Readonly<P>,
        state: Readonly<S>
    ): Partial<S> | null;
    getDerivedStateFromError?(error: any): Partial<S> | null;
    /* eslint-enable @typescript-eslint/no-explicit-any */
}

export class Component<P extends AnyObject, S extends AnyObject> {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static getDerivedStateFromError?(error: any): AnyObject | null;

    private nextState: S | null = null;
    private renderCallbacks: Array<() => void> = [];

    // TODO (#2): Add description
    public _dirty = false;
    // TODO (#3): Add description
    public _pendingError: any;
    // TODO (#4): Add description
    public _processingException: any;
    public _vnode: any;
    public state: S | null = null;

    constructor(
        public props: P,
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        public context?: any /* eslint-enable @typescript-eslint/no-explicit-any */
    ) {}

    setState(
        env: ComponentEnv,
        options: Options,
        state: Partial<S> | null,
        callback?: () => void
    ): void {
        let s;
        if (this.nextState !== null && this.nextState !== this.state) {
            s = this.nextState;
        } else {
            s = this.nextState = Object.assign({}, this.state);
        }

        if (state) Object.assign(s, state);
        if (state === null || !this._vnode) return;
        if (callback !== undefined) this.renderCallbacks.push(callback);
        enqueueRender(env, options, this);
    }
}

export interface Component<P, S> {
    componentWillMount?(): void;
    componentDidMount?(): void;

    componentWillUnmount?(): void;

    getChildContext?(): AnyObject;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;

    shouldComponentUpdate?(
        nextProps: Readonly<P>,
        nextState: Readonly<S>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        nextContext: any
    ): boolean;
    componentWillUpdate?(
        previousProps: Readonly<P>,
        previousState: Readonly<S>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        snapshot: any
    ): void;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    componentDidCatch?(error: any, errorInfo?: any): void;
}
