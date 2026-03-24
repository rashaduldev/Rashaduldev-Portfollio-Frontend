export type ApiResponse<T> = {
  success: boolean;
  status: "success" | "error";
  message: string;
  payload: T | null;
  error?: string | null;
  statusCode?: number;
};
