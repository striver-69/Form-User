const mongoose=require('mongoose')

mongoose.connect('mongodb+srv://form:12345678abc@cluster0.f1ci4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true
})


