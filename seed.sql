-- Criar usuário administrador padrão
-- Senha: admin123 (hash será gerado pelo sistema)
INSERT OR IGNORE INTO users (name, username, password, permission, is_admin) 
VALUES (
  'Administrador', 
  'admin',
  -- Temporário, será atualizado via API para bcrypt hash
  '$2a$10$YourHashHere',
  'admin',
  TRUE
);

-- Dados de exemplo para desenvolvimento
INSERT OR IGNORE INTO suppliers (name, product_type, status) VALUES 
  ('José Silva', 'Feijão', 'active'),
  ('Maria Santos', 'Milho', 'active'),
  ('João Oliveira', 'Arroz', 'settled');

-- Fichas de exemplo
INSERT OR IGNORE INTO weekly_sheets (
  supplier_id, 
  date, 
  double_checked, 
  stock_merchandise, 
  credit_text,
  credit_total,
  envelope_money,
  folder_total,
  observations,
  created_by
) VALUES 
  (1, '2024-11-10', TRUE, '50 sacas de feijão', 'R$2000 Francisco Croatá, R$500 José', 2500.00, 1000.00, 3500.00, 'Pagamento parcial recebido', 1),
  (2, '2024-11-10', FALSE, '30 sacas de milho', 'R$1500 Pedro Silva', 1500.00, 500.00, 2000.00, NULL, 1);

-- Feiras de exemplo
INSERT OR IGNORE INTO fairs (date, location, total_value, observations, created_by) VALUES
  ('2024-11-12', 'Feira Central', 5000.00, 'Boa venda', 1),
  ('2024-11-13', 'Feira do Produtor', 3500.00, NULL, 1);

-- Itens das feiras
INSERT OR IGNORE INTO fair_items (fair_id, quantity, category, unit_value, total_value) VALUES
  (1, 20, 'Feijão', 150.00, 3000.00),
  (1, 10, 'Milho', 200.00, 2000.00),
  (2, 15, 'Arroz', 233.33, 3500.00);