import { Context, Next } from 'hono';
import { verifyToken, extractToken } from '../lib/auth';
import { Bindings, AuthPayload } from '../types';

export async function authMiddleware(c: Context<{ Bindings: Bindings }>, next: Next) {
  const token = extractToken(c.req.header('Authorization'));
  
  if (!token) {
    return c.json({ error: 'Token não fornecido' }, 401);
  }
  
  const payload = verifyToken(token);
  
  if (!payload) {
    return c.json({ error: 'Token inválido' }, 401);
  }
  
  // Adicionar informações do usuário ao contexto
  c.set('user', payload);
  
  await next();
}

export async function adminMiddleware(c: Context<{ Bindings: Bindings }>, next: Next) {
  const user = c.get('user') as AuthPayload;
  
  if (!user || user.permission !== 'admin') {
    return c.json({ error: 'Acesso negado. Apenas administradores.' }, 403);
  }
  
  await next();
}