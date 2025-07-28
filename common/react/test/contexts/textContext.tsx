import { createAtomContext } from '../core/createAtomContext'

// 텍스트 컨텍스트 생성
export const {
  Provider: TextProvider,
  useAtomState: useText,
  useAtomReadOnly: useTextValue,
  useAtomSetter: useTextSetter,
} = createAtomContext<string>('Hello Jotai!')