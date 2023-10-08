import * as fs from 'fs';
import * as path from 'path';
import handlebars from 'handlebars';

export class MailerHelper {
  async getTemplateEmail(data: Record<string, any>, htmlName: string) {
    const source = this.readFile(`${htmlName}.html`);
    const template = handlebars.compile(source);
    return template({ ...data });
  }

  private readFile(fileName: string) {
    const pathFile = path.join(
      process.cwd(),
      'libs/mailer/src/templates',
      fileName,
    );
    const data = fs.readFileSync(pathFile, 'utf-8');
    return data.toString();
  }
}
