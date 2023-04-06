import {
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Sequelize
} from "sequelize";
import Guild from "./guild.js";

export default class IgnoreChannel extends Model<InferAttributes<IgnoreChannel>, InferCreationAttributes<IgnoreChannel>> {
    declare id: string;
    declare GuildId: ForeignKey<Guild["id"]>;

    static initialize(sequelize: Sequelize): void {
        this.init({
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            }
        }, {
            sequelize,
            modelName: "IgnoreChannel"
        });
    }
}
