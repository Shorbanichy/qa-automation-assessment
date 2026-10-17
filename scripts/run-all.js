// Runs UI (q1 -> q2 -> q3, sequential) and then API tests; always runs both, returns non-zero if any failed.
const { spawnSync } = require('child_process');
const run = (script) => spawnSync('npm', ['run', script], { stdio: 'inherit', shell: true }).status || 0;

const ui = run('test:ui');
const api = run('api:test');
console.log(`\n=== SUMMARY ===\nUI : ${ui === 0 ? 'PASSED' : 'FAILED'}\nAPI: ${api === 0 ? 'PASSED' : 'FAILED'}`);
console.log('Reports: playwright-report/index.html | allure-results/ | reports/newman/api-report.html');
process.exit(ui || api);
