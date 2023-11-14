import multer from 'multer';
import multerS3 from 'multer-s3';
import { s3 } from './aws';
import { generateRandomString } from './utils';
import logger from './logger';
import { env } from '../env';
import {getValidFilename} from "./hangul";

export default class MiddleWare {
    private S3ImageUploadStorage = multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: `${env.aws.s3.image.bucket}`,
        key: function (req, file, cb) {
            logger.log(`origin: ${file.originalname}`);
            file.originalname = getValidFilename(file.originalname);
            logger.log(`convert: ${file.originalname}`);

            const parsed = file.originalname?.split('.');
            const filename = Array.isArray(parsed) && parsed?.length > 0 ? parsed[0] : '';
            const ext = Array.isArray(parsed) && parsed?.length > 1 ? parsed[1] : '';

            let obj = `${generateRandomString(32)}.${filename}`;
            if (ext?.length > 0) {
                obj += `.${ext}`;
            }

            const key = `${env.aws.s3.image.path}/${obj}`;
            logger.log('S3 file uploaded:', key);
            cb(null, key);
        },
    });

    uploadS3Image = multer({
        storage: this.S3ImageUploadStorage,
    });

    uploadAddressFile = multer({ dest: 'addressData/'});
}

