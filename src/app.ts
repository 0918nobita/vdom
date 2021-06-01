import { VNode, updateElement } from './vnode';

export type View<State, ActionSet> =
    (state: State, actions: ActionSet) => VNode;

type ActionType<State, Payload> =
    (state: State, payload: Payload) => void;

export type ActionSet<State, PayloadMap> = {
    [ActionName in keyof PayloadMap]: ActionType<State, PayloadMap[ActionName]>;
}

interface AppConstructor<State, PayloadMap> {
    el: HTMLElement;
    initialState: State;
    view: View<State, ActionSet<State, PayloadMap>>;
    actions: ActionSet<State, PayloadMap>;
}

export const makeApp = <State, PayloadMap>({
    el,
    initialState,
    view,
    actions
}: AppConstructor<State, PayloadMap>) => {
    let oldNode: VNode | undefined;
    let newNode: VNode | undefined;
    let shouldSkipRendering = false;

    const state = initialState;
    const boundActions = {} as ActionSet<State, PayloadMap>;

    const render = () => {
        updateElement(el, oldNode, newNode);
        oldNode = newNode;
        shouldSkipRendering = false;
    };

    const scheduleRendering = () => {
        if (shouldSkipRendering) return;
        shouldSkipRendering = true;
        setTimeout(() => render());
    };

    const reconstructVNode = () => {
        newNode = view(state, boundActions);
        scheduleRendering();
    };

    for (const key in actions) {
        const action = actions[key];
        boundActions[key] = (state, payload) => {
            action(state, payload);
            reconstructVNode();
        };
    }

    return () => reconstructVNode();
};
