// 사용자 관련 액션 정의
export interface UserActionPayloadMap {
  'user/login': {
    email: string;
    password: string;
    rememberMe?: boolean;
  };
  'user/logout': void;
  'user/update-profile': {
    userId: string;
    data: Partial<{
      name: string;
      email: string;
      avatar: string;
      bio: string;
    }>;
  };
  'user/change-password': {
    currentPassword: string;
    newPassword: string;
  };
  'user/verify-email': {
    token: string;
  };
}