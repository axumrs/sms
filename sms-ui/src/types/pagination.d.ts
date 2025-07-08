type Pagination<T> = {
  total: number;
  page_total: number;
  page: number;
  page_size: number;
  data: T[];
};
