import { Component, VNode, _catchError } from './index';

it('_catchError', () => {
    const error = new Error();

    const vnode: VNode<{}> = { type: 'div', _component: null, _parent: null };
    expect(() => _catchError(error, vnode)).toThrowError();
});

it('_catchError (componentDidCatch)', () => {
    const error = new Error();

    const componentDidCatch: jest.Mock<void, [Error]> = jest
        .fn()
        .mockName('componentDidCatch');

    const component = new Component<{}, {}>({});
    component.componentDidCatch = componentDidCatch;

    const vnode: VNode<{}> = {
        type: 'button',
        _component: null,
        _parent: { type: 'div', _component: component, _parent: null },
    };
    expect(() => _catchError(error, vnode)).toThrowError();
    expect(componentDidCatch).toBeCalledTimes(1);
});
