import { _catchError, Component, VNode } from './index';

it('_catchError', () => {
    const error = new Error();

    const vnode: VNode<Record<string, never>> = {
        type: 'div',
        _component: null,
        _parent: null,
    };
    expect(() => _catchError(error, vnode)).toThrowError();
});

it('_catchError (componentDidCatch)', () => {
    const error = new Error();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const componentDidCatch: jest.Mock<void, [Error]> = jest
        .fn()
        .mockName('componentDidCatch');

    const component = new Component<
        Record<string, never>,
        Record<string, never>
    >({});
    component.componentDidCatch = componentDidCatch;

    const vnode: VNode<Record<string, never>> = {
        type: 'button',
        _component: null,
        _parent: { type: 'div', _component: component, _parent: null },
    };
    expect(() => _catchError(error, vnode)).toThrowError();
    expect(componentDidCatch).toBeCalledTimes(1);
});
