import {TransactionEntity} from "./TransactionEntity";
import {AddFundEntity} from "./AddFundEntity";

export interface SalesEntity {
    id: string,
    name: string,
    dateStart: Date,
    dateEnd: Date,
    created: Date,
    transactions: TransactionEntity[],
    addFunds: AddFundEntity[],
}