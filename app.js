const bodyParser =require('body-parser');
const request = require('request');
const express=require('express');
const https= require('https');
const app=express();


app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

app.get("/letter", function(req,res){
    res.sendFile(__dirname + "/signup.html")
})

app.post("/letter", function(req, res){
    const firstname= req.body.firstname;
    const lastname = req.body.lastname;
    const email= req.body.email;

    const data={
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME:firstname,
                    LNAME:lastname
                }
            }
        ]
    };

    const jsonData= JSON.stringify(data);

    const url= "https://us18.api.mailchimp.com/3.0/lists/edbe2cf887";

    const options={
        method: "POST",
        auth:"junior:0953f942b77c2f3ce8aff83362f7066e-us18"
    }

    const request = https.request(url,options, function(response){
        
        if(response.statusCode===200){
            res.sendFile(__dirname +"/success.html");
        }else{
            res.sendFile(__dirname +"/faillure.html");
        }

      response.on("data", function(data){
          console.log(JSON.parse(data));
      })
    })
    request.write(jsonData);
    request.end();
});

app.post("/faillure", function(req, res){
    res.redirect("/letter");
})

app.post("/success", function(req,res){
    res.redirect("/letter");
})

app.listen(process.env.PORT || 3000, function(){
      console.log('The App is served From the port 3000');
})

/* 
Api key of MailChimp API
0953f942b77c2f3ce8aff83362f7066e-us18
list Id
edbe2cf887*/