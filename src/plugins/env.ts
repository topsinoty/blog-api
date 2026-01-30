import fp from "fastify-plugin";
import env from "@fastify/env";

export default fp(async (fastify) => {
  await fastify.register(env, {
    schema: {
      type: "object",
      required: ["PORT"],
      properties: {
        PORT: { type: "number", default: 8080 },
        HOST: { type: "string", default: "localhost" },
        NODE_ENV: { type: "string", default: "development" },
      },
    },
    dotenv: true,
  });
});
