import { User } from './user.model';

const getAllUsersFromDB = async () => {
	const users = await User.find({});

	return users;
};

export const userServices = { getAllUsersFromDB };
