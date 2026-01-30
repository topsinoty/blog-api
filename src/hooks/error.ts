import type { FastifyError, FastifyRequest, FastifyReply } from "fastify";

export const globalErrorHandler = (
  error: FastifyError,
  _: FastifyRequest,
  reply: FastifyReply,
) => {
  reply.status(error.statusCode ?? 500).send({
    status: "FAIL",
    data: null,
    error,
  });
};
