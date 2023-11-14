export interface IEmail {
    _id?: number;
    to: string;
    status: string;
    message_id: string;
    reason?: string;
    sent_at?: Date;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}
