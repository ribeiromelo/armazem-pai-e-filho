const fs = require('fs');
const html = fs.readFileSync('/tmp/feiras-prod.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
const script = scriptMatch[1];
const lines = script.split('\n');

// Procurar por padrões problemáticos
console.log('Procurando padrões suspeitos...\n');

// 1. Object property shorthand incorreto
lines.forEach((line, i) => {
    if (line.match(/:\s*\$\{/) && !line.match(/`/)) {
        console.log(`Linha ${i+1}: Template literal em object property`);
        console.log('  ', line.trim());
    }
});

// 2. Template literals não escapados
let inBacktick = false;
lines.forEach((line, i) => {
    const backticks = (line.match(/`/g) || []).length;
    if (backticks % 2 === 1) inBacktick = !inBacktick;
    
    if (!inBacktick && line.includes('${')) {
        console.log(`Linha ${i+1}: \${ fora de template literal`);
        console.log('  ', line.trim());
    }
});
