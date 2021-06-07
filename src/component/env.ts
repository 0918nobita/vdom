import type { IComponent } from './component';

export interface ComponentEnv {
    prevDebounce: ((proc: () => void) => void) | null;
    rerenderCount: number;
    rerenderQueue: IComponent[];
}

export const createEnv = (): ComponentEnv => ({
    prevDebounce: null,
    rerenderCount: 0,
    rerenderQueue: [],
});
