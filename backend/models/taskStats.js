module.exports = (sequelize, DataTypes) => {
  const TaskStats = sequelize.define('TaskStats', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    totalTasks: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    completedTasks: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    upcomingTasks: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    completionRate: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    }
  });

  TaskStats.associate = (models) => {
    TaskStats.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return TaskStats;
};