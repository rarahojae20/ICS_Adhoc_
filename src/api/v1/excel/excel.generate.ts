// generateExcel.ts

import { RolesAnywhere } from 'aws-sdk';
import ExcelJS from 'exceljs';
import { CsHeaderColumnNames, NoticeHeaderColumnNames } from '../../../../src/lib/excel.common';
import { ICombinedInterface } from '../../../../src/types/core/noticecscomment';

export default class ExcelService {
    public generateExcel = async (data: ICombinedInterface[], requiredFields: string[]): Promise<Buffer> => {

        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data');
        let headerType;



        switch (data[0].type) {
            case 'notice':
                headerType = NoticeHeaderColumnNames;
                break;
            case 'cs':
                headerType = CsHeaderColumnNames;
                break;
            default:
                throw new Error('Invalid data type');
        }

        
        // 엑셀 헤더 생성
        const headerRow = requiredFields.map(field => {
        

            const header = headerType.find(column => column.key === field);
            return header ? header.name : field;
        });
        worksheet.addRow(headerRow);

        // 데이터를 Excel 행에 삽입
        data.forEach((item: ICombinedInterface) => {
            const row = requiredFields.map(field => {
                const column = headerType.find(column => column.key === field);
                return column ? item[column.key] : '';
            });
            worksheet.addRow(row);
        });

        // Excel 파일을 Buffer로 변환하여 반환
        const excelBuffer = await workbook.xlsx.writeBuffer();
        return excelBuffer as Buffer;
    };
}

