// 데이터 관련 액션 정의
export interface DataActionPayloadMap {
  'data/fetch': {
    endpoint: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    params?: Record<string, any>;
    headers?: Record<string, string>;
  };
  'data/cache-invalidate': {
    keys: string[];
  };
  'data/batch-update': {
    updates: Array<{
      id: string;
      changes: Record<string, any>;
    }>;
  };
  'data/sync': {
    source: string;
    options?: {
      force?: boolean;
      timeout?: number;
    };
  };
}