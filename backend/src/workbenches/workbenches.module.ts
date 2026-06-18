import { Module } from '@nestjs/common';
import { WorkbenchesController } from './workbenches.controller';
import { WorkbenchesService } from './workbenches.service';

@Module({
  controllers: [WorkbenchesController],
  providers: [WorkbenchesService],
})
export class WorkbenchesModule {}
