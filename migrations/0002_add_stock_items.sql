-- Tabela de itens de estoque das fichas
CREATE TABLE IF NOT EXISTS sheet_stock_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sheet_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  item_name TEXT NOT NULL,
  unit_value DECIMAL(10,2) NOT NULL,
  total_value DECIMAL(10,2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sheet_id) REFERENCES weekly_sheets(id) ON DELETE CASCADE
);

-- Adicionar coluna para total do estoque na tabela de fichas
ALTER TABLE weekly_sheets ADD COLUMN stock_total DECIMAL(10,2) DEFAULT 0;

-- Adicionar coluna para ajustes das observações
ALTER TABLE weekly_sheets ADD COLUMN observations_adjustment DECIMAL(10,2) DEFAULT 0;

-- Criar índice para busca rápida
CREATE INDEX IF NOT EXISTS idx_sheet_stock_items_sheet ON sheet_stock_items(sheet_id);