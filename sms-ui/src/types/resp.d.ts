type ApiResp<T> = {
  code: number;
  msg: string;
  data?: T;
};

type IdResp = {
  id: string;
};
