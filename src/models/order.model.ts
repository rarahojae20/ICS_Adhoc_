import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { IConsignee } from 'src/types/consignee';
import { IOrderInvoice } from 'src/types/Invoice';
import { IShipper } from 'src/types/shipper';

interface OrderAttributes {
  order_id: string;
  channel_hawbcode: string;
  transport_mode_code: string;
  weight: number;
  weight_unit: string;
  piece: number;
  declare_type: number;
  remark: string;
  created_at: Date;

  shipper_id: number;
  consignee_id: number;
  order_invoice_id: number;

  shipper: IShipper; // Ishipper에 해당하는 타입이어야 함
  consignee: IConsignee; // IConsignees에 해당하는 타입이어야 함
  order_invoice: IOrderInvoice; // IOrderInvoices에 해당하는 타입이어야 함
}


export type OrderPk = 'order_id';
export type OrderId = Order[OrderPk];
export type OrderOptionalAttributes = "order_id" | "channel_hawbcode" | "transport_mode_code" | "weight" | "weight_unit" | "piece" | "declare_type" | "remark" | "created_at" | "shipper_id" | "consignee_id" | "order_invoice_id" | "shipper" | "consignee" | "order_invoice";
export type OrderCreationAttributes = Optional<OrderAttributes, OrderOptionalAttributes>;



export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  order_id: string;
  channel_hawbcode: string;
  transport_mode_code: string;
  weight: number;
  weight_unit: string;
  piece: number;
  declare_type: number;
  remark: string;
  created_at: Date;

  shipper_id: number;
  consignee_id: number;
  order_invoice_id: number;

  shipper: IShipper; // Ishipper에 해당하는 타입이어야 함
  consignee: IConsignee; // IConsignees에 해당하는 타입이어야 함
  order_invoice: IOrderInvoice; // IOrderInvoices에 해당하는 타입이어야 함

  static initModel(sequelize: Sequelize.Sequelize): typeof Order {
    return Order.init(
      
        {
          order_id: {
              type: DataTypes.STRING(50),
              primaryKey: true,
          },
          channel_hawbcode: {
              type: DataTypes.STRING(50),
          },
          transport_mode_code: {
              type: DataTypes.STRING(50),
          },
          weight: {
              type: DataTypes.DECIMAL,
          },
          weight_unit: {
              type: DataTypes.STRING(10),
          },
          piece: {
              type: DataTypes.INTEGER,
          },
          declare_type: {
              type: DataTypes.INTEGER,
          },
          remark: {
              type: DataTypes.STRING(500),
          },
          created_at: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          },
            shipper_id: {
              type: DataTypes.INTEGER,
          },
          consignee_id: {
              type: DataTypes.INTEGER,
          },
          order_invoice_id: {
              type: DataTypes.INTEGER,
          },
          shipper: {
              type: DataTypes.JSON, // 예시로 JSON 타입으로 정의되어 있음
          },
          consignee: {
              type: DataTypes.JSON,
          },
          order_invoice: {
              type: DataTypes.JSON,
          },

      },
      {
        sequelize,
        tableName: 'orders',
        timestamps: false,
      }
    );
  }
}
