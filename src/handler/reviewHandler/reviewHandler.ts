import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

export const fillReview = async (req: Request, res: Response) => {
  const { transactionId, review, rating } = req.body;
  let transaction = await db.transaction.findUnique({
    where: {
      id: transactionId,
    },
    include: { review: true },
  });

  if (!transaction)
    return res
      .status(400)
      .send({ message: `Transaction with id ${transactionId} doesn't exist` });

  if (!transaction.review)
    return res.status(400).send({
      message: `You can't fill review for transactionId ${transactionId}. Make sure transaction status is Done`,
    });

  if (transaction.review.isFilled)
    return res.status(400).send({
      message: `Review for transactionId ${transactionId} already filled. You can fill it twice!`,
    });

  if (transaction)
    try {
      transaction = await db.transaction.update({
        where: { id: transactionId },
        data: {
          review: {
            update: {
              rating: Number(rating),
              review,
              isFilled: true,
            },
          },
        },
        include: { review: true },
      });

      return res.status(200).send({
        message: `Review for transactionId ${transactionId} has been submitted`,
        data: transaction,
      });
    } catch (err: any) {
      return res.status(500).send({ message: err });
    }
};

export const getReview = async (req: Request, res: Response) => {
  const { merchantId, customerId, transactionId } = req.query;

  const where: Prisma.ReviewWhereInput = {};

  if (transactionId) {
    where.transactionId = transactionId as string;
  }

  if (merchantId) {
    where.merchantId = merchantId as string;
  }

  if (customerId) {
    where.customerId = customerId as string;
  }

  const reviews = await db.review.findMany({
    where,
    include: { customer: true, merchant: true },
  });

  return res.status(200).send({ data: reviews });
};

export const getMerchantRating = async (req: Request, res: Response) => {
  const { merchantId } = req.query;

  const merchant = await db.merchant.findUnique({
    where: { id: merchantId as string | undefined },
  });

  if (!merchant)
    return res
      .status(400)
      .send({ message: `Merchant with id ${merchantId} doesn't exist` });

  const rating = await db.review.aggregate({
    where: { merchantId: merchant?.id, isFilled: true },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return res.status(200).send({ data: rating });
};
