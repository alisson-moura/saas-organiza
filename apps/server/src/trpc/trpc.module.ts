import { Global, Module } from '@nestjs/common';
import { TRPCModule } from 'nestjs-trpc';
import { TrpcPanelController } from './trpc-panel.controller';
import { AppContext } from './app.context';
import { AuthMiddleware } from './auth.middleware';

@Global()
@Module({
  imports: [
    TRPCModule.forRoot({
      autoSchemaFile:
        process.env.NODE_ENV === 'production'
          ? undefined
          : './src/trpc/@generated',
      context: AppContext,
    }),
  ],
  controllers: [TrpcPanelController],
  providers: [AppContext, AuthMiddleware],
})
export class TrpcModule {}
