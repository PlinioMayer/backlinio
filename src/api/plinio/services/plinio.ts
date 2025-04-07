/**
 * plinio service
 */

import { Core, factories, Modules } from '@strapi/strapi';
export default factories.createCoreService('api::plinio.plinio', ({ strapi }: { strapi: Core.Strapi }) => ({
  async findMaxPlinio(dias: number): Promise<Modules.Documents.Document<'api::plinio.plinio'>> {
    return (await strapi.documents('api::plinio.plinio').findMany({
      limit: 1,
      sort: 'dias:desc',
      status: 'published',
      filters: {
        dias: {
          $lte: dias
        }
      },
    }))[0];
  }
}));
