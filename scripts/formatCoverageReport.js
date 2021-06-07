const fs = require('fs/promises');
const path = require('path');

(async () => {
    const rootDir = path.join(__dirname, '../');

    const generateComment = (reports) => {
        const header = '## Jest Coverage Report\n\n';
        const firstRow = `| Total | ${reports.total.statements.pct}%  | ${reports.total.branches.pct}% | ${reports.total.functions.pct}% | ${reports.total.lines.pct}% |\n`;
        const otherRows = Object.keys(reports)
            .filter((key) => key !== 'total')
            .reduce((acc, key) => {
                const relativePath = path.relative(rootDir, key);
                const report = reports[key];
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
        const reportFileContent = await fs.readFile(reportFilePath);
        const report = JSON.parse(reportFileContent);
        const comment = JSON.stringify(generateComment(report));
        await fs.writeFile('prComment.json', comment);
    } catch (e) {
        console.error('Failed to collect coverage');
        console.error(e);
    }
})();
