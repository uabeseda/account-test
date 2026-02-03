import { ObjectId } from 'mongodb';
import { getCollection } from '../db/connection';
import { Account, AccountPayload } from '../schemas';
import { NotFoundError, ValidationError } from '../errors';

const COLLECTION_NAME = 'Accounts';

export const createAccount = async (payload: AccountPayload): Promise<Account> => {
  const collection = getCollection<Account>(COLLECTION_NAME);

  const now = new Date();
  const accountData: Omit<Account, '_id'> = {
    name: payload.name,
    scope: payload.scope,
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(accountData as Account);
  const createdAccount = await collection.findOne({ _id: result.insertedId });

  if (!createdAccount) {
    throw new Error('Failed to create account');
  }

  return createdAccount;
};

export const updateAccount = async (id: string, payload: AccountPayload): Promise<Account> => {
  if (!ObjectId.isValid(id)) {
    throw new ValidationError('Invalid account ID');
  }

  const collection = getCollection<Account>(COLLECTION_NAME);

  const updateData = {
    name: payload.name,
    scope: payload.scope,
    updatedAt: new Date(),
  };

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: 'after' },
  );

  if (!result) {
    throw new NotFoundError('Account not found');
  }

  return result;
};

export interface AccountStats {
  accounts: number;
  prospects: number;
  children: number;
}

export const getStats = async (): Promise<AccountStats> => {
  const collection = getCollection<Account>(COLLECTION_NAME);

  const aggregationResult = await collection.aggregate([
    {
      $group: {
        _id: '$scope',
        count: { $sum: 1 },
      },
    },
  ]).toArray();

  const stats: AccountStats = {
    accounts: 0,
    prospects: 0,
    children: 0,
  };

  aggregationResult.forEach((item) => {
    if (item._id === 'account') {
      stats.accounts = item.count;
    } else if (item._id === 'prospect') {
      stats.prospects = item.count;
    } else if (item._id === 'child') {
      stats.children = item.count;
    }
  });

  return stats;
};
