// TODO: Implement enqueueRender function
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function
const enqueueRender = (_component: Component<any, any>): void => {};

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

    public _dirty: any;
    public _pendingError: any;
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
        if (update) {
            Object.assign(s, update);
        }

        if (update === null) return;

        if (this.vnode) {
            if (callback !== undefined) this.renderCallbacks.push(callback);
            enqueueRender(this);
        }
    }
}

type RefObject<T> = { current: T | null };
type RefCallback<T> = (instance: T | null) => void;
type Ref<T> = RefObject<T> | RefCallback<T>;

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

export interface VNode<P> {
    type: ComponentType<P> | string;
    _component: null | Component<P, Record<string, never>>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _parent: VNode<any> | null;
}

type Consumer<T> = FunctionComponent<{
    children: (value: T) => ComponentChildren;
}>;

type Provider<T> = FunctionComponent<{ value: T; children: ComponentChildren }>;

interface Context<T> {
    Consumer: Consumer<T>;
    Provider: Provider<T>;
    displayName?: string;
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

// TODO: Make the types more precise
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
const Fragment = ((props: any) => props.children) as unknown as ComponentClass<
    Record<string, never>,
    Record<string, never>
>;

// TODO: Implement createVNode function
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function
const createVNode = (_a: any, _b: any, _c: any, _d: any, _e: any): any => {};

// TODO: Implement diff function
interface DiffArgs {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    parentDom: any;
    childVNode: any;
    oldVNode: any;
    globalContext: any;
    isSvg: boolean;
    excessDomChildren: any;
    commitQueue: any;
    oldDom: any;
    isHydrating: boolean;
    /* eslint-enable @typescript-eslint/no-explicit-any */
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
const diff = (_args: DiffArgs): void => {};

// TODO: Implement diffChildren function
interface DiffChildrenArgs {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    parentDom: any;
    renderResult: any;
    newParentVNode: any;
    oldParentVNode: any;
    globalContext: any;
    isSvg: boolean;
    excessDomChildren: any;
    commitQueue: any;
    oldDom: any;
    isHydrating: boolean;
    /* eslint-enable @typescript-eslint/no-explicit-any */
}
export const diffChildren = ({
    parentDom,
    renderResult,
    newParentVNode,
    oldParentVNode,
    globalContext,
    isSvg,
    excessDomChildren,
    commitQueue,
    oldDom,
    isHydrating,
}: DiffChildrenArgs): void => {
    let oldVNode /*, newDom, firstChildDom, refs*/;
    /* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
    const oldChildren = (oldParentVNode && oldParentVNode._children) || [];
    const { length: oldChildrenLength } = oldChildren;
    newParentVNode._children = [];
    for (let i = 0; i < renderResult.length; i++) {
        let childVNode = renderResult[i];
        if (childVNode === null || typeof childVNode === 'boolean') {
            childVNode = newParentVNode._children[i] = null;
        } else if (
            typeof childVNode === 'string' ||
            typeof childVNode === 'number' ||
            typeof childVNode === 'bigint'
        ) {
            childVNode = newParentVNode._children[i] = createVNode(
                null,
                childVNode,
                null,
                null,
                childVNode
            );
        } else if (Array.isArray(childVNode)) {
            childVNode = newParentVNode._children[i] = createVNode(
                Fragment,
                { children: childVNode },
                null,
                null,
                null
            );
        } else if (childVNode._depth > 0) {
            childVNode = newParentVNode._children[i] = createVNode(
                childVNode.type,
                childVNode.props,
                childVNode.key,
                null,
                childVNode._original
            );
        } else {
            childVNode = newParentVNode._children[i] = childVNode;
        }

        if (childVNode === null) continue;

        childVNode._parent = newParentVNode;
        childVNode._depth = (newParentVNode._depth as number) + 1;
        oldVNode = oldChildren[i];
        if (
            oldVNode === null ||
            (oldVNode &&
                childVNode.key === oldVNode.key &&
                childVNode.type === oldVNode.type)
        ) {
            oldChildren[i] = undefined;
        } else {
            for (let j = 0; j < oldChildrenLength; j++) {
                oldVNode = oldChildren[j];
                if (
                    oldVNode &&
                    childVNode.key === oldVNode.key &&
                    childVNode.type === oldVNode.type
                ) {
                    oldChildren[j] = undefined;
                    break;
                }
                oldVNode = null;
            }
        }
        oldVNode = oldVNode || {};
        diff({
            parentDom,
            childVNode,
            oldVNode,
            globalContext,
            isSvg,
            excessDomChildren,
            commitQueue,
            oldDom,
            isHydrating,
        });
    }
    /* eslint-enable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
};

/** 最も近いエラー境界を見つけ、エラーを投げた上でそれを呼び出す */
export const _catchError = (
    error: Error,
    vnode: VNode<Record<string, never>>
): never | Component<Record<string, never>, Record<string, never>> => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    for (; vnode._parent && (vnode = vnode._parent); ) {
        const component = vnode._component;

        if (!component || component._processingException) continue;

        try {
            const ctor = component.constructor as typeof Component;
            let handled;

            if (ctor && ctor.getDerivedStateFromError) {
                component.setState(ctor.getDerivedStateFromError(error));
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                handled = component._dirty;
            }

            if (component.componentDidCatch) {
                component.componentDidCatch(error);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                handled = component._dirty;
            }

            // これがエラー境界なので、回避されたことと中間ハイドレーションかどうかをマークする
            if (handled) {
                component._pendingError = component;
                return component;
            }
        } catch (e) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            error = e;
        }
    }

    throw error;
};
