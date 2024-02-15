import React from 'react'

const useDebounce = (value: string, delay: number) => {
  const [debounceValue, setDebounceValue] = React.useState(value)

  React.useEffect(() => {
    const timer = setTimeout(() => setDebounceValue(value), delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debounceValue
}

export default useDebounce
