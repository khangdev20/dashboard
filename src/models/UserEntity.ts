import { HistoryEntity } from "./HistoryEntity";
import { OrderEntity } from "./OrderEntity";
import { PlayListEntity } from "./PlayListEntity";
import { TransactionEntity } from "./TransactionEntity";

export interface UserEntity {
  id: string,
  created: Date,
  playlists: PlayListEntity[],
  orders: OrderEntity[],
  histories: HistoryEntity[],
  transaction: TransactionEntity[]
  name: string,
  avatar: string,
  sex: boolean, 
  phone: string,
  email: string;
  role: string,
  current: string,
}