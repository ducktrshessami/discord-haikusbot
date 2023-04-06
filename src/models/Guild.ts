import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
    Sequelize
} from "sequelize";
import IgnoreChannel from "./IgnoreChannel.js";

export default class Guild extends Model<InferAttributes<Guild>, InferCreationAttributes<Guild>> {
    declare id: string;
    declare IgnoreChannels?: NonAttribute<Array<IgnoreChannel>>;

    static initialize(sequelize: Sequelize): void {
        this.init({
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            }
        }, {
            sequelize,
            modelName: "Guild"
        });
    }
}
