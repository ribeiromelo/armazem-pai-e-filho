// Database Types
export interface User {
  id: number;
  name: string;
  username: string;
  password?: string;
  permission: 'view' | 'edit' | 'admin';
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: number;
  name: string;
  product_type: string;
  status: 'active' | 'settled';
  created_at: string;
  updated_at: string;
}

export interface WeeklySheet {
  id: number;
  supplier_id: number;
  date: string;
  double_checked: boolean;
  stock_merchandise?: string;
  credit_text?: string;
  credit_total: number;
  envelope_money: number;
  folder_total: number;
  observations?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  supplier?: Supplier;
}

export interface Fair {
  id: number;
  date: string;
  location: string;
  total_value: number;
  observations?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  items?: FairItem[];
}

export interface FairItem {
  id: number;
  fair_id: number;
  quantity: number;
  category: string;
  unit_value: number;
  total_value: number;
  created_at: string;
}

export interface Receipt {
  id: number;
  buyer_name: string;
  date: string;
  total_value: number;
  signature?: string;
  created_by: number;
  created_at: string;
  items?: ReceiptItem[];
}

export interface ReceiptItem {
  id: number;
  receipt_id: number;
  product_name: string;
  quantity: number;
  unit_value: number;
  total_value: number;
  created_at: string;
}

// Auth Types
export interface AuthPayload {
  userId: number;
  username: string;
  permission: string;
  isAdmin: boolean;
}

// Environment Bindings
export interface Bindings {
  DB: D1Database;
  JWT_SECRET?: string;
}