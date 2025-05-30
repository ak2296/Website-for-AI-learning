import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface AboutAttributes {
  id: number;
  title?: string;
  content?: string;
  imagePath?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AboutCreationAttributes extends Optional<AboutAttributes, 'id'> {}

class About extends Model<AboutAttributes, AboutCreationAttributes> implements AboutAttributes {
  public id!: number;
  public title?: string;
  public content?: string;
  public imagePath?: string;
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
          type: DataTypes.TEXT,
          allowNull: true,
        },
        imagePath: {
          type: DataTypes.STRING,
          allowNull: true,
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