import { env } from "../env";
import logger from "./logger";
import {
    DeleteMessageBatchCommand, GetQueueAttributesCommand, Message,
    ReceiveMessageCommand,
    SendMessageCommand,
    SQSClient
} from "@aws-sdk/client-sqs";
// import YamatoService from "../tracker/yamato/yamato.service";
// import UspsService from "../tracker/usps/usps.service";
import { Waybill } from "../models/waybill.model";
import YtoService from "src/courier/yto/yto.service";
import FedexService from "src/courier/fedex/fedex.service";

export default class AwsSQS {
    private sqs: SQSClient;

    constructor () {
        this.sqs = new SQSClient({
            region: env.aws.sqs.region,
            credentials: {
                accessKeyId: env.aws.sqs.accessKeyId,
                secretAccessKey: env.aws.sqs.secretAccessKey,
            },
        });
    }// constructor

    private getQueueMessageCount = async () => {
        const params = {
            QueueUrl: env.aws.sqs.queueUrl,
            AttributeNames: ['ApproximateNumberOfMessages'],
        };
        try {
            const command = new GetQueueAttributesCommand(params);
            const response = await this.sqs.send(command);
            const messageCount = response.Attributes.ApproximateNumberOfMessages;

            return messageCount;
        } catch (e: any) {
            logger.err(JSON.stringify(e));
            return null;
        }
    }// getQueueMessageCount

    public sendMessage = async (waybill_no: Waybill) => {
        const messageBody = JSON.stringify(waybill_no);
        const params = {
            QueueUrl: env.aws.sqs.queueUrl,
            MessageBody: messageBody,
        }
        try {
            const command = new SendMessageCommand(params);
            const response = await this.sqs.send(command);
            logger.log(`sendMessage response = ${JSON.stringify(response)}`);
        } catch (e: any) {
            logger.err(JSON.stringify(e));
        }
    }// sentMessage

    public sendMessages = async (waybill_nos) => {
        try {
            for (const waybill_no of waybill_nos) {
                const messageBody = JSON.stringify(waybill_no);
                const params = {
                    QueueUrl: env.aws.sqs.queueUrl,
                    MessageBody: messageBody,
                }
                const command = new SendMessageCommand(params);
                const response = await this.sqs.send(command);
            }
        } catch (e: any) {
            logger.err(JSON.stringify(e));
        }
    }// sentMessages

    public receiveMessages = async (maxMessages: number) => {
        const params = {
            QueueUrl: env.aws.sqs.queueUrl,
            MaxNumberOfMessages: 10,
        }
        let messagesArr = [];
        try {
            for(let i = 0; i < maxMessages; i++){
                const command = new ReceiveMessageCommand(params);
                const response = await this.sqs.send(command);
                const messages = response?.Messages;

                if (messages && messages.length > 0) {
                    messagesArr = messagesArr.concat(messages);
                }
                if (messages.length < 10) break;
            }
            logger.log(`receiveMessages result = ${messagesArr}`);
            return messagesArr;
        } catch (e: any) {
            logger.err(JSON.stringify(e));
            return null;
        }
    }// receiveMessage

    private processMessages = async (messages: Message[]) => {
        const deleteTrackings = [];
        const updateTrackings = [];

        for (const message of messages) {
            let isFinished = false;
            const trackingMessage = JSON.parse(message?.Body);

            switch (trackingMessage.courier) {
                // case 'sagawa':
                //     isFinished = await new SagawaService().track(trackingMessage.waybill_no);
                //     break;
                // case 'yamato':
                //     isFinished = await new YamatoService().track(trackingMessage.waybill_no);
                //     break;
                // case 'usps':
                //     isFinished = await new UspsService().track(trackingMessage.waybill_no);
                //     break;
                
                // case 'yto':
                //     isFinished = await new YtoService().track(trackingMessage.waybill_no);
                //     break;
    
                default:
                    isFinished = true;
            }
            if (isFinished) {
                deleteTrackings.push(message);
            } else {
                updateTrackings.push(message);
            }
        }
        return { updateTrackings, deleteTrackings };
    }// processMessage

    public deleteMessages = async (messages) => {
        if (!messages || messages.length <= 0) {
            return;
        }
        const entries = messages?.map((message) => ({
            Id: message.MessageId,
            ReceiptHandle: message.ReceiptHandle,
        }));
        const params = {
            QueueUrl: env.aws.sqs.queueUrl,
            Entries: entries,
        };
        try {
            const command = new DeleteMessageBatchCommand(params);
            const response = await this.sqs.send(command);
            logger.debug(`deleteMessages response = ${JSON.stringify(response)}`);
        } catch (e: any) {
            logger.err(JSON.stringify(e));
        }
    }// deleteMessage

    public processAndDeleteMessages = async (maxMessages: number) => {
        const trackings = await this.receiveMessages(maxMessages);
        logger.log(`receivie ${trackings?.length} Messages`);

        if (trackings && trackings.length > 0) {
            const { updateTrackings, deleteTrackings } = await this.processMessages(trackings);
            if (deleteTrackings && deleteTrackings.length > 0){
                await this.deleteMessages(deleteTrackings);
            }
            if (updateTrackings && updateTrackings.length > 0) {
                await this.deleteMessages(updateTrackings);
                await this.sendMessages(updateTrackings.map((message) => JSON.parse(message.Body)));
            }
        }
    }// processAndDeleteMessages

    public deleteAllMessages = async () => {
        const deleteTrackingArr = await this.receiveMessages(20);

        if (deleteTrackingArr && deleteTrackingArr.length > 0){
            await this.deleteMessages(deleteTrackingArr);
        }
    }// deleteAllMessages

}
