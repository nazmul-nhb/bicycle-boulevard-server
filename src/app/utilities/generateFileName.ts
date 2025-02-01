import { generateRandomID } from 'nhb-toolbox';

/**
 * * Generate a random filename for file upload to cloudinary.
 * @param suffix Suffix to add before the filename.
 * @returns The generated filename.
 */
export const generateFileName = (suffix: string): string => {
	return generateRandomID({
		suffix,
		caseOption: 'lower',
		prefix: 'bicycle',
		timeStamp: true,
		separator: '_',
		length: 6,
	})
		.replace(/[^a-zA-Z0-9-_ .]/g, ' ')
		.toLowerCase();
};
