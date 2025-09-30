import { ObjectId } from 'mongodb';
export const toObjectId = (id: string) => {
  if (!ObjectId.isValid(id)) throw new Error('INVALID_ID');
  return new ObjectId(id);
};
