'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

let lastEnvMtimeMs = 0;

/**
 * Carrega variaveis do arquivo .env na raiz do projeto sem precisar de pacotes externos.
 * Recarrega automaticamente caso o arquivo .env seja salvo/editado.
 */
function loadEnv() {
  const candidates = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '../../.env')
  ];

  for (const envPath of candidates) {
    try {
      if (!fs.existsSync(envPath)) continue;
      const stat = fs.statSync(envPath);
      if (lastEnvMtimeMs && stat.mtimeMs === lastEnvMtimeMs) {
        return;
      }
      lastEnvMtimeMs = stat.mtimeMs;

      const raw = fs.readFileSync(envPath, 'utf8');
      const lines = raw.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx <= 0) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
      break;
    } catch (_err) {
      // Ignora erro de leitura caso o ambiente seja somente leitura
    }
  }
}

loadEnv();

function getAuthSecret() {
  loadEnv();
  return (
    process.env.AUTH_SECRET ||
    'rural_consultor_secret_key_2026_blindado_32chars_min'
  );
}

/**
 * Gera hash seguro de senha usando crypto.scryptSync.
 */
function hashPassword(password, customSalt) {
  const plain = String(password || '');
  const salt = customSalt || crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(plain, salt, 64).toString('hex');
  return `scrypt$${salt}$${derived}`;
}

/**
 * Verifica senha contra hash armazenado usando comparacao em tempo constante.
 */
function verifyPassword(password, storedHash) {
  if (!password || !storedHash || typeof storedHash !== 'string') {
    return false;
  }
  try {
    const plain = String(password);
    if (storedHash.startsWith('scrypt$')) {
      const parts = storedHash.split('$');
      if (parts.length !== 3) return false;
      const [, salt, originalHex] = parts;
      const derivedHex = crypto.scryptSync(plain, salt, 64).toString('hex');
      const bufA = Buffer.from(originalHex, 'hex');
      const bufB = Buffer.from(derivedHex, 'hex');
      if (bufA.length !== bufB.length) return false;
      return crypto.timingSafeEqual(bufA, bufB);
    }

    if (storedHash.startsWith('pbkdf2$')) {
      const parts = storedHash.split('$');
      if (parts.length !== 3) return false;
      const [, salt, originalHex] = parts;
      const derivedHex = crypto
        .pbkdf2Sync(plain, salt, 100000, 64, 'sha512')
        .toString('hex');
      const bufA = Buffer.from(originalHex, 'hex');
      const bufB = Buffer.from(derivedHex, 'hex');
      if (bufA.length !== bufB.length) return false;
      return crypto.timingSafeEqual(bufA, bufB);
    }

    // Fallback de comparacao segura caso exista hash legado
    const bufA = Buffer.from(storedHash, 'utf8');
    const bufB = Buffer.from(plain, 'utf8');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch (_err) {
    return false;
  }
}

function base64UrlEncode(strOrBuf) {
  const buf = Buffer.isBuffer(strOrBuf)
    ? strOrBuf
    : Buffer.from(String(strOrBuf), 'utf8');
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlDecode(str) {
  const normalized = String(str || '')
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const pad = normalized.length % 4;
  const padded = pad ? normalized + '='.repeat(4 - pad) : normalized;
  return Buffer.from(padded, 'base64').toString('utf8');
}

/**
 * Assina token de sessao com HMAC-SHA256 e validade padrao de 7 dias.
 */
function signSession(payload, maxAgeMs = 7 * 24 * 60 * 60 * 1000) {
  const now = Date.now();
  const data = {
    ...payload,
    iat: now,
    exp: now + maxAgeMs
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(data));
  const signature = crypto
    .createHmac('sha256', getAuthSecret())
    .update(encodedPayload)
    .digest();
  const encodedSig = base64UrlEncode(signature);
  return `${encodedPayload}.${encodedSig}`;
}

/**
 * Verifica assinatura e validade do token de sessao em tempo constante.
 */
function verifySession(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.trim().split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, encodedSig] = parts;
  if (!encodedPayload || !encodedSig) return null;

  try {
    const expectedSig = base64UrlEncode(
      crypto
        .createHmac('sha256', getAuthSecret())
        .update(encodedPayload)
        .digest()
    );

    const bufA = Buffer.from(encodedSig, 'utf8');
    const bufB = Buffer.from(expectedSig, 'utf8');
    if (bufA.length !== bufB.length) return null;
    if (!crypto.timingSafeEqual(bufA, bufB)) return null;

    const decodedJson = base64UrlDecode(encodedPayload);
    const payload = JSON.parse(decodedJson);
    if (!payload || typeof payload !== 'object') return null;
    if (typeof payload.exp === 'number' && Date.now() > payload.exp) {
      return null;
    }
    return payload;
  } catch (_err) {
    return null;
  }
}

/**
 * Extrai cookies do header Cookie.
 */
function parseCookies(cookieHeader) {
  const out = {};
  if (!cookieHeader || typeof cookieHeader !== 'string') return out;
  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const idx = pair.indexOf('=');
    if (idx <= 0) continue;
    const k = pair.slice(0, idx).trim();
    const v = pair.slice(idx + 1).trim();
    try {
      out[k] = decodeURIComponent(v);
    } catch (_e) {
      out[k] = v;
    }
  }
  return out;
}

