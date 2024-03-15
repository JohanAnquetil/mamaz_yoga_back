const { DataTypes, Model } = require('sequelize');
const { sequelize} = require('../../config/sequelize');
const Post = require('../models/posts.js');

class PostMeta extends Model {}

PostMeta.init({
  meta_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  post_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  meta_key: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  meta_value: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'PostMeta',
  tableName: 'mod350_postmeta',
  timestamps: false,
});

module.exports = PostMeta;