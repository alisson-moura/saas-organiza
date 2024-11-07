import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccountsModule } from './accounts/accounts.module';
import { TrpcModule } from './trpc/trpc.module';
import { LibsModule } from './libs/libs.module';
import { envSchema } from './env-validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const parsed = envSchema.safeParse(config);
        if (!parsed.success) {
          console.error(
            'Erro na validação das variáveis de ambiente:',
            parsed.error.format(),
          );
          throw new Error('Configuração inválida no .env');
        }
        return parsed.data;
      },
    }),
    LibsModule,
    TrpcModule,
    AccountsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
