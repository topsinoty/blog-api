import { FastifyReply, FastifyRequest } from "fastify";

export const globalRouteNotFoundErrorHandler = (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
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
};
