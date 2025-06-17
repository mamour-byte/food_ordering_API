import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Restaurant } from 'src/restaurants/restaurant.entity';
import { OneToMany } from 'typeorm';

export enum UserRole {
  CLIENT = 'client',
  RESTAURANT = 'restaurant',
  DELIVERY = 'delivery',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Restaurant, restaurant => restaurant.owner)
  restaurants: Restaurant[];

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
