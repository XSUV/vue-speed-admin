import { http } from '@/utils/http';

interface Result {
  success: boolean;
  data: any[];
}

export const getAsyncRoutes = () => {
  return http.request<Result>('get', '/get-async-routes');
};
