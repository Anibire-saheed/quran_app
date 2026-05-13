import axios from 'axios';

const authEndpoint = process.env.NEXT_PUBLIC_QF_OAUTH_BASE_URL || 'https://oauth2.quran.foundation';

/**
 * GET LOGOUT URL
 * Constructs the RP-initiated logout URL for OpenID Connect.
 * Required: id_token_hint (ID token from login response)
 * Optional: post_logout_redirect_uri (where to redirect after logout)
 */
export const getLogoutUrl = (idTokenHint: string, postLogoutRedirectUri?: string, state?: string) => {
  const url = new URL(`${authEndpoint}/oauth2/sessions/logout`);
  url.searchParams.append('id_token_hint', idTokenHint);
  
  if (postLogoutRedirectUri) {
    url.searchParams.append('post_logout_redirect_uri', postLogoutRedirectUri);
  }
  
  if (state) {
    url.searchParams.append('state', state);
  }
  
  return url.toString();
};

/**
 * INTROSPECT TOKEN
 * Checks if an access or refresh token is active.
 * Requires Basic Auth with Client ID and Secret.
 */
export const introspectToken = async (token: string, clientId: string, clientSecret: string) => {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  const { data } = await axios.post(
    `${authEndpoint}/oauth2/introspect`,
    new URLSearchParams({ token }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    }
  );
  
  return data;
};
