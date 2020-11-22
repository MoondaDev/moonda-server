import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { envFilePath } from '../config';
import { MailSchema } from './mail.schema';
import { MailService } from './mail.service';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: 465,
        requireTLS: false,
        secure: true,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: 'jongjjang03',
      },
      preview: false,
      template: {
        dir: process.cwd() + '/template/',
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
    MongooseModule.forFeature([
      { name: 'mails', schema: MailSchema, collection: 'mails' },
    ]),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
