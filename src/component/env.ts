import type { AnyObject } from '../types';
import type { Component } from './component';

export interface ComponentEnv {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prevDebounce: any;
    rerenderCount: number;
    rerenderQueue: Array<Component<AnyObject, AnyObject>>;
}

export const createEnv = (): ComponentEnv => ({
    prevDebounce: null,
    rerenderCount: 0,
    rerenderQueue: [],
});
