import prisma from "../prisma.js";

// `client` can be a transaction (tx) or null
export const logActivity = (client, { cardId, boardId, actorId, type, body, meta }) =>
  (client || prisma).cardActivity.create({
    data: {
      cardId,
      boardId,
      actorId,
      type,
      ...(body ? { body } : {}),
      ...(meta ? { meta } : {}),
    },
  });