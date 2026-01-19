const fs = require('node:fs');

if (!fs.existsSync('./dist')) {
    console.error('dist directory not found');
    process.exit();
}

fs.rmSync('./dist', { recursive: true, force: true });
console.log('dist directory removed');
process.exit();