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
                '/game': function() {
                    document.getElementById('floatingBarsG').style.display = "block";
                	console.log("routie game");
                    SCOREAPP.datas.game();
                },
                '/schedule': function() {
                    document.getElementById('floatingBarsG').style.display = "block";
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
        }

    };

    // Post gamescore
    SCOREAPP.update = {
        gamescore: function (){
            var site = fermata.json("https://api.leaguevine.com/v1/game_scores/");
            var post = site.post(
                        {
                            'Content-Type':"application/json",
                            'Authorization':"bearer a6abfe991a"
                        },
                        {
                            game_id: "127238",
                            team_1_score: "66",
                            team_2_score: "22",
                            is_final: "False"
                        }, 
            function (error, result) {
            if (!error) {
                console.log("Posten is gelukt");
            } else {
                console.warn(error);
            }
            });
        }
    }

    // Get data from API for each page
    SCOREAPP.datas = {
        game: function () {    
            if(!SCOREAPP.game){     
                 var site = fermata.json("https://api.leaguevine.com/v1/games/127238/?access_token=857668913c");
                 var get = site.get(function (err, result) {
                   if (!err) {
                        SCOREAPP.game = result;
                        Transparency.render(qwery('[data-route=game]')[0], SCOREAPP.game);
                        document.getElementById('floatingBarsG').style.display = "none";
                        SCOREAPP.router.change();
                   }  
                });
            }else{
                        Transparency.render(qwery('[data-route=game]')[0], SCOREAPP.game);
                        document.getElementById('floatingBarsG').style.display = "none";
                        SCOREAPP.router.change();
                   }
        },

        schedule: function(){
            if(!SCOREAPP.schedule){     
                 var site = fermata.json("https://api.leaguevine.com/v1/games/?tournament_id=19389&pool_id=19222");
                 var get = site.get(function (err, result) {
                   if (!err) {
                        SCOREAPP.schedule = result;
                        console.log(result);
                        Transparency.render(qwery('[data-route=schedule]')[0], SCOREAPP.schedule);
                        document.getElementById('floatingBarsG').style.display = "none";
                        SCOREAPP.router.change();
                   }
                });
            }else {
                        Transparency.render(qwery('[data-route=schedule]')[0], SCOREAPP.schedule);
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


    //DOM ready
    domready(function () {
        // Start application
        SCOREAPP.controller.init();
        SCOREAPP.update.gamescore();
    });

})();

/*  '/game/:id': function(id){} */

    //Compare scores
    /*directives = {
        Sc: {
        text: function(){
            for(var i=0; i<SCOREAPP.ranking.rankings.length; i++) {
                var points = this.rankings[i].Pw - this.rankings[i].Pl;
                return points;
            }
        }
        }
    };*/
