import { Hono } from 'hono';
import { z } from 'zod';
import { verifyPassword, generateToken, hashPassword } from '../lib/auth';
import { Bindings } from '../types';

const authRoutes = new Hono<{ Bindings: Bindings }>();

// Schema de validação para login
const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

// Rota de login
authRoutes.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const { username, password } = loginSchema.parse(body);
    
    // Buscar usuário no banco
    const user = await c.env.DB.prepare(
      'SELECT * FROM users WHERE username = ?'
    ).bind(username).first();
    
    if (!user) {
      return c.json({ error: 'Usuário ou senha inválidos' }, 401);
    }
    
    // Verificar senha
    const validPassword = await verifyPassword(password, user.password as string);
    
    if (!validPassword) {
      return c.json({ error: 'Usuário ou senha inválidos' }, 401);
    }
    
    // Gerar token
    const token = await generateToken(user as any);
    
    // Remover senha do objeto de resposta
    const { password: _, ...userWithoutPassword } = user;
    
    return c.json({
      success: true,
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Dados inválidos', details: error.errors }, 400);
    }
    return c.json({ error: 'Erro ao fazer login' }, 500);
  }
});

export default authRoutes;