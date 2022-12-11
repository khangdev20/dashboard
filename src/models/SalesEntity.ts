import {TransactionEntity} from "./TransactionEntity";

export interface SalesEntity {
    id: string,
    name: string,
    dateStart: Date,
    dateEnd: Date,
    created: Date,
    transactions: TransactionEntity[]
}