import { Component, VNode } from '../component';

/** 最も近いエラー境界を見つけ、エラーを投げた上でそれを呼び出す */
export const _catchError = (
    error: Error,
    vnode: VNode<Record<string, never>>
): never | Component<Record<string, never>, Record<string, never>> => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    for (; vnode._parent && (vnode = vnode._parent); ) {
        const component = vnode._component;

        if (!component || component._processingException) continue;

        try {
            const ctor = component.constructor as typeof Component;
            let handled;

            if (ctor && ctor.getDerivedStateFromError) {
                component.setState(ctor.getDerivedStateFromError(error));
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                handled = component._dirty;
            }

            if (component.componentDidCatch) {
                component.componentDidCatch(error);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                handled = component._dirty;
            }

            // これがエラー境界なので、回避されたことと中間ハイドレーションかどうかをマークする
            if (handled) {
                component._pendingError = component;
                return component;
            }
        } catch (e) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            error = e;
        }
    }

    throw error;
};
