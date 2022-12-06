import { WalletEntity } from "./WalletEntity";

export interface TransactionEntity {
  id: string;
  walletId: string,
  packageName: string;
  wallet: WalletEntity;
  price: number,
  time: number,
  created: Date,
}