//Namespace
var SCOREAPP = SCOREAPP || {};

// self invoking anonymous function
(function(){
	
    //Controller
    SCOREAPP.controller = {
    //function to start router
        init: function(){
        		SCOREAPP.router.init(); 
        }
    };

    //Set data objects to zero
    SCOREAPP.game = null;
    SCOREAPP.schedule = null;
    SCOREAPP.ranking = null; 

    //Router (Routie library) 
    SCOREAPP.router = {
        init: function (){
            //loads HTML & data for each page
            routie({
                '/game/:id': function(id) { //Takes the id out of the URL
                    document.getElementById('floatingBarsG').style.display = "block"; //Shows loader
                    document.getElementById('navigation').style.display = "none"; //Hide navigation
                	console.log("routie game");
                    SCOREAPP.datas.game(id); //Gets game data from API from specific game_id 
                },
                '/schedule': function() {
                    document.getElementById('floatingBarsG').style.display = "block"; //Shows loader
                	console.log("routie schedule");
                    SCOREAPP.datas.schedule(); //Gets schedule data from API
                },
                '/ranking': function() {
                    document.getElementById('floatingBarsG').style.display = "block"; //Shows loader
                	console.log("routie ranking");
                    SCOREAPP.datas.ranking(); //Gets ranking data from API
                },
                //Default output for undefined URLs
                '*': function() { //Displays schedule page
                    document.getElementById('floatingBarsG').style.display = "block"; //Shows loader
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

    // Post game score
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

            //Acces to post function
            var headers = {
                            'Content-Type':"application/json",
                            'Authorization':"bearer a6abfe991a"
            }

            var site = fermata.json("https://api.leaguevine.com/v1/game_scores/");
            // Post function fermata js
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

            //Prevent to refresh the page
            return false; 
        }
    };

    // Get data from API for each page
    SCOREAPP.datas = {
        game: function (id) {    
            if(!SCOREAPP.game){  
                var gameUrl = "https://api.leaguevine.com/v1/games/" + id + "/";   
                var site = fermata.json(gameUrl);

                // Get function fermata js 
                site.get(function (err, result) {
                   if (!err) {
                        SCOREAPP.game = result; //Fill SCOREAPP.game with data
                        Transparency.render(qwery('[data-route=game]')[0], SCOREAPP.game); //Render data to HTML section with data-route="game" 
                        document.getElementById('floatingBarsG').style.display = "none"; //Hide loader
                        SCOREAPP.router.gameSection(); //Change to game page

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
                // Get function fermata js 
                site.get(function (err, result) {
                   if (!err) {
                        SCOREAPP.schedule = result.objects; //Fill SCOREAPP.schedule with data objects
                        Transparency.render(qwery('[data-table=schedule]')[0], SCOREAPP.schedule, directives); //Render data & directives to HTML section with data-table="schedule"
                        document.getElementById('floatingBarsG').style.display = "none"; //Hide loader
                        SCOREAPP.router.change(); //Change to schedule page
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
                // Get function fermata js 
                site.get(function (err, result) {
                   if (!err) {
                        SCOREAPP.ranking = result; //Fill SCOREAPP.ranking with data 
                        Transparency.render(qwery('[data-route=ranking]')[0], SCOREAPP.ranking); //Render data to HTML section with data-route="ranking"
                        document.getElementById('floatingBarsG').style.display = "none"; //Hide loader
                        SCOREAPP.router.change(); //Change to ranking page
                   } 
                });
            }else{
                Transparency.render(qwery('[data-route=ranking]')[0], SCOREAPP.ranking);
                document.getElementById('floatingBarsG').style.display = "none";
                SCOREAPP.router.change();
            } 
        }
    };

    var directives = {
        idS: { //directive to bind game id to url
            href: function(params) {   
                return params.text = "#/game/" + this.id;
            }
        },
        start_time: { //directive to display only time
            text: function(params) {
                var dateTime = this.start_time;
                var time = dateTime.split("T");
                return params.text = time[1].substring(0,5);
            }
        }
    };

    //DOM ready
    domready(function () {
        // Start application
        SCOREAPP.controller.init();
    });

})();



