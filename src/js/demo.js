var alltweets,
	tweets1,
	tweets2,
	tweets3,
	gallery1,
	gallery2;

$(document).ready(function(){
	//first let's load a ton of data
		$.ajax({
		  type: "GET",
		  url: "js/data.json",
		  dataType: "text",
		  success: function(data, status, exthing){
		  	json = JSON.parse(data);

		  	//let's log it out to get a sense for the structure
		  	console.log("This is a sample of the type of data:");
		  	console.log(json[0]);

			alltweets = json;
			tweets1 = json.slice(0, 15);
			tweets2 = json.slice(9, 24);
			tweets3 = json.slice(18, 33);

			gallery1 = new twitterGallery('.viz1');
			gallery1.showTweets(tweets1);

			gallery2 = new twitterGallery('.viz2');
			gallery2.showTweets(tweets2);

		  },
		  error: function(jqXHR, textStatus, errorThrown){
		  		console.debug(status);
		  }
		});
});


var twitterGallery = function (selector) {

	this.selector = selector

	this.showTweets = function (data) {
		var tweets = d3.select(selector).selectAll(".tweet").data(data, function (d) {
			return d.Text;
		});

		tweets
			.attr("class", "tweet updated")
			.each(function (d) {
				var tweet = d3.select(this);

				tweet.select('.avatar')
					.style('background-image', function (d) {
						return 'url(' + d.User.ProfileImageUrl + ')';
					});

				tweet.select('.text')
					.html(function (d) {
						return d.Text
					})

				setTimeout (function (thetweet) {
					thetweet.attr('class', 'tweet');
				}, 100, tweet);
			})


		tweets
			.enter()
				.append("div")
				.attr("class", "tweet collapsed")
				.each(function (d) {

					var tweet = d3.select(this);

					tweet.append('div')
						.attr('class', 'avatar')
						.style('background-image', function (d) {
							return 'url(' + d.User.ProfileImageUrl + ')';
						});

					tweet.append('span')
						.attr('class', 'text')
						.html(function (d) {
							return d.Text
						})

					setTimeout (function (thetweet) {
						thetweet.attr('class', 'tweet');
					}, 100, tweet);
				})


		tweets
			.exit()
			.remove();
	}
}
