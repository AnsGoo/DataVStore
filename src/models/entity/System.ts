import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export default class System {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 64, unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 64 })
  tag!: string;

  @Column({
    type: 'json',
  })
  config!: Object;

  @Column({ type: 'varchar', length: 512, nullable: true })
  desc!: string;

  @Column('timestamp')
  @CreateDateColumn()
  createTime!: string;
}
