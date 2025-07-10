type Pagination<T> = {
  data: T[];
} & PaginationMeta;

type PaginationMeta = {
  total: number;
  page_total: number;
  page: number;
  page_size: number;
};
