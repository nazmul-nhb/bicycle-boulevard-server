import { User } from '../user/user.model';
import type { DecodedUser } from '../../types/interfaces';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import { STATUS_CODES } from '../../constants';
import { validateObjectId } from '../../utilities/validateObjectId';

/**
 * * Deactivate/Reactivate a user in MongoDB by toggling `isActive` field.
 * @param id User ID to block/unblock.
 * @param blockUser Whether to block or unblock user; `true` means block user.
 * @param admin Current logged in user (admin) from decoded token.
 * @returns A message indicating the result of the operation.
 */
const toggleUserStatusInDB = async (
	id: string,
	blockUser: boolean,
	admin?: DecodedUser,
) => {
	validateObjectId(id, 'user', 'deactivate_user');

	if (!admin || admin?.role !== 'admin') {
		throw new ErrorWithStatus(
			'Authorization Error',
			`You do not have permission to ${blockUser ? 'deactivate' : 'reactivate'} this user!`,
			STATUS_CODES.UNAUTHORIZED,
			'auth',
		);
	}

	const user = await User.findById(id);

	if (!user) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`No user found with ID ${id}!`,
			STATUS_CODES.NOT_FOUND,
			'user',
		);
	}

	if (user.email === admin.email) {
		throw new ErrorWithStatus(
			`Cannot  ${blockUser ? 'Deactivate' : 'Reactivate'}`,
			`You cannot  ${blockUser ? 'deactivate' : 'reactivate'} yourself!`,
			STATUS_CODES.CONFLICT,
			'deactivate_user',
		);
	}

	if (blockUser && !user.isActive) {
		throw new ErrorWithStatus(
			'Already Deactivated',
			`${user.name} is already deactivated!`,
			STATUS_CODES.CONFLICT,
			'user',
		);
	}

	if (!blockUser && user.isActive) {
		throw new ErrorWithStatus(
			'Already Active',
			`${user.name} is already active!`,
			STATUS_CODES.CONFLICT,
			'user',
		);
	}

	const result = await User.updateOne({ _id: id }, { isActive: !blockUser });

	if (result.modifiedCount < 1) {
		throw new ErrorWithStatus(
			'Bad Request',
			`User with ID ${id} cannot be ${blockUser ? 'deactivated' : 'reactivated'}!`,
			STATUS_CODES.BAD_REQUEST,
			'user',
		);
	}

	return `User is  ${blockUser ? 'deactivated' : 'reactivated'} successfully!`;
};

export const adminServices = { toggleUserStatusInDB };
