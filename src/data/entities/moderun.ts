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

  @Column({ type: 'text', nullable: true })
  end!: string

  @OneToMany(() => Session, (session) => session.modeRun, { cascade: true })
  sessions!: Session[]
}
