const fs = require('fs');
const html = fs.readFileSync('/tmp/feiras-prod.html', 'utf8');

// Extrair script
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
    console.log('❌ Script não encontrado');
    process.exit(1);
}

const script = scriptMatch[1];

// Tentar parsear com Node
try {
    new Function(script);
    console.log('✅ JavaScript é válido!');
} catch (err) {
    console.log('❌ JavaScript INVÁLIDO:');
    console.log('Erro:', err.message);
    console.log('Linha aproximada:', err.stack.split('\n')[0]);
    
    // Mostrar contexto do erro
    const lines = script.split('\n');
    const errorLine = parseInt(err.message.match(/line (\d+)/)?.[1]) || 0;
    if (errorLine > 0) {
        console.log('\nContexto:');
        for (let i = Math.max(0, errorLine - 3); i < Math.min(lines.length, errorLine + 2); i++) {
            const marker = i === errorLine - 1 ? '>>> ' : '    ';
            console.log(marker + (i + 1) + ':', lines[i]);
        }
    }
}
