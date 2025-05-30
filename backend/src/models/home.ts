import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface HomeAttributes {
  id: number;
  title?: string | null;
  content?: string | null;
  description?: string | null;
  imagePath?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface HomeCreationAttributes extends Optional<HomeAttributes, 'id'> {}

class Home extends Model<HomeAttributes, HomeCreationAttributes> implements HomeAttributes {
  public id!: number;
  public title?: string | null;
  public content?: string | null;
  public description?: string | null;
  public imagePath?: string | null; // Fixed syntax error by removing duplicate 'public'
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize): void {
    Home.init(
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
        description: {
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
        tableName: 'home',
        timestamps: true,
      }
    );
  }
}

export default Home;