import aws from 'aws-sdk';
import path from 'path';
import logger from '../lib/logger';
import { env } from '../env';


aws.config.update({
    accessKeyId: env.aws.ses.accessKey,
    secretAccessKey: env.aws.ses.secretKey,
    region: env.aws.region,
});

export const s3 = new aws.S3();

export const deleteBucketImage = async(imageUrl): Promise<void> => {
    const basename = path.basename(imageUrl);

    s3.deleteObject(
        {
            Bucket: `${env.aws.s3.image.bucket}`,
            Key: `${env.aws.s3.image.path}/${basename}`, // 버켓 내 경로
        },
        (err, data) => {
            if (err) {
                logger.error(err);
            }
            if (data) {
                logger.log('deleteBucketImage ', basename, JSON.stringify(data));
            }
        }
    )
};

// 다음 업데이트 때 s3관련 코드 클래스화 필요
export const getEmailTemplates = async (s3Key) => {
    try {
        const { Body } = await s3.getObject({
            Bucket: env.aws.s3.template.bucket,
            Key: s3Key
        }).promise();
        return Body.toString();
    } catch (e) {
        logger.error(e);
        return null;
    }
};
