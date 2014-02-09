// MARVEL CHARACTER CARDS JAVASCRIPT MAGIC
// Khanh Nguyen 2014
// http://khanh.info

//URLS
var GET_CHARACTERS_URL = 'http://localhost/marvel_tree/marvel_api/get_characters_url/';
var GET_CHARACTERS_JSON = 'http://localhost/marvel_tree/characters.json';
// Variables for character cards
var CHARACTERS = [];
var IMG_COUNTER = 0;
var IMG_SHOW_COUNTER = 0;

// num of characters should be set to 1400
var NUM_OF_CHARACTERS = 1400;
var PORTRAIT_SMALL = "portrait_small";
var PORTRAIT_MED = "portrait_medium";

// ready as in ready to start fading in images
var ready = false;

// search terms inputted by the user
var SEARCH_TERM = '';

// GET /v1/public/characters
function getCharacters(limit, offset) {

	limit = typeof limit !== 'undefined' ? limit : 100;
	offset = typeof offset !== 'undefined' ? offset : 0;

	var results;
	var url;

	$.ajax({
		url: GET_CHARACTERS_URL,
		async: false,
		data: {	'secret': 'lol plz'
		},
		success: function (data) {
			url = data;
		}
	})

	if (url != 'error'){
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
	else {
		$.ajax({
			url: GET_CHARACTERS_JSON,
			dataType: "json",
			async: false,
			success: function(data) {
				CHARACTERS = data;
				ready = true;

				CHARACTERS.forEach(function (character){
					var img = parseThumbnailToHTML(character.thumbnail.path, PORTRAIT_MED, character.thumbnail.extension, character.name, character.id);

					//display character thumbnails on the page
					$(".characters").append(img);

					$("#"+character.id).click(function(event){
						findRelationships(character, $(this));
					});
				})
			}
		});
	}
	

}

// Parse the the image to html with tooltip
function parseThumbnailToHTML(url, variant, extension, charName, id) {
	var img = '<a id="' + id +'" class="card-a card-hover"><div class="character-card"><img id="char_' + IMG_COUNTER  
	+ '" src="'+ url + '/' + variant + '.' + extension 
	+ '"class="img-thumbnail char-img"/><p class="character-name">'+ charName +'</p></div></a>';

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

	//removes the hover on the selected card because it looks weird...
	card.removeClass('card-hover');
	removePopovers();
	$(".card-a").removeClass('card-selected');
	$(".card-a").removeClass('card-matched');
	$(".card-a").removeClass('card-hovered');	


	$(".overlay").show();
	card.addClass('card-selected');

	card.attr('data-toggle', 'popover');
	card.attr('data-original-title', '<strong>' + character.name + '</strong> appears in:');

	// console.log(character);

	var matchingEvents = [];
	var matchingSeries = [];
	var matchingStories = [];

	// match events
	if (character.events.available != 0) {
		character.events.items.forEach(function(item){

			if (typeof card.attr('data-content') != 'undefined'){
				card.attr('data-content', card.attr('data-content') + '<br>' + item.name);
			}
			else {
				card.attr('data-content', item.name)
			}

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

			if (typeof card.attr('data-content') != 'undefined'){
				card.attr('data-content', card.attr('data-content') + '<br>' + item.name);
			}
			else {
				card.attr('data-content', item.name)
			}

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

			if (typeof card.attr('data-content') != 'undefined'){
				card.attr('data-content', card.attr('data-content') + '<br>' + item.name);
			}
			else {
				card.attr('data-content', item.name)
			}

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
			$('#'+match.hero.id).attr('data-toggle', 'popover');
			$('#'+match.hero.id).attr('data-original-title', '<strong>' + character.name + '</strong>' + ' meets ' + match.hero.name +' in:');

			if (typeof $('#'+match.hero.id).attr('data-content') != 'undefined'){
				$('#'+match.hero.id).attr('data-content', $('#'+match.hero.id).attr('data-content') + '<br>' + match.matchEvent.name);
			}
			else {
				$('#'+match.hero.id).attr('data-content', match.matchEvent.name)
			}
		})
	}

	if (matchingSeries.length != 0) {
		matchingSeries.forEach(function(match){
			$('#'+match.hero.id).addClass('card-matched');
			$('#'+match.hero.id).attr('data-toggle', 'popover');
			$('#'+match.hero.id).attr('data-original-title', '<strong>' + character.name + '</strong>' + ' meets ' + match.hero.name +' in:');
			if (typeof $('#'+match.hero.id).attr('data-content') != 'undefined'){
				$('#'+match.hero.id).attr('data-content', $('#'+match.hero.id).attr('data-content')  + '<br>' + match.matchSeries.name);
			}
			else {
				$('#'+match.hero.id).attr('data-content', match.matchSeries.name)
			}
		})
	}

	if (matchingStories.length != 0) {
		matchingStories.forEach(function(match){
			$('#'+match.hero.id).addClass('card-matched');
			$('#'+match.hero.id).attr('data-toggle', 'popover');
			$('#'+match.hero.id).attr('data-original-title', '<strong>' + character.name + '</strong>' + ' meets ' + match.hero.name +' in:');
			if (typeof $('#'+match.hero.id).attr('data-content') != 'undefined'){
				$('#'+match.hero.id).attr('data-content', $('#'+match.hero.id).attr('data-content') + '<br>' + match.matchStories.name);
			}
			else {
				$('#'+match.hero.id).attr('data-content', match.matchStories.name)
			}
		})
	}

	if (character.events.available == 0 && character.series.available == 0 && character.stories.available == 0) {
		card.attr('data-content', 'nothing according to the API ...')
	}

	showPopovers();
}

// activate the popovers
function showPopovers() {
	$('[data-toggle="popover"]').popover({
		'trigger': "hover",
		'placement': function(tip, element) {
			// https://github.com/twbs/bootstrap/issues/345
		    var $element, above, actualHeight, actualWidth, below, boundBottom, boundLeft, boundRight, boundTop, elementAbove, elementBelow, elementLeft, elementRight, isWithinBounds, left, pos, right;
		    isWithinBounds = function(elementPosition) {
		      return boundTop < elementPosition.top && boundLeft < elementPosition.left && boundRight > (elementPosition.left + actualWidth) && boundBottom > (elementPosition.top + actualHeight);
		    };
		    $element = $(element);
		    pos = $.extend({}, $element.offset(), {
		      width: element.offsetWidth,
		      height: element.offsetHeight
		    });
		    actualWidth = 283;
		    actualHeight = 350;
		    boundTop = $(document).scrollTop();
		    boundLeft = $(document).scrollLeft();
		    boundRight = boundLeft + $(window).width();
		    boundBottom = boundTop + $(window).height();
		    elementAbove = {
		      top: pos.top - actualHeight,
		      left: pos.left + pos.width / 2 - actualWidth / 2
		    };
		    elementBelow = {
		      top: pos.top + pos.height,
		      left: pos.left + pos.width / 2 - actualWidth / 2
		    };
		    elementLeft = {
		      top: pos.top + pos.height / 2 - actualHeight / 2,
		      left: pos.left - actualWidth
		    };
		    elementRight = {
		      top: pos.top + pos.height / 2 - actualHeight / 2,
		      left: pos.left + pos.width
		    };
		    above = isWithinBounds(elementAbove);
		    below = isWithinBounds(elementBelow);
		    left = isWithinBounds(elementLeft);
		    right = isWithinBounds(elementRight);
		    if (above) {
		      return "top";
		    } else {
		      if (below) {
		        return "bottom";
		      } else {
		        if (left) {
		          return "left";
		        } else {
		          if (right) {
		            return "right";
		          } else {
		            return "right";
		          }
		        }
		      }
		    }
  		},
		'html': true
	});
	$('[data-toggle="popover"]').popover('enable');
}

// remove popovers DESTROY IT!
function removePopovers() {
	$(".card-a").removeAttr('data-toggle');
	$(".card-a").removeAttr('data-original-title');
	$(".card-a").removeAttr('data-content');
	$(".card-a").popover('destroy');
}

function resetCards() {
	$(".overlay").hide();
	$(".card-a").removeClass('card-selected');
	$(".card-a").removeClass('card-matched');	
	$(".card-a").removeClass('card-hovered');	
	removePopovers();
	//fix hovering
	$(".card-a").addClass('card-hover')
}

function clearSearchTerms() {
	if (SEARCH_TERM != ''){
		resetCards();
		quickSearch();				
	}
	SEARCH_TERM = '';
	$(".search-overlay").hide();
}

function quickSearch() {
	var searchResults = [];
	CHARACTERS.forEach(function(character){
		// console.log(character.name.toLowerCase())
		var lowerCaseCharacterName = character.name.toLowerCase();
		var lowerCaseSearchTerm = SEARCH_TERM.toLowerCase();

		if (lowerCaseCharacterName.indexOf(lowerCaseSearchTerm) > -1){
			// console.log(character.name, SEARCH_TERM)
			

			searchResults.push(character);
		}
	});

	if (searchResults.length != 0) {
		var character = searchResults[0]
		var p = $("#"+character.id).position()
		var top = p.top - 100;
		$.scrollTo({top:top, left:p.left})

		searchResults.forEach(function (character){
			$("#"+character.id).addClass("card-hovered");
		})
	}
}

// WHERE THE MARVEL MAGIC HAPPENS
$(document).ready(function() {
	$(".search-overlay").hide();
	$(".overlay").hide();
	// $("#canvas").hide();
	getCharacters(100, 0);
	var showCardsInterval = window.setInterval(showCards, 20);

	// if click the overlay then reset all cards
	$('.overlay').click(function(){
		resetCards()
	});

	// resets the card if ESC is pressed
	$(document).on('keydown', function(e){
		// console.log(e.keyCode);
		if (e.keyCode == 27) {
			resetCards();
		}
	});

	// start the serach term reset thingy
	var clearSearchTermsInterval = window.setInterval(clearSearchTerms, 1200);
	// catches search terms from keyboard
	$(document).on('keypress', function(e){
		// stop the clear thingy
		clearInterval(clearSearchTermsInterval);

		// handles the spacebar press -> do not scroll!-
		if (e.keyCode == 32) {
			e.preventDefault();
		}
		
		var newTerm = SEARCH_TERM + String.fromCharCode(e.charCode);
		if (newTerm.trim() != ''){
			SEARCH_TERM = SEARCH_TERM + String.fromCharCode(e.charCode)

			// console.log(SEARCH_TERM)
			$(".search-overlay").show();
			$(".search-term").text(SEARCH_TERM);

		}
		
		//start clear thingy
		clearSearchTermsInterval = window.setInterval(clearSearchTerms, 1200);
	})
});