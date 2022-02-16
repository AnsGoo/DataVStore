import { Entity, Column, Index, PrimaryColumn, Generated, CreateDateColumn } from "typeorm";

@Entity()
export default class Page {
  @PrimaryColumn()
  @Generated('uuid')
  id?: string;

  @Column()
  name!: string;

  @Column({
    type: 'varchar',
    length: 200
  })
  @Index()
  author!: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true
  })
  thumbnail?: string;

  @Column({
    default: false
  })
  isHome!: boolean;

  @Column({default:false})
  isDelete!: boolean;

  @Column("json")
  canvasData: any

  @Column("json")
  canvasStyle: any

  @Column('timestamp')
  @CreateDateColumn()
  createTime!: string

  @Column({type:'text', nullable: true})
  allowed!: string| null
}
