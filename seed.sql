-- Inserir usuário admin padrão
-- Senha: admin123 (hash bcrypt)
INSERT INTO users (name, username, password, permission, is_admin) 
VALUES ('Administrador', 'admin', '$2a$10$YourHashHere', 'admin', TRUE);

-- Inserir usuário de teste para desenvolvimento
-- Senha: 123456 (para testes)
INSERT INTO users (name, username, password, permission, is_admin) 
VALUES ('Usuário Teste', 'teste', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'edit', FALSE);
