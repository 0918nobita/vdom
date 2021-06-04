type RefObject<T> = { current: T | null };

type RefCallback<T> = (instance: T | null) => void;

export type Ref<T> = RefObject<T> | RefCallback<T>;
