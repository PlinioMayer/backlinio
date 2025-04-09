/**
 * plinio controller
 */

import { Core, factories } from '@strapi/strapi'
import { Context } from 'koa';

export default factories.createCoreController('api::plinio.plinio', ({ strapi }: { strapi: Core.Strapi }) => ({
  async find(ctx: Context) {
    if (ctx.query.byObjetivo === 'true') {
      const filters: Record<string, unknown> = ctx.query.filters = ctx.query.filters as Record<string, unknown> ?? {};
      const dias: Record<string, unknown> = filters.dias = filters.dias as Record<string, unknown> ?? {};
      dias.$lte = dias.$lte ?? await strapi.service('api::objetivo.objetivo').findMaxDiasObjetivo();
    }

    return await super.find(ctx);
  }
}));
