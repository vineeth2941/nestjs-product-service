import { Global, Module } from '@nestjs/common';
import { DatabaseRepository } from './database.repository';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [DatabaseRepository],
  exports: [DatabaseRepository],
})
export class DatabaseModule {}
