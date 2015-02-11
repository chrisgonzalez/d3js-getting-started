var alltweets,
	tweets1,
	tweets2,
	tweets3;

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

		  	joinData(tweets1);

		  },
		  error: function(jqXHR, textStatus, errorThrown){
		  		console.debug(status);
		  }
		});
});


function scales(data){

	/*

	d3js scales are a super useful part of the library. A scale accepts an input domain and
	scales it to an output range. For instance, say we want to map twitter timestamps to screen
	coordinates. We can set the input domain to encompass the available timestamps (using d3.extent
	to find	our extremes), and set the output range to somewhere within the range of the screen in
	either pixels or percent.

	The following example will map timestamps to x-axis coordinates

	*/

	console.log("\n**** SCALING DATA TO SCREEN DIMENSIONS ****\n");

	//FIRST, LET'S FIND OUR INPUT DOMAINS

		//this uses the above function to return the date and bgl extents
		var timeExtent = d3.extents(data, function (d) {
			return d.RawMessage.timestamp_ms;
		})

	//SECOND, LET'S SET OUR OUTPUT RANGES

		//first range is from x = 0 to x = window width, second range inverts this idea to give a bottom-up orientation
		//for this example, we'll use pixel coordinates, but if the goal is to use CSS, percents could work just as well!
		var ranges = {
			dateRange: [0, window.innerWidth],
			dataRange: [window.innerHeight, 0 ]
		}

	//NOW, LET'S CREATE OUR SCALES

		//in this example, we'll use linear scales, but d3 has some other options (we'll show this later on)
		var xScale = d3.scale.linear()
				    	.domain(timeExtent)
				    	.rangeRound(ranges.dateRange);

		var yScale = d3.scale.linear()
				    	.domain(domains.dataExtent)
				    	.rangeRound(ranges.dataRange);

		return {
			x: xScale,
			y: yScale
		}
}

function joinData(data){

	/*
		Data joins are the bread and butter of d3js. Given an array of data, we can quickly bind
		this data to elements in the DOM, creating and removing elements on the fly using a set
		of rules. Set the rules once, then change your data forever and see the magic!

	*/

	//FIRST, WE CREATE A 'SELECTION'
	/*
		The key here is that the elements we're selecting won't yet exist in the DOM, and will
		be created and destroyed as we pass or remove their data references.

		For this example, let's create a little div for each blood glucose object in the data array.
	*/

	var bgls = d3.select(".viz").selectAll(".tweet").data(data);

	/*
		Here, we are using d3 to select the ".visualization" container div, then creating a d3
	  	selection using selectAll, then binding our data to that selection.

	  	Keep in mind there are currently no divs with class 'bgl'!

	*/

	//SECOND, WE CREATE RULES FOR WHAT HAPPENS WHEN WE GET NEW DATA, UPDATE EXISTING DATA, AND REMOVE DATA
	/*
		d3js provides utilities for adding, removing and updating DOM content based on an
		ever-changing data set. Let's add some rules for when we add new data!
	*/


	/*
		First, let's create a rule that handles a div in general- this will get applied when
		a div already exists and is updated, and will get applied every time a div is acted
		upon. The order of the update, enter(), and exit() will have an additive kind of effect,
		similar to the way CSS cascades.
	*/

	bgls
		//modify the inner html
		.html(function(d){
				return d.Text;
			})

	/*
		Second, let's handle new divs by adding them and styling them

	*/

	bgls
		.enter()
			//first, append a new div
			.append("div")
			//add the class 'tweet'
			.attr("class", "tweet")
			//and last, let's add the tweet text to the div
			.html(function (d) {
				return d.Text;
			})

	/*
		Now, let's create a rule that handles a div when it's removed
	*/

	//on exit, remove the div from the DOM!
	bgls
		.exit()
		.remove("div");

	/*
		Try running this function with any subset of the json data!

		Like:
		joinData(json.slice(0,10));
		joinData(json.slice(143,250));

	*/

}
