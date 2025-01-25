import type { Document, Model, Types } from 'mongoose';
import type { USER_ROLES } from './user.constants';

export type TUserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface IUser {
	name: string;
	email: string;
	password: string;
	image: string;
	role: TUserRole;
	isActive?: boolean;
}

export interface ILoginCredentials {
	email: string;
	password: string;
}

export interface ITokens {
	accessToken: string;
	refreshToken: string;
}

export interface IUserDoc extends IUser, Document {
	_id: Types.ObjectId;
}

export interface IUserModel extends Model<IUserDoc> {
	validateUser(email?: string): Promise<IUserDoc>;
}
