const _fetch = <T>(url: string, init?: RequestInit) => {
  const fullUrl = `${import.meta.env.VITE_API_URL}${url}`;

  return fetch(fullUrl, {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: init?.body ? JSON.stringify(init?.body) : undefined,
  })
    .then((res) => res.json())
    .then((res) => res as ApiResp<T>);
};

const $post = <T>(url: string, body: any) =>
  _fetch<T>(url, { body, method: "POST" });

export { $post };
