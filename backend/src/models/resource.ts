import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface ResourceAttributes {
  id: number;
  title?: string;
  description?: string;
  filePath?: string;
  mediaType?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ResourceCreationAttributes extends Optional<ResourceAttributes, 'id'> {}

class Resource extends Model<ResourceAttributes, ResourceCreationAttributes> implements ResourceAttributes {
  public id!: number;
  public title?: string;
  public description?: string;
  public filePath?: string;
  public mediaType?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize): void {
    Resource.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        filePath: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        mediaType: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'Resources',
        timestamps: true,
      }
    );
  }
}

export default Resource;