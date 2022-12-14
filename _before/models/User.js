const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

const bcrypt = require('bcrypt');

//create our User model
class User extends Model {
    //set up method to run on instance data(per user) to check password
    checkPassword(loginPw){
        return bcrypt.compareSync(loginPw, this.password)
    }
}

//define table columns and configuration
User.init(
    {
        //table column definitions go here
        //define an id column
        id:{
            //user the special Sequelize DataTypes object provide what type of data it is 
            type: DataTypes.INTEGER,
            //this is the equivalent of SQLs not null option
            allowNull: false,
            //instruct that this is the primary key
            primaryKey: true,
            //turn on auto increment
            autoIncrement: true
        },
        //define a username colum
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        //define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            //there cannot be any duplicate email values
            unique: true,
            //if allowNull is set to false, we can run our data through validators before creating the table data
            validate:{
                isEmail: true
            }
        },
        //define a pw column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //the means the pw must be atleast 4 char long
                len: [4]
            }
        }
    },
    {   
        hooks: {
            // // set up beforeCreate lifecycle "hook" functionality
            // beforeCreate(userData){
            //     return bcrypt.hash(userData.password, 10 ).then(newUserData => {
            //         return newUserData
            //     })
            // }

            async beforeCreate (newUserData){
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            //set up beforeUpdate lifecycle "hook" functionality
            async beforeUpdate(updatedUserData){
                updatedUserData.password = await bcrypt.hash (updatedUserData.password, 10);
                return updatedUserData;
            }
        },
 

        //pass in our imported sequelize connection (the direct connection to our database)
        sequelize,
        //dont automatically create createedAt/updateAt timestamp fields
        timestamps: false,
        //dont pluralize name of database table
        freezeTableName: true,
        //use underscores instead of camelcasing
        underscored: true,
        //make it so our model name stays lowercase in the database
        modelName: 'user'

    }
);


module.exports = User;