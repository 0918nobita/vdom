import * as fc from 'fast-check';

import type { VNode } from '../component';
import { Component, createEnv } from '../component';
import { createOptions } from '../options';
import type { AnyObject, EmptyObject } from '../types';
import { catchError } from './catchError';

const createCommonConfig = () => ({
    env: createEnv(),
    options: createOptions(),
});

it('property-based', () => {
    fc.assert(fc.property(fc.array(fc.integer()), () => true));
});

describe('_catchError', () => {
    it('when _parent is null', () => {
        const { env, options } = createCommonConfig();
        const error = new Error();
        const vnode: VNode<AnyObject> = {
            type: 'div',
            component: null,
            parent: null,
        };
        expect(() => catchError({ env, options, error, vnode })).toThrowError();
    });

    it('when component.componentDidCatch is defined', () => {
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
            component: null,
            parent: { type: 'div', component, parent: null },
        };
        expect(() => catchError({ env, options, error, vnode })).toThrowError();
        expect(componentDidCatch).toBeCalledTimes(1);
    });

    it('when _parent._component is null', () => {
        const { env, options } = createCommonConfig();
        const error = new Error();
        const vnode: VNode<AnyObject> = {
            type: 'button',
            component: null,
            parent: { type: 'div', component: null, parent: null },
        };
        expect(() => catchError({ env, options, error, vnode })).toThrowError();
    });

    it('when _parent._component._processingException is true', () => {
        const { env, options } = createCommonConfig();
        const error = new Error();
        const component = new Component<EmptyObject, EmptyObject>({});
        component.processingException = true;
        const vnode: VNode<AnyObject> = {
            type: 'button',
            component: null,
            parent: { type: 'div', component, parent: null },
        };
        expect(() => catchError({ env, options, error, vnode })).toThrowError();
    });

    it('when ctor.getDerivedStateFromError is defined', () => {
        const { env, options } = createCommonConfig();
        const error = new Error();
        const componentClass = Component;
        const getDerivedStateFromError = jest
            .fn()
            .mockName('getDerivedStateFromError')
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .mockImplementation((_err) => ({ hasError: true }));
        componentClass.getDerivedStateFromError = getDerivedStateFromError;
        const component = new componentClass<
            EmptyObject,
            { hasError: boolean }
        >({});
        const setState = jest.fn().mockName('setState');
        component.setState = setState;
        const vnode: VNode<AnyObject> = {
            type: 'button',
            component: null,
            parent: { type: 'div', component, parent: null },
        };
        expect(() => catchError({ env, options, error, vnode })).toThrowError();
        expect(getDerivedStateFromError).toBeCalledTimes(1);
        expect(setState).toBeCalledTimes(1);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(setState.mock.calls[0][2]).toEqual({
            hasError: true,
        });
    });

    it('when ctor.getDerivedStateFromError is defined', () => {
        const { env, options } = createCommonConfig();
        const error = new Error();
        const componentClass = Component;
        const getDerivedStateFromError = jest
            .fn()
            .mockName('getDerivedStateFromError')
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .mockImplementation((_err) => ({ hasError: true }));
        componentClass.getDerivedStateFromError = getDerivedStateFromError;
        const component = new componentClass<
            EmptyObject,
            { hasError: boolean }
        >({});
        const setState = jest.fn().mockName('setState');
        component.setState = setState;
        const vnode: VNode<AnyObject> = {
            type: 'button',
            component: null,
            parent: { type: 'div', component, parent: null },
        };
        expect(() => catchError({ env, options, error, vnode })).toThrowError();
        expect(getDerivedStateFromError).toBeCalledTimes(1);
        expect(setState).toBeCalledTimes(1);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(setState.mock.calls[0][2]).toEqual({
            hasError: true,
        });
    });

    it('when component.setState throws an exception', () => {
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
            component: null,
            parent: { type: 'div', component, parent: null },
        };
        expect(() =>
            catchError({ env, options, error: error1, vnode })
        ).toThrowError('2');
    });

    it('when component._dirty is true', () => {
        const { env, options } = createCommonConfig();
        const error = new Error();
        const componentClass = Component;
        componentClass.getDerivedStateFromError = jest.fn();
        const component = new componentClass({});
        component.dirty = true;
        const vnode: VNode<AnyObject> = {
            type: 'button',
            component: null,
            parent: { type: 'div', component, parent: null },
        };
        expect(() => catchError({ env, options, error, vnode })).not.toThrow();
        expect(component.pendingError).toBeTruthy();
    });
});
