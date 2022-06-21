import { tableSchema } from '@nozbe/watermelondb';

const userSchema = tableSchema({
  name: 'user',
  columns: [
    {
      name: 'email',
      type: 'string',
    },
    {
      name: 'name',
      type: 'string',
    },
    {
      name: 'driver_license',
      type: 'string',
    },
    {
      name: 'token',
      type: 'string',
    },
    {
      name: 'photo',
      type: 'string',
    },
  ]
});

export { userSchema }