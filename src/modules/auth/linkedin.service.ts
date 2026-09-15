import axios from "axios";

import { env } from "../../config/env";

const LINKEDIN_AUTH_URL = "https://www.linkedin.com/oauth/authorization";

const LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/accessToken";

const LINKEDIN_USERINFO_URL = "https://api.linkedin.com/userinfo";

export const getLinkedInAuthUrl = (): string => {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: env.linkedinClientId,
    redirect_uri: env.linkedinCallbackUrl,
    scope: "openid profile email",
  });

  return `${LINKEDIN_AUTH_URL}?${params.toString()}`;
};

export const getLinkedInAccessToken = async (code: string): Promise<string> => {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: env.linkedinClientId,
    client_secret: env.linkedinClientSecret,
    redirect_uri: env.linkedinCallbackUrl,
  });

  const response = await axios.post(LINKEDIN_TOKEN_URL, params.toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data.access_token;
};

export interface LinkedInUserInfo {
  sub: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email?: string;
  email_verified?: boolean;
}

export const getLinkedInUserInfo = async (
  accessToken: string,
): Promise<LinkedInUserInfo> => {
  const response = await axios.get<LinkedInUserInfo>(LINKEDIN_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};
