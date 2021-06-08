import type { ComponentEnv } from './env';
import { renderComponent } from './renderComponent';

/** キューに積まれたすべてのコンポーネントをレンダリングすることで、レンダーキューをフラッシュする */
export const process = (env: ComponentEnv): void => {
    // TODO (#13): 内部処理についての説明を追加する
    while ((env.rerenderCount = env.rerenderQueue.length)) {
        const queue = env.rerenderQueue.sort(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            (a, b) => a.vnode!.depth - b.vnode!.depth
        );
        env.rerenderQueue = [];
        for (const c of queue) if (c.dirty) renderComponent(c);
    }
};
