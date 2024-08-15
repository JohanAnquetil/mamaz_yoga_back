export class UserLogin {
  id!: number;
  userLogin!: string;
  userPass!: string;
  userNicename!: string;
  userEmail!: string;
  userUrl?: string;
  userRegistered?: Date;
  userActivationKey?: string;
  userStatus!: number;
  displayName?: string;
  is_premium!: boolean;
}
