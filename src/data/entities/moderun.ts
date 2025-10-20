import { Session } from '@/data/entities/session.ts'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity('moderun')
export class ModeRun {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'text' })
  mode!: string

  @Column('text')
  date!: string

  @Column('float')
  score!: number

  @OneToMany(() => Session, (session) => session.moderun, {
    cascade: true
  })
  sessions!: Session[]
}
