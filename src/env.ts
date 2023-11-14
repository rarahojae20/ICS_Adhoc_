import * as dotenv from 'dotenv'; //.env.test 파일안에있는 환경변수들을 찾아서 테스트하는 라이브러리
import * as path from 'path';
import fs from 'fs';
import appRoot from 'app-root-path';

import * as pkg from '../package.json';
import { getOsEnv, normalizePort, getOsEnvOptional, getOsEnvNumberOptional, getOsEnvNumber } from './lib/env';

/**
 * Load .env file or for tests the .env.test file.
 */

const postfix = () => { //NODE_ENV기반으로  .env파일의 postfix를 결정
    const envs = [ ['prod', ''], ['dev']]; //NODE_ENV가 prod일 경우 .env.prod dev일경우 .env.dev  //dev나 prod가 일치하지않으면 그냥 .env파일경로 결정
    const env = process.env.NODE_ENV?.toLowerCase(); //Node.JS의 process객체를통해 접근

    if (!env) return '';

    let result = '.' + env;
    // return true 는 break
    // return false 는 continue
    envs.some(e => {
        const key = e[0];
        const found = env.includes(key);
        if (found) result = '.' + (e.length > 1 ? e[1] : key);

        return found;
    });

    return result;
}

const config = { path: path.join(appRoot.path, `.env${postfix()}`) };

(() => {
    try {
        if (fs.existsSync(config.path)) {
            //file exists
        } else {
            console.error(JSON.stringify(config));
            process.exit(1);
        }
    } catch(err) {
        console.error(JSON.stringify(config), err);
        process.exit(1);
    }
})();



dotenv.config(config); //.env.test 파일안에있는 환경변수들을 찾아서nod.js 사용되는 전역변수에 접근할수있게 해서

/**
 * Environment variables
 */
