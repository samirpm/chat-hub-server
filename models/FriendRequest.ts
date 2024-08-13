import { Schema, model, Document } from 'mongoose';
import { IUser } from './User';

export interface IFriendRequest extends Document {
  requester: IUser['_id'];
  recipient: IUser['_id'];
  status: 'pending' | 'accepted' | 'rejected';
}

const friendRequestSchema = new Schema<IFriendRequest>({
  requester: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
});

const FriendRequest = model<IFriendRequest>('FriendRequest', friendRequestSchema);

export default FriendRequest;
