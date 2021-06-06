import type { Options } from '../options';
import type { AnyObject } from '../types';
import type { Component } from './component';
import type { ComponentEnv } from './env';
import { process } from './process';

const defer =
    typeof Promise === 'function'
        ? Promise.prototype.then.bind(Promise.resolve())
        : setTimeout;

/**
 * コンポーネントの再レンダリングをエンキューする
 * @param component 再レンダリングするコンポーネント
 */
export const enqueueRender = (
    env: ComponentEnv,
    options: Options,
    component: Component<AnyObject, AnyObject>
): void => {
    // TODO (#11): 内部処理についての説明を追加する
    const func = (): void => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        env.prevDebounce = options.debounceRendering;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        void (env.prevDebounce || defer)(() => process(env));
    };

    if (!component.dirty) {
        component.dirty = true;
        env.rerenderQueue.push(component);
        if (
            !env.rerenderCount++ ||
            env.prevDebounce !== options.debounceRendering
        )
            func();
        return;
    }

    if (env.prevDebounce !== options.debounceRendering) func();
};
