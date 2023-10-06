import { DynamicModule, Module } from '@nestjs/common';
import { LanguageService } from './language.service';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';

@Module({
  providers: [LanguageService],
  exports: [LanguageService],
})
export class LanguageModule {
  static register(storagePath: string): DynamicModule {
    return {
      module: LanguageModule,
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'fa',
          loaderOptions: {
            path: storagePath,
          },
          resolvers: [HeaderResolver],
        }),
      ],
      exports: [I18nModule],
    };
  }
}
