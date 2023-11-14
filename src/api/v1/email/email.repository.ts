import { Emails } from "../../../models/emails.model";

export default class EmailRepository {
	public async getEmails(query) {
		return await Emails.findAll({
			where: query,
			order: [['sent_at', 'DESC']],
			raw: true
		});
	}

	public async createEmailWithStatus(to: string, messageId: string, status: string, failureReason?: string) {
		const email = await Emails.create({
			to,
			message_id: messageId,
			status,
			reason: failureReason,
			sent_at: new Date()
		});
		return email;
	}
}
