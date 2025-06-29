'use strict';

export default{
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('users', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true
        },
        first_name: {
          type: Sequelize.STRING
        },
        last_name: {
          type: Sequelize.STRING
        },
        email: {
          type: Sequelize.STRING
        },
        role: {
          type: Sequelize.ENUM('owner', 'employee', 'customer'),
          allowNull: false,
          defaultValue: 'customer'      
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        }
      }, { transaction });
  
      await queryInterface.addIndex('users', ['email'], { transaction });
  
      await transaction.commit();      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};