import { Component, createEnv, VNode } from '../component';
import { createOptions } from '../options';
import { AnyObject, EmptyObject } from '../types';
import { _catchError } from './catchError';

const createCommonConfig = () => ({
    env: createEnv(),
    options: createOptions(),
});

it('_catchError', () => {
    const { env, options } = createCommonConfig();
    const error = new Error();
    const vnode: VNode<AnyObject> = {
        type: 'div',
        _component: null,
        _parent: null,
    };
    expect(() => _catchError(env, options, error, vnode)).toThrowError();
});

it('_catchError (when componentDidCatch is defined)', () => {
    const { env, options } = createCommonConfig();
    const error = new Error();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const componentDidCatch: jest.Mock<void, [Error]> = jest
        .fn()
        .mockName('componentDidCatch');
    const component = new Component<EmptyObject, EmptyObject>({});
    component.componentDidCatch = componentDidCatch;
    const vnode: VNode<AnyObject> = {
        type: 'button',
        _component: null,
        _parent: { type: 'div', _component: component, _parent: null },
    };
    expect(() => _catchError(env, options, error, vnode)).toThrowError();
    expect(componentDidCatch).toBeCalledTimes(1);
});

it('_catchError (when vnode._parent._component is null)', () => {
    const { env, options } = createCommonConfig();
    const error = new Error();
    const vnode: VNode<AnyObject> = {
        type: 'button',
        _component: null,
        _parent: { type: 'div', _component: null, _parent: null },
    };
    expect(() => _catchError(env, options, error, vnode)).toThrowError();
});

it('_catchError (when vnode._parent._component._processingException is true)', () => {
    const { env, options } = createCommonConfig();
    const error = new Error();
    const component = new Component<EmptyObject, EmptyObject>({});
    component._processingException = true;
    const vnode: VNode<AnyObject> = {
        type: 'button',
        _component: null,
        _parent: { type: 'div', _component: component, _parent: null },
    };
    expect(() => _catchError(env, options, error, vnode)).toThrowError();
});

it('_catchError (when ctor.getDerivedStateFromError is defined)', () => {
    const { env, options } = createCommonConfig();
    const error = new Error();
    const componentClass = Component;
    const getDerivedStateFromError = jest
        .fn()
        .mockName('getDerivedStateFromError')
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .mockImplementation((_err) => ({ hasError: true }));
    componentClass.getDerivedStateFromError = getDerivedStateFromError;
    const component = new componentClass<EmptyObject, { hasError: boolean }>(
        {}
    );
    const setState = jest.fn().mockName('setState');
    component.setState = setState;
    const vnode: VNode<AnyObject> = {
        type: 'button',
        _component: null,
        _parent: { type: 'div', _component: component, _parent: null },
    };
    expect(() => _catchError(env, options, error, vnode)).toThrowError();
    expect(getDerivedStateFromError).toBeCalledTimes(1);
    expect(setState).toBeCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(setState.mock.calls[0][2]).toEqual({
        hasError: true,
    });
});

it('_catchError (when ctor.getDerivedStateFromError is defined)', () => {
    const { env, options } = createCommonConfig();
    const error = new Error();
    const componentClass = Component;
    const getDerivedStateFromError = jest
        .fn()
        .mockName('getDerivedStateFromError')
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .mockImplementation((_err) => ({ hasError: true }));
    componentClass.getDerivedStateFromError = getDerivedStateFromError;
    const component = new componentClass<EmptyObject, { hasError: boolean }>(
        {}
    );
    const setState = jest.fn().mockName('setState');
    component.setState = setState;
    const vnode: VNode<AnyObject> = {
        type: 'button',
        _component: null,
        _parent: { type: 'div', _component: component, _parent: null },
    };
    expect(() => _catchError(env, options, error, vnode)).toThrowError();
    expect(getDerivedStateFromError).toBeCalledTimes(1);
    expect(setState).toBeCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(setState.mock.calls[0][2]).toEqual({
        hasError: true,
    });
});

it('_catchError (when component.setState throws an exception)', () => {
    const { env, options } = createCommonConfig();
    const error1 = new Error('1');
    const error2 = new Error('2');
    const componentClass = Component;
    componentClass.getDerivedStateFromError = jest.fn();
    const component = new componentClass({});
    component.setState = jest.fn().mockImplementation(() => {
        throw error2;
    });
    const vnode: VNode<AnyObject> = {
        type: 'button',
        _component: null,
        _parent: { type: 'div', _component: component, _parent: null },
    };
    expect(() => _catchError(env, options, error1, vnode)).toThrowError('2');
});

it('_cacthError (when component._dirty is true)', () => {
    const { env, options } = createCommonConfig();
    const error = new Error();
    const componentClass = Component;
    componentClass.getDerivedStateFromError = jest.fn();
    const component = new componentClass({});
    component._dirty = true;
    const vnode: VNode<AnyObject> = {
        type: 'button',
        _component: null,
        _parent: { type: 'div', _component: component, _parent: null },
    };
    expect(() => _catchError(env, options, error, vnode)).not.toThrow();
    expect(component._pendingError).toBeTruthy();
});
