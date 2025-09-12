import { useState } from 'react'

export default function Application() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        Vite Starter Template
      </div>
      <div>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}
