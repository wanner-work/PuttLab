interface Props {
  title: string
  subtitle?: string
}

export default function PageHeading({ title, subtitle }: Props) {
  return (
    <header className="mt-5 mb-8 text-center">
      <h1 className="mb-2 text-3xl font-bold">{title}</h1>
      {subtitle && <p className="text-muted-foreground text-lg">{subtitle}</p>}
    </header>
  )
}
