// src/models/resource.ts
import { Sequelize, DataTypes, Model } from "sequelize";

export default class Resource extends Model {
  public id!: number;
  public filePath!: string;
  public title!: string;
  public description!: string;
  public mediaType!: string; // Ensure this is defined

  public static initModel(sequelize: Sequelize): void {
    Resource.init(
      {
        filePath: { type: DataTypes.STRING, allowNull: false },
        title: { type: DataTypes.STRING, allowNull: true },
        description: { type: DataTypes.TEXT, allowNull: true },
        mediaType: { type: DataTypes.STRING, allowNull: true }, // Add this line
      },
      { sequelize, modelName: "Resource" }
    );
  }
}