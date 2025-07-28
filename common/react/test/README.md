# Jotai Test Suite

React Native 환경에서 Jotai 상태 관리 라이브러리를 테스트하고 데모하는 종합 테스트 모음입니다.

## 📁 디렉토리 구조

```
test/
├── core/           # 핵심 유틸리티
├── contexts/       # 컨텍스트 정의
├── components/     # UI 컴포넌트
├── demos/          # 데모 페이지
└── tests/          # 테스트 위젯
```

## 🎯 주요 기능

### createAtomContext 패턴
간편한 Jotai Context 생성을 위한 헬퍼 함수입니다.

```typescript
// 기존 방식 (25줄)
const CounterContext = createContext(...)
export const CounterProvider = ({ children }) => { ... }
export const useCounter = () => { ... }

// 새 방식 (1줄)
export const {
  Provider: CounterProvider,
  useAtomState: useCounter,
  useAtomReadOnly: useCounterValue,
  useAtomSetter: useCounterSetter,
} = createAtomContext(0)
```

## 📦 핵심 모듈

### Core (`/core/`)
- `createAtomContext.tsx` - Jotai Context 생성 헬퍼
- `useCounterViewModel.ts` - 카운터 비즈니스 로직

### Contexts (`/contexts/`)
- `counterContext.tsx` - 숫자 타입 컨텍스트
- `userContext.tsx` - 객체 타입 컨텍스트
- `themeContext.tsx` - 유니온 타입 컨텍스트
- `textContext.tsx` - 문자열 타입 컨텍스트

### Components (`/components/`)
- `Widget.tsx` - 메인 카운터 위젯
- `*Display.tsx` - 상태 표시 컴포넌트들
- `*Controller.tsx` - 상태 조작 컴포넌트들

### Demos (`/demos/`)
- `jotai-demo.tsx` - React Native 데모 페이지
- `page.tsx` - 웹 데모 페이지
- `demo-sections/` - 재사용 가능한 데모 섹션들

### Tests (`/tests/`)
- `comprehensive-test.tsx` - 종합 테스트 도구
- `AllContextTestWidget.tsx` - 전체 컨텍스트 테스트
- `MiniTestWidget.tsx` - 개별 컨텍스트 테스트
- `context-test.tsx` - 컨텍스트 단위 테스트

## 🚀 사용법

### 기본 import
```typescript
import { createAtomContext } from './core'
import { CounterProvider, useCounter } from './contexts'
import { Widget, CounterDisplay } from './components'
```

### 모든 것을 한 번에 import
```typescript
import { 
  createAtomContext,
  CounterProvider, 
  Widget,
  JotaiDemo 
} from './test'
```

## 🧪 테스트 페이지들

1. **종합 테스트 뷰어** (`/comprehensive-test`)
   - 전체, 개별, 시나리오 테스트 모드
   - 가장 포괄적인 테스트 도구

2. **전체 Context 테스트** (`/context-test`)
   - 모든 Context 타입 동시 표시
   - AllContextTestWidget 사용

3. **Jotai 데모 페이지** (`/jotai-demo`)
   - React Native용 스크롤 가능한 데모
   - 패턴 설명과 함께 제공

4. **기본 Jotai 테스트** (`/jotai-test`)
   - 기본 카운터 위젯 테스트
   - 독립 상태 확인

## ✨ createAtomContext 패턴 장점

- ✅ **한 줄 선언**: 복잡한 보일러플레이트 제거
- 🔒 **타입 안전성**: TypeScript 자동 추론
- 🎣 **자동 훅 생성**: useAtomState, useAtomReadOnly, useAtomSetter
- 🔄 **재사용성**: 모든 타입에서 동일한 패턴 사용
- 🏗️ **격리**: 각 Provider마다 독립적인 상태 관리

## 🔧 개발 가이드

새로운 Context 추가:
1. `contexts/` 디렉토리에 새 파일 생성
2. `createAtomContext(initialValue)` 사용
3. `contexts/index.ts`에 export 추가
4. 대응하는 Display/Controller 컴포넌트 생성

테스트 추가:
1. `tests/` 디렉토리에 테스트 파일 생성
2. `MiniTestWidget`을 사용하여 개별 테스트
3. `AllContextTestWidget`에 통합 테스트 추가