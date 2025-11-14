import { User, AuthPayload } from '../types';

// Usar Web Crypto API para hash de senha (compatível com Cloudflare Workers)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// JWT simples para Cloudflare Workers
function base64url(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function base64urlDecode(str: string): string {
  str += '==='.slice(0, [0, 3, 2, 1][str.length % 4]);
  return atob(str.replace(/-/g, '+').replace(/_/g, '/'));
}

export function generateToken(user: User): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload: AuthPayload & { exp: number } = {
    userId: user.id,
    username: user.username,
    permission: user.permission,
    isAdmin: user.is_admin,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
  };
  
  const headerB64 = base64url(JSON.stringify(header));
  const payloadB64 = base64url(JSON.stringify(payload));
  
  // Criar assinatura simples (em produção, usar uma biblioteca JWT adequada)
  const signature = base64url(headerB64 + '.' + payloadB64 + '.secret');
  
  return `${headerB64}.${payloadB64}.${signature}`;
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    const [headerB64, payloadB64, signature] = token.split('.');
    
    // Verificar assinatura simples
    const expectedSignature = base64url(headerB64 + '.' + payloadB64 + '.secret');
    if (signature !== expectedSignature) {
      return null;
    }
    
    const payload = JSON.parse(base64urlDecode(payloadB64));
    
    // Verificar expiração
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return {
      userId: payload.userId,
      username: payload.username,
      permission: payload.permission,
      isAdmin: payload.isAdmin
    };
  } catch (error) {
    return null;
  }
}

export function extractToken(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}