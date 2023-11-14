import { Sequelize } from 'sequelize';

import { env } from '../env';

import logger from '../lib/logger';

// marketplace
import { Items } from '../models/items.model';
import { Orders } from '../models/orders.model';
// email
import { Emails } from '../models/emails.model';
import { Templates } from '../models/templates.model';
// exchange
import { Exchange } from '../models/exchange.model';
// board
import { Board } from '../models/board.model';
import { Comment } from '../models/comment.model';
import { File } from '../models/file.model';
import { CS } from '../models/cs.model';

// tracker
import { Tracking } from '../models/tracking.model';
import { Waybill } from "../models/waybill.model";

// hscode
import { Hscodes } from '../models/hscodes.model';
import { Taxs } from '../models/taxs.model';

import { JP_Address } from '../models/jp_address.model';
import { Exports } from '../models/exports.model';
import { FlightSchedules } from '../models/flight_schedules.model';
import { NoticeCsComment } from '../../src/models/noticecscomment.model';
import { Shipper } from '../../src/models/shipper.model';
import { Consignee } from '../../src/models/consignees.model';
import { Invocation } from 'node-schedule';
import { OrderInvoice } from '../../src/models/order_invoices.model';
import { Order } from '../../src/models/order.model';

/**
 * sequelize-auto -o "./src/models/mysql" -d adhoc_marketplace -h localhost -p 3306 -e mysql -u root -x -l ts --cm p --indentation 4
 */
const sequelize = new Sequelize(env.mysql.schema, null, null, {
    dialect: 'mysql',
    dialectOptions: {
        connectTimeout: env.mode.prod ? 5000 : 60000 // 5s for prod, 1min for dev
    },
    port: parseInt(env.mysql.port, 10),
    replication: {
        read: [
            {
                host: env.mysql.read.host,
                username: env.mysql.read.username,
                password: env.mysql.read.password
            },
        ],
        write: {
            host: env.mysql.write.host,
            username: env.mysql.write.username,
            password: env.mysql.write.password
        }
    },
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        freezeTableName: true
    },
    timezone: '+09:00',
    logQueryParameters: env.mode.dev,
    logging: (query) => {
        if (query?.includes('SELECT 1+1 AS result')) return;
        logger.sql(query);
    }
});

const sequalizeCore = new Sequelize(env.mysql.core.schema, null, null, {
    dialect: 'mysql',
    dialectOptions: {
        connectTimeout: env.mode.prod ? 5000 : 60000 // 5s for prod, 1min for dev
    },
    port: parseInt(env.mysql.core.port, 10),
    replication: {
        read: [
            {
                host: env.mysql.core.read.host,
                username: env.mysql.core.read.username,
                password: env.mysql.core.read.password
            },
        ],
        write: {
            host: env.mysql.core.write.host,
            username: env.mysql.core.write.username,
            password: env.mysql.core.write.password
        }
    },
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        freezeTableName: true
    },
    timezone: '+09:00',
    logQueryParameters: env.mode.dev,
    logging: (query) => {
        if (query?.includes('SELECT 1+1 AS result')) return;
        logger.sql(query);
    }
});

export function initModels() {
    // marketplace
    Items.initModel(sequelize);
    Orders.initModel(sequelize);
    // email
    Emails.initModel(sequelize);
    Templates.initModel(sequelize);
    // exchange
    Exchange.initModel(sequelize);
    // board
    Board.initModel(sequelize);
    Comment.initModel(sequelize);
    File.initModel(sequelize);
    CS.initModel(sequelize);
    // hscode
    Hscodes.initModel(sequelize);
    Taxs.initModel(sequelize);
    // tracker
    Tracking.initModel(sequalizeCore);
    Waybill.initModel(sequelize);
    // address
    JP_Address.initModel(sequelize);
    // export
    Exports.initModel(sequelize);
    
    NoticeCsComment.initModel(sequelize);
    // Orders.initModel(sequelize);
    // Shipper.initModel(sequelize);
    // Consignee.initModel(sequelize);
    // OrderInvoice.initModel(sequelize);



    // Order.hasMany(Shipper, { foreignKey: 'order_id', as: 'shippers' });
    // Order.hasMany(Consignee, { foreignKey: 'order_id', as: 'consignees' });
    // Order.hasMany(OrderInvoice, { foreignKey: 'order_id' ,as: 'invoices' });
    // Shipper.belongsTo(Order, { foreignKey: 'shipper_id' , as: 'shippers'});
    // Consignee.belongsTo(Order, { foreignKey: 'consignee_id', as:'consignees' });
    // OrderInvoice.belongsTo(Order, { foreignKey: 'orderInvoice_id' ,as:'invoices'});

    NoticeCsComment.hasMany(File, { foreignKey: 'board_id' });
    File.belongsTo(NoticeCsComment, { foreignKey: 'board_id' });
    
    NoticeCsComment.hasMany(NoticeCsComment, {
        foreignKey: 'board_id',
        as: 'comments', // comments 관계로 접근할 수 있도록 설정
        constraints: false, // 외래 키 제약 조건 무시
        scope: {
            type: 'comment' // 댓글 타입만 가져오도록 설정
        }
    });
    

    // flights
    FlightSchedules.initModel(sequelize);

}

export {
    sequelize as mysql,
    sequalizeCore as mysqlCore
};

export function connect() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async(resolve, reject) => {
        initModels();

        try {
            await sequelize.authenticate();
            await sequalizeCore.authenticate();
            logger.log('MySQL Connection has been established successfully.');
            resolve(null);
        } catch (error) {
            logger.error('Unable to connect to the MySQL:', error);
            reject(error);
        }
    });
}
