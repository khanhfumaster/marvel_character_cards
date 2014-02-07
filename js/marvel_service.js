var publicKey = "LOLOL";
var privateKey = "LOLOLOL";

var CHARACTERS = [];
var IMG_COUNTER = 0;
var IMG_SHOW_COUNTER = 0;

// num of characters is 1400
var NUM_OF_CHARACTERS = 1400;
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
				$('[data-toggle="popover"]').popover({
					'trigger': "hover",
		    		'placement': 'right'
				});

				//TODO: when you click on a character thumbnail - find all relationships and highlight and link
				$("#"+character.id).click(function(event){
					findRelationships(character, $(this));
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
	var img = '<a id="' + id +'" data-toggle="popover" data-content="TODO PUT DESCRIPTION AND WHERE THEY MET MAIN DUDE"><div class="character-card"><img id="char_' + IMG_COUNTER  + '" src="'+ url + '/' + variant + '.' 
	+  extension + '"class="img-thumbnail char-img"/><p class="character-name">'+ charName +'</p></div></a>';

	IMG_COUNTER += 1;
	return img;
}

// fades the cards in
function showCards(){
	if (ready){
		$('#char_'+IMG_SHOW_COUNTER).css('display', 'inline-block');
		$('#char_'+IMG_SHOW_COUNTER).next('.character-name').css('display', 'inline-block');
		IMG_SHOW_COUNTER += 1;
	}
}

// find the relationships of a character based on the events, series and stories matching
// GREEN LINE means EVENTS
// ORANGE LINE means SERIES
// GREY LINE means STORIES
function findRelationships(character, card){
	
	// Apply the overlay and keep the card selected
	// TODO: Maybe increase the image size even more and move to center
	$("a").removeClass('card-selected');
	$("a").removeClass('card-matched');		
	$(".overlay").show();
	card.addClass('card-selected');

	console.log(character);

	var matchingEvents = [];
	var matchingSeries = [];
	var matchingStories = [];

	// match events
	if (character.events.available != 0) {
		character.events.items.forEach(function(item){

			CHARACTERS.forEach(function(hero){
				if (character.id != hero.id){
					if (hero.events.available != 0) {
						hero.events.items.forEach(function(heroEvent){
							if (item.resourceURI == heroEvent.resourceURI) {
								var match = {hero: hero, matchEvent: heroEvent};
								matchingEvents.push(match);
							}
						});
					}
				}
				
			})

		});
	}

	// match series
	if (character.series.available != 0) {
		character.series.items.forEach(function(item){

			CHARACTERS.forEach(function(hero){
				if (character.id != hero.id){
					if (hero.series.available != 0) {
						hero.series.items.forEach(function(heroSeries){
							if (item.resourceURI == heroSeries.resourceURI) {
								var match = {hero: hero, matchSeries: heroSeries};
								matchingSeries.push(match);
							}
						});
					}
				}
				
			})

		});
	}

	// match stories
	if (character.stories.available != 0) {
		character.stories.items.forEach(function(item){

			CHARACTERS.forEach(function(hero){
				if (character.id != hero.id){
					if (hero.stories.available != 0) {
						hero.stories.items.forEach(function(heroStories){
							if (item.resourceURI == heroStories.resourceURI) {
								var match = {hero: hero, matchStories: heroStories};
								matchingStories.push(match);
							}
						});
					}
				}
				
			})

		});
	}

	if (matchingEvents.length != 0) {
		matchingEvents.forEach(function(match){
			$('#'+match.hero.id).addClass('card-matched');
		})
	}

	if (matchingSeries.length != 0) {
		matchingSeries.forEach(function(match){
			$('#'+match.hero.id).addClass('card-matched');
		})
	}

	if (matchingStories.length != 0) {
		matchingStories.forEach(function(match){
			$('#'+match.hero.id).addClass('card-matched');
		})
	}
}


// WHERE THE MARVEL MAGIC HAPPENS
$(document).ready(function() {
	$(".overlay").hide();
	// $("#canvas").hide();
	getCharacters(100, 0);
	var intervalID = window.setInterval(showCards, 20);

	// if click the overlay then reset all cards
	$('.overlay').click(function(){
		$(".overlay").hide();
		$("a").removeClass('card-selected');
		$("a").removeClass('card-matched');		
	});

});