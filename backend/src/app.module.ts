import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { FirmModule } from './firm/firm.module';
import { ProjectsModule } from './projects/projects.module';
import { VolumesModule } from './volumes/volumes.module';
import { MaterialsModule } from './materials/materials.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { WorkbenchesModule } from './workbenches/workbenches.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    FirmModule,
    ProjectsModule,
    VolumesModule,
    MaterialsModule,
    AppointmentsModule,
    WorkbenchesModule,
    DashboardModule,
  ],
})
export class AppModule {}
