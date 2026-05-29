import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

export class CloudinaryService {
    private configured: boolean;

    constructor() {
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (process.env.CLOUDINARY_URL) {
            cloudinary.config({ url: process.env.CLOUDINARY_URL });
            this.configured = true;
        } else if (cloudName && apiKey && apiSecret) {
            cloudinary.config({
                cloud_name: cloudName,
                api_key: apiKey,
                api_secret: apiSecret,
            });
            this.configured = true;
        } else {
            this.configured = false;
        }
    }

    get isConfigured(): boolean {
        return this.configured;
    }

    async uploadBuffer(buffer: Buffer, filename?: string): Promise<string> {
        if (!this.configured) {
            return Promise.reject(new Error('Cloudinary is not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET.'));
        }

        return new Promise<string>((resolve, reject) => {
            const publicId = filename
                ? filename.replace(/\s+/g, '_')
                : String(Date.now());

            const opts: Record<string, unknown> = {
                resource_type: 'raw',
                public_id: publicId,
            };

            const uploadStream = cloudinary.uploader.upload_stream(opts, (error, result) => {
                if (error) return reject(error);
                // result can be undefined in rare cases so guard
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const r = result as any;
                resolve(r?.secure_url ?? r?.url ?? '');
            });

            streamifier.createReadStream(buffer).pipe(uploadStream);
        });
    }
}

export const cloudinaryService = new CloudinaryService();
