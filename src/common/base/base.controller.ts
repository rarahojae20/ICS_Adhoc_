import { Builder } from 'builder-pattern';
import { prune } from '../../lib/utils';
import { ITemplate } from '../../types/template';

export abstract class BaseController {
    protected extractBodyTemplate = (body): ITemplate => {
        if (!body) return {};

        const template = Builder<ITemplate>()
            .title(body.title)
            .name(body.name)
            .arguments(body.arguments)
            .storage(body.storage)
            .build();

        return prune(template);
    }

}
