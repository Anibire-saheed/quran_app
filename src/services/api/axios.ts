import axios from 'axios';

// ─── Content-token readiness gate ────────────────────────────────────────────
// All requests through quranApi / quranSearchApi are held until setContentToken
// is called (or 5 s passes as a safety fallback), preventing 401s from the race
// between AuthProvider's token fetch and React Query's immediate first request.
let _contentTokenReady = false;
const _contentTokenWaiters: Array<() => void> = [];

function _waitForContentToken(): Promise<void> {
  if (_contentTokenReady) return Promise.resolve();
  return new Promise<void>((resolve) => _contentTokenWaiters.push(resolve));
}

export function notifyContentTokenReady() {
  _contentTokenReady = true;
  _contentTokenWaiters.splice(0).forEach((fn) => fn());
}

// ─── Quran Foundation V4 API Base URLs
const QURAN_FOUNDATION_API_URL = process.env.NEXT_PUBLIC_QF_CONTENT_BASE_URL || 'https://apis-prelive.quran.foundation/content/api/v4';
const QURAN_FOUNDATION_SEARCH_URL = process.env.NEXT_PUBLIC_QF_SEARCH_BASE_URL || 'https://apis-prelive.quran.foundation/search';
const QURAN_FOUNDATION_AUTH_URL = process.env.NEXT_PUBLIC_QF_AUTH_BASE_URL || 'https://apis-prelive.quran.foundation/user/api/v1';
const QURAN_FOUNDATION_REFLECT_URL = process.env.NEXT_PUBLIC_QF_REFLECT_BASE_URL || 'https://apis-prelive.quran.foundation/quran-reflect';
const QURAN_FOUNDATION_OAUTH_URL = process.env.NEXT_PUBLIC_QF_OAUTH_BASE_URL || 'https://prelive-oauth2.quran.foundation';

const CLIENT_ID = process.env.NEXT_PUBLIC_QF_CLIENT_ID;
const CONTENT_CLIENT_ID = process.env.NEXT_PUBLIC_QF_CONTENT_CLIENT_ID || CLIENT_ID;

// 1. Content API Instance (Requires Content Token)
export const quranApi = axios.create({
  baseURL: QURAN_FOUNDATION_API_URL,
  headers: {
    'Accept': 'application/json',
    'x-client-id': CONTENT_CLIENT_ID,
  }
});

// 2. Search API Instance (Requires Content Token)
export const quranSearchApi = axios.create({
  baseURL: QURAN_FOUNDATION_SEARCH_URL,
  headers: {
    'Accept': 'application/json',
    'x-client-id': CONTENT_CLIENT_ID,
  }
});

// Gate: hold requests until content token is set (max 5 s fallback)
const _contentGate = (config: any): Promise<typeof config> =>
  Promise.race([
    _waitForContentToken(),
    new Promise<void>((r) => setTimeout(r, 5000)),
  ]).then(() => config);

quranApi.interceptors.request.use(_contentGate);
quranSearchApi.interceptors.request.use(_contentGate);

// 3. User/Auth API Instance (Requires User Token)
export const quranAuthApi = axios.create({
  baseURL: QURAN_FOUNDATION_AUTH_URL,
  headers: {
    'Accept': 'application/json',
    'x-client-id': CLIENT_ID,
  }
});

// 4. Quran Reflect API Instance (Requires User Token)
export const quranReflectApi = axios.create({
  baseURL: QURAN_FOUNDATION_REFLECT_URL,
  headers: {
    'Accept': 'application/json',
    'x-client-id': CLIENT_ID,
  }
});

/**
 * Sets the Content API token (obtained via client_credentials)
 */
export const setContentToken = (token: string) => {
  if (token) {
    quranApi.defaults.headers.common['x-auth-token'] = token;
    quranSearchApi.defaults.headers.common['x-auth-token'] = token;
    // Also set Authorization header as fallback
    quranApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    quranSearchApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete quranApi.defaults.headers.common['x-auth-token'];
    delete quranSearchApi.defaults.headers.common['x-auth-token'];
    delete quranApi.defaults.headers.common['Authorization'];
    delete quranSearchApi.defaults.headers.common['Authorization'];
  }
};

/**
 * Sets the User API token (obtained via authorization_code)
 */
export const setAuthToken = (token: string) => {
  if (token) {
    quranAuthApi.defaults.headers.common['x-auth-token'] = token;
    quranReflectApi.defaults.headers.common['x-auth-token'] = token;
    // Also set Authorization header as fallback
    quranAuthApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    quranReflectApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete quranAuthApi.defaults.headers.common['x-auth-token'];
    delete quranReflectApi.defaults.headers.common['x-auth-token'];
    delete quranAuthApi.defaults.headers.common['Authorization'];
    delete quranReflectApi.defaults.headers.common['Authorization'];
  }
};
