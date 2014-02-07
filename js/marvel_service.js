var publicKey = "lolol";
var privateKey = "lololol";

var CHARACTERS = [];
var IMG_COUNTER = 0;
var IMG_SHOW_COUNTER = 0;

// num of characters is 1400
var NUM_OF_CHARACTERS = 100;
var PORTRAIT_SMALL = "portrait_small";
var PORTRAIT_MED = "portrait_medium";

var ready = false;

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
		success: function(data) {
			ready = true;
			var results = data.data.results;

			results.forEach(function(character){
				// console.log(character);
				CHARACTERS.push(character);
				var img = parseThumbnailToHTML(character.thumbnail.path, PORTRAIT_MED, character.thumbnail.extension, character.name, character.id);

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
			})

			var newOffset = offset + 100;
			if (newOffset <= NUM_OF_CHARACTERS){
				getCharacters(100, newOffset);
			}
		}
	});

}

// Parse the the image to html with tooltip
function parseThumbnailToHTML(url, variant, extension, charName, id) {
	var img = '<a id="' + id +'"><div class="character-card"><img id="char_' + IMG_COUNTER  + '" src="'+ url + '/' + variant + '.' 
	+  extension + '"class="img-thumbnail char-img"/><p class="character-name">'+ charName +'</p></div></a>';

	IMG_COUNTER += 1;
	return img;
}

function showImages(){
	if (ready){
		$('#char_'+IMG_SHOW_COUNTER).css('display', 'inline-block');
		IMG_SHOW_COUNTER += 1;
	}
}

// find the relationships of a character based on the events, series and stories matching
// GREEN LINE means 3 commons
// ORANGE LINE means 2 commons
// GREY LINE means 1 common - minor connection
function findRelationships(character){
	alert(character.name)
}

// WHERE THE MARVEL MAGIC HAPPENS
$(document).ready(function() {
	getCharacters(100, 0);
	var intervalID = window.setInterval(showImages, 20);

});