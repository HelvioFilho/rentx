import { tableSchema, TableSchema } from '@nozbe/watermelondb/Schema';

const userSchema: TableSchema = tableSchema({
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
      name: 'photo',
      type: 'string',
    },
    {
      name: 'token',
      type: 'string',
    }
  ]
});

export { userSchema }