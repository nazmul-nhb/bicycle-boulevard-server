import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';
import { adminServices } from './admin.services';

/** Block/Unblock a user */
const toggleUserStatus = catchAsync(async (req, res) => {
	const { id } = req.params;

	const blockUser = req.path.split('/')[2] === 'block';

	const message = await adminServices.toggleUserStatusInDB(
		id,
		blockUser,
		req?.user,
	);

	sendResponse(res, 'User', 'PATCH', null, message);
});

export const adminControllers = { toggleUserStatus };
