import { AnyObject } from './types';

export interface VNode<P extends AnyObject> {
    type: ComponentType<P> | string;
    _component: null | Component<P, AnyObject>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _parent: VNode<any> | null;
}

type ComponentChild =
    | VNode<AnyObject>
    | AnyObject
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

type ComponentType<P extends AnyObject> =
    | ComponentClass<P, AnyObject>
    | FunctionComponent<P>;

export interface ComponentEnv {
    rerenderQueue: Array<Component<AnyObject, AnyObject>>;
}

export const createEnv = (): ComponentEnv => ({ rerenderQueue: [] });

// TODO (#1): Implement enqueueRender function
/**
 * コンポーネントの再レンダリングをエンキューする
 * @param component 再レンダリングするコンポーネント
 */
export const enqueueRender = (
    env: ComponentEnv,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: Component<AnyObject, AnyObject>
): void => {
    if (component._dirty) return;
    component._dirty = true;
    env.rerenderQueue.push(component);
};

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
    private vnode: any;

    // TODO (#2): Add description
    public _dirty = false;
    // TODO (#3): Add description
    public _pendingError: any;
    // TODO (#4): Add description
    public _processingException: any;
    public state: S | null = null;

    constructor(
        private env: ComponentEnv,
        public props: P,
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        public context?: any /* eslint-enable @typescript-eslint/no-explicit-any */
    ) {}

    setState(state: Partial<S> | null, callback?: () => void): void {
        let s;
        if (this.nextState !== null && this.nextState !== this.state) {
            s = this.nextState;
        } else {
            s = this.nextState = Object.assign({}, this.state);
        }

        if (state) Object.assign(s, state);
        if (state === null || !this.vnode) return;
        if (callback !== undefined) this.renderCallbacks.push(callback);
        enqueueRender(this.env, this);
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
