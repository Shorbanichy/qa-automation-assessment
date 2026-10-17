const { exec } = require('child_process');
const file = require('path').resolve('reports/newman/api-report.html');
const cmd = process.platform === 'win32' ? `start "" "${file}"` : process.platform === 'darwin' ? `open "${file}"` : `xdg-open "${file}"`;
exec(cmd);
