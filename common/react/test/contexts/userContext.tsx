import { createAtomContext } from '../core/createAtomContext'

// 사용자 정보 타입
interface User {
  name: string
  age: number
  email: string
}

// 사용자 컨텍스트 생성
export const {
  Provider: UserProvider,
  useAtomState: useUser,
  useAtomReadOnly: useUserValue,
  useAtomSetter: useUserSetter,
} = createAtomContext<User>({
  name: 'John Doe',
  age: 25,
  email: 'john@example.com'
})