# Action Register Example

이 예제는 모듈화된 Action Register 시스템의 사용법을 보여줍니다.

## 주요 특징

### 1. 타입 안전성
- TypeScript를 통한 완전한 타입 추론
- 컴파일 타임에 잘못된 액션 이름이나 payload 감지
- IDE 자동완성 지원

### 2. 모듈화된 구조
```
actionRegister/
├── core/                 # 핵심 ActionRegister 클래스
│   ├── ActionRegister.ts
│   ├── types.ts
│   └── index.ts
├── react/               # React 통합
│   ├── ActionContext.tsx
│   ├── hooks.ts
│   └── index.ts
├── actions/             # 액션 타입 정의
│   ├── user.ts
│   ├── ui.ts
│   ├── data.ts
│   └── index.ts
└── index.ts
```

### 3. 파이프라인 시스템
- 우선순위 기반 핸들러 실행
- 블로킹/논블로킹 핸들러 지원
- Payload 변경 및 파이프라인 제어

### 4. React 통합
- Context API를 통한 전역 상태 관리
- Custom hooks로 간편한 사용
- 자동 cleanup과 메모리 누수 방지

## 사용 예시

### 기본 설정
```tsx
import { ActionProvider } from '../common/react/actionRegister';

function App() {
  return (
    <ActionProvider>
      <YourComponents />
    </ActionProvider>
  );
}
```

### 액션 핸들러 등록
```tsx
import { useActionHandler } from '../common/react/actionRegister';

function LoginComponent() {
  useActionHandler('user/login', async (payload, controller) => {
    // 입력 검증
    if (!payload.email) {
      controller.abort('이메일이 필요합니다');
      return;
    }
    
    // Payload 변경
    controller.modifyPayload(p => ({
      ...p,
      email: p.email.toLowerCase()
    }));
    
    // 비동기 작업
    await loginAPI(payload);
  }, { priority: 10, blocking: true });
}
```

### 액션 디스패치
```tsx
import { useAction } from '../common/react/actionRegister';

function Component() {
  const action = useAction();
  
  const handleLogin = () => {
    action.dispatch('user/login', {
      email: 'user@example.com',
      password: 'password123'
    });
  };
}
```

## 예제 컴포넌트 설명

### LoginComponent
- 사용자 로그인 프로세스 시연
- 입력 검증 및 payload 변경
- 비동기 작업과 에러 처리
- Toast 메시지 연동

### ToastComponent
- UI 피드백 시스템
- 다양한 메시지 타입 지원
- 자동 사라짐 기능

### DataFetchComponent
- 데이터 페칭 워크플로우
- 로딩 상태 관리
- API 호출 시뮬레이션

## 확장 방법

### 새로운 액션 타입 추가
1. `actions/` 폴더에 새 파일 생성
2. 액션 인터페이스 정의
3. `actions/index.ts`에서 통합

### 새로운 도메인 추가
```typescript
// actions/notification.ts
export interface NotificationActionPayloadMap {
  'notification/send': {
    userId: string;
    message: string;
    type: 'push' | 'email' | 'sms';
  };
}

// actions/index.ts
export interface AppActionPayloadMap extends 
  // ... 기존 타입들
  NotificationActionPayloadMap {}
```

이 예제를 통해 Action Register 시스템의 강력한 타입 안전성과 확장성을 경험해보세요.