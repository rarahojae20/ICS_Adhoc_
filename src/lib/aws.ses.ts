import AWS from 'aws-sdk';
import { env } from '../env';
import logger from '../lib/logger';

export default class AwsSES {
	private ses: AWS.SES;

	constructor() {
		this.ses = new AWS.SES({
			accessKeyId: env.aws.ses.accessKey,
			secretAccessKey: env.aws.ses.secretKey,
			region: env.aws.region,
		});
		logger.debug('env.aws', env.aws);
	}

	public sendEmail = async (dest: string[], subject: string, text: string) => {
		let result;
		const param = this.setMailFormat(dest, subject, text);

		try {
			result = await this.ses.sendEmail(param).promise();
			logger.debug('result', result.MessageId);
		} catch (e) {
			result = e;
		}
		return result;
	}

	private setMailFormat = (dest: string[], subject: string, text: string) => {
		return {
			Destination: {
				ToAddresses: dest,
			},
			Message: {
				Body: {
					Html: {
						Charset: 'UTF-8',
						Data: text,
					},
				},
				Subject: {
					Charset: 'UTF-8',
					Data: subject,
				},
			},
			Source: env.aws.ses.sender,
		};
	}
}
