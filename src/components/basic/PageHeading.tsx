interface Props {
  title: string
  subtitle?: string
}

export default function PageHeading({ title, subtitle }: Props) {
  return (
    <header className="mt-2 mb-8">
      <h1 className="text-4xl font-bold">{title}</h1>
      {subtitle && <p className="text-lg text-neutral-400">{subtitle}</p>}
    </header>
  )
}
