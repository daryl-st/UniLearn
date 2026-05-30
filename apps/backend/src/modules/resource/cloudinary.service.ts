import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import {
    buildPdfDeliveryUrl,
    buildResourcePublicId,
    getNotificationUrl,
    isOfficeFile,
    isPdfFile,
} from "./cloudinary.utils.js";

export type CloudinaryUploadResult = {
    publicId: string;
    originalUrl: string;
    pdfUrl: string;
    needsConversion: boolean;
};

export class CloudinaryNotConfiguredError extends Error {
    constructor() {
        super(
            "Cloudinary is not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET.",
        );
        this.name = "CloudinaryNotConfiguredError";
    }
}

export class CloudinaryService {
    private configured: boolean;
    private cloudName: string;
    private apiSecret: string;

    constructor() {
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (process.env.CLOUDINARY_URL) {
            cloudinary.config({ url: process.env.CLOUDINARY_URL });
            this.configured = true;
            this.cloudName = cloudinary.config().cloud_name ?? cloudName ?? "";
            this.apiSecret = cloudinary.config().api_secret ?? apiSecret ?? "";
        } else if (cloudName && apiKey && apiSecret) {
            cloudinary.config({
                cloud_name: cloudName,
                api_key: apiKey,
                api_secret: apiSecret,
            });
            this.configured = true;
            this.cloudName = cloudName;
            this.apiSecret = apiSecret;
        } else {
            this.configured = false;
            this.cloudName = "";
            this.apiSecret = "";
        }
    }

    get isConfigured(): boolean {
        return this.configured;
    }

    getCloudName(): string {
        return this.cloudName;
    }

    getApiSecret(): string {
        return this.apiSecret;
    }

    /** PDF derived from Office conversion (Aspose) — delivered as image. */
    buildPdfUrl(publicId: string): string {
        if (this.configured) {
            const options: Record<string, unknown> = {
                resource_type: "image",
                secure: true,
                format: "pdf",
            };
            return cloudinary.url(publicId, options);
        }
        return buildPdfDeliveryUrl(publicId, this.cloudName);
    }

    async uploadResourceFile(
        buffer: Buffer,
        originalname: string,
        mimeType?: string,
    ): Promise<CloudinaryUploadResult> {
        if (!this.configured) {
            throw new CloudinaryNotConfiguredError();
        }

        const publicId = buildResourcePublicId(originalname, {
            omitPdfExtension: isPdfFile(originalname, mimeType),
        });
        const needsConversion = isOfficeFile(originalname, mimeType);
        const uploadAsPdf = isPdfFile(originalname, mimeType);
        const notificationUrl = needsConversion ? getNotificationUrl() : undefined;

        const opts: Record<string, unknown> = {
            public_id: publicId,
            use_filename: false,
            unique_filename: false,
            overwrite: false,
            // Native PDFs as raw — many Cloudinary accounts block image PDF CDN delivery.
            resource_type: "raw",
        };

        if (needsConversion) {
            opts.raw_convert = "aspose";
            if (notificationUrl) {
                opts.notification_url = notificationUrl;
            }
        }

        const result = await this.uploadStream(buffer, opts);
        const originalUrl = result.secure_url ?? result.url ?? "";

        if (needsConversion) {
            return {
                publicId,
                originalUrl,
                pdfUrl: this.buildPdfUrl(publicId),
                needsConversion: true,
            };
        }

        const pdfUrl = uploadAsPdf ? originalUrl : this.buildPdfUrl(publicId);

        return {
            publicId,
            originalUrl,
            pdfUrl,
            needsConversion: false,
        };
    }

    private uploadStream(
        buffer: Buffer,
        opts: Record<string, unknown>,
    ): Promise<{ secure_url?: string; url?: string }> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(opts, (error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new Error("Cloudinary upload returned no result"));
                resolve(result);
            });
            streamifier.createReadStream(buffer).pipe(uploadStream);
        });
    }
}

export const cloudinaryService = new CloudinaryService();
