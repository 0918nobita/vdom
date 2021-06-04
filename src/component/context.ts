import type { ComponentChildren, FunctionComponent } from './component';

type Consumer<T> = FunctionComponent<{
    children: (value: T) => ComponentChildren;
}>;

type Provider<T> = FunctionComponent<{ value: T; children: ComponentChildren }>;

export interface Context<T> {
    Consumer: Consumer<T>;
    Provider: Provider<T>;
    displayName?: string;
}
