import { useCounter } from '../contexts/counterContext'

export const useCounterViewModel = () => {
	const [count, setCount] = useCounter()

	const increment = () => {
		setCount(count + 1)
	}

	const decrement = () => {
		setCount((prev: number) => prev - 1)
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