import { equal } from './equal';

type PropsType = Record<string, string | Function>;
type NodeType<Props extends PropsType = any> =
    | VNode<Props>
    | Fragment
    | string
    | number;

export class Fragment {
    // HACK: Nominal typing
    // @ts-ignore TS6133: _tag is declared but its value is never read.
    private _tag = 'Fragment' as const;
}

class Component<Props extends PropsType = {}, State = {}> {
    public state: State | null = null;

    constructor(public props: Props) {}

    setState(newState: State) {
        Object.assign(this.state, newState);
    }

    componentWillMount() {}
    componentDidMount() {}

    componentWillUnmount() {}

    /** 新しい Props を受け取る */
    componentWillReceiveProps(_nextProps: Readonly<Props>) {}

    /** 再レンダリングが必要かどうか判定する */
    shouldComponentUpdate(
        nextProps: Readonly<Props>,
        nextState: Readonly<State>
    ): boolean {
        return this.props !== nextProps || this.state !== nextState;
    }

    componentWillUpdate() {}
    componentDidUpdate(
        _previousProps: Readonly<Props>,
        _previousState: Readonly<State>
    ) {}

    render(): NodeType {
        return new Fragment();
    }
}

export interface VNode<Props extends PropsType = {}> {
    type: string | Fragment | ComponentType<Props>;
    props: Props;
    children: NodeType[];
    _component: Component<any, any> | null;
}

type ComponentType<Props extends PropsType = {}> =
    | ComponentClass<Props>
    | FunctionComponent<Props>;

interface ComponentClass<Props extends PropsType = {}, State = {}> {
    new (props: Props): Component<Props, State>;
}

type FunctionComponent<Props extends PropsType = {}> = (
    props: Props
) => VNode<Props>;

const isVNode = <Props extends PropsType = {}>(
    node: NodeType<Props>
): node is VNode<Props> => {
    const ty = typeof node;
    return ty === 'object' || ty === 'function';
};

export const h = <Props extends PropsType = {}>(
    type: string | Fragment | ComponentType<Props>,
    props: Props,
    ...children: NodeType[]
): VNode<Props> => ({ type, props, children, _component: null });

const isEventProp = (prop: string): boolean => /^on/.test(prop);

const setAttributes = (target: HTMLElement, props: PropsType): void => {
    for (const prop in props) {
        if (isEventProp(prop)) {
            const eventName = prop.slice(2).toLowerCase();
            target.addEventListener(eventName, props[prop] as EventListener);
            return;
        }
        target.setAttribute(prop, props[prop] as string);
    }
};

const createElement = <Props extends PropsType = {}>(
    node: NodeType<Props>
): Node | Text => {
    if (!isVNode(node)) return document.createTextNode(node.toString());

    // TODO: Implement functional components
    if (typeof node.type === 'function') throw new Error('Not implemented');

    let el: Node;
    if (node.type instanceof Fragment) {
        el = document.createDocumentFragment();
    } else {
        el = document.createElement(node.type);
        setAttributes(el as HTMLElement, node.props);
    }

    for (const child of node.children) el.appendChild(createElement(child));
    return el;
};

type Difference =
    | 'None'
    | 'NodeType'
    | 'TextNode'
    | 'NodeName'
    | 'InputValue'
    | 'Props';

const computeDiff = <Props extends PropsType = {}>(
    a: NodeType<Props>,
    b: NodeType<Props>
): Difference => {
    if (typeof a !== typeof b) return 'NodeType';
    if (!isVNode(a) && a !== b) return 'TextNode';
    if (isVNode(a) && isVNode(b)) {
        if (a.type !== b.type) return 'NodeType';
        if (a.props['value'] !== b.props['value']) return 'InputValue';
        if (!equal(a.props, b.props)) return 'Props';
    }
    return 'None';
};

const updateValue = (target: HTMLInputElement, newValue: string) => {
    target.value = newValue;
};

const updateAttributes = <Props extends PropsType = {}>(
    target: HTMLElement,
    oldProps: Props,
    newProps: Props
) => {
    for (const prop in oldProps) target.removeAttribute(prop);
    for (const prop in newProps)
        if (!isEventProp(prop))
            target.setAttribute(prop, newProps[prop] as string);
};

export const updateElement = <Props extends PropsType = {}>(
    parent: HTMLElement,
    oldNode: NodeType<Props> | undefined,
    newNode: NodeType<Props> | undefined,
    index = 0
): void => {
    if (oldNode === undefined) {
        if (newNode === undefined) return;
        parent.appendChild(createElement(newNode));
        return;
    }
    const target = parent.childNodes[index];
    if (target === undefined) throw new Error('Failed to get child node');
    if (!newNode) {
        parent.removeChild(target);
        return;
    }
    const diff = computeDiff(oldNode, newNode);
    switch (diff) {
        case 'NodeType':
        case 'TextNode':
        case 'NodeName':
            parent.replaceChild(createElement(newNode), target);
            break;
        case 'InputValue':
            updateValue(
                target as HTMLInputElement,
                (newNode as VNode<Props>).props['value'] as string
            );
            break;
        case 'Props':
            updateAttributes(
                target as HTMLElement,
                (oldNode as VNode<Props>).props,
                (newNode as VNode<Props>).props
            );
            break;
    }
    if (isVNode(oldNode) && isVNode(newNode)) {
        for (
            let i = 0;
            i < newNode.children.length || i < oldNode.children.length;
            i++
        ) {
            updateElement(
                target as HTMLElement,
                oldNode.children[i],
                newNode.children[i],
                i
            );
        }
    }
};
