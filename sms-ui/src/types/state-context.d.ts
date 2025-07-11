type StateContextProps = {
  $toast: string | null;
  $msg: string | null;
  $isLoading: boolean;
  $setToast: (toast: string | null) => void;
  $setMsg: (msg: string | null) => void;
  $setIsLoading: (isLoading: boolean) => void;
  $adminJwtExpired: boolean;
  $setAdminJwtExpired: (expired: boolean) => void;
};
