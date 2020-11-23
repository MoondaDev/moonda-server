import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventOpen } from './schemas/event.open.schema';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: EventOpen,
        schemaOptions: {
          timestamps: true,
        },
      },
    ]),
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
