import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm'; // import decorators to be used in TypeORM
// import { Exclude } from 'class-transformer'

// Note by convention we don't put `Entity` as the postfix
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  // @Exclude()  // decorator to remove this property in request/response
  password: string;

  @AfterInsert() // Hook API
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @AfterUpdate() // Hook API
  logUpdate() {
    console.log('Updated User with id', this.id);
  }

  @AfterRemove() // Hook API
  logRemove() {
    console.log('Removed User with id', this.id);
  }
}
