import multer from 'multer';
import configs from '../configs';
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
	cloud_name: configs.cloudName,
	api_key: configs.cloudinaryApiKey,
	api_secret: configs.cloudinaryApiSecret,
});

// Multer configuration for memory storage
const storage = multer.memoryStorage();
export const uploadFile = multer({ storage });

/**
 * * Utility to upload image to cloudinary.
 * @param imageName Filename for the image which will act as cloudinary public id for that file.
 * @param buffer The image file as buffer.
 * @param folder The folder in which the image will be saved.
 * @returns Return the upload response from cloudinary.
 */
export const sendImageToCloudinary = (
	imageName: string,
	buffer: Buffer,
	folder = 'bicycle',
): Promise<UploadApiResponse> => {
	return new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream(
			{ folder, public_id: imageName },
			(error, result) => {
				if (error) {
					return reject(error);
				}
				resolve(result as UploadApiResponse);
			},
		);
		uploadStream.end(buffer); // Pass the buffer to Cloudinary's stream
	});
};

/**
 * * Utility to delete an image file from cloudinary using public id.
 * @param public_id The filename or cloudinary public id for a file to delete.
 * @param folder Folder in which the image file is located.
 * @returns Returns delete response from cloudinary.
 */
export const deleteFromCloudinary = async (
	public_id: string,
	folder = 'bicycle',
): Promise<{ result: string }> => {
	const a: { result: string } = await cloudinary.uploader.destroy(
		`${folder}/${public_id}`,
	);
	return a;
};
