const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/sequelize.js');
const User = require('../models/users.js');

class UserMeta extends Model {}

UserMeta.init({
    umeta_id:{
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id:{
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull:false,
        defaultValue: 0,
        references: {
            model: User,
            key: 'ID',
        }
    },
    meta_key:{
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    meta_value:{
        type: DataTypes.TEXT('long'),
        allowNull: true,
        defaultValue: null
    },},{
        sequelize,
        modelName: 'UserMeta',
        tableName: 'mod350_usermeta',
        timestamps: false,
      })

module.exports = UserMeta;