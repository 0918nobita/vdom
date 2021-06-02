export class Fragment {
    // HACK: Nominal typing
    // @ts-ignore TS6133: _tag is declared but its value is never read.
    private _tag = 'Fragment' as const;
}
