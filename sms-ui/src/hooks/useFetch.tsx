import qs from "qs";
export default function useFetch<T>(
  ctx: StateContextProps,
  extOpts?: {
    noLoading?: boolean;
    $auth?: AdminAuth;
  }
) {
  const noLoading = extOpts?.noLoading || false;
  const { $setIsLoading, $setToast, $setAdminJwtExpired } = ctx;
  const { token: $token } = (extOpts?.$auth || {}) as AdminAuth;
  const authorization = $token ? `Bearer ${$token}` : "";

  const _fetch = <T,>(url: string, init?: FetchProps) => {
    const fullUrl = `${import.meta.env.VITE_API_URL}${url}`;

    return fetch(fullUrl, {
      ...init,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: authorization,
      },
      body: init?.body ? JSON.stringify(init?.body) : undefined,
    })
      .then((res) => res.json())
      .then((res) => res as ApiResp<T>);
  };

  const $fetch = async (url: string, init?: FetchProps) => {
    if (!noLoading) {
      $setIsLoading(true);
    }
    try {
      const res = await _fetch<T>(url, {
        ...init,
      });
      if (res.code !== 0) {
        if (res.msg.startsWith("JWT:")) {
          // 重新登录
          $setAdminJwtExpired(true);
          throw new Error(res.msg.replace("JWT:", ""));
        }
        throw new Error(res.msg);
      }
      return res.data;
    } catch (error) {
      let err = error || "请检查网络";
      if (error instanceof Error) {
        err = error.message;
      }
      $setToast(`${err}`);
    } finally {
      if (!noLoading) {
        $setIsLoading(false);
      }
    }
  };

  const $get = async (url: string, params?: Record<string, any>) => {
    console.log(params);
    const fullUrl = params ? `${url}?${qs.stringify(params)}` : url;
    return $fetch(fullUrl, { method: "GET" });
  };
  const $post = async (url: string, body?: any) => {
    return $fetch(url, { method: "POST", body });
  };

  const $put = async (url: string, body?: any) => {
    return $fetch(url, { method: "PUT", body });
  };

  const $delete = async (url: string) => {
    return $fetch(url, { method: "DELETE" });
  };

  const $patch = async (url: string, body?: any) => {
    return $fetch(url, { method: "PATCH", body });
  };

  return { $get, $post, $put, $delete, $patch };
}
