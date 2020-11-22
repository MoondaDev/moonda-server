import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mail } from '../mail/mail.schema';

@Injectable()
export class MailService {
  constructor(
    @InjectModel('mails') private readonly mailModel: Model<Mail>,
    private readonly mailerService: MailerService,
  ) {}

  async send(
    subject: string,
    toName: string,
    toEmail: string,
    fromName: string,
    fromEmail: string,
    template: string,
    context: any,
  ): Promise<Mail> {
    try {
      await this.sendMail(
        subject,
        toName,
        toEmail,
        fromName,
        fromEmail,
        template,
        context,
      );
      const mail = await this.saveMail(
        subject,
        toName,
        toEmail,
        fromName,
        fromEmail,
        template,
        context,
      );
      return mail;
    } catch (err) {
      console.error(err);
      throw new HttpException(
        { success: false, message: err.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async sendMail(
    subject: string,
    toName: string,
    toEmail: string,
    fromName: string,
    fromEmail: string,
    template: string,
    context: any,
  ): Promise<any> {
    const res = await this.mailerService.sendMail({
      to: {
        name: toName,
        address: toEmail,
      },
      from: {
        name: fromName,
        address: fromEmail,
      },
      subject,
      template,
      context,
    });

    return res;
  }

  private async saveMail(
    subject: string,
    toName: string,
    toEmail: string,
    fromName: string,
    fromEmail: string,
    template: string,
    context: any,
  ): Promise<Mail> {
    const mail = new this.mailModel();
    mail.subject = subject;
    mail.toName = toName;
    mail.toEmail = toEmail;
    mail.fromName = fromName;
    mail.fromEmail = fromEmail;
    mail.template = template;
    mail.context = context;

    const savedMail = await mail.save();
    return savedMail;
  }
}
