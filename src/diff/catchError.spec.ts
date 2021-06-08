import type { IComponent, VNode } from '../component';
import { Component, createEnv as createComponentEnv } from '../component';
import type { VNodeCreationEnv } from '../createElement';
import {
    createEnv as createComponentCreationEnv,
    createVNode,
} from '../createElement';
import type { Options } from '../options';
import { createOptions } from '../options';
import type { EmptyObject } from '../types';
import { catchError } from './catchError';

describe('catchError', () => {
    const createCommonConfig = () => ({
        componentEnv: createComponentEnv(),
        vnodeCreationEnv: createComponentCreationEnv(),
        options: createOptions(),
    });

    const createTemplateVNode = (
        vnodeCreactionEnv: VNodeCreationEnv,
        options: Options
    ): VNode => {
        const vnode = createVNode({
            env: vnodeCreactionEnv,
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
            env: vnodeCreactionEnv,
            options,
            vnode: {
                type: 'div',
                props: { children: [vnode] },
                key: null,
                ref: null,
                original: null,
            },
        });
        return vnode;
    };

    it.concurrent('when parent is null', () => {
        const { componentEnv, vnodeCreationEnv, options } =
            createCommonConfig();
        const error = new Error();
        const vnode = createVNode({
            env: vnodeCreationEnv,
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
        const { componentEnv, vnodeCreationEnv, options } =
            createCommonConfig();
        const error = new Error();
        const componentDidCatch = jest.fn().mockName('componentDidCatch');
        const component: IComponent = new Component({});
        component.componentDidCatch = componentDidCatch;
        const vnode = createTemplateVNode(vnodeCreationEnv, options);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        vnode.parent!.component = component;
        expect(() =>
            catchError({ env: componentEnv, options, error, vnode })
        ).toThrowError();
        expect(componentDidCatch).toBeCalledTimes(1);
    });

    it.concurrent('when parent.component is null', () => {
        const { componentEnv, vnodeCreationEnv, options } =
            createCommonConfig();
        const error = new Error();
        const vnode = createTemplateVNode(vnodeCreationEnv, options);
        expect(() =>
            catchError({ env: componentEnv, options, error, vnode })
        ).toThrowError();
    });

    it.concurrent('when parent.component.processingException is true', () => {
        const { componentEnv, vnodeCreationEnv, options } =
            createCommonConfig();
        const error = new Error();
        const component: IComponent = new Component({});
        component.processingException = true;
        const vnode = createTemplateVNode(vnodeCreationEnv, options);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        vnode.parent!.component = component;
        expect(() =>
            catchError({ env: componentEnv, options, error, vnode })
        ).toThrowError();
    });

    it.concurrent('when ctor.getDerivedStateFromError is defined', () => {
        const { componentEnv, vnodeCreationEnv, options } =
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
        const vnode = createTemplateVNode(vnodeCreationEnv, options);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        vnode.parent!.component = component;
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
        const { componentEnv, vnodeCreationEnv, options } =
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
        const vnode = createTemplateVNode(vnodeCreationEnv, options);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        vnode.parent!.component = component;
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
        const { componentEnv, vnodeCreationEnv, options } =
            createCommonConfig();
        const error1 = new Error('1');
        const error2 = new Error('2');
        const componentClass = Component;
        componentClass.getDerivedStateFromError = jest.fn();
        const component = new componentClass({});
        component.setState = jest.fn().mockImplementation(() => {
            throw error2;
        });
        const vnode = createTemplateVNode(vnodeCreationEnv, options);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        vnode.parent!.component = component;
        expect(() =>
            catchError({ env: componentEnv, options, error: error1, vnode })
        ).toThrowError('2');
    });

    it.concurrent('when component.dirty is true', () => {
        const { componentEnv, vnodeCreationEnv, options } =
            createCommonConfig();
        const error = new Error();
        const componentClass = Component;
        componentClass.getDerivedStateFromError = jest.fn();
        const component = new componentClass({});
        component.dirty = true;
        const vnode = createTemplateVNode(vnodeCreationEnv, options);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        vnode.parent!.component = component;
        expect(() =>
            catchError({ env: componentEnv, options, error, vnode })
        ).not.toThrow();
        expect(component.pendingError).toBeTruthy();
    });
});
