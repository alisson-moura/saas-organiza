import { All, Controller, Inject, OnModuleInit } from '@nestjs/common';
import { AppRouterHost } from 'nestjs-trpc';
import { renderTrpcPanel } from 'trpc-panel';

@Controller()
export class TrpcPanelController implements OnModuleInit {
  private appRouter!: any;

  constructor(
    @Inject(AppRouterHost) private readonly appRouterHost: AppRouterHost,
  ) {}
  onModuleInit() {
    this.appRouter = this.appRouterHost.appRouter;
  }

  @All('/panel')
  panel(): string {
    return renderTrpcPanel(this.appRouter, {
      url: 'https://api-organiza-fr6u.onrender.com/trpc',
    });
  }
}
