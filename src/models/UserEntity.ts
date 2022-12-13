import { HistoryEntity } from "./HistoryEntity";
import { PlayListEntity } from "./PlayListEntity";
import { WalletEntity } from "./WalletEntity";

export interface UserEntity {
  id: string,
  created: Date,
  playLists: PlayListEntity[],
  histories: HistoryEntity[],
  wallet: WalletEntity,
  name: string,
  avatar: string,
  sex: boolean, 
  premium: boolean,
  phone: string,
  email: string;
  role: string,
  dateUse: Date,
}