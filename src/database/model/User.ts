import Model from '@nozbe/watermelondb/Model';
import field from '@nozbe/watermelondb/decorators/field';

class User extends Model {
  static table = 'user';

  @field('email')
  email!: string;

  @field('name')
  name!: string;

  @field('driver_license')
  driver_license!: string;

  @field('photo')
  photo!: string;

  @field('token')
  token!: string;
}

export { User }