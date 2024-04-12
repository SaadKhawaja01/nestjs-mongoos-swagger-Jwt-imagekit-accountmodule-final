import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from './user/user.module';

import environments from './helpers/environments';

@Module({
  imports: [
    MongooseModule.forRoot(environments.MONGO_DB_URL, {
      dbName: environments.MONGO_DB,
    }),
    UserModule,
  ],
})
export class AppModule {}
