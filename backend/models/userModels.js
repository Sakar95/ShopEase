import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : true,
            trim : true
        },

        email :{
            type : String,
            required :true
        },

        password : {
            type : String,
            required :true,
            unique : true
        },

        phone :{
            type : Number,
            required : true
        },

        address : {
            type : String,
            required :true
        },
        securityAns : {
            type : String,
            require : true
        },
        cartItem :[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        }],
        role : {
            type : Number,
            default : 0
        }
    },
    {
        timestamps : true
    }
)

export const User = mongoose.model("User",userSchema)