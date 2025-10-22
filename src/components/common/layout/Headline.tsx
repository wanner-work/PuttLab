interface Props {
  title: string
  subtitle?: string
}

export default function Headline({ title, subtitle }: Props) {
  return (
    <div className="mt-10 mb-6">
      <h1 className="text-4xl">{title}</h1>
      {subtitle && (
        <p className="text-muted-foreground mt-1 text-lg">{subtitle}</p>
      )}
    </div>
  )
}