export const env = {
    mode: {
        prod: process.env.NODE_ENV?.toLowerCase().includes('prod'), 
        dev: process.env.NODE_ENV?.toLowerCase().includes('dev'),
        test: process.env.NODE_ENV?.toLowerCase().includes('test'),
        value: process.env.NODE_ENV?.toLowerCase(),
    },
    app: {
        name: getOsEnv('APP_NAME'),
        tenancy: getOsEnv('APP_DEFAULT_TENANCY'),
        version: (pkg as any).version,
        description: (pkg as any).description,
        port: normalizePort('3000'),
        web: {
            url: getOsEnv('APP_WEB_URL'),
        },
        cors: {
            origins: getOsEnvOptional('APP_CORS_ORIGINS') || getOsEnvOptional('APP_WEB_URL')
        },
    },
    auth: {
        apiKey: getOsEnvOptional('AUTH_API_KEY'),
    },
    mysql: {
        port: getOsEnv('MYSQL_PORT'),
        schema: getOsEnv('MYSQL_SCHEMA'),
        read: {
            host: getOsEnv('MYSQL_READ_HOST'),
            username: getOsEnv('MYSQL_READ_USERNAME'),
            password: getOsEnv('MYSQL_READ_PASSWORD'),
        },
        write: {
            host: getOsEnv('MYSQL_WRITE_HOST'),
            username: getOsEnv('MYSQL_WRITE_USERNAME'),
            password: getOsEnv('MYSQL_WRITE_PASSWORD'),
        },
        core: {
            port: getOsEnv('MYSQL_CORE_PORT'),
            schema: getOsEnv('MYSQL_CORE_SCHEMA'),
            read: {
                host: getOsEnv('MYSQL_CORE_READ_HOST'),
                username: getOsEnv('MYSQL_CORE_READ_USERNAME'),
                password: getOsEnv('MYSQL_CORE_READ_PASSWORD'),
            },
            write: {
                host: getOsEnv('MYSQL_CORE_WRITE_HOST'),
                username: getOsEnv('MYSQL_CORE_WRITE_USERNAME'),
                password: getOsEnv('MYSQL_CORE_WRITE_PASSWORD'),
            },
        }
    },
    core: {
        api: {
            item: getOsEnv('CORE_ITEM_API'),
            order: getOsEnv('CORE_ORDER_API'),
        }
    },
    shopping: {
        qoo10: {
            uri: getOsEnv('QOO10_URL'),
            commonParams: {
                v: getOsEnv('QOO10_APP_VERSION'),
                returnType: getOsEnv('QOO10_APP_RETURNTYPE'),
            },
            api: {
                key: getOsEnvOptional('QOO10_API_KEY'),
            },
            user: getOsEnv('QOO10_USER'),
        },
        rakuten: {
            serviceSecret: getOsEnv('RAKUTEN_SERVICE_SECRECT'),
            licenseKey: getOsEnv('RAKUTEN_LICENSE_KEY'),
            url: getOsEnv('RAKUTEN_BASE_URL'),
        },
    },

    courier: {
        sagawa: {
            tracking: {
                url: getOsEnvOptional('SAGAWA_TRACKING_URL'),
            }
        },
        yamato: {
            tracking: {
                url: getOsEnvOptional('YAMATO_TRACKING_URL'),
            }
        },
        usps: {
            url: getOsEnvOptional('USPS_URL'),
            token: getOsEnvOptional('USPS_TOKEN'),
        },
        fedex: {
            url: getOsEnvOptional('FEDEX_URL'),
            apikey: getOsEnvOptional('FEDEX_API_KEY'),
            secret: getOsEnvOptional('FEDEX_SECRET_KEY'),
            accountNumber: getOsEnvOptional('FEDEX_ACCOUNT_NUMBER'),
        },
        yto: {
            url: getOsEnv('YTO_URL'),
            apikey: getOsEnvOptional('YTO_API_KEY'),
            secret: getOsEnvOptional('YTO_SECRET_KEY'),
            accountNumber: getOsEnvOptional('YTO_ACCOUNT_NUMBER'),
            tracking: {
                url: getOsEnv('USPS_TRACKING_URL'),
            }
        },
        zto: { 
            url: getOsEnv('ZTO_URL'),
            secret:getOsEnv('ZTO_SECRET_KEY'),
            appkey:getOsEnv('ZTO_APP_CODE'),
        },
        efs: { 
            apikey: getOsEnvOptional('EFS_API_KEY'),
            secret: getOsEnvOptional('EFS_SECRET_KEY'),

        }
    },

    // google: {
    //     location: getOsEnv('GOOGLE_LOCATION'),
    //     project: {
    //         name: getOsEnvOptional('GOOGLE_PROJECT_NAME'),
    //     },
    // },
    aws: {
        s3: {
            image: {
                key: {
                    id: getOsEnvOptional('AWS_S3_ACCESS_KEY_ID'), //
                    secret: getOsEnvOptional('AWS_S3_ACCESS_KEY_SECRET'),
                },
                bucket: getOsEnvOptional('AWS_S3_IMAGE_BUCKET'),
                path: `images`,
            },
            template: {
                bucket: getOsEnv('AWS_S3_TEMPLATE_BUCKET'),
            },
        },
        region: getOsEnv('AWS_REGION'),
        ses: {
            accessKey: getOsEnv('SES_ACCESS_KEY'),
            secretKey: getOsEnv('SES_SECRET_KEY'),
            sender: getOsEnv('AWS_SES_SENDER'),
            receiverDomains: getOsEnvOptional('AWS_SES_RECEIVER_DOMAINS'),
        },
        sqs: {
            accessKeyId: getOsEnvOptional('SQS_ACCESS_KEY'),
            secretAccessKey: getOsEnvOptional('SQS_SECRET_KEY'),
            region: getOsEnvOptional('AWS_REGION'),
            queueUrl: getOsEnvOptional('AWS_SQS_QUEUE_URL'),
            messageGroupId: getOsEnvOptional('AWS_SQS_MESSAGE_GROUP_ID'),
        },
    },
    korea: {
        exim: {
            bank: {
                url: getOsEnv('KOREA_EXIM_BANK_BASE_URL'),
                api: {
                    key: getOsEnvOptional('KOREA_EXIM_BANK_API_KEY'),
                }
            }
        }
    },
    agente: {
        url: {
            export: {
                check: getOsEnvOptional('AGENTE_EXPORT_CHECK_URL'),
                register: getOsEnvOptional('AGENTE_EXPORT_REGISTER_URL'),
            },
            simplifiedExport: {
                check: getOsEnvOptional('AGENTE_SIMPLIFIED_EXPORT_CHECK_URL'),
                register: getOsEnvOptional('AGENTE_SIMPLIFIED_EXPORT_REGISTER_URL'),
            },
        },
        service: {
            key: getOsEnvOptional('AGENTE_SERVICE_KEY'),
        },
    },
    flight: {
        api: {
            url: getOsEnvOptional('FLIGHT_API_URL'),
            key: getOsEnvOptional('FLIGHT_API_KEY'),
        }
    }
};

