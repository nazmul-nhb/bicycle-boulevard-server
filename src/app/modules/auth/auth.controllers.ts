import { generateRandomID } from 'nhb-toolbox';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import configs from '../../configs';
import { STATUS_CODES } from '../../constants';
import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';
import { sendImageToCloudinary } from '../../utilities/uploadImage';
import { User } from '../user/user.model';
import { authServices } from './auth.services';

/** Register a new user */
const registerUser = catchAsync(async (req, res) => {
	const existingUser = await User.findOne({ email: req.body.email });

	if (existingUser) {
		throw new ErrorWithStatus(
			'Duplicate Error',
			`User already exists with email: ${req.body.email}!`,
			STATUS_CODES.CONFLICT,
			'register_user',
		);
	}

	if (!req.file) {
		throw new ErrorWithStatus(
			'Image Required',
			`Require image to create new profile!`,
			STATUS_CODES.BAD_REQUEST,
			'register_user',
		);
	}

	const fileName = generateRandomID({
		suffix: req.body.name,
		caseOption: 'lower',
		prefix: 'bicycle',
		timeStamp: true,
		separator: '_',
		length: 6,
	});

	const { secure_url } = await sendImageToCloudinary(
		fileName,
		req.file.buffer,
	);

	const user = await authServices.registerUserInDB({
		...req.body,
		image: secure_url.split(configs.imageBaseUrl)[1],
	});

	sendResponse(res, 'User', 'POST', user, 'User registered successfully!');
});

/** Login a user */
const loginUser = catchAsync(async (req, res) => {
	const tokens = await authServices.loginUser(req.body);

	const { refreshToken, accessToken } = tokens;

	res.cookie('refreshToken', refreshToken, {
		secure: configs.NODE_ENV === 'production',
		httpOnly: true,
	});

	sendResponse(
		res,
		'User',
		'OK',
		{ token: accessToken },
		'Login successful!',
	);
});

/** Generate new access token. */
const refreshToken = catchAsync(async (req, res) => {
	const { refreshToken } = req.cookies;

	const result = await authServices.refreshToken(refreshToken);

	sendResponse(
		res,
		'N/A',
		'OK',
		result,
		'Successfully retrieved new access token!',
	);
});

export const authControllers = { registerUser, loginUser, refreshToken };
