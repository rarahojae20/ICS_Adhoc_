import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { Order } from './order.model';


interface ShipperAttributes {
  shipper_id: number;
  order_id: string; //order모델과의 외래키
  name: string;
  company: string;
  country_code: string;
  province_name: string;
  city_name: string;
  address: string;
  post_code: string;
  area_name: string;
  mobile: string;
  phone: string;
  email: string;
}

export type ShipperPk = 'shipper_id';
export type ShipperId = Shipper[ShipperPk];
export type ShipperOptionalAttributes = "shipper_id" | "order_id" | "name" | "company" | "country_code" | "province_name" | "city_name" | "address" | "post_code" | "area_name" | "mobile" | "phone" | "email";
export type ShipperCreationAttributes = Optional<ShipperAttributes, ShipperOptionalAttributes>;

export class Shipper extends Model<ShipperAttributes, ShipperCreationAttributes> implements ShipperAttributes {
  shipper_id: number;
  order_id: string;
  name: string;
  company: string;
  country_code: string;
  province_name: string;
  city_name: string;
  address: string;
  post_code: string;
  area_name: string;
  mobile: string;
  phone: string;
  email: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof Shipper {
    return Shipper.init(
      {
        shipper_id: {
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
        address: {
          type: DataTypes.STRING(200),
        },
        post_code: {
          type: DataTypes.STRING(20),
        },
        area_name: {
          type: DataTypes.STRING(100),
        },
        mobile: {
          type: DataTypes.STRING(20),
        },
        phone: {
          type: DataTypes.STRING(50),
        },
        email: {
          type: DataTypes.STRING(100),
        },
      },
      {
        sequelize,
        tableName: 'shippers',
        timestamps: false,
      }
    );
  }
}

