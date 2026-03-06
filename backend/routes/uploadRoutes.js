import path from 'path';
import express from 'express';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        const dir = 'uploads/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
        );
    }
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp|mp4|webm/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images and Videos only!'));
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// @desc    Upload multiple files
// @route   POST /api/upload
// @access  Public (or Private depending on needs, simple setup for now)
router.post('/', upload.array('images', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send({ message: 'No files uploaded' });
    }

    // Safely map only string filename URL paths
    const filePaths = req.files.map(file => {
        if (!file || !file.path) return '';
        // Make absolutely sure we are just storing the string path
        const normalizedPath = file.path.replace(/\\/g, '/');
        // Return relative to uploads dir without absolute C: references
        return `/${normalizedPath}`;
    }).filter(p => typeof p === 'string' && p.trim() !== '');

    res.send({
        message: 'Files Uploaded Successfully',
        images: filePaths,
    });
});

export default router;
