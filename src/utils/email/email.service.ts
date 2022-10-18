import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { emailContentType } from './interfaces/emailContent.interfaces';

@Injectable()
export class EmailService {
  private readonly emailFilePath = path.join('notifications', 'emails.txt');
  async _sendEmail(emailContent: emailContentType) {
    try {
      fs.readFileSync(this.emailFilePath);
      fs.appendFileSync(
        this.emailFilePath,
        `${JSON.stringify(emailContent)}\n`,
      );
    } catch (err) {
      fs.createWriteStream(this.emailFilePath);
    }
  }
}
