import { Component, ComponentEnv, VNode } from '../component';
import { Options } from '../options';
import { AnyObject } from '../types';

/** 最も近いエラー境界を見つけ、エラーを投げた上でそれを呼び出す */
export const _catchError = (
    env: ComponentEnv,
    options: Options,
    error: Error,
    vnode: VNode<AnyObject>
): never | Component<AnyObject, AnyObject> => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    for (; vnode._parent && (vnode = vnode._parent); ) {
        const component = vnode._component;

        if (!component || component._processingException) continue;

        try {
            const ctor = component.constructor as typeof Component;
            let handled;

            if (ctor && ctor.getDerivedStateFromError) {
                component.setState(
                    env,
                    options,
                    ctor.getDerivedStateFromError(error)
                );
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
