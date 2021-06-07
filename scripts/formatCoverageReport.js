const fs = require('fs/promises');
const path = require('path');

(async () => {
    const generateComment = (report) => {
        const header = '## Jest Coverage Report\n\n';
        const table =
            '| File | Statements | Branches | Functions | Lines |\n' +
            '| --- | --- | --- | --- | --- |\n' +
            `| Total | ${report.total.statements.pct}%  | ${report.total.branches.pct}% | ${report.total.functions.pct}% | ${report.total.lines.pct}% |\n`;
        const body = `${header}${table}`;
        return { body };
    };

    try {
        const reportFilePath = path.join(
            __dirname,
            '../coverage/coverage-summary.json'
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
