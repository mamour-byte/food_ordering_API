import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, user => user.restaurants, { eager: false })
  owner: User;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  coverImageUrl: string;

  @Column()
  address: string;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: true })
  isOpen: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
