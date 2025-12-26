export const feirasPage = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Feiras - Teste Final</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 p-8">
    <h1 class="text-2xl font-bold mb-4">Teste FINAL - SEM template literals</h1>
    <div id="result"></div>
    
    <script>
    const token = localStorage.getItem('token');
    if (!token) window.location.href = '/';
    
    // USAR CONCATENAÇÃO em vez de template literals
    const nome = 'Teste';
    const mensagem = 'Olá ' + nome + '! Token: ' + (token ? 'OK' : 'ERRO');
    
    document.getElementById('result').innerHTML = mensagem;
    console.log('Funcionou com concatenação:', mensagem);
    </script>
</body>
</html>
`;
