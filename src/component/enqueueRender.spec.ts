import { createOptions } from '../options';
import { Component } from './component';
import { enqueueRender } from './enqueueRender';
import { createEnv } from './env';

const createCommonConfig = () => ({
    env: createEnv(),
    options: createOptions(),
});

it('enqueueRender', () => {
    const { env, options } = createCommonConfig();
    const component = new Component({});
    enqueueRender(env, options, component);
    expect(env.rerenderCount).toBe(1);
    expect(component.dirty).toBe(true);
    expect(env.rerenderQueue[0]).toBe(component);
});
