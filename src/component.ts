export interface VNode<P> {
    type: ComponentType<P> | string;
    _component: null | Component<P, Record<string, never>>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _parent: VNode<any> | null;
}

type ComponentChild =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | VNode<any>
    | Record<string, never>
    | string
    | number
    | bigint
    | boolean
    | null
    | undefined;

type ComponentChildren = ComponentChild[] | ComponentChild;

type Consumer<T> = FunctionComponent<{
    children: (value: T) => ComponentChildren;
}>;

type Provider<T> = FunctionComponent<{ value: T; children: ComponentChildren }>;

interface Context<T> {
    Consumer: Consumer<T>;
    Provider: Provider<T>;
    displayName?: string;
}

type RefObject<T> = { current: T | null };
type RefCallback<T> = (instance: T | null) => void;
type Ref<T> = RefObject<T> | RefCallback<T>;

interface Attributes {
    key?: string | number;
    jsx?: boolean;
}

type RenderableProps<P, RefType> = P &
    Readonly<Attributes & { children?: ComponentChildren; ref?: Ref<RefType> }>;

interface FunctionComponent<P> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (props: RenderableProps<P, any>, context?: any): VNode<any> | null;
    displayName?: string;
    defaultProps?: Partial<P>;
}

type ComponentType<P> =
    | ComponentClass<P, Record<string, never>>
    | FunctionComponent<P>;

export const rerenderQueue: Array<
    Component<Record<string, never>, Record<string, never>>
> = [];

// TODO (#1): Implement enqueueRender function
/**
 * コンポーネントの再レンダリングをエンキューする
 * @param component 再レンダリングするコンポーネント
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function
export const enqueueRender = (component: Component<any, any>): void => {
    if (component._dirty) return;
    component._dirty = true;
    rerenderQueue.push(component);
};

export interface ComponentClass<P, S> {
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

type UpdateState<P, S, K extends keyof S> =
    | ((
          prevState: Readonly<S>,
          props: Readonly<P>
      ) => Pick<S, K> | Partial<S> | null)
    | Pick<S, K>
    | Partial<S>
    | null;

export class Component<P, S> {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static getDerivedStateFromError?(error: any): Record<string, never> | null;

    private nextState: S | null = null;
    private renderCallbacks: any[] = [];
    private vnode: any;

    // TODO (#2): Add description
    public _dirty = false;
    // TODO (#3): Add description
    public _pendingError: any;
    // TODO (#4): Add description
    public _processingException: any;
    public state: S | null = null;

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    constructor(public props: P, public context?: any) {}
    /* eslint-enable @typescript-eslint/no-explicit-any */

    setState<K extends keyof S>(
        update: UpdateState<P, S, K>,
        callback?: () => void
    ): void {
        let s;
        if (this.nextState !== null && this.nextState !== this.state) {
            s = this.nextState;
        } else {
            s = this.nextState = Object.assign({}, this.state);
        }

        if (typeof update === 'function')
            update = update(Object.assign({}, s), this.props);
        if (update) Object.assign(s, update);

        if (update === null) return;

        if (this.vnode) {
            if (callback !== undefined) this.renderCallbacks.push(callback);
            enqueueRender(this);
        }
    }
}

export interface Component<P, S> {
    componentWillMount?(): void;
    componentDidMount?(): void;

    componentWillUnmount?(): void;

    getChildContext?(): Record<string, never>;

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
