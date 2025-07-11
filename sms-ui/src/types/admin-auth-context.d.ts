type AdminAuthContextProps = {
  $token: string | null;
  $setToken: (token: string) => void;
  $exp: number;
  $setExp: (exp: number) => void;
  $isExpired: () => boolean;
  $setAuth: (auth: AdminAuth) => void;
  $removeAuth: () => void;
  $auth?: AdminAuth | null;
};
