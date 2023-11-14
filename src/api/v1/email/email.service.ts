import EmailStatus from "../../../lib/email.status";
import EmailRepository from './email.repository';
import ejs from 'ejs';
import logger from '../../../lib/logger';
import AwsSES from '../../../lib/aws.ses';
import ApiCodes from '../../../lib/api.codes';
import ApiError from '../../../lib/api.error';
import ApiDetailCodes from '../../../lib/api.detail.codes';
import ApiMessages from '../../../lib/api.messages';
import TemplateService from "../templates/template.service";
import { env } from "../../../env";
import { getEmailTemplates } from "../../../lib/aws";
import { assertNotNull, assertTrue } from "../../../lib/utils";

export default class EmailService {
	public getEmails = async (query) => {
		// query 값이 없을 경우 빈 객체로 변환
		Object.keys(query).forEach((key) => (query[key] === undefined || query[key] === null) && delete query[key]);

		const result = await new EmailRepository().getEmails(query);
		return result;
	};

	verifyReceiverEmail = (address: string) => {
		const receiverList = env.aws.ses.receiverDomains?.split(',') || [];
		if (receiverList.length === 0) return;

		const isMatch = receiverList.some((domain) => address?.endsWith(`@${domain}`));
		assertTrue(isMatch, new ApiError(ApiCodes.BAD_REQUEST, ApiMessages.BAD_REQUEST, {
			message: `This address domain does not permitted.`,
			code: ApiDetailCodes.EMAIL_ADDRESS_INVALID,
		}));
	}

	public sendEmail = async ({ to, title, template }) => {
		assertNotNull(template?.id || template?.name, new ApiError(ApiCodes.BAD_REQUEST, ApiMessages.BAD_REQUEST, {
            message: 'template variable does not exists',
            code: ApiDetailCodes.REQ_PARAM_EMPTY,
        }))

		let baseline;
		if (template.id) {
			baseline = await new TemplateService().findOneById(template.id);
		} else if (template.name) {
			baseline = await new TemplateService().findOneByName(template.name);
		}

		assertNotNull(baseline, new ApiError(ApiCodes.BAD_REQUEST, ApiMessages.BAD_REQUEST, {
			message: 'template does not exists',
			code: ApiDetailCodes.REQ_PARAM_EMPTY,
		}));

		new TemplateService().checkContent(template, baseline);
		this.verifyReceiverEmail(to);

		title = title || baseline.title;

		const html = await this.setEmailForm(baseline.storage.s3_key, template.arguments);
		const dest = [to];
		const sendResult = await new AwsSES().sendEmail(dest, title, html);

		let result;
		const sesMessageId = sendResult?.MessageId || sendResult?.requestId;

		if (sendResult.MessageId) {
			result = await new EmailRepository().createEmailWithStatus(to, sesMessageId, EmailStatus.SUCCESS);
		} else {
			await new EmailRepository().createEmailWithStatus(to, sesMessageId, EmailStatus.FAIL, sendResult.message);
			throw new ApiError(ApiCodes.BAD_REQUEST, sendResult.code, {
				message: sendResult.message,
				code: ApiDetailCodes.EMAIL_SEND_FAIL,
			});
		}

		const encodedMessageId = Buffer.from(sesMessageId).toString('base64');
		const ret = {
			message_id: encodedMessageId,
			status: result.status,
			sent_at: result.sent_at,
		}
		return ret;
	};

	async setEmailForm(s3Key: string, args: object) {
		const template = await getEmailTemplates(s3Key);

		try {
			const res = ejs.render(template, args);
			return res;
		} catch (e) {
			logger.error(e);
			return null;
		}
	}
}
