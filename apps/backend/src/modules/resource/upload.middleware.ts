import multer from 'multer';
import type { Request, Response, NextFunction } from 'express';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export function maybeSingle(field = 'file') {
    return (req: Request, res: Response, next: NextFunction) => {
        const ct = req.headers['content-type'] || '';
        if (typeof ct === 'string' && ct.includes('multipart/form-data')) {
            return upload.single(field)(req as any, res as any, next as any);
        }
        return next();
    };
}

export default upload;
