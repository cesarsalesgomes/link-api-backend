import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { VehicleModule } from './modules/vehicle/vehicle.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RemoteModule } from './modules/remote/remote.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    VehicleModule,
    UserModule,
    AuthModule,
    RemoteModule
  ],
  controllers: []
})
export class AppModule { }
