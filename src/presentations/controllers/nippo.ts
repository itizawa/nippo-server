import * as express from "express";
import { User } from "~/models/User";
import { UpsertNippoUseCase } from "~/useCases/Nippo/UpsertNippoUseCase";
import { Types } from "mongoose";
import { logger } from "~/utils/logger";

const upsertNippoUseCase = new UpsertNippoUseCase();

export const postNippo = async (
  req: express.Request<
    { id: string },
    object,
    { date: string; body: string }
  > & { user: User },
  res: express.Response,
) => {
  const { user } = req;
  const { id: objectiveId } = req.params;
  const { body, date } = req.body;

  if (!body || !date || !objectiveId) {
    return res.status(400).send({ message: "bodyとobjectiveIdは必須です" });
  }

  try {
    const createdObject = await upsertNippoUseCase.execute({
      currentUser: user,
      body,
      date,
      objectiveId: new Types.ObjectId(objectiveId),
    });
    return res.status(200).json({ object: createdObject });
  } catch (error) {
    logger(error.message, "error");
    return res.status(503).send({ message: "予期せぬエラーが発生しました" });
  }
};