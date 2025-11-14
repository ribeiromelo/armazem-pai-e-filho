-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  permission TEXT NOT NULL CHECK(permission IN ('view', 'edit', 'admin')),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de fornecedores
CREATE TABLE IF NOT EXISTS suppliers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  product_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('active', 'settled')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de fichas semanais
CREATE TABLE IF NOT EXISTS weekly_sheets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_id INTEGER NOT NULL,
  date DATE NOT NULL,
  double_checked BOOLEAN DEFAULT FALSE,
  stock_merchandise TEXT,
  credit_text TEXT,
  credit_total DECIMAL(10,2) DEFAULT 0,
  envelope_money DECIMAL(10,2) DEFAULT 0,
  folder_total DECIMAL(10,2) DEFAULT 0,
  observations TEXT,
  created_by INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Tabela de feiras
CREATE TABLE IF NOT EXISTS fairs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  total_value DECIMAL(10,2) DEFAULT 0,
  observations TEXT,
  created_by INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Tabela de itens das feiras
CREATE TABLE IF NOT EXISTS fair_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fair_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  category TEXT NOT NULL,
  unit_value DECIMAL(10,2) NOT NULL,
  total_value DECIMAL(10,2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fair_id) REFERENCES fairs(id) ON DELETE CASCADE
);

-- Tabela de recibos
CREATE TABLE IF NOT EXISTS receipts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  buyer_name TEXT NOT NULL,
  date DATE NOT NULL,
  total_value DECIMAL(10,2) NOT NULL,
  signature TEXT,
  created_by INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Tabela de itens dos recibos
CREATE TABLE IF NOT EXISTS receipt_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  receipt_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_value DECIMAL(10,2) NOT NULL,
  total_value DECIMAL(10,2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);
CREATE INDEX IF NOT EXISTS idx_weekly_sheets_supplier ON weekly_sheets(supplier_id);
CREATE INDEX IF NOT EXISTS idx_weekly_sheets_date ON weekly_sheets(date);
CREATE INDEX IF NOT EXISTS idx_fairs_date ON fairs(date);
CREATE INDEX IF NOT EXISTS idx_receipts_date ON receipts(date);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);