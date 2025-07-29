# Action Register Example

이 예제는 **Pure View + View Animation Data + View Action 모듈화** 구조를 적용한 Action Register 시스템을 보여줍니다.

## 📁 모듈화 구조

### 🎯 순수 뷰 분리 아키텍처
```
example/
├── ModularizedExample.tsx        # 메인 애플리케이션
├── contexts/                     # createActionContext를 활용한 컨텍스트
│   ├── AnimationContext.tsx      # 애니메이션 데이터 & 액션 관리
│   └── ViewActionContext.tsx     # 뷰 액션 & 상태 관리
├── components/                   # 컴포넌트 계층
│   ├── pure/                     # 순수 뷰 컴포넌트
│   │   ├── StatusIndicator.tsx   # 상태 표시 (애니메이션 분리)
│   │   ├── ActionDashboard.tsx   # 대시보드 (로직 분리)
│   │   ├── Toast.tsx             # 토스트 (애니메이션 분리)
│   │   └── Modal.tsx             # 모달 (상태 분리)
│   ├── UserActionsComponent.tsx  # 사용자 비즈니스 로직
│   ├── UIActionsComponent.tsx    # UI 비즈니스 로직
│   └── DashboardComponent.tsx    # 대시보드 비즈니스 로직
├── modules/                      # 비즈니스 로직 모듈
│   ├── UserActionModule.tsx      # 사용자 액션 로직
│   └── UIActionModule.tsx        # UI 액션 로직
└── actions/                      # 액션 타입 정의
    ├── extended.ts               # 확장 액션 타입
    └── ...
```

## 🏗️ 핵심 모듈화 원칙

### 1. Pure View Components
- **책임**: 오직 UI 렌더링만 담당
- **특징**: 상태 관리 로직, 비즈니스 로직 완전 분리
- **예시**: `StatusIndicator`, `Toast`, `Modal`

### 2. View Animation Hooks (createActionContext)
- **책임**: 애니메이션 상태 관리 및 액션 처리 (hooks 기반)
- **구조**: `AnimationContext.tsx`에서 hooks로 애니메이션 로직 관리
- **특징**: Provider 없이 hooks만으로 애니메이션 시스템 구축

### 3. View Action Hooks (createActionContext)
- **책임**: 뷰 상태 관리 및 로깅 시스템 (hooks 기반)
- **구조**: `ViewActionContext.tsx`에서 hooks로 상태와 액션 분리
- **특징**: Context 없이 hooks만으로 상태 관리와 액션 디스패치

### 4. Business Logic Modules
- **책임**: 도메인별 비즈니스 로직 처리
- **구조**: `UserActionModule`, `UIActionModule`
- **특징**: 액션 핸들러와 상태 관리 로직 캡슐화

## 🔧 Hooks 기반 사용법

### 1. View State 관리 (통합된 hook)
```tsx
import { useViewState } from '../contexts/ViewActionContext';

function MyComponent() {
  // hooks로 상태와 액션 핸들러 자동 설정
  const viewState = useViewState();
  
  // 상태 사용
  const logs = viewState.state.logs;
  const status = viewState.actions.getComponentStatus('my-component');
  
  return <div>{/* UI */}</div>;
}
```

### 2. View Actions 디스패치
```tsx
import { useViewActions } from '../contexts/ViewActionContext';

function ActionButton() {
  const viewActions = useViewActions();
  
  const handleClick = () => {
    viewActions.addLog({
      action: 'button-click',
      type: 'user',
      status: 'success',
      message: '버튼 클릭됨'
    });
  };
  
  return <button onClick={handleClick}>Click</button>;
}
```

### 3. 애니메이션 관리
```tsx
import { useAnimationState, useAnimationHandlers, useAnimationAction } from '../contexts/AnimationContext';

function AnimatedComponent() {
  const { actions } = useAnimationState();
  const animationAction = useAnimationAction();
  
  // 애니메이션 핸들러 설정 (앱 레벨에서 한 번만)
  // useAnimationHandlers();
  
  // 애니메이션 값 생성
  const fadeAnim = actions.createFadeAnim('my-fade');
  
  // 애니메이션 실행
  const startAnimation = () => {
    animationAction.dispatch('animation/fade', {
      id: 'my-fade',
      toValue: 1,
      duration: 300
    });
  };
  
  return <Animated.View style={{ opacity: fadeAnim }} />;
}
```

## 🏗️ 아키텍처 특징

### 완전한 Hooks 기반 아키텍처
- **Context 제거**: Provider/Consumer 패턴 대신 hooks만 사용
- **독립적 상태**: 각 컴포넌트가 필요한 상태만 hooks로 관리
- **createActionContext**: 타입 안전한 액션 시스템만 활용
- **자동 핸들러**: hook 내부에서 핸들러 자동 등록으로 설정 단순화

### 관심사 분리 원칙
- **Pure View**: UI 렌더링만 담당, 로직 완전 분리
- **Hooks State**: 컴포넌트별 독립적인 상태 관리
- **Action Handlers**: 중앙화된 액션 처리 로직
- **Business Logic**: 도메인별 비즈니스 로직 모듈화

## 🚀 사용법

### 기본 설정 (Provider 최소화)
```tsx
import { createActionContext } from '../common/react/actionRegister/react/ActionContext';
import { useAnimationHandlers, useViewState } from './contexts';

const { Provider } = createActionContext<ExtendedActionPayloadMap>();

function App() {
  const viewState = useViewState(); // 핸들러 자동 설정됨
  
  // 애니메이션 핸들러만 별도 설정
  useAnimationHandlers();

  return (
    <Provider>
      <YourComponents />
    </Provider>
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