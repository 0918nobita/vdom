import type { IComponent } from '../component';
import { Component, createEnv as createComponentEnv } from '../component';
import {
    createEnv as createComponentCreationEnv,
    createVNode,
} from '../createElement';
import { createOptions } from '../options';
import type { EmptyObject } from '../types';
import { catchError } from './catchError';

const createCommonConfig = () => ({
    componentEnv: createComponentEnv(),
    componentCreationEnv: createComponentCreationEnv(),
    options: createOptions(),
});

describe('_catchError', () => {
    it.concurrent('when _parent is null', () => {
        const { componentEnv, componentCreationEnv, options } =
            createCommonConfig();
        const error = new Error();
        const vnode = createVNode({
            env: componentCreationEnv,
            options,
            vnode: {
                type: 'div',
                props: { children: [] },
                key: null,
                ref: null,
                original: null,
            },
        });
        expect(() =>
            catchError({ env: componentEnv, options, error, vnode })
        ).toThrowError();
    });

    it.concurrent('when component.componentDidCatch is defined', () => {
        const { componentEnv, componentCreationEnv, options } =
            createCommonConfig();
        const error = new Error();
        const componentDidCatch = jest.fn().mockName('componentDidCatch');
        const component: IComponent = new Component({});
        component.componentDidCatch = componentDidCatch;
        const vnode = createVNode({
            env: componentCreationEnv,
            options,
            vnode: {
                type: 'div',
                props: { children: [] },
                key: null,
                ref: null,
                original: null,
            },
        });
        vnode.parent = createVNode({
            env: componentCreationEnv,
            options,
            vnode: {
                type: 'div',
                props: { children: [vnode] },
                key: null,
                ref: null,
                original: null,
            },
        });
        vnode.parent.component = component;
        expect(() =>
            catchError({ env: componentEnv, options, error, vnode })
        ).toThrowError();
        expect(componentDidCatch).toBeCalledTimes(1);
    });

    it.concurrent('when _parent._component is null', () => {
        const { componentEnv, componentCreationEnv, options } =
            createCommonConfig();
        const error = new Error();
        const vnode = createVNode({
            env: componentCreationEnv,
            options,
            vnode: {
                type: 'button',
                props: { children: [] },
                key: null,
                ref: null,
                original: null,
            },
        });
        vnode.parent = createVNode({
            env: componentCreationEnv,
            options,
            vnode: {
                type: 'div',
                props: { children: [vnode] },
                key: null,
                ref: null,
                original: null,
            },
        });
        expect(() =>
            catchError({ env: componentEnv, options, error, vnode })
        ).toThrowError();
    });

    it.concurrent(
        'when _parent._component._processingException is true',
        () => {
            const { componentEnv, componentCreationEnv, options } =
                createCommonConfig();
            const error = new Error();
            const component: IComponent = new Component({});
            component.processingException = true;
            const vnode = createVNode({
                env: componentCreationEnv,
                options,
                vnode: {
                    type: 'button',
                    props: { children: [] },
                    key: null,
                    ref: null,
                    original: null,
                },
            });
            vnode.parent = createVNode({
                env: componentCreationEnv,
                options,
                vnode: {
                    type: 'button',
                    props: { children: [vnode] },
                    key: null,
                    ref: null,
                    original: null,
                },
            });
            vnode.parent.component = component;
            expect(() =>
                catchError({ env: componentEnv, options, error, vnode })
            ).toThrowError();
        }
    );

    it.concurrent('when ctor.getDerivedStateFromError is defined', () => {
        const { componentEnv, componentCreationEnv, options } =
            createCommonConfig();
        const error = new Error();
        const componentClass = Component;
        const getDerivedStateFromError = jest
            .fn()
            .mockName('getDerivedStateFromError')
            .mockImplementation(() => ({ hasError: true }));
        componentClass.getDerivedStateFromError = getDerivedStateFromError;
        const component = new componentClass<
            EmptyObject,
            { hasError: boolean }
        >({});
        const setState = jest.fn().mockName('setState');
        component.setState = setState;
        const vnode = createVNode({
            env: componentCreationEnv,
            options,
            vnode: {
                type: 'button',
                props: { children: [] },
                key: null,
                ref: null,
                original: null,
            },
        });
        vnode.parent = createVNode({
            env: componentCreationEnv,
            options,
            vnode: {
                type: 'div',
                props: { children: [vnode] },
                key: null,
                ref: null,
                original: null,
            },
        });
        vnode.parent.component = component;
        expect(() =>
            catchError({ env: componentEnv, options, error, vnode })
        ).toThrowError();
        expect(getDerivedStateFromError).toBeCalledTimes(1);
        expect(setState).toBeCalledTimes(1);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(setState.mock.calls[0][2]).toEqual({
            hasError: true,
        });
    });

    it.concurrent('when ctor.getDerivedStateFromError is defined', () => {
        const { componentEnv, componentCreationEnv, options } =
            createCommonConfig();
        const error = new Error();
        const componentClass = Component;
        const getDerivedStateFromError = jest
            .fn()
            .mockName('getDerivedStateFromError')
            .mockImplementation(() => ({ hasError: true }));
        componentClass.getDerivedStateFromError = getDerivedStateFromError;
        const component = new componentClass<
            EmptyObject,
            { hasError: boolean }
        >({});
        const setState = jest.fn().mockName('setState');
        component.setState = setState;
        const vnode = createVNode({
            env: componentCreationEnv,
            options,
            vnode: {
                type: 'button',
                props: { children: [] },
                key: null,
                ref: null,
                original: null,
            },
        });
        vnode.parent = createVNode({
            env: componentCreationEnv,
            options,
            vnode: {
                type: 'div',
                props: { children: [vnode] },
                key: null,
                ref: null,
                original: null,
            },
        });
        vnode.parent.component = component;
        expect(() =>
            catchError({ env: componentEnv, options, error, vnode })
        ).toThrowError();
        expect(getDerivedStateFromError).toBeCalledTimes(1);
        expect(setState).toBeCalledTimes(1);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(setState.mock.calls[0][2]).toEqual({
            hasError: true,
        });
    });

    it.concurrent('when component.setState throws an exception', () => {
        const { componentEnv, componentCreationEnv, options } =
            createCommonConfig();
        const error1 = new Error('1');
        const error2 = new Error('2');
        const componentClass = Component;
        componentClass.getDerivedStateFromError = jest.fn();
        const component = new componentClass({});
        component.setState = jest.fn().mockImplementation(() => {
            throw error2;
        });
        const vnode = createVNode({
            env: componentCreationEnv,
            options,
            vnode: {
                type: 'button',
                props: { children: [] },
                key: null,
                ref: null,
                original: null,
            },
        });
        vnode.parent = createVNode({
            env: componentCreationEnv,
            options,
            vnode: {
                type: 'div',
                props: { children: [vnode] },
                key: null,
                ref: null,
                original: null,
            },
        });
        vnode.parent.component = component;
        expect(() =>
            catchError({ env: componentEnv, options, error: error1, vnode })
        ).toThrowError('2');
    });

    it.concurrent('when component._dirty is true', () => {
        const { componentEnv, componentCreationEnv, options } =
            createCommonConfig();
        const error = new Error();
        const componentClass = Component;
        componentClass.getDerivedStateFromError = jest.fn();
        const component = new componentClass({});
        component.dirty = true;
        const vnode = createVNode({
            env: componentCreationEnv,
            options,
            vnode: {
                type: 'button',
                props: { children: [] },
                key: null,
                ref: null,
                original: null,
            },
        });
        vnode.parent = createVNode({
            env: componentCreationEnv,
            options,
            vnode: {
                type: 'div',
                props: { children: [vnode] },
                key: null,
                ref: null,
                original: null,
            },
        });
        vnode.parent.component = component;
        expect(() =>
            catchError({ env: componentEnv, options, error, vnode })
        ).not.toThrow();
        expect(component.pendingError).toBeTruthy();
    });
});
