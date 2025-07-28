import { createAtomContext } from '../core/createAtomContext'

// 간편하게 카운터 컨텍스트 생성
export const {
  Provider: CounterProvider,
  useAtomState: useCounter,
  useAtomReadOnly: useCounterValue,
  useAtomSetter: useCounterSetter,
} = createAtomContext(0)