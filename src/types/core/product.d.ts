import { IBrand } from './brand';
import { IManufacturer } from './manufacturer';
import { ICategory } from './category';
import { IMedia } from './media';

export interface IProduct {
    state?: string;
    name?: string;
    industrial_code?: string;
    adult?: string;
    brand?: IBrand;
    manufacturer?: IManufacturer;
    category?: ICategory[];
    media?: IMedia;
    detail?: string;
}
