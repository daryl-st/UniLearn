import multer from 'multer';
import type { Request, Response, NextFunction } from 'express';

const ALLOWED_MIME = new Set([
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.oasis.opendocument.text',
    'text/plain',
]);

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 25 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const name = file.originalname.toLowerCase();
        const allowedExt = ['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.odt', '.txt'];
        const hasAllowedExt = allowedExt.some((ext) => name.endsWith(ext));
        const mime = (file.mimetype ?? '').toLowerCase();
        if (ALLOWED_MIME.has(mime) || hasAllowedExt) {
            cb(null, true);
            return;
        }
        cb(new Error('Unsupported file type. Upload PDF, PowerPoint, or Word files only.'));
    },
});

export function maybeSingle(field = 'file') {
    return (req: Request, res: Response, next: NextFunction) => {
        const ct = req.headers['content-type'] || '';
        if (typeof ct === 'string' && ct.includes('multipart/form-data')) {
            return upload.single(field)(req as any, res as any, (err: unknown) => {
                if (err instanceof multer.MulterError) {
                    const message =
                        err.code === 'LIMIT_FILE_SIZE'
                            ? 'File is too large (max 25 MB).'
                            : err.message;
                    return res.status(400).json({ error: message });
                }
                if (err instanceof Error) {
                    return res.status(400).json({ error: err.message });
                }
                return next(err as any);
            });
        }
        return next();
    };
}

export default upload;
