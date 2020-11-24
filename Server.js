const express=require("express");
const request=require("request");
const app=express();
const PORT=process.env.PORT||8080;

app.get("/details/:id",function(req,res){
    var authorname="",scoredmark="",title="",postedTime="",commentsgiven="<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css\" integrity=\"sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm\" crossorigin=\"anonymous\"><table class=\"table\"><th>Author</th><th>Comments</th>",official="",x1=6;
  var output="<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css\" integrity=\"sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm\" crossorigin=\"anonymous\">";
  request(`https://hacker-news.firebaseio.com/v0/item/${req.params.id}.json?print=pretty`,function(error,response,body){
       const resp=JSON.parse(body);
       authorname=resp.by;
       scoredmark=resp.score;
       title=resp.title;
       postedTime=resp.time;
       official=resp.url;
       try{
       var x=resp.kids.length;
       resp.kids.forEach((element,index)=>{
        request(`https://hacker-news.firebaseio.com/v0/item/${element}.json?print=pretty`,function(err,respo,body1){
        var out=JSON.parse(body1);
        console.log(out);   
        commentsgiven+="<tr><td>"+out.by+"</td><td>"+out.text+"</td></tr>";
        if(index==(x-1))
        {
        output+=`<h1>Story Details</h1><table class=\"table\"><tr><td>Title:</td><td>${title}</td><tr><td>Author:</td><td>${authorname}<tr></td><td>Score:</td><td>${scoredmark}<tr></td><td>Created TimeStamp:</td><td>${postedTime}<tr></td><td>More Info</td><td><a href=${official}>Read More</a></td></table><br><h3>Comments:</h3><br>${commentsgiven}<br>`;
        res.send(output);
        }
        })
    })
       }catch(e)
       {
           x1=0;
           commentsgiven="No Comments Yet";
       }
       if(x1==0)
       res.send(`<h1>Story Details</h1><br>Title:${title}<br>Author:${authorname}<br>Score:${scoredmark}<br><h3>Comments:</h3>${commentsgiven}<br>Created Time:${postedTime}<br><a href=${official}>Read More</a>`);
  })
})
app.get("/",function(req,res){
  var output="<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css\" integrity=\"sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm\" crossorigin=\"anonymous\"><p align=\"center\" class=\"h1\">Welcome to Stories Collection</p><br><table class=\"table\">";
    request('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty',function(error,response,body){
        var arr=JSON.parse(body);
        arr=arr.slice(0,20);
        arr.forEach((element,index) => {
            request(`https://hacker-news.firebaseio.com/v0/item/${element}.json?print=pretty`,function(error1,response1,body1){
                var resp=JSON.parse(body1);
                output+="<tr><td>"+resp.title+"</td><td><a href=\"https://storycollections.glitch.me/details/"+element+"/\">Read More</a></td></tr>";
              console.log(index);
                if(index===19)
                  {
                    output+="</table>"
                    res.send(output);
                    return;
                  }
            })
        })
    })
})
app.listen(PORT,function(){
    console.log("Server Connected");
})
