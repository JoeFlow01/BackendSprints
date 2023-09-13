const movies_DB=require('./MoviesDB');
const express=require('express');
const mongoose=require('mongoose')
const fs=require('fs');
let request_id=0;

mongoose.connect("mongodb://127.0.0.1:27017/sprints",{})
.then(()=>{
    console.log("connected to db")

}).catch((e)=>{
    console.log(e);
})

const app=express();

const logger=(req,res,next) =>{

    var data="req id:"+JSON.stringify(request_id)+" req method: "+req.method+"\n";
    fs.appendFile('requests.txt',data,(err)=>{
        if(err){
            console.log(err);
        }
        else{
            request_id+=1;
        }
    })
    next();
}
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(logger);

const get_request_Handler = async (req,res) =>{
    const movies= await movies_DB.find({});
    res.send(movies);
}

const post_request_Handler = (req,res) =>{
    const newmovie = new movies_DB({
        title:req.body.title,
        Director:req.body.Director,
        IMDB_Rating:req.body.IMDB_Rating
    });
    newmovie.save();
    res.send("movie added");
}

const delete_request_Handler = async (req,res) =>{
    const id=req.body.id;
    const response= await movies_DB.deleteOne({_id:id});
    res.send(response);
}

const put_request_Handler = async (req,res) =>{
    const body=req.body;
    const id=body.id;
    const response= await movies_DB.updateOne({_id:id},body.updates,{new:true});
    res.send(response);
}

app.get('/',get_request_Handler);

app.post('/',post_request_Handler);

app.delete('/',delete_request_Handler);

app.put('/',put_request_Handler);

app.listen(3000,'localhost',() =>{
    console.log("Server Started ");

})