/**
 * Le e valida a sessao a partir de Authorization Bearer, x-session-token ou cookie rr_session.
 */
function extractSessionFromReq(req) {
  if (!req || !req.headers) return null;

  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    const session = verifySession(token);
    if (session) return session;
  }

  const customHeader = req.headers['x-session-token'];
  if (typeof customHeader === 'string' && customHeader.trim()) {
    const session = verifySession(customHeader.trim());
    if (session) return session;
  }

  const cookies = parseCookies(req.headers.cookie);
  if (cookies.rr_session) {
    const session = verifySession(cookies.rr_session);
    if (session) return session;
  }

  if (req.query && typeof req.query.session_token === 'string') {
    const session = verifySession(req.query.session_token);
    if (session) return session;
  }

  return null;
}

function setSessionCookie(res, token, maxAgeSec = 7 * 24 * 60 * 60) {
  if (!res || typeof res.setHeader !== 'function') return;
  const cookieStr = `rr_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSec}`;
  res.setHeader('Set-Cookie', cookieStr);
}

function clearSessionCookie(res) {
  if (!res || typeof res.setHeader !== 'function') return;
  res.setHeader(
    'Set-Cookie',
    'rr_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
  );
}

/**
 * Rate Limiter em memoria por IP + Rota.
 */
const rateLimitStore = new Map();

function getClientIp(req) {
  if (!req || !req.headers) return '127.0.0.1';
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.trim()) {
    return xff.split(',')[0].trim();
  }
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) {
    return realIp.trim();
  }
  return (req.socket && req.socket.remoteAddress) || '127.0.0.1';
}

function checkRateLimit(ip, bucket = 'default', maxReq = 30, windowMs = 60000) {
  const now = Date.now();
  if (rateLimitStore.size > 5000) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (now > v.resetAt) rateLimitStore.delete(k);
    }
  }

  const key = `${bucket}:${ip || 'unknown'}`;
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return {
      allowed: true,
      remaining: Math.max(0, maxReq - 1),
      retryAfterSec: 0
    };
  }

  entry.count += 1;
  if (entry.count > maxReq) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000))
    };
  }

  return {
    allowed: true,
    remaining: Math.max(0, maxReq - entry.count),
    retryAfterSec: 0
  };
}

/**
 * Remove acentos para inspecao normalizada de palavras bloqueadas.
 */
