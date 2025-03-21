const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: '#000000'
    },
    description: {
      type: DataTypes.TEXT
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Category.associate = (models) => {
    Category.belongsToMany(models.Task, {
      through: 'TaskCategories',
      foreignKey: 'categoryId'
    });
    
    Category.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return Category;
};