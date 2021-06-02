import { h } from './hyperscript';
import { ActionSet, View, makeApp } from './app';

interface CounterState {
    count: number;
}

const initialState: CounterState = {
    count: 0,
};

const actions: ActionSet<CounterState, { increment: {} }> = {
    increment(state) {
        console.log('state', state);
        state.count++;
    },
};

type CounterActions = typeof actions;

const view: View<CounterState, CounterActions> = (state, actions) =>
    h(
        'div',
        {},
        h('p', {}, state.count),
        h('button', { onClick: () => actions.increment(state, {}) }, 'Count up')
    );

const el = document.getElementById('root')!;
const run = makeApp({ el, initialState, view, actions });
run();
