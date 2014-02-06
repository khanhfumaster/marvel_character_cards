var publicKey = "INSERT PUBLIC KEY HERE PLZ";
var privateKey = "DO NOT SHARE THIS WITH ANYMORE PLZ";

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

function parseThumbnailToHTML(url, variant, extension, charName) {
	var img = '<a data-toggle="tooltip" title="'+charName+'"><img src="'+ url + '/' + variant + '.' +  extension + '"class="img-thumbnail char-img"/></a>';
	return img;
}

$(document).ready(function() {

	for (var offset = 0; offset <= NUM_OF_CHARACTERS; offset += 100) {
		getCharacters(100, offset);
	};

	CHARACTERS.forEach(function(character){
		console.log(character);
		var img = parseThumbnailToHTML(character.thumbnail.path, PORTRAIT_SMALL, character.thumbnail.extension, character.name);
		$(".characters").append(img);
		$('[data-toggle="tooltip"]').tooltip({
    		'placement': 'bottom'
		});
	})

	//TODO: when you click on a character thumbnail - find all relationships and highlight and link

});