const fs = require('fs');
const path = require('path');

let totalLines = 0;
let fileCount = 0;

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'build') continue;
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walk(fullPath);
        } else {
            if (/\.(js|jsx|ts|tsx|css|html|md|json)$/i.test(fullPath)) {
                if (file === 'package-lock.json' || file === 'package.json' || file === 'tsconfig.json' || file.endsWith('.log')) continue;
                
                const content = fs.readFileSync(fullPath, 'utf8');
                totalLines += content.split('\n').length;
                fileCount++;
            }
        }
    }
}

walk('.');
console.log(`\n🎉 We have written **${totalLines.toLocaleString()}** lines of code across **${fileCount}** files!`);
