import axios from 'axios';

import { IAxios } from '../types/axios';

export default class Axios {
    private config: IAxios;

    private constructor(config: IAxios) {
        this.config = config;
    }

    public async send() {
        let result;

        await axios(this.config)
            .then((response) => {
                result = response.data;
            })
            .catch((error) => {
                result = error.response;
            });

        return result;
    }

    public static setConfig(config: IAxios) {
        return new Axios(config);
    }
}
