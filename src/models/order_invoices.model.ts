import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { Order } from './order.model';


interface OrderInvoiceAttributes {
  invoice_id: number;
  order_id: string;
  sku: string;
  ename: string;
  cname: string;
  quantity: number;
  unit: string;
  specification: string;
  unit_price: number;
  customs_ordination_no: string;
  remark: string;
  sale_addr: string;
  currency_code: string;
}

type OrderInvoicePk = 'invoice_id';
type OrderInvoiceId = OrderInvoice[OrderInvoicePk];
type OrderInvoiceOptionalAttributes = "invoice_id" | "order_id" | "sku" | "ename" | "cname" | "quantity" | "unit" | "specification" | "unit_price" | "customs_ordination_no" | "remark" | "sale_addr" | "currency_code";
type OrderInvoiceCreationAttributes = Optional<OrderInvoiceAttributes, OrderInvoiceOptionalAttributes>;

export class OrderInvoice extends Model<OrderInvoiceAttributes, OrderInvoiceCreationAttributes> implements OrderInvoiceAttributes {
  invoice_id: number;
  order_id: string;
  sku: string;
  ename: string;
  cname: string;
  quantity: number;
  unit: string;
  specification: string;
  unit_price: number;
  customs_ordination_no: string;
  remark: string;
  sale_addr: string;
  currency_code: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof OrderInvoice {
    return OrderInvoice.init(
      {
        invoice_id: {
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
        sku: {
          type: DataTypes.STRING(200),
        },
        ename: {
          type: DataTypes.STRING(500),
        },
        cname: {
          type: DataTypes.STRING(500),
        },
        quantity: {
          type: DataTypes.INTEGER,
        },
        unit: {
          type: DataTypes.STRING(50),
        },
        specification: {
          type: DataTypes.STRING(50),
        },
        unit_price: {
          type: DataTypes.DECIMAL,
        },
        customs_ordination_no: {
          type: DataTypes.STRING(500),
        },
        remark: {
          type: DataTypes.STRING(200),
        },
        sale_addr: {
          type: DataTypes.STRING(200),
        },
        currency_code: {
          type: DataTypes.STRING(3),
        },
      },
      {
        sequelize,
        tableName: 'order_invoices',
        timestamps: false,
      }
    );
  }
}
