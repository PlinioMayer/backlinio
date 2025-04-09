/**
 * objetivo service
 */

import { Core, factories, Modules } from '@strapi/strapi';

export default factories.createCoreService('api::objetivo.objetivo', ({ strapi }: { strapi: Core.Strapi }) => ({
  findMaxDiasObjetivo(): Promise<number> {
    return strapi.db.connection.raw("SELECT (fim - inicio) AS dias FROM objetivos ORDER BY dias DESC LIMIT 1").then(r => r.rows[0].dias);
  }
}));
