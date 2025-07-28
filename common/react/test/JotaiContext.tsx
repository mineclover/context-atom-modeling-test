import React, { createContext, useContext, useRef, ReactNode } from 'react'
import { atom, PrimitiveAtom } from 'jotai'

type CounterAtom = PrimitiveAtom<number>

interface JotaiContextType {
	counterAtomRef: React.RefObject<CounterAtom>
}

const JotaiContext = createContext<JotaiContextType | null>(null)

export const JotaiProvider = ({ children }: { children: ReactNode }) => {
	const counterAtomRef = useRef(atom(0))

	return <JotaiContext.Provider value={{ counterAtomRef }}>{children}</JotaiContext.Provider>
}

export const useJotaiContext = () => {
	const context = useContext(JotaiContext)
	if (!context) {
		throw new Error('useJotaiContext must be used within JotaiProvider')
	}
	return context
}