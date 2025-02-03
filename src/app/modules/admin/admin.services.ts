import { User } from '../user/user.model';
import type { DecodedUser } from '../../types/interfaces';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import { STATUS_CODES } from '../../constants';
import { validateObjectId } from '../../utilities/validateObjectId';

/**
 * * Deactivate a user in MongoDB by updating the `isActive` field to `false`.
 * @param id User ID to block.
 * @param admin Current logged in user (admin) from decoded token.
 * @returns A message indicating the result of the operation.
 */
const deactivateUserInDB = async (id: string, admin?: DecodedUser) => {
	validateObjectId(id, 'user', 'deactivate_user');

	if (!admin || admin?.role !== 'admin') {
		throw new ErrorWithStatus(
			'Authorization Error',
			'You do not have permission to deactivate this user!',
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
			'Cannot Deactivate',
			`You cannot deactivate yourself!`,
			STATUS_CODES.CONFLICT,
			'deactivate_user',
		);
	}

	if (!user.isActive) {
		throw new ErrorWithStatus(
			'Already Deactivated',
			`${user.name} is already deactivated!`,
			STATUS_CODES.CONFLICT,
			'user',
		);
	}

	const result = await User.updateOne({ _id: id }, { isActive: false });

	if (result.modifiedCount < 1) {
		throw new ErrorWithStatus(
			'Bad Request',
			`User with ID ${id} cannot be deactivated!`,
			STATUS_CODES.BAD_REQUEST,
			'user',
		);
	}

	return 'User is deactivated successfully!';
};

export const adminServices = { deactivateUserInDB };
