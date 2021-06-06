import type { Component, ComponentEnv, VNode } from '../component';
import type { Options } from '../options';
import type { AnyObject } from '../types';

interface CatchErrorArgs {
    env: ComponentEnv;
    error: unknown;
    options: Options;
    vnode: VNode<AnyObject>;
}

/** 最も近いエラー境界を見つけ、エラーを投げた上でそれを呼び出す */
export const catchError = ({
    env,
    error,
    options,
    vnode,
}: CatchErrorArgs): never | Component<AnyObject, AnyObject> => {
    for (; vnode.parent && (vnode = vnode.parent); ) {
        const { component } = vnode;

        if (!component || component.processingException) continue;

        try {
            const ctor = component.constructor as typeof Component;
            let handled = false;

            if (ctor && ctor.getDerivedStateFromError) {
                component.setState(
                    env,
                    options,
                    ctor.getDerivedStateFromError(error)
                );
                handled = component.dirty;
            }

            if (component.componentDidCatch) {
                component.componentDidCatch(error);
                handled = component.dirty;
            }

            // これがエラー境界なので、回避されたことと中間ハイドレーションかどうかをマークする
            if (handled) {
                component.pendingError = component;
                return component;
            }
        } catch (e: unknown) {
            error = e;
        }
    }

    throw error;
};
