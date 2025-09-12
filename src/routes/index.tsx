import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="">
      <h3 className='font-extrabold text-5xl'>Welcome Home!</h3>
    </div>
  )
}