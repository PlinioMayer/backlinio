import { Core, factories, Modules } from '@strapi/strapi'
import { Context } from 'koa';
import { daysBetween } from '../../../utils';


type ObjetivoPlinio = Modules.Documents.Document<'api::objetivo.objetivo'> & { plinio: Modules.Documents.Document<'api::plinio.plinio'> };

export default factories.createCoreController('api::objetivo.objetivo', ({ strapi }: { strapi: Core.Strapi }) => ({
  async find(ctx: Context) {
    const objetivos: { data: ObjetivoPlinio[] } = await super.find(ctx);

    if (ctx.query.plinio === 'true') {
      for (const objetivo of objetivos.data) {
        const dias = daysBetween(new Date(objetivo.inicio), new Date(objetivo.fim));
        objetivo.plinio = await strapi.service('api::plinio.plinio').findMaxPlinio(dias);
      }
    }

    return objetivos;
  }
}));
