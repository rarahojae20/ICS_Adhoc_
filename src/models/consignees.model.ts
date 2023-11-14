import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { Order } from './order.model';

interface ConsigneeAttributes {
  consignee_id: number;
  order_id: string;////order모델과의 외래키
  name: string;
  ename: string;
  company: string;
  country_code: string;
  province_name: string;
  city_name: string;
  area_name: string;
  address: string;
  post_code: string;
  mobile: string;
  phone: string;
  email: string;
  certificate_type: string;
  certificate_number: string;
}

type ConsigneePk = 'consignee_id';
type ConsigneeId = Consignee[ConsigneePk];
type ConsigneeOptionalAttributes = "consignee_id" | "order_id" | "name" | "ename" | "company" | "country_code" | "province_name" | "city_name" | "area_name" | "address" | "post_code" | "mobile" | "phone" | "email" | "certificate_type" | "certificate_number";
type ConsigneeCreationAttributes = Optional<ConsigneeAttributes, ConsigneeOptionalAttributes>;

export class Consignee extends Model<ConsigneeAttributes, ConsigneeCreationAttributes> implements ConsigneeAttributes {
  consignee_id: number;
  order_id: string;
  name: string;
  ename: string;
  company: string;
  country_code: string;
  province_name: string;
  city_name: string;
  area_name: string;
  address: string;
  post_code: string;
  mobile: string;
  phone: string;
  email: string;
  certificate_type: string;
  certificate_number: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof Consignee {
    return Consignee.init(
      {
        consignee_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        order_id: {
          type: DataTypes.STRING(50),
          references: {
            model: Order,
            key: 'order_id',
          },
        },
        name: {
          type: DataTypes.STRING(200),
        },
        ename: {
          type: DataTypes.STRING(200),
        },
        company: {
          type: DataTypes.STRING(100),
        },
        country_code: {
          type: DataTypes.STRING(2),
        },
        province_name: {
          type: DataTypes.STRING(100),
        },
        city_name: {
          type: DataTypes.STRING(100),
        },
        area_name: {
          type: DataTypes.STRING(100),
        },
        address: {
          type: DataTypes.STRING(200),
        },
        post_code: {
          type: DataTypes.STRING(20),
        },
        mobile: {
          type: DataTypes.STRING(100),
        },
        phone: {
          type: DataTypes.STRING(200),
        },
        email: {
          type: DataTypes.STRING(100),
        },
        certificate_type: {
          type: DataTypes.STRING(2),
        },
        certificate_number: {
          type: DataTypes.STRING(50),
        },
      },
      {
        sequelize,
        tableName: 'consignees',
        timestamps: false,
      }
    );
  }
}

