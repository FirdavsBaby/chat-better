import { IUser } from "./User";

export interface IMessage {
  text: string;
  user_id: IUser;
  created_at: string;
  updated_at: string;
  __v: number;
  _id: string;
}
