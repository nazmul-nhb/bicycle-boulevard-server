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
