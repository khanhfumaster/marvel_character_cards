var publicKey = "INSERT PUBLIC KEY HERE PLZ";
var privateKey = "I REALLY NEED A BETTER WAY TO DO THIS...";

var CHARACTERS = []
var NUM_OF_CHARACTERS = 1400
var PORTRAIT_SMALL = "portrait_small"
var PORTRAIT_MED = "portrait_medium"

// GET /v1/public/characters
function getCharacters(limit, offset) {

	limit = typeof limit !== 'undefined' ? limit : 100;
	offset = typeof offset !== 'undefined' ? offset : 0;

	var results;
	var ts = $.now();	
	var hash = $.md5(ts+privateKey+publicKey);
	var url = "http://gateway.marvel.com/v1/public/characters?"+
												"apikey=" + publicKey +
												"&ts=" + ts +
												"&hash=" + hash;

	if (typeof limit !== 'undefined') {
		url = url + "&limit=" + limit;
	}

	if (typeof offset !== 'undefined') {
		url = url + "&offset=" + offset;
	}

	$.ajax({
		url: url,
		dataType: 'json',
		async: false,
		success: function(data) {
			var results = data.data.results;

			results.forEach(function(character){
				CHARACTERS.push(character);
			})
		}
	});

}

// Parse the the image to html with tooltip
function parseThumbnailToHTML(url, variant, extension, charName, id) {
	var img = '<a data-toggle="tooltip" title="'+charName+ '"' + 'id="' + id +'"><img src="'+ url + '/' + variant + '.' +  extension + '"class="img-thumbnail char-img"/></a>';
	return img;
}

// find the relationships of a character based on the events, series and stories matching
// GREEN LINE means 3 commons
// ORANGE LINE means 2 commons
// GREY LINE means 1 common - minor connection
function findRelationships(character){
	alert(character.name)
}

$(document).ready(function() {
	// set offset to 100 when testing to save api calls
	for (var offset = 0; offset <= NUM_OF_CHARACTERS; offset += 100) {
		getCharacters(100, offset);
	};

	CHARACTERS.forEach(function(character){
		console.log(character);
		var img = parseThumbnailToHTML(character.thumbnail.path, PORTRAIT_SMALL, character.thumbnail.extension, character.name, character.id);

		//display character thumbnails on the page
		$(".characters").append(img);

		//activate the tooltip to show character names
		$('[data-toggle="tooltip"]').tooltip({
    		'placement': 'bottom'
		});

		//TODO: when you click on a character thumbnail - find all relationships and highlight and link
		$("#"+character.id).click(function(event){
			findRelationships(character);
		});
	});
});