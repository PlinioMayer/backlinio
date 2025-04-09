import { Core, factories, Modules } from '@strapi/strapi'
import { Context, Next } from 'koa';
import { daysBetween } from '../../../utils';


type ObjetivoPlinio = Modules.Documents.Document<'api::objetivo.objetivo'> & { plinio: Modules.Documents.Document<'api::plinio.plinio'> };

export default factories.createCoreController('api::objetivo.objetivo', ({ strapi }: { strapi: Core.Strapi }) => ({
  async find(ctx: Context) {
    const filters: Record<string, unknown> = ctx.query.filters = ctx.query.filters as Record<string, unknown> ?? {};
    const excluido: Record<string, unknown> = filters.excluido = filters.excluido as Record<string, unknown> ?? {};
    excluido.$null = excluido.$null ?? true;
    const objetivos: { data: ObjetivoPlinio[] } = await super.find(ctx);

    if (ctx.query.plinio === 'true') {
      for (const objetivo of objetivos.data) {
        const dias = daysBetween(new Date(objetivo.inicio), new Date(objetivo.fim));
        objetivo.plinio = await strapi.service('api::plinio.plinio').findMaxPlinio(dias);
      }
    }

    return objetivos;
  },

  async delete(ctx: Context, next: Next) {
    await strapi.service('api::objetivo.objetivo').update(ctx.params.id, { data: { excluido: new Date() } });
    ctx.status = 204;
    await next();
  }
}));
