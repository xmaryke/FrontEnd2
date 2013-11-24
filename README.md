FrontEnd2
=========

Hier vind je mijn bestanden voor het vak Front end 2.
Per les heb ik het huiswerk op Github gezet.

De eindopdracht van dit vak is te vinden in het mapje ScoreApp, waar de code van mijn score app staat.


ScoreApp
========

Functionaliteitn score app:
- Het wedstrijdschema van het Frisbee toernooi Amsterdam Ultimate Autumn bekijken (= schedule)
- De uiteindelijke score van een wedstrijd aanpassen (= game)
- De stand van het Frisbee Toernooi Amsterdam Ultimate Autumn bekijken 
 

Breakdown van de score app:

<pre>
var SCOREAPP = SCOREAPP || {};


(function(){

	SCOREAPP.controller = {
		init: function(){}
	};

	SCOREAPP.feedback = {
		showLoader: function(){},
		hideLoader: function(){},
		liRankingActive: function() {},
		liScheduleActive: function() {}
	};

	SCOREAPP.router = {
		init: function (){
			routie({
				'/game/:id': function(id) {},
				'/schedule': function() {},
				'/ranking': function() {},
				'*': function() {} 
			});
		},
		swipe: function() {},
		change: function () {},
		gameSection: function(){}
	};

	SCOREAPP.update = {
		 gameScore: function (form){
		 	site.post(headers, inputData, function (error, result) {});
		 }
	};

	SCOREAPP.datas = {
		game: function (id) {
			site.get(function (err, result) {});
		},
		schedule: function(){
			site.get(function (err, result) {});
		},
		ranking: function () { 
			site.get(function (err, result) {});
		}
	};

	var directives = {};

	SCOREAPP.animation = {
		init: function(){},
		doMove: function(){} 
	};


    domready(function () {});
})();
</pre>
