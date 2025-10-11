import {
  createKindeServerClient,
  GrantType,
  type SessionManager,
  type UserType,
} from '@kinde-oss/kinde-typescript-sdk';
import { type Context } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { createFactory, createMiddleware } from 'hono/factory';

// デバッグ用: 環境変数の確認
console.log('=== Kinde Environment Variables ===');
console.log('KINDE_ISSUER_URL:', process.env.KINDE_ISSUER_URL);
console.log('KINDE_CLIENT_ID:', process.env.KINDE_CLIENT_ID);
console.log(
  'KINDE_CLIENT_SECRET:',
  process.env.KINDE_CLIENT_SECRET ? '***存在する***' : '***undefined***'
);
console.log('KINDE_REDIRECT_URI:', process.env.KINDE_REDIRECT_URI);
console.log('KINDE_LOGOUT_REDIRECT_URI:', process.env.KINDE_LOGOUT_REDIRECT_URI);
console.log('===================================');

// 環境変数が存在しない場合のエラー処理
if (!process.env.KINDE_ISSUER_URL) {
  throw new Error('KINDE_ISSUER_URL is not defined in environment variables');
}
if (!process.env.KINDE_CLIENT_ID) {
  throw new Error('KINDE_CLIENT_ID is not defined in environment variables');
}
if (!process.env.KINDE_CLIENT_SECRET) {
  throw new Error('KINDE_CLIENT_SECRET is not defined in environment variables');
}
if (!process.env.KINDE_REDIRECT_URI) {
  throw new Error('KINDE_REDIRECT_URI is not defined in environment variables');
}

// Client for authorization code flow
export const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
  authDomain: process.env.KINDE_ISSUER_URL!,
  clientId: process.env.KINDE_CLIENT_ID!,
  clientSecret: process.env.KINDE_CLIENT_SECRET!,
  redirectURL: process.env.KINDE_REDIRECT_URI!,
  logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URI!,
});

let store: Record<string, unknown> = {};

export const sessionManager = (c: Context): SessionManager => ({
  async getSessionItem(key: string) {
    const result = getCookie(c, key);
    return result;
  },
  async setSessionItem(key: string, value: unknown) {
    const cookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    } as const;
    if (typeof value === 'string') {
      setCookie(c, key, value, cookieOptions);
    } else {
      setCookie(c, key, JSON.stringify(value), cookieOptions);
    }
  },
  async removeSessionItem(key: string) {
    deleteCookie(c, key);
  },
  async destroySession() {
    ['id_token', 'access_token', 'user', 'refresh_token'].forEach(key => {
      deleteCookie(c, key);
    });
  },
});

type Env = {
  Variables: {
    user: UserType;
  };
};

export const getUser = createMiddleware<Env>(async (c, next) => {
  try {
    const manager = sessionManager(c);
    const isAuthenticated = await kindeClient.isAuthenticated(manager);

    if (!isAuthenticated) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const user = await kindeClient.getUser(manager);
    c.set('user', user);
    await next();
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Unauthorized' }, 401);
  }
});
