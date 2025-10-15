import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('session')
export class Session {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('integer')
  mode!: number

  @Column('text')
  date!: string

  @Column('integer')
  hits!: number

  @Column('integer')
  score!: number

  @Column({ nullable: true, type: 'integer' })
  maxAttempts!: number
}
