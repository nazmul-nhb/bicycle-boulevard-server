import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import configs from '../../configs';
import { STATUS_CODES } from '../../constants';
import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';
import { sendImageToCloudinary } from '../../utilities/uploadImage';
// import { User } from '../user/user.model';
import { generateFileName } from '../../utilities/generateFileName';
import type { IUser } from '../user/user.types';
import { authServices } from './auth.services';

/** * Register a new user */
const registerUser = catchAsync(async (req, res) => {
	const userToCreate = req.body as IUser;

	// const existingUser = await User.findOne({ email: userToCreate.email });

	// if (existingUser) {
	// 	throw new ErrorWithStatus(
	// 		'Duplicate Error',
	// 		`User already exists with email: ${userToCreate.email}!`,
	// 		STATUS_CODES.CONFLICT,
	// 		'register_user',
	// 	);
	// }

	if (!req.file) {
		throw new ErrorWithStatus(
			'Image Required',
			`Require image to create new profile!`,
			STATUS_CODES.BAD_REQUEST,
			'register_user',
		);
	}

	const fileName = generateFileName('user').trim();

	const { secure_url } = await sendImageToCloudinary(
		fileName,
		req.file.buffer,
	);

	req.cloudinary_public_id = fileName;

	const user = await authServices.registerUserInDB({
		...userToCreate,
		image: secure_url.split(configs.imageBaseUrl)[1],
	});

	sendResponse(res, 'User', 'POST', user, 'User registered successfully!');
});

/** * Login a user */
const loginUser = catchAsync(async (req, res) => {
	const result = await authServices.loginUser(req.body);

	const { refreshToken, accessToken, user } = result;

	res.cookie('refreshToken', refreshToken, {
		secure: configs.NODE_ENV === 'production',
		httpOnly: true,
	});

	sendResponse(
		res,
		'User',
		'OK',
		{ user, token: accessToken },
		'Login successful!',
	);
});

/** * Generate new access token. */
const refreshToken = catchAsync(async (req, res) => {
	const { refreshToken } = req.cookies;

	const token = await authServices.refreshToken(refreshToken);

	sendResponse(
		res,
		'N/A',
		'OK',
		token,
		'Successfully retrieved new access token!',
	);
});

/** * Get current logged in user. */
const getCurrentUser = catchAsync(async (req, res) => {
	const user = await authServices.getCurrentUserFromDB(req.user);

	sendResponse(res, 'User', 'GET', user);
});

export const authControllers = {
	registerUser,
	loginUser,
	refreshToken,
	getCurrentUser,
};
