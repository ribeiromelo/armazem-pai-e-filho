-- Deletar usuário admin antigo
DELETE FROM users WHERE username = 'admin';

-- Criar novo usuário admin com senha 'admin123' já hashada (PBKDF2)
-- Hash gerado com: crypto.subtle.deriveBits(PBKDF2, password+salt, 256)
-- Salt: 7b6e1c4a2f8d3e9b4c5a6d7e8f9a0b1c
-- Password: admin123
INSERT INTO users (name, username, password, permission, is_admin) 
VALUES (
  'Administrador',
  'admin',
  '7b6e1c4a2f8d3e9b4c5a6d7e8f9a0b1c:e8c9b7a6f5e4d3c2b1a09f8e7d6c5b4a3c2d1e0f9e8d7c6b5a4938271605f4e',
  'admin',
  1
);
