// TODO: Implement enqueueRender function
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
    static getDerivedStateFromError?(error: any): object | null;

    private nextState: S | null = null;
    private renderCallbacks: any[] = [];
    private vnode: any;

    public _dirty: any;
    public _pendingError: any;
    public _processingException: any;
    public state: S | null = null;

    constructor(public props: P, public context?: any) {}

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
    | VNode<any>
    | object
    | string
    | number
    | bigint
    | boolean
    | null
    | undefined;

type ComponentChildren = ComponentChild[] | ComponentChild;

interface Attributes {
    key?: string | number | any;
    jsx?: boolean;
}

type RenderableProps<P, RefType> = P &
    Readonly<Attributes & { children?: ComponentChildren; ref?: Ref<RefType> }>;

interface FunctionComponent<P> {
    (props: RenderableProps<P, any>, context?: any): VNode<any> | null;
    displayName?: string;
    defaultProps?: Partial<P>;
}
type ComponentType<P> = ComponentClass<P, {}> | FunctionComponent<P>;

export interface VNode<P> {
    type: ComponentType<P> | string;
    _component: null | Component<P, {}>;
    _parent: VNode<any> | null;
}

interface Consumer<T>
    extends FunctionComponent<{ children: (value: T) => ComponentChildren }> {}

interface Provider<T>
    extends FunctionComponent<{ value: T; children: ComponentChildren }> {}

interface Context<T> {
    Consumer: Consumer<T>;
    Provider: Provider<T>;
    displayName?: string;
}

export interface Component<P, S> {
    componentWillMount?(): void;
    componentDidMount?(): void;

    componentWillUnmount?(): void;

    getChildContext?(): object;

    componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;

    shouldComponentUpdate?(
        nextProps: Readonly<P>,
        nextState: Readonly<S>,
        nextContext: any
    ): boolean;
    componentWillUpdate?(
        previousProps: Readonly<P>,
        previousState: Readonly<S>,
        snapshot: any
    ): void;

    componentDidCatch?(error: any, errorInfo?: any): void;
}

export interface ComponentClass<P, S> {
    new (props: P, context: any): Component<P, S>;
    displayName?: string;
    defaultProps?: Partial<P>;
    contextType?: Context<any>;
    getDerivedStateFromProps?(
        props: Readonly<P>,
        state: Readonly<S>
    ): Partial<S> | null;
    getDerivedStateFromError?(error: any): Partial<S> | null;
}

const Fragment = ((props: any) => props.children) as unknown as ComponentClass<
    {},
    {}
>;

// TODO: Implement createVNode function
const createVNode = (_a: any, _b: any, _c: any, _d: any, _e: any): any => {};

// TODO: Implement diff function
interface DiffArgs {
    parentDom: any;
    childVNode: any;
    oldVNode: any;
    globalContext: any;
    isSvg: boolean;
    excessDomChildren: any;
    commitQueue: any;
    oldDom: any;
    isHydrating: boolean;
}
const diff = (_args: DiffArgs): void => {};

// TODO: Implement diffChildren function
interface DiffChildrenArgs {
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
}: DiffChildrenArgs) => {
    let oldVNode /*, newDom, firstChildDom, refs*/;
    let oldChildren = (oldParentVNode && oldParentVNode._children) || [];
    let { length: oldChildrenLength } = oldChildren;
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
        childVNode._depth = newParentVNode._depth + 1;
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
};

/** 最も近いエラー境界を見つけ、エラーを投げた上でそれを呼び出す */
export const _catchError = (error: Error, vnode: VNode<{}>) => {
    for (; vnode._parent && (vnode = vnode._parent); ) {
        const component = vnode._component;

        if (!component || component._processingException) continue;

        try {
            const ctor = component.constructor as typeof Component;
            let handled;

            if (ctor && ctor.getDerivedStateFromError) {
                component.setState(ctor.getDerivedStateFromError(error));
                handled = component._dirty;
            }

            if (component.componentDidCatch) {
                component.componentDidCatch(error);
                handled = component._dirty;
            }

            // これがエラー境界なので、回避されたことと中間ハイドレーションかどうかをマークする
            if (handled) {
                component._pendingError = component;
                return component;
            }
        } catch (e) {
            error = e;
        }
    }

    throw error;
};
