import { PackageEntity } from "./PackageEntity";
import { UserEntity } from "./UserEntity";

export interface OrderEntity {
  id: string;
  user: UserEntity;
  package: PackageEntity;
  created: Date;
}