function normalizeForInspection(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

const DEFAULT_BLOCK_REASON =
  'Mensagem bloqueada pelo escudo de seguranca: formato ou comando nao permitido. Envie apenas duvidas tecnicas sobre regularizacao rural.';

/**
 * Firewall Anti-Hack, Anti-Binario, Anti-SQLi/XSS e Anti-Prompt Injection para o Chat da IA.
 */
function validateAndSanitizeAiInput(rawText) {
  if (typeof rawText !== 'string') {
    return { ok: false, category: 'invalid_type', reason: DEFAULT_BLOCK_REASON };
  }

  // 1. Bloqueio imediato de bytes de controle nao imprimiveis (antes do trim para pegar null bytes)
  if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(rawText)) {
    return { ok: false, category: 'control_chars', reason: DEFAULT_BLOCK_REASON };
  }

  const trimmed = rawText.trim();
  if (trimmed.length === 0 || trimmed.length > 800) {
    return {
      ok: false,
      category: 'length_invalid',
      reason:
        trimmed.length > 800
          ? 'Mensagem bloqueada pelo escudo de seguranca: limite maximo de 800 caracteres excedido. Resuma o caso do seu cliente.'
          : DEFAULT_BLOCK_REASON
    };
  }

  // 2. Bloqueio de sequencias binarias, hexadecimais, URL-encoded massivo, Base64 longo ou excesso de simbolos de codigo
  const binaryPatterns = [
    /(?:[01]{8}\s*){3,}/, // 3 ou mais octetos binarios (ex: 01000001 01000010 01000011)
    /[01]{24,}/, // 24+ bits seguidos
    /(?:\\x[0-9a-fA-F]{2}){3,}/i, // Sequencia de bytes hexadecimais \x41\x42\x43
    /(?:0x[0-9a-fA-F]{2,}\s*){4,}/i, // Sequencia 0x41 0x42 0x43 0x44
    /(?:%[0-9a-fA-F]{2}){6,}/i, // URL encoding suspeito em cadeia
    /(?:\\u[0-9a-fA-F]{4}){4,}/i, // Unicode escape injection
    /\b[A-Za-z0-9+/]{64,}={0,2}\b/ // Bloco Base64 longo
  ];

  for (const pattern of binaryPatterns) {
    if (pattern.test(trimmed)) {
      return { ok: false, category: 'binary_or_hex', reason: DEFAULT_BLOCK_REASON };
    }
  }

  // Excesso de simbolos tipicos de codigo ({}[];<>)
  const codeSymbols = trimmed.match(/[{}\[\];<>\\`$]/g);
  if (codeSymbols && codeSymbols.length > 4) {
    return { ok: false, category: 'code_symbols', reason: DEFAULT_BLOCK_REASON };
  }

  // 3. Bloqueio de SQL Injection, XSS, Path Traversal e Command Injection
  const lowerRaw = trimmed.toLowerCase();
  const normalized = normalizeForInspection(trimmed);

  const injectionSignatures = [
    '<script',
    '</script',
    'javascript:',
    'vbscript:',
    'data:text/html',
    'onerror=',
    'onload=',
    'onclick=',
    'onmouseover=',
    'union select',
    'select * from',
    'drop table',
    'alter table',
    'insert into',
    'delete from',
    'truncate table',
    'pg_sleep',
    'waitfor delay',
    'information_schema',
    'xp_cmdshell',
    '../',
    '..\\',
    '/etc/passwd',
    '/etc/shadow',
    '__proto__',
    'constructor',
    'prototype',
    'child_process',
    'process.env',
    'document.cookie'
  ];

  for (const sig of injectionSignatures) {
    if (lowerRaw.includes(sig) || normalized.includes(sig)) {
      return { ok: false, category: 'sqli_xss_cmd', reason: DEFAULT_BLOCK_REASON };
    }
  }

  if (
    /('\s*or\s*'?\d+'?\s*=\s*'?\d+)/i.test(trimmed) ||
    /;\s*--/.test(trimmed) ||
    /<\s*[a-z!/?][^>]*>/i.test(trimmed)
  ) {
    return { ok: false, category: 'sqli_xss_regex', reason: DEFAULT_BLOCK_REASON };
  }

  // 4. Bloqueio de Prompt Injection, Jailbreak e Extracao de Segredos
  const promptInjectionPhrases = [
    'ignore previous instructions',
    'ignore all instructions',
    'disregard previous',
    'forget previous instructions',
    'ignore todas as instrucoes',
    'ignore as instrucoes',
    'ignore as regras',
    'esquece as regras',
    'desconsidere as instrucoes',
    'system prompt',
    'seu prompt',
    'prompt de sistema',
    'instrucoes internas',
    'modo desenvolvedor',
    'developer mode',
    'jailbreak',
    'do anything now',
    'revele a senha',
    'qual a senha do admin',
    'banco de dados',
    'variaveis de ambiente',
    '.env',
    'api_key',
    'apikey',
    'service_role',
    'auth_secret',
    'webhook_secret',
    'mostre o codigo',
    'codigo fonte',
    'source code'
  ];

  for (const phrase of promptInjectionPhrases) {
    if (normalized.includes(phrase)) {
      return { ok: false, category: 'prompt_injection', reason: DEFAULT_BLOCK_REASON };
    }
  }

  // Checagem isolada para sigla DAN (Jailbreak "DAN")
  if (/\bdan\b/.test(normalized) && (normalized.includes('modo') || normalized.includes('mode') || normalized.includes('act as') || normalized.includes('agora voce'))) {
    return { ok: false, category: 'jailbreak_dan', reason: DEFAULT_BLOCK_REASON };
  }
  if (/\bDAN\b/.test(trimmed)) {
    return { ok: false, category: 'jailbreak_dan', reason: DEFAULT_BLOCK_REASON };
  }

  // Sanitiza espacos multiplos e neutraliza caracteres especiais residuais
  const cleanText = trimmed
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return { ok: true, cleanText };
}

/**
 * Aplica headers de seguranca padrao em respostas HTTP/Serverless.
 */
function applySecurityHeaders(res) {
  if (!res || typeof res.setHeader !== 'function') return;
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
}

/**
 * Envia JSON padronizado garantindo ausencia de travessoes acidentais.
 */
function sendJson(res, statusCode, payload) {
  applySecurityHeaders(res);
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const bodyStr = JSON.stringify(payload);
  res.end(bodyStr);
}

/**
 * Faz parse seguro do body JSON tanto na Vercel quanto no servidor HTTP nativo.
 */
function parseRequestBody(req, maxBytes = 102400) {
  return new Promise((resolve, reject) => {
    if (!req) return resolve({});
    if (req.body !== undefined && req.body !== null) {
      if (typeof req.body === 'object') return resolve(req.body);
      if (typeof req.body === 'string') {
        try {
          return resolve(req.body.trim() ? JSON.parse(req.body) : {});
        } catch (_e) {
          return resolve({ raw: req.body });
        }
      }
    }

    let raw = '';
    let bytes = 0;
    req.on('data', (chunk) => {
      bytes += chunk.length;
      if (bytes > maxBytes) {
        reject(new Error('Payload excede o limite de seguranca permitido.'));
        return;
      }
      raw += chunk.toString('utf8');
    });
    req.on('end', () => {
      if (!raw || !raw.trim()) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (_err) {
        // Suporta form-urlencoded caso algum gateway envie nesse formato
        try {
          const params = new URLSearchParams(raw);
          const obj = {};
          for (const [k, v] of params.entries()) {
            obj[k] = v;
          }
          resolve(obj);
        } catch (_err2) {
          resolve({ raw });
        }
      }
    });
    req.on('error', (err) => reject(err));
  });
}

module.exports = {
  loadEnv,
  getAuthSecret,
  hashPassword,
  verifyPassword,
  signSession,
  verifySession,
  parseCookies,
  extractSessionFromReq,
  setSessionCookie,
  clearSessionCookie,
  getClientIp,
  checkRateLimit,
  validateAndSanitizeAiInput,
  applySecurityHeaders,
  sendJson,
  parseRequestBody
};
