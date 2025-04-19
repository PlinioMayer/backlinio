import { Core, factories, Modules } from "@strapi/strapi";
import { Context, Next } from "koa";
import { daysBetween, format } from "../../../utils";
import { isObject } from "lodash/fp";
import { errors } from "@strapi/utils";
import { ApiPlinioPlinio } from "../../../../types/generated/contentTypes";

const uid = "api::objetivo.objetivo";

type ObjetivoPlinio = Modules.Documents.Document<"api::objetivo.objetivo"> & {
  plinio: Modules.Documents.Document<"api::plinio.plinio">;
};

export default factories.createCoreController(
  uid,
  ({ strapi }: { strapi: Core.Strapi }) => ({
    async find(ctx: Context) {
      const filters: Record<string, unknown> = (ctx.query.filters =
        (ctx.query.filters as Record<string, unknown>) ?? {});
      const excluido: Record<string, unknown> = (filters.excluido =
        (filters.excluido as Record<string, unknown>) ?? {});
      excluido.$null = excluido.$null ?? true;
      const objetivos: { data: ObjetivoPlinio[] } = await super.find(ctx);

      if (ctx.query.plinio === "true") {
        for (const objetivo of objetivos.data) {
          const dias = daysBetween(
            new Date(objetivo.inicio),
            new Date(objetivo.fim),
          );
          objetivo.plinio = await strapi
            .service("api::plinio.plinio")
            .findMaxPlinio(dias);
        }
      }

      return objetivos;
    },

    async delete(ctx: Context, next: Next) {
      await strapi
        .service(uid)
        .update(ctx.params.id, { data: { excluido: new Date() } });
      ctx.status = 200;
      await next();
    },

    async update(ctx: Context, next: Next) {
      const maxDiasInicial = await strapi.service(uid).findMaxDiasObjetivo();
      const maxPlinioInicial = await strapi
        .service("api::plinio.plinio")
        .findMaxPlinio(maxDiasInicial);
      if (ctx.request.body.data.fim === "today") {
        ctx.request.body.data.fim = format(new Date());
      }
      await super.update(ctx, next);
      const maxDias = await strapi.service(uid).findMaxDiasObjetivo();
      const maxPlinio = await strapi
        .service("api::plinio.plinio")
        .findMaxPlinio(maxDias);

      ctx.status = 200;

      if (maxPlinioInicial.documentId !== maxPlinio.documentId) {
        ctx.body = maxPlinio;
      }

      await next();
    },

    async create(ctx: Context, next: Next) {
      const maxDiasInicial = await strapi.service(uid).findMaxDiasObjetivo();
      const maxPlinioInicial =
        maxDiasInicial === null
          ? null
          : await strapi
              .service("api::plinio.plinio")
              .findMaxPlinio(maxDiasInicial);
      await this.validateQuery(ctx);
      const sanitizedQuery = await this.sanitizeQuery(ctx);

      const { body = {} } = ctx.request;

      if (!isObject(body.data)) {
        throw new errors.ValidationError(
          'Missing "data" payload in the request body',
        );
      }

      await this.validateInput(body.data, ctx);

      const sanitizedInputData = await this.sanitizeInput(body.data, ctx);

      const objetivo = await strapi.service(uid).create({
        ...sanitizedQuery,
        data: sanitizedInputData,
      });

      ctx.body = { objetivo };
      ctx.status = 201;

      const maxDias = await strapi.service(uid).findMaxDiasObjetivo();
      const maxPlinio = await strapi
        .service("api::plinio.plinio")
        .findMaxPlinio(maxDias);

      if (maxPlinioInicial?.documentId !== maxPlinio.documentId) {
        (ctx.body as { plinio?: ApiPlinioPlinio }).plinio = maxPlinio;
      }

      await next();
    },
  }),
);
