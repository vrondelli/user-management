export type ListQueryResponse<ResponseData, Key extends string> = {
  [key in Key]: ResponseData[];
} & {
  total: number;
  limit: number;
  offset: number;
};
