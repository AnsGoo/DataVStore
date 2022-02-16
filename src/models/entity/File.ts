import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export default class File {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({
    unique: true
  })
  md5!: string;

  @Column({
    type: 'text',
  })
  url!: string;

  @Column('timestamp')
  @CreateDateColumn()
  createTime!: string;
}
