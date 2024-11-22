import { All, Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppRouterHost } from 'nestjs-trpc';
import { renderTrpcPanel } from 'trpc-panel';

@Controller()
export class TrpcPanelController implements OnModuleInit {
  private appRouter!: any;

  constructor(
    @Inject(AppRouterHost) private readonly appRouterHost: AppRouterHost,
    private configService: ConfigService,
  ) {}
  onModuleInit() {
    this.appRouter = this.appRouterHost.appRouter;
  }

  @All('/panel')
  panel(): string {
    return renderTrpcPanel(this.appRouter, {
      url: this.configService.getOrThrow('API_URL') + '/trpc',
    });
  }
}
