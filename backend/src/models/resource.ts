import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Resource extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public filePath!: string;
  public mediaType!: string;
}

Resource.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mediaType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Resource',
    tableName: 'resources',
  }
);

export default Resource;