//Namespace
var SCOREAPP = SCOREAPP || {};

// self invoking anonymous function
(function(){
	
    //Controller
    SCOREAPP.controller = {
    init: function(){
    		SCOREAPP.router.init(); 
    	}
    };

    //Set data objects to zero
    SCOREAPP.game = null;
    SCOREAPP.schedule = null;
    SCOREAPP.ranking = null; 

    
    //Router --> Routie library
    SCOREAPP.router = {
        init: function (){
            routie({
                //Create pages
                '/game/:id': function(id) {
                    document.getElementById('floatingBarsG').style.display = "block";
                    document.getElementById('navigation').style.display = "none";
                	console.log("routie game");
                    SCOREAPP.datas.game(id);
                },
                '/schedule': function() {
                    document.getElementById('floatingBarsG').style.display = "block";
                    document.getElementById('navigation').style.display = "block";
                	console.log("routie schedule");
                    SCOREAPP.datas.schedule();
                },
                '/ranking': function() {
                    document.getElementById('floatingBarsG').style.display = "block";
                	console.log("routie ranking");
                    SCOREAPP.datas.ranking();
                },
                //Default output
                '*': function() {
                    document.getElementById('floatingBarsG').style.display = "block";
                    console.log("routie default");
                    SCOREAPP.datas.schedule();
                }
            });
        },

        //Switch to another page
        change: function () {
            var route = window.location.hash.slice(2),
                sections = qwery('section[data-route]'),
                section = qwery('[data-route=' + route + ']')[0];  

            // Show active section, hide all other
            if (section) {
                for (var i=0; i < sections.length; i++){
                    sections[i].classList.remove('active');
                }
                section.classList.add('active');
            }

            // Default route
            if (!route) {
                sections[0].classList.add('active');
            }
        },

        //Route without id, so the section exists 
        gameSection: function(){
            sections = qwery('section[data-route]'),
            section = qwery('[data-route=game]')[0]; 

             // Show active section, hide all other
            if (section) {
                for (var i=0; i < sections.length; i++){
                    sections[i].classList.remove('active');
                }
                section.classList.add('active');
            }

            // Default route
            if (!section) {
                sections[0].classList.add('active');
            }
        }

    };



    // Post gamescore
    SCOREAPP.update = {
        gameScore: function (form){
            //Select the form input field
            var team1Score = qwery('#postScoreForm [name=team1score]')[0];
            var team2Score = qwery('#postScoreForm [name=team2score]')[0];
            var isFinal = qwery('#postScoreForm [name=isfinal]')[0];

            //Game id form url
            var gameIdString = window.location.hash.slice(2).split('/');
            var gameId = gameIdString[1];  

            //Input data
            var inputData = {
                game_id: gameId, 
                team_1_score: team1Score.value,
                team_2_score: team2Score.value,
                is_final: isFinal.value
            }

            var headers = {
                            'Content-Type':"application/json",
                            'Authorization':"bearer a6abfe991a"
            }

            var site = fermata.json("https://api.leaguevine.com/v1/game_scores/");
            site.post(headers, inputData, function (error, result) {
            if (!error) {
                console.log("Posten is gelukt");
                console.log(inputData);

                //Go to schedule page after posting data
                window.location.href = "http://marrymedia.nl/frontend/#/schedule";
                //Reload schedule page
                window.location.reload(true);

            } else {
                console.warn(error);
            }
            });

            //prevent to refresh the page
            return false; 
        }
    }

    // Get data from API for each page
    SCOREAPP.datas = {
        game: function (id) {    
            if(!SCOREAPP.game){  
                 var gameUrl = "https://api.leaguevine.com/v1/games/" + id + "/";   
                 var site = fermata.json(gameUrl);
                 var get = site.get(function (err, result) {
                   if (!err) {
                        SCOREAPP.game = result;
                        Transparency.render(qwery('[data-route=game]')[0], SCOREAPP.game);
                        document.getElementById('floatingBarsG').style.display = "none";
                        SCOREAPP.router.gameSection();

                        //Form function for edit score
                        var postScoreForm = qwery('#postScoreForm');
                        postScoreForm[0].onsubmit = SCOREAPP.update.gameScore;
                        
                    
                }  
            });
            }else{
                        Transparency.render(qwery('[data-route=game]')[0], SCOREAPP.game);
                        document.getElementById('floatingBarsG').style.display = "none";
                        SCOREAPP.router.gameSection();
                   }
        },

        schedule: function(){
            if(!SCOREAPP.schedule){     
                 var site = fermata.json("https://api.leaguevine.com/v1/games/?tournament_id=19389&pool_id=19222");
                 var get = site.get(function (err, result) {
                   if (!err) {
                        SCOREAPP.schedule = result.objects;

                        Transparency.render(qwery('[data-table=schedule]')[0], SCOREAPP.schedule, directives);
                        document.getElementById('floatingBarsG').style.display = "none";
                        SCOREAPP.router.change();
                   }
                });
            }else {
                        Transparency.render(qwery('[data-table=schedule]')[0], SCOREAPP.schedule, directives);
                        document.getElementById('floatingBarsG').style.display = "none";
                        SCOREAPP.router.change();
                   }  
        },

        ranking: function () {    
            if(!SCOREAPP.ranking){     
                 var site = fermata.json("https://api.leaguevine.com/v1/pools/19222/?access_token=e772a86109");
                 var get = site.get(function (err, result) {
                   if (!err) {
                        SCOREAPP.ranking = result;
                        Transparency.render(qwery('[data-route=ranking]')[0], SCOREAPP.ranking);
                        document.getElementById('floatingBarsG').style.display = "none";
                        SCOREAPP.router.change();
                   } 
                });
            }else{
                        Transparency.render(qwery('[data-route=ranking]')[0], SCOREAPP.ranking);
                        document.getElementById('floatingBarsG').style.display = "none";
                        SCOREAPP.router.change();
                   } 
        }
    };

    //directives to bind game id to url
    var directives = {
        idS: {
            href: function(params) {   
            return params.text = "#/game/" + this.id;
            }
        }
    };

    //DOM ready
    domready(function () {
        // Start application
        SCOREAPP.controller.init();
    });

})();



