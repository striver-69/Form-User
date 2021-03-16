const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt')

//Schema for the user form.
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:7,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error("password cannot contain the word password")
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error("Age must be positive number")
            }
        }
    }
},{
    timestamps:true
})


userSchema.methods.toJSON=function(){
    const userobject=this.toObject()
    delete userobject.password

    return userobject
}


//statics methods are accessibe on models
userSchema.statics.findbyCredentials= async (email,password)=>{
    const user=await User.findOne({email})

    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch=await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }
    return user
}

//hash password before saving
userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,8)
    }

    next()
})

//Delete user tasks when the user is removed
userSchema.pre('remove',async function(next){
    const user =this
    await Task.deleteMany({owner:user._id})
    next()
})

const User=mongoose.model('User',userSchema)

module.exports=User