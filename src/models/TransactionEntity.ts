import { PackageEntity } from "./PackageEntity";
import { UserEntity } from "./UserEntity";

export interface TransactionEntity {
  id: string;
  package: PackageEntity;
  user: UserEntity;
  created: Date,
}