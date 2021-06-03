// TODO (#5): Implement diff function
interface DiffArgs {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    parentDom: any;
    childVNode: any;
    oldVNode: any;
    globalContext: any;
    isSvg: boolean;
    excessDomChildren: any;
    commitQueue: any;
    oldDom: any;
    isHydrating: boolean;
    /* eslint-enable @typescript-eslint/no-explicit-any */
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
export const diff = (_args: DiffArgs): void => {};
