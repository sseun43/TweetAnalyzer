const fetch = require('cross-fetch');
const Twitter = require('twitter');
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
const express = require("express");
const app = express();
app.set("port", process.env.PORT || 3000);


	const url ='https://api.twitter.com/oauth2/token'
	const newsKey ="06d71bdd33544f7f94f94984ab380bbc"
	const newsUrl= "https://newsapi.org/v2/everything?q=olympics&sortBy=publishedAt&apiKey="+newsKey
	let daBearerToken = ""
	const key ="9BcDnecawEvgpBiaREIlQN4ZL"
	const secret="LevM5Ep1BODf8nIDwadTvVkUTZjs79To8LsVbL4GtDI3rvIymZ"

	var cat = key +":"+secret;
	var credentials = new Buffer(cat).toString('base64');

	const watsonKey={
		"username": "5e901d2b-1b58-49d8-8f4e-fc086c98a0be",
        "password": "CxCgkfl20w5l"
    }

   /* fetch(newsUrl)
    .then(res => res.json())
    .catch(error => console.log('Error:', error))
    .then(res=>{
    	const danews= res.articles.map(v=>v.title+v.description).join(".")

    		var tone_analyzer = new ToneAnalyzerV3({
	 					username: watsonKey.username,
	  					password: watsonKey.password,
	  					version_date: "2018-02-13",
	  					headers: {
    						'X-Watson-Learning-Opt-Out': 'true'
  							},
				});
	   				var params = {
						  'tone_input': danews,
						  'content_type': 'text/plain',
						  "sentences":false,
					};

					tone_analyzer.tone(params, function(error, response) {
  								if (error)
    								console.log('error:', error);
  								else
    								console.log(JSON.stringify(response, null, 2));
  						});

    })*/
 app.get("/tweetResult/:toSearch",(req,res)=>{
 	const toSearch=req.params.toSearch
 	let result;

 	fetch(url,{
		method:"POST",
		body:"grant_type=client_credentials",
		headers : {
			"Authorization": "Basic " + credentials,
	        "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"
		},
	})
	.then(res => res.json())
	.catch(error => console.log('Error:', error))
	.then(response => {
		//console.log('Success:', response)
		daBearerToken=response.access_token
			const client = new Twitter({
			  consumer_key: key,
			  consumer_secret: secret,
			  bearer_token:response.access_token 
			});

			client.get('search/tweets', {q:toSearch}, function(error, tweets, response) {
   				const daTweets = tweets.statuses.map(v=>v.text).join();
   				//console.log(daTweets);
   				console.log(toSearch)

	   				var tone_analyzer = new ToneAnalyzerV3({
	 					username: watsonKey.username,
	  					password: watsonKey.password,
	  					version_date: "2018-02-13",
	  					headers: {
    						'X-Watson-Learning-Opt-Out': 'true'
  							},
				});
	   				var params = {
						  'tone_input': daTweets,
						  'content_type': 'text/plain',
						  "sentences":false,
					};

					tone_analyzer.tone(params, function(error, response) {
  								if (error)
    								console.log('error:', error);
  								else
    								res.json(response.document_tone, null, 2);
  						});
			});
	})


 })
	


app.listen(app.get("port"), ()=>{console.log("App started on port 3000")});