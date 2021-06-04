import { Component, createEnv, VNode } from '../component';
import { createOptions } from '../options';
import { AnyObject, EmptyObject } from '../types';
import { _catchError } from './catchError';

it('_catchError', () => {
    const env = createEnv();
    const options = createOptions();
    const error = new Error();

    const vnode: VNode<AnyObject> = {
        type: 'div',
        _component: null,
        _parent: null,
    };
    expect(() => _catchError(env, options, error, vnode)).toThrowError();
});

it('_catchError (componentDidCatch)', () => {
    const env = createEnv();
    const options = createOptions();
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
