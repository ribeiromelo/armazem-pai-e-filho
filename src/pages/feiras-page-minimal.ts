export const feirasPageMinimal = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Feiras - Teste Minimal</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 p-8">
    <h1 class="text-3xl font-bold mb-4">Feiras - Teste Minimal</h1>
    <div id="status" class="mb-4 p-4 bg-blue-100 rounded">Carregando...</div>
    <div id="fairs-list" class="space-y-2"></div>

    <script>
        console.log('=== SCRIPT MINIMAL INICIADO ===');
        
        const token = localStorage.getItem('token');
        console.log('Token:', token ? 'EXISTS' : 'NULL');
        
        if (!token) {
            document.getElementById('status').innerHTML = 'Sem token! <a href="/" class="text-blue-600">Fazer login</a>';
        } else {
            document.getElementById('status').textContent = 'Token OK! Buscando feiras...';
            
            fetch('/api/fairs', {
                headers: { 'Authorization': 'Bearer ' + token }
            })
            .then(r => {
                console.log('Response status:', r.status);
                return r.json();
            })
            .then(fairs => {
                console.log('Feiras:', fairs);
                const html = fairs.map(f => '<div class="p-4 bg-white rounded shadow">' + f.location + ' - R$ ' + f.total_value + '</div>').join('');
                document.getElementById('fairs-list').innerHTML = html || 'Nenhuma feira';
                document.getElementById('status').textContent = 'Sucesso! ' + fairs.length + ' feira(s) carregada(s)';
            })
            .catch(err => {
                console.error('Erro:', err);
                document.getElementById('status').textContent = 'ERRO: ' + err.message;
            });
        }
    </script>
</body>
</html>
`;
