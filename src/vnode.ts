import { Fragment } from './fragment';

export type PropsType = Record<string, string | Function>;

export type NodeType<Props extends PropsType = any> =
    | VNode<Props>
    | Fragment
    | string
    | number;

export interface VNode<Props extends PropsType = {}> {
    type: string | Fragment | ComponentType<Props>;
    props: Props;
    children: NodeType[];
    _component: Component<any, any> | null;
}

export type ComponentType<Props extends PropsType = {}> =
    | ComponentClass<Props>
    | FunctionComponent<Props>;

interface ComponentClass<Props extends PropsType = {}, State = {}> {
    new (props: Props): Component<Props, State>;
}

type FunctionComponent<Props extends PropsType = {}> = (
    props: Props
) => VNode<Props>;

export const isVNode = <Props extends PropsType = {}>(
    node: NodeType<Props>
): node is VNode<Props> => {
    const ty = typeof node;
    return ty === 'object' || ty === 'function';
};

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
