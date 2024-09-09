import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  prince: number;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  mileage: number;

  @Expose()
  approved: boolean;

  @Transform(({ obj }) => obj.user.id)  // assign a property of an object instead of the whole object
  @Expose()
  userId: number;
}
