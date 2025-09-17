import Reveal from '../animations/Reveal'

interface Props {
  title: string
  subtitle?: string
}

export default function PageHeading({ title, subtitle }: Props) {
  return (
    <header className="mt-10 mb-6">
      <Reveal>
        <h1 className="text-4xl">{title}</h1>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.2}>
          <p className="text-muted-foreground mt-1 text-lg">{subtitle}</p>
        </Reveal>
      )}
    </header>
  )
}
