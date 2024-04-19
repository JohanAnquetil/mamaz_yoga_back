const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/sequelize');
const UserMeta = require('../models/users_meta')
class User extends Model {}

User.init({
    ID:{
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    user_login:{
        type: DataTypes.STRING(20),
        allowNull:false,
        unique: {
            msg: 'Login déjà utilisé'
        }
    },
    user_pass:{
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    user_nicename:{
        type: DataTypes.STRING(50),
        allowNull: false
    },
    user_email:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    user_url: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    user_registered: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: '0000-00-00 00:00:00 ',
    },
    user_activation_key:{
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    user_status:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    display_name:{
        type:DataTypes.STRING(250),
        allowNull: false
    }},{
        sequelize,
        modelName: 'User',
        tableName: 'mod350_users',
        timestamps: false,
      })

module.exports = User;

User.hasMany(UserMeta, { foreignKey: 'user_id' });
UserMeta.belongsTo(User, { foreignKey: 'user_id' });