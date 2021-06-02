interface ComponentConstructor {
    getDerivedStateFromError: null | ((error: Error) => any);
}

interface Component {
    constructor: ComponentConstructor;
    setState(state: any): void;
    componentDidCatch: null | ((error: Error) => void);
    _dirty: any;
    _pendingError: any;
    _processingException: any;
}

interface VNode {
    _component: null | Component;
    _parent: any;
}

/** 最も近いエラー境界を見つけ、エラーを投げた上でそれを呼び出す */
const _catchError = (error: Error, vnode: VNode) => {
    for (; (vnode = vnode._parent); ) {
        const component = vnode._component;

        if (!component || component._processingException) continue;

        try {
            const ctor = component.constructor;
            let handled;

            if (ctor && ctor.getDerivedStateFromError !== null) {
                component.setState(ctor.getDerivedStateFromError(error));
                handled = component._dirty;
            }

            if (component.componentDidCatch !== null) {
                component.componentDidCatch(error);
                handled = component._dirty;
            }

            // これがエラー境界なので、回避されたことと中間ハイドレーションかどうかをマークする
            if (handled) {
                component._pendingError = component;
                return component;
            }
        } catch (e) {
            error = e;
        }
    }

    throw error;
};
