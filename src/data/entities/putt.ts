import {Entity, PrimaryGeneratedColumn, Column } from "typeorm"; 

@Entity('putt') 
export class Putt {   

  @PrimaryGeneratedColumn()
  id!: number; 
  
  @Column("text")
  date!: string; 
  
  @Column("text")
  result!: "hit" | "miss";

  @Column("integer")
  distance!: number;
}