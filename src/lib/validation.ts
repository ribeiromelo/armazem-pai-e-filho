import { z } from 'zod';

/**
 * Valida se um ID é um número inteiro positivo
 * Retorna o ID como número ou null se inválido
 */
export function validateId(id: string | undefined): number | null {
  if (!id) return null;
  
  const parsed = parseInt(id, 10);
  if (isNaN(parsed) || parsed <= 0 || !Number.isInteger(parsed)) {
    return null;
  }
  
  return parsed;
}

/**
 * Schema Zod para validação de IDs
 */
export const idSchema = z.string().regex(/^\d+$/, 'ID deve ser um número inteiro positivo').transform(Number);

/**
 * Schema Zod para validação de datas no formato ISO ou YYYY-MM-DD
 */
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD');

/**
 * Schema Zod para validação de valores monetários (positivos)
 */
export const moneySchema = z.number().nonnegative('Valor deve ser positivo ou zero');

/**
 * Schema Zod para validação de permissões
 */
export const permissionSchema = z.enum(['view', 'edit', 'admin']);
