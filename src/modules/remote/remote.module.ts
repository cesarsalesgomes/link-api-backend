import { Module, HttpModule } from '@nestjs/common';
import { RemoteService } from './remote.service';

@Module({
  imports: [HttpModule],
  providers: [RemoteService],
  exports: [RemoteService]
})
export class RemoteModule { }
