import { atom, PrimitiveAtom } from 'jotai'
import React, { createContext, ReactNode, useContext, useRef } from 'react'

import { useAtom, useAtomValue, useSetAtom } from 'jotai/react'
import { selectAtom } from 'jotai/utils'

/**
 * Jotai atom을 Context로 공유할 수 있는 헬퍼 함수
 * @param initialValue atom의 초기값
 * @returns Provider, hooks를 포함한 객체
 */
export function createAtomContext<T>(initialValue: T) {
  type AtomType = PrimitiveAtom<T>
  
  interface AtomContextType {
    atomRef: React.RefObject<AtomType>
  }

  const AtomContext = createContext<AtomContextType | null>(null)

  // Provider 컴포넌트
  const Provider = ({ children }: { children: ReactNode }) => {
    const atomRef = useRef(atom(initialValue))
    return <AtomContext.Provider value={{ atomRef }}>{children}</AtomContext.Provider>
  }

  // Context 접근 hook
  const useAtomContext = () => {
    const context = useContext(AtomContext)
    if (!context) {
      throw new Error('useAtomContext must be used within Provider')
    }
    return context
  }

  // atom 값과 setter를 모두 반환하는 hook
  const useAtomState = () => {
    const { atomRef } = useAtomContext()
    return useAtom(atomRef.current)
  }

  // atom 값만 반환하는 hook
  const useAtomReadOnly = () => {
    const { atomRef } = useAtomContext()
    return useAtomValue(atomRef.current)
  }

  const useAtomSelect = (callback: (item: T) => T) => {
    const { atomRef } = useAtomContext()
    return selectAtom(atomRef.current, callback)
  }

  // atom setter만 반환하는 hook
  const useAtomSetter = () => {
    const { atomRef } = useAtomContext()
    return useSetAtom(atomRef.current)
  }

  return {
    Provider,
    useAtomContext,
    useAtomState,
    useAtomReadOnly,
    useAtomSelect,
    useAtomSetter,
  }
}
