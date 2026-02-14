import CryptoJS from 'crypto-js';

/**
 * Generate MD5 hash from base64 image string for cache matching
 * @param base64Image - Base64 encoded image string
 * @returns MD5 hash string
 */
export const generateImageHash = (base64Image: string): string => {
    if (!base64Image) return '';

    // Remove data URL prefix if present (data:image/jpeg;base64,...)
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

    // Generate MD5 hash
    const hash = CryptoJS.MD5(cleanBase64).toString();
    return hash;
};

/**
 * Compare two image hashes
 * @param hash1 - First image hash
 * @param hash2 - Second image hash
 * @returns True if hashes match
 */
export const compareImageHashes = (hash1: string, hash2: string): boolean => {
    return hash1 === hash2;
};
