const fs = require('fs/promises');
const path = require('path');

(async () => {
    try {
        const report = JSON.parse(
            await fs.readFile(
                path.join(__dirname, '../coverage/coverage-summary.json')
            )
        );
        const body = `## Jest Coverage Report\n\n| File | Statements | Branches | Functions | Lines |\n| --- | --- | --- | --- | --- |\n| Total | ${report.total.statements.pct}%  | ${report.total.branches.pct}% | ${report.total.functions.pct}% | ${report.total.lines.pct}% |\n`;
        await fs.writeFile('prComment.json', JSON.stringify({ body }));
    } catch (e) {
        console.error('Failed to collect coverage');
        console.error(e);
    }
})();
