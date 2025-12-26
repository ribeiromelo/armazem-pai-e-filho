-- Adicionar campo status na tabela fairs
ALTER TABLE fairs ADD COLUMN status TEXT DEFAULT 'open' CHECK(status IN ('open', 'finalized'));

-- Adicionar campos de resultado financeiro na tabela fairs
ALTER TABLE fairs ADD COLUMN total_revenue DECIMAL(10,2) DEFAULT 0;
ALTER TABLE fairs ADD COLUMN total_cost DECIMAL(10,2) DEFAULT 0;
ALTER TABLE fairs ADD COLUMN total_profit DECIMAL(10,2) DEFAULT 0;
ALTER TABLE fairs ADD COLUMN finalized_at DATETIME;

-- Adicionar campos de venda na tabela fair_items
ALTER TABLE fair_items ADD COLUMN quantity_returned INTEGER DEFAULT 0;
ALTER TABLE fair_items ADD COLUMN quantity_sold INTEGER DEFAULT 0;
ALTER TABLE fair_items ADD COLUMN unit_cost DECIMAL(10,2) DEFAULT 0;
ALTER TABLE fair_items ADD COLUMN total_revenue DECIMAL(10,2) DEFAULT 0;
ALTER TABLE fair_items ADD COLUMN total_cost DECIMAL(10,2) DEFAULT 0;
ALTER TABLE fair_items ADD COLUMN profit DECIMAL(10,2) DEFAULT 0;
