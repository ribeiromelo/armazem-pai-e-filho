import { User, AuthPayload } from '../types';

// PBKDF2 para hash de senha seguro (compatível com Cloudflare Workers)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  
  // Gerar salt aleatório de 16 bytes
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  // Importar senha como chave
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordData,
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  // Derivar hash usando PBKDF2 com 100.000 iterações
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256 // 32 bytes
  );
  
  const hashArray = Array.from(new Uint8Array(derivedBits));
  const saltArray = Array.from(salt);
  
  // Combinar salt + hash em formato: salt(hex):hash(hex)
  const saltHex = saltArray.map(b => b.toString(16).padStart(2, '0')).join('');
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const [saltHex, hashHex] = storedHash.split(':');
    
    // Converter salt de hex para bytes
    const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
    
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);
    
    // Importar senha como chave
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordData,
      'PBKDF2',
      false,
      ['deriveBits']
    );
    
    // Derivar hash com o mesmo salt
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );
    
    const hashArray = Array.from(new Uint8Array(derivedBits));
    const computedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return computedHash === hashHex;
  } catch (error) {
    return false;
  }
}

// JWT Secret (deve ser configurado via variável de ambiente)
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';

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

// HMAC-SHA256 para assinatura JWT usando Web Crypto API
async function signJWT(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(JWT_SECRET);
  const dataToSign = encoder.encode(data);
  
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, dataToSign);
  const hashArray = Array.from(new Uint8Array(signature));
  return base64url(hashArray.map(b => b.toString(16).padStart(2, '0')).join(''));
}

export async function generateToken(user: User): Promise<string> {
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
  
  // Assinatura HMAC segura
  const signature = await signJWT(headerB64 + '.' + payloadB64);
  
  return `${headerB64}.${payloadB64}.${signature}`;
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const [headerB64, payloadB64, signature] = token.split('.');
    
    // Verificar assinatura HMAC
    const expectedSignature = await signJWT(headerB64 + '.' + payloadB64);
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