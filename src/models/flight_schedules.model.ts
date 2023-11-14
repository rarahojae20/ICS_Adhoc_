import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

/**
 * FLIGHT_SCHEDULES_DB
 * - _id
 * - flight_number // 항공편명
 * - origin_airport // 출발공항
 * - dest_airport // 도착공항
 * - filed_ete // 예상 비행시간
 * - scheduled_out // 게이트 출발 예정 시간
 * - estimated_out // 게이트 출발 예상 시간
 * - actual_out // 게이트 출발 실제 시간
 * - scheduled_off // 이륙 예정 시간
 * - estimated_off // 이륙 예상 시간
 * - actual_off // 이륙 실제 시간
 * - scheduled_on // 착륙 예정 시간
 * - estimated_on // 착륙 예상 시간
 * - actual_on // 착륙 실제 시간
 * - scheduled_in // 게이트 도착 예정 시간
 * - estimated_in // 게이트 도착 예상 시간
 * - actual_in // 게이트 도착 실제 시간
 * - status // 상태
 */

export interface FlightSchedulesAttributes {
    _id: number;
    flight_number?: string;
    origin_airport?: string;
    dest_airport?: string;
    filed_ete?: number;
    scheduled_out?: Date;
    estimated_out?: Date;
    actual_out?: Date;
    scheduled_off?: Date;
    estimated_off?: Date;
    actual_off?: Date;
    scheduled_on?: Date;
    estimated_on?: Date;
    actual_on?: Date;
    scheduled_in?: Date;
    estimated_in?: Date;
    actual_in?: Date;
    status?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export type FlightSchedulesPk = "_id";
export type FlightSchedulesId = FlightSchedules[FlightSchedulesPk];
export type FlightSchedulesCreationAttributes = Optional<FlightSchedulesAttributes, FlightSchedulesOptionalAttributes>;
export type FlightSchedulesOptionalAttributes = "_id" | "created_at" | "updated_at" | "deleted_at";

export class FlightSchedules extends Model<FlightSchedulesAttributes, FlightSchedulesCreationAttributes> implements FlightSchedulesAttributes {
    _id!: number;
    flight_number?: string;
    origin_airport?: string;
    dest_airport?: string;
    filed_ete?: number;
    scheduled_out?: Date;
    estimated_out?: Date;
    actual_out?: Date;
    scheduled_off?: Date;
    estimated_off?: Date;
    actual_off?: Date;
    scheduled_on?: Date;
    estimated_on?: Date;
    actual_on?: Date;
    scheduled_in?: Date;
    estimated_in?: Date;
    actual_in?: Date;
    status?: string;
    created_at!: Date;
    updated_at?: Date;
    deleted_at?: Date;

    static initModel(sequelize: Sequelize.Sequelize): typeof FlightSchedules {
        FlightSchedules.init({
            _id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                comment: "항공편 스케줄 ID"
            },
            flight_number: {
                type: DataTypes.STRING(20),
                allowNull: true,
                comment: "항공편명"
            },
            origin_airport: {
                type: DataTypes.STRING(20),
                allowNull: true,
                comment: "출발공항"
            },
            dest_airport: {
                type: DataTypes.STRING(20),
                allowNull: true,
                comment: "도착공항"
            },
            filed_ete: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: "예상 비행시간"
            },
            scheduled_out: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "게이트 출발 예정 시간"
            },
            estimated_out: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "게이트 출발 예상 시간"
            },
            actual_out: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "게이트 출발 실제 시간"
            },
            scheduled_off: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "이륙 예정 시간"
            },
            estimated_off: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "이륙 예상 시간"
            },
            actual_off: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "이륙 실제 시간"
            },
            scheduled_on: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "착륙 예정 시간"
            },
            estimated_on: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "착륙 예상 시간"
            },
            actual_on: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "착륙 실제 시간"
            },
            scheduled_in: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "게이트 도착 예정 시간"
            },
            estimated_in: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "게이트 도착 예상 시간"
            },
            actual_in: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "게이트 도착 실제 시간"
            },
            status: {
                type: DataTypes.STRING(20),
                allowNull: true,
                comment: "상태"
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                comment: "생성일",
                defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "수정일"
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "삭제일"
            }
        }, {
            sequelize,
            tableName: "flight_schedules",
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "_id" },
                    ]
                },
            ]
        });
        return FlightSchedules;
    }
}
