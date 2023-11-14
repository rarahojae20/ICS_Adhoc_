/* eslint-disable @typescript-eslint/no-explicit-any */
import { Builder } from 'builder-pattern';

import FileRepository from './file.repository';

import { IFile } from '../../../types/file';

import logger from '../../../lib/logger';
import { deleteBucketImage } from '../../../lib/aws';

export default class FileService {
	public list = async(where: any): Promise<IFile[]> => {
		return await new FileRepository().findAll(where);
	};

    public get = async(fileId: number): Promise<IFile> => {
		return await new FileRepository().findOne(fileId);
	};

    public create = async(where: any, files: any): Promise<IFile[]> => {
        const result: IFile[] = [];

        for (const file of files) {
            const param = Builder<IFile>()
                .board_id(where.board_id)
                .comment_id(where.comment_id)
                .storage(file)
                .build();

            const created = await new FileRepository().create(param);
            result.push(created);
        }

        return result;
	};

    /**
     * 버킷의 이미지를 지우고 DB상 데이터를 물리적으로 삭제 후
     * 처음부터 새로 파일을 생성한다.
     *
     * @param fileId
     * @param files
     * @returns
     */
    public update = async(where: any, files: any): Promise<IFile[]> => {
        await this.delete(where);
        return await this.create(where, files);
	};

    public delete = async(where: any): Promise<IFile[]> => {
        const files = await new FileRepository().delete(where);
        if (files.length > 0) {
            for (const file of files) {
                logger.log('file:', file);
                const storage: any = file.getDataValue('storage');
                await deleteBucketImage(storage.location);
            }
        }

		return files;
	};
}
