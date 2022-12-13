import {WalletEntity} from "./WalletEntity";
import {SalesEntity} from "./SalesEntity";

export interface AddFundEntity {
    id: string,
    walletId: string,
    wallet: WalletEntity,
    salesId: string,
    sales: SalesEntity,
    money: number,
    status: boolean,
    created: Date,
}