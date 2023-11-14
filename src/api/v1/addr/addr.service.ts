import ApiCodes from '../../../lib/api.codes';
import ApiError from '../../../lib/api.error';
import ApiMessages from '../../../lib/api.messages';
import ApiDetailCodes from '../../../lib/api.detail.codes';
import { assertNotNull, prune } from '../../../lib/utils';
import * as CountryService from './countries';
import xlsx from 'xlsx';
import { Builder } from 'builder-pattern';
import { IJP_Address } from '../../../types/jp_address';
import AddrRepository from './addr.repository';
import AddressColumn from '../../../lib/jp_address.column';
import moment from 'moment';

export default class AddrService {
    protected countryCode: string;
    protected postalCode: string;
    protected address: string;

    public setCountryCode(countryCode: string) {
        this.countryCode = countryCode;
        return this;
    }

    public setpostalCode(postalCode: string) {
        this.postalCode = postalCode;
        return this;
    }

    public setAddress(address: string) {
        this.address = address;
        return this;
    }

    public async verifyAddress() {
        const serviceClassName = `${this.countryCode.toUpperCase()}AddrService`;
        const serviceClass = CountryService[serviceClassName];

        assertNotNull(serviceClass, new ApiError(ApiCodes.BAD_REQUEST, ApiMessages.BAD_REQUEST, {
            code: ApiDetailCodes.REQ_PARAM_INVALID,
            message: `Invalid country code: ${this.countryCode}`
        }))

        const params = {
            address: this.address,
            postalCode: this.postalCode
        };

        assertNotNull(params.address && params.postalCode, new ApiError(ApiCodes.BAD_REQUEST, ApiMessages.BAD_REQUEST, {
            code: ApiDetailCodes.REQ_PARAM_INVALID,
            message: `Address and postal_code are required.`
            })
        );

        return await new serviceClass().verifyAddress(params);
    }

    public async updateAddress(file: Express.Multer.File, agency: string) {
        const filename = file.path;
        const workbook = xlsx.readFile(filename);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        const addressList = jsonData.map((row: any) => {
            const address = this.createAddressFromRow(row, agency);
            return prune(address);
        });

        await new AddrRepository().removeAndCreateAddress(addressList, agency);

        return {
            address: {
                agency
            }
        };
    }

    private createAddressFromRow(row: any, agency: string): IJP_Address {
        const address = Builder<IJP_Address>()
            .postal_code(row[AddressColumn.POSTAL_CODE])
            .prefecture(row[AddressColumn.PREFECTURE])
            .municipality(row[AddressColumn.MUNICIPALITY])
            .town_area(row[AddressColumn.TOWN_AREA])
            .romanization(row[AddressColumn.ROMANIZATION])
            .prefecture_hi(row[AddressColumn.PREFECTURE_HI])
            .municipality_hi(row[AddressColumn.MUNICIPALITY_HI])
            .town_area_hi(row[AddressColumn.TOWN_AREA_HI])
            .office_code(row[AddressColumn.OFFICE_CODE])
            .area_code(row[AddressColumn.AREA_CODE])
            .added_at(moment(row[AddressColumn.ADDED_AT], 'YYYYMMDD').toDate())
            .agency(agency)
            .build();

        return address;
    }

}
