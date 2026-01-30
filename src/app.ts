import { join } from "node:path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import {
  FastifyError,
  FastifyPluginAsync,
  FastifyServerOptions,
} from "fastify";

export interface AppOptions
  extends FastifyServerOptions, Partial<AutoloadPluginOptions> {}
// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts,
): Promise<void> => {
  // Place here your custom code!

  // Format all responses
  fastify.addHook("onSend", async (_, reply, payload) => {
    if (reply.statusCode >= 400) return payload;

    let data;
    try {
      data = JSON.parse(payload as string);
    } catch {
      return payload;
    }

    return JSON.stringify({
      status: "SUCCESS",
      data,
    });
  });

  // Error handling
  fastify.setErrorHandler((error: FastifyError, _, reply) => {
    reply.status(error.statusCode ?? 500).send({
      status: "FAIL",
      data: null,
      error,
    });
  });

  // fastify route not found shit
  fastify.setNotFoundHandler((req, reply) => {
    reply.status(404).send({
      status: "FAIL",
      data: null,
      error: {
        message: "Route not found",
        code: "NOT_FOUND",
        path: req.url,
        method: req.method,
      },
    });
  });

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  // eslint-disable-next-line no-void
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: opts,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  // eslint-disable-next-line no-void
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    options: opts,
  });
};

export default app;
export { app, options };
