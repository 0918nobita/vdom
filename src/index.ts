type NodeType = VNode<any, any, any[]> | string | number;
type Attributes = Record<string, string | Function>;

interface VNode<Name extends string, Attrs extends Attributes, Children extends NodeType[]> {
    nodeName: Name;
    attributes: Attrs;
    children: Children;
}

const isVNode = (node: NodeType): node is VNode<any, any, any[]> =>
    typeof node !== 'string' && typeof node !== 'number';

const h = <Name extends string, Attrs extends Attributes, Children extends NodeType[]>(
    nodeName: Name,
    attributes: Attrs,
    ...children: Children
): VNode<Name, Attrs, Children> => ({
    nodeName,
    attributes,
    children
});

const isEventAttr = (attr: string): boolean => /^on/.test(attr);

const setAttributes = (target: HTMLElement, attrs: Attributes): void => {
    for (const attr in attrs) {
        if (isEventAttr(attr)) {
            const eventName = attr.slice(2).toLowerCase();
            target.addEventListener(eventName, attrs[attr] as EventListener);
            return;
        }
        target.setAttribute(attr, attrs[attr] as string);
    }
};

const createElement = (node: NodeType): HTMLElement | Text => {
    if (!isVNode(node))
        return document.createTextNode(node.toString());

    const el: HTMLElement = document.createElement(node.nodeName);
    setAttributes(el, node.attributes);
    for (const child of node.children)
        el.appendChild(createElement(child));
    return el;
};

type Difference = 'none' | 'nodeType' | 'textNode' | 'nodeName' | 'inputValue' | 'attr';

const equal = (a: any, b: any): boolean => {
    if (a === null) return b === null;

    switch (typeof a) {
        case 'bigint':
        case 'boolean':
        case 'function':
        case 'number':
        case 'string':
        case 'symbol':
        case 'undefined':
            return a === b;
        case 'object':
            const aKeys = Object.keys(a);
            const bKeys = Object.keys(b);
            if (aKeys.length !== bKeys.length) return false;
            for (let i = 0; i < aKeys.length; i++) {
                const aKey = aKeys[i]!;
                const bKey = bKeys[i]!;
                if (aKey !== bKey) return false;
                if (!equal(a[aKey], b[bKey])) return false;
            }
            return true;
    }
};

const computeDiff = (a: NodeType, b: NodeType): Difference => {
    if (typeof a !== typeof b) return 'nodeType';
    if (!isVNode(a) && a !== b) return 'textNode';
    if (isVNode(a) && isVNode(b)) {
        if (a.nodeName !== b.nodeName) return 'nodeName';
        if (a.attributes.value !== b.attributes.value) return 'inputValue';
        if (!equal(a.attributes, b.attributes)) return 'attr';
    }
    return 'none';
};

const updateValue = (target: HTMLInputElement, newValue: string) => {
    target.value = newValue;
};

const updateAttributes = (target: HTMLElement, oldAttrs: Attributes, newAttrs: Attributes) => {
    for (const attr in oldAttrs) target.removeAttribute(attr);
    for (const attr in newAttrs)
        if (!isEventAttr(attr)) target.setAttribute(attr, newAttrs[attr] as string);
};

const updateElement = (
    parent: HTMLElement,
    oldNode: NodeType | undefined,
    newNode: NodeType | undefined,
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
        case 'nodeType':
        case 'textNode':
        case 'nodeName':
            parent.replaceChild(createElement(newNode), target);
            break;
        case 'inputValue':
            updateValue(target as HTMLInputElement, (newNode as VNode<any, any, any[]>).attributes.value as string);
            break;
        case 'attr':
            updateAttributes(
                target as HTMLElement,
                (oldNode as VNode<any, any, any[]>).attributes,
                (newNode as VNode<any, any, any[]>).attributes);
            break;
    }
    if (isVNode(oldNode) && isVNode(newNode)) {
        for (let i = 0; i < newNode.children.length || i < oldNode.children.length; i++) {
            updateElement(target as HTMLElement, oldNode.children[i], newNode.children[i], i);
        }
    }
};

interface View<State, ActionSet> {
    (state: State, actions: ActionSet): VNode<any, any, any[]>;
}

type ActionType<State> = (state: State, ...data: any) => any;

type ActionSet<State, ActionNames extends string> = {
    [action in ActionNames]: ActionType<State>;
}

class App<State, ActionNames extends string> {
    private actions: ActionSet<State, ActionNames>;
    private oldNode?: VNode<any, any, any[]>;
    private newNode?: VNode<any, any, any[]>;
    private shouldSkipRender = false;

    constructor(
        private el: HTMLElement,
        private view: View<State, ActionSet<State, ActionNames>>,
        private state: State,
        actions: ActionSet<State, ActionNames>,
    ) {
        this.actions = this.dispatchAction(actions);
        this.reconstructVNode();
    }

    private dispatchAction(actions: ActionSet<State, ActionNames>) {
        const dispatched = {} as ActionSet<State, ActionNames>;
        for (const key in actions) {
            const action = actions[key]!;
            dispatched[key] = (state: State, ...data: any) => {
                const newState = action(state, ...data);
                this.reconstructVNode();
                return newState;
            };
        }
        return dispatched;
    }

    private reconstructVNode(): void {
        this.newNode = this.view(this.state, this.actions);
        this.scheduleRendering();
    }

    private scheduleRendering(): void {
        if (this.shouldSkipRender) return;
        this.shouldSkipRender = true;
        setTimeout(this.render.bind(this));
    }

    private render(): void {
        updateElement(this.el, this.oldNode, this.newNode);
        this.oldNode = this.newNode;
        this.shouldSkipRender = false;
    }
}

interface CounterState {
    count: number;
}

const initialState: CounterState = {
    count: 0,
};

const actions: ActionSet<CounterState, 'increment'> = {
    increment(state) {
        console.log('state', state);
        state.count++;
    },
};

type CounterActions = typeof actions;

const view: View<CounterState, CounterActions> = (state, actions) =>
    h('div', {},
        h('p', {},
            state.count),
        h('button', { onClick: () => actions.increment(state) },
            'Count up'));

const root = document.getElementById('root')!;
new App(root, view, initialState, actions);
