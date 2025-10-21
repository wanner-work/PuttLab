import { ModeRun } from '@/data/entities/moderun.ts'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('session')
export class Session {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('text')
  date!: string

  @Column('integer')
  attempts!: number

  @Column('integer')
  hits!: number

  @Column('integer')
  distance!: number

  @Column({ nullable: true, type: 'integer' })
  maxAttempts!: number

  @ManyToOne(() => ModeRun, (moderun) => moderun.sessions)
  moderun!: ModeRun
}
