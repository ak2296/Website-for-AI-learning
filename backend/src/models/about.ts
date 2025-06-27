// models/about.ts
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface AboutAttributes {
  id: number;
  title?: string | null;
  content?: string | null;
  imagePath: string;
  mediaType?: string | null; // Add mediaType
  createdAt?: Date;
  updatedAt?: Date;
}

interface AboutCreationAttributes extends Optional<AboutAttributes, 'id'> {}

class About extends Model<AboutAttributes, AboutCreationAttributes> implements AboutAttributes {
  public id!: number;
  public title!: string | null;
  public content!: string | null;
  public imagePath!: string;
  public mediaType?: string | null; // Add mediaType to the model
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize): void {
    About.init(
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
        content: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        imagePath: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        mediaType: {
          type: DataTypes.STRING,
          allowNull: true, // Optional, matching multer's mimetype
        },
      },
      {
        sequelize,
        tableName: 'about',
        timestamps: true,
      }
    );
  }
}

export default About;