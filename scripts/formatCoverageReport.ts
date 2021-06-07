import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import fs from 'fs/promises';
import * as t from 'io-ts';
import path from 'path';

const tReportDetail = t.type({
    total: t.number,
    covered: t.number,
    skipped: t.number,
    pct: t.number,
});

const tReport = t.type({
    statements: tReportDetail,
    branches: tReportDetail,
    functions: tReportDetail,
    lines: tReportDetail,
});

const tReports = t.intersection([
    t.record(t.string, tReport),
    t.record(t.literal('total'), tReport),
]);

type Reports = t.TypeOf<typeof tReports>;

void (async () => {
    const rootDir = path.join(__dirname, '../');

    const generateComment = (reports: Reports) => {
        const header = '## Jest Coverage Report\n\n';
        const firstRow = `| Total | ${reports.total.statements.pct}%  | ${reports.total.branches.pct}% | ${reports.total.functions.pct}% | ${reports.total.lines.pct}% |\n`;
        const otherRows = Object.keys(reports)
            .filter((key) => key !== 'total')
            .reduce((acc, key) => {
                const relativePath = path.relative(rootDir, key);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const report = reports[key]!;
                const row = `| ${relativePath} | ${report.statements.pct}% | ${report.branches.pct}% | ${report.functions.pct}% | ${report.lines.pct}% |\n`;
                return `${acc}${row}`;
            }, '');
        const table =
            '| File | Statements | Branches | Functions | Lines |\n' +
            '| --- | --- | --- | --- | --- |\n' +
            firstRow +
            otherRows;
        const body = `${header}${table}`;
        return { body };
    };

    try {
        const reportFilePath = path.join(
            rootDir,
            './coverage/coverage-summary.json'
        );
        const reportFileContent = await fs.readFile(reportFilePath, 'utf-8');
        await pipe(
            tReports.decode(JSON.parse(reportFileContent)),
            E.fold(
                (errors) => {
                    errors.forEach((e) => console.error(e));
                    throw new Error(
                        'The format of coverage/coverage-summary.json is invalid'
                    );
                },
                (reports) => {
                    const comment = JSON.stringify(generateComment(reports));
                    return TE.tryCatch(
                        () => fs.writeFile('prComment.json', comment),
                        String
                    );
                }
            )
        )();
    } catch (e) {
        console.error('Failed to collect coverage');
        console.error(e);
    }
})();
