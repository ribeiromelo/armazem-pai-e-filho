// Usar String.raw para preservar escapes
export const feirasPage = String.raw`<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Feiras - Armazém Pai e Filho</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <div id="app">Carregando...</div>
    
    <script>
    // TESTE SIMPLES
    const token = localStorage.getItem('token');
    if (!token) window.location.href = '/';
    
    document.getElementById('app').innerHTML = '<h1>Página de Feiras FUNCIONANDO!</h1><p>Token: ' + (token ? 'OK' : 'ERRO') + '</p>';
    
    // Testar template literal
    const teste = 'FUNCIONA';
    console.log('Template literal teste:', `Valor: ${teste}`);
    </script>
</body>
</html>
`;
