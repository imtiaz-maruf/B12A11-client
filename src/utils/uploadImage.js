// ===========================================
// CLIENT/src/utils/uploadImage.js
// ===========================================
import axios from 'axios';

/**
 * Upload image to Cloudinary
 * @param {File} imageFile - The image file to upload
 * @returns {Promise<string>} - URL of uploaded image
 */
export const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData
        );
        return response.data.secure_url;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image');
    }
};