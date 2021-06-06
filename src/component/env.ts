import type { AnyObject } from '../types';
import type { Component } from './component';

export interface ComponentEnv {
    prevDebounce: ((proc: () => void) => void) | null;
    rerenderCount: number;
    rerenderQueue: Array<Component<AnyObject, AnyObject>>;
}

export const createEnv = (): ComponentEnv => ({
    prevDebounce: null,
    rerenderCount: 0,
    rerenderQueue: [],
});
