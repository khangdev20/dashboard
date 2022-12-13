import { TransactionEntity } from "./TransactionEntity";
import { UserEntity } from "./UserEntity";
import {AddFundEntity} from "./AddFundEntity";

export interface WalletEntity {
  id: string,
  userId: string,
  user: UserEntity,
  money: number,
  transactions: TransactionEntity[],
  addFunds: AddFundEntity[],
  created: Date
}