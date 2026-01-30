import { onSendAsyncHookHandler } from "fastify";

export const globalOnSendHandler: onSendAsyncHookHandler = async (
  _,
  reply,
  payload,
) => {
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
};
