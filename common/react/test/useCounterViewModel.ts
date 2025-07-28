import { useAtom } from 'jotai'
import { useJotaiContext } from './JotaiContext'

export const useCounterViewModel = () => {
	const { counterAtomRef } = useJotaiContext()
	const [count, setCount] = useAtom(counterAtomRef.current)

	const increment = () => {
		setCount(count + 1)
	}

	const decrement = () => {
		setCount((prev) => prev - 1)
	}

	const reset = () => {
		setCount(0)
	}

	return {
		count,
		increment,
		decrement,
		reset,
		setValue: setCount,
	}
}
