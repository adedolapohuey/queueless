export type Response = {
  status: number;
  result: {
    status: number;
    message: string;
    data?: Record<string, any>;
    errors?: Record<string, string>;
  };
};

export interface queryInterface {
  query: string;
  page: number;
  perPage: number;
}
