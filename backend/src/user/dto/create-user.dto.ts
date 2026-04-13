import { IsEmail, IsNotEmpty, MinLength, IsEnum } from 'class-validator';

export enum Room {
  Room1 = 'room1',
  Room2 = 'room2',
  Room3 = 'room3',
}

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(Room)
  roomId: Room;
}
