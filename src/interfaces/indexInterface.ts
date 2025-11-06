export interface Response {
  status: number;
  result: {
    status: number;
    message: string;
    data?: Record<string, any>;
  };
}
