import type { Options } from '../options';
import type { AnyObject } from '../types';
import type { Context } from './context';
import { enqueueRender } from './enqueueRender';
import type { ComponentEnv } from './env';
import type { Ref } from './ref';
import type { VNode } from './vnode';

type ComponentChild =
    | VNode
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
    new (props: P, context: any): IComponent<P, S>;
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

export interface IComponent<
    P extends AnyObject = AnyObject,
    S extends AnyObject = AnyObject
> {
    dirty: boolean;
    pendingError: unknown;
    processingException: unknown;
    state: S | null;
    vnode: VNode<P> | null;

    setState(
        env: ComponentEnv,
        options: Options,
        state: Partial<S>,
        callback?: () => void
    ): void;

    componentWillMount?(): void;
    componentDidMount?(): void;

    componentWillUnmount?(): void;

    getChildContext?(): AnyObject;

    componentWillReceiveProps?(
        nextProps: Readonly<P>,
        nextContext: unknown
    ): void;

    shouldComponentUpdate?(
        nextProps: Readonly<P>,
        nextState: Readonly<S>,
        nextContext: unknown
    ): boolean;
    componentWillUpdate?(
        previousProps: Readonly<P>,
        previousState: Readonly<S>,
        snapshot: unknown
    ): void;

    componentDidCatch?(error: unknown, errorInfo?: unknown): void;
}

export class Component<
    P extends AnyObject = AnyObject,
    S extends AnyObject = AnyObject
> implements IComponent<P, S>
{
    static getDerivedStateFromError?(error: unknown): AnyObject | null;

    #nextState: S | null = null;
    #renderCallbacks: Array<() => void> = [];

    // TODO (#2): Add description
    dirty = false;
    // TODO (#3): Add description
    pendingError: unknown;
    // TODO (#4): Add description
    processingException: unknown;
    vnode = null;
    state = null;

    constructor(public props: P, public context?: unknown) {}

    setState(
        env: ComponentEnv,
        options: Options,
        state: Partial<S> | null,
        callback?: () => void
    ): void {
        if (this.#nextState === null || this.#nextState === this.state)
            this.#nextState = Object.assign({}, this.state);

        if (state) Object.assign(this.#nextState, state);
        if (state === null || !this.vnode) return;
        if (callback !== undefined) this.#renderCallbacks.push(callback);
        enqueueRender(env, options, this);
    }
}
