import { Component, VNode, _catchError } from './index';

it('_catchError', () => {
    const error = new Error();

    const vnode0: VNode = { _component: null, _parent: null };
    expect(() => _catchError(error, vnode0)).toThrowError();

    const componentDidCatch: jest.Mock<void, [Error]> = jest
        .fn()
        .mockName('componentDidCatch');
    const component: Component = {
        constructor: { getDerivedStateFromError: null },
        setState() {},
        componentDidCatch,
        _dirty: null,
        _pendingError: null,
        _processingException: null,
    };
    const vnode1: VNode = {
        _component: null,
        _parent: { _component: component },
    };
    expect(() => _catchError(error, vnode1)).toThrowError();
    expect(componentDidCatch).toBeCalledTimes(1);
});
