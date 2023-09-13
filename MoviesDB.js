const mongoose=require('mongoose');

const movies_schema=new mongoose.Schema({
    title:{type:String,required:true},
    Director:{type:String,required:true},
    IMDB_Rating:{type:Number,required:true},
});

const movies_DB= mongoose.model('movies_DB',movies_schema);

module.exports = movies_DB;