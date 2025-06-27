// models/admin.ts
import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import bcrypt from "bcrypt";

interface AdminAttributes {
  id?: number;
  username: string;
  password: string; // Hashed password
  skipHook?: boolean; // skipHook as an optional property
}

interface AdminCreationAttributes extends Optional<AdminAttributes, "id"> {}

class Admin extends Model<AdminAttributes, AdminCreationAttributes> implements AdminAttributes {
  public id!: number;
  public username!: string;
  public password!: string;
  public skipHook?: boolean; 

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Method to check password
  public async validPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  static initModel(sequelize: Sequelize): void {
    Admin.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        skipHook: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: "Admins",
        hooks: {
          beforeCreate: async (admin: any) => {
            if (admin.skipHook !== true && admin.password) {
              const salt = await bcrypt.genSalt(10);
              admin.password = await bcrypt.hash(admin.password, salt);
            }
          },
          beforeUpdate: async (admin: any) => {
            if (admin.skipHook !== true && admin.password) {
              const salt = await bcrypt.genSalt(10);
              admin.password = await bcrypt.hash(admin.password, salt);
            }
          },
        },
      }
    );
  }
}

// Export the class without initializing it here
export default Admin;