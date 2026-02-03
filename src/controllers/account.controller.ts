import { Request, Response } from 'express';
import { AccountPayload } from '../schemas';
import * as accountService from '../services/account.service';
import { asyncHandler } from '../utils/asyncHandler';

export const createAccountHandler = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body as AccountPayload;
  const account = await accountService.createAccount(payload);
  res.status(201).json(account);
});

export const updateAccountHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body as AccountPayload;
  const account = await accountService.updateAccount(id, payload);
  res.status(200).json(account);
});

export const getStatsHandler = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await accountService.getStats();
  res.status(200).json(stats);
});
