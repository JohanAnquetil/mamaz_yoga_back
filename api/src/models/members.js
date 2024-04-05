const { DataTypes, Model } = require('sequelize');
const { sequelize}  = require('../../config/sequelize');
const UserMeta = require('./users_meta');

class Member extends Model {}

Member.init({
  arm_member_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  arm_user_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false
  },
  arm_user_login: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  arm_user_pass: {
    type: DataTypes.STRING(64),
    allowNull: false
  },
  arm_user_nicename: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  arm_user_email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  arm_user_url: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  arm_user_registered: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW // Assurez-vous que cette valeur par défaut est appropriée
  },
  arm_user_activation_key: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  arm_user_status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  arm_display_name: {
    type: DataTypes.STRING(250),
    allowNull: false
  },
  arm_user_type: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  arm_primary_status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  arm_secondary_status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  arm_user_plan_ids: {
    type: DataTypes.TEXT,
    allowNull: true // La colonne peut être nulle selon votre structure
  },
  arm_user_suspended_plan_ids: {
    type: DataTypes.TEXT,
    allowNull: true // La colonne peut être nulle selon votre structure
  }
}, {
  sequelize,
  modelName: 'Member',
  tableName: 'mod350_arm_members',
  timestamps: false, // Remplacez par le nom réel de votre table
});


Member.hasMany(UserMeta, { foreignKey: 'user_id' });
UserMeta.belongsTo(Member, { foreignKey: 'user_id' });

module.exports = Member;
