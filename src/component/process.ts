import type { ComponentEnv } from './env';
import { renderComponent } from './renderComponent';

/** キューに積まれたすべてのコンポーネントをレンダリングすることで、レンダーキューをフラッシュする */
export const process = (env: ComponentEnv): void => {
    // TODO (#13): 内部処理についての説明を追加する
    while ((env.rerenderCount = env.rerenderQueue.length)) {
        const queue = env.rerenderQueue.sort(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            (a, b) => a._vnode._depth - b._vnode._depth
        );
        env.rerenderQueue = [];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        for (const c of queue) if (c._dirty) renderComponent(c);
    }
};
