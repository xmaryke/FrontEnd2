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

    //Gives user feedback
    SCOREAPP.feedback = {
        //Loader - feedback for loading data
        showLoader: function(){
            document.getElementById('floatingBarsG').style.display = "block";
        },
        hideLoader: function(){
            document.getElementById('floatingBarsG').style.display = "none";
        },

        //See which page is active in menu
        liRanking: qwery('nav li#liRanking')[0],
        liSchedule: qwery('nav li#liSchedule')[0],
        liRankingActive: function() {

            this.liRanking.classList.remove('navInactive');
            this.liRanking.classList.add('navActive');

            this.liSchedule.classList.remove('navActive');
            this.liSchedule.classList.add('navInactive');
        },
        liScheduleActive: function() {

            this.liSchedule.classList.remove('navInactive');
            this.liSchedule.classList.add('navActive');

            this.liRanking.classList.remove('navActive');
            this.liRanking.classList.add('navInactive');
        }
    };


    //Router (Routie library) 
    SCOREAPP.router = {
        init: function (){
            //loads HTML & data for each page
            routie({
                '/game/:id': function(id) { //Takes the id out of the URL
                    SCOREAPP.feedback.showLoader(); //Shows loader
                    document.getElementById('navigation').style.display = "none"; //Hide navigation
                	console.log("routie game");
                    SCOREAPP.datas.game(id); //Gets game data from API from specific game_id 
                    SCOREAPP.animation.init(); //Start frisbee animation
                },
                '/schedule': function() {
                    SCOREAPP.feedback.liScheduleActive(); //Show nav item as active 
                    SCOREAPP.feedback.showLoader(); //Shows loader
                	console.log("routie schedule");
                    SCOREAPP.datas.schedule(); //Gets schedule data from API
                },
                '/ranking': function() {
                    SCOREAPP.feedback.liRankingActive(); //Show nav item as active
                    SCOREAPP.feedback.showLoader(); //Shows loader
                	console.log("routie ranking");
                    SCOREAPP.datas.ranking(); //Gets ranking data from API
                },
                //Default output for undefined URLs
                '*': function() { //Displays schedule page
                    SCOREAPP.feedback.liScheduleActive(); //Show nav item as active 
                    SCOREAPP.feedback.showLoader(); //Shows loader
                    console.log("routie default");
                    SCOREAPP.datas.schedule(); 
                }
            });
        },

        //Control number for the swipe function
        controlNumber: 0,

        //Prevents to execute the swipe function multiple times
        swipe: function() {
            //After executing the swipe function add 1 to the controlNumber
            this.controlNumber += 1;

            //When the swipe function is executed 2 times, the control number will be 2 and then the code below will be executed for one time
            if(this.controlNumber == 2) {
                if(window.location.hash == "#/schedule"){ //If you're on the schedule page go to the ranking page 
                     window.location.href = "http://marrymedia.nl/frontend/#/ranking";
                }
                else if(window.location.hash == "#/ranking"){ //If you're on the ranking page go to the schedule page
                    window.location.href = "http://marrymedia.nl/frontend/#/schedule";
                }
                else{ //If you're on another page go to the ranking page
                    window.location.href = "http://marrymedia.nl/frontend/#/ranking";
                }

                //Reset the controle number to value 0
                this.controlNumber -= 2;
            }
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
                is_final: "True"
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
                        SCOREAPP.feedback.hideLoader(); //Hides loader
                        SCOREAPP.router.gameSection(); //Change to game page

                        //Form function for edit score
                        var postScoreForm = qwery('#postScoreForm');
                        postScoreForm[0].onsubmit = SCOREAPP.update.gameScore;
                    }  
                });
            }else{
                Transparency.render(qwery('[data-route=game]')[0], SCOREAPP.game);
                SCOREAPP.feedback.hideLoader(); 
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
                        Transparency.render(qwery('[data-list=schedule]')[0], SCOREAPP.schedule, directives); //Render data & directives to HTML section with data-table="schedule"
                        SCOREAPP.feedback.hideLoader(); //Hides loader
                        SCOREAPP.router.change(); //Change to schedule page
                    }
                });
            }else {
                Transparency.render(qwery('[data-list=schedule]')[0], SCOREAPP.schedule, directives);
                SCOREAPP.feedback.hideLoader(); //Hides loader
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
                        SCOREAPP.feedback.hideLoader(); //Hides loader
                        SCOREAPP.router.change(); //Change to ranking page
                   } 
                });
            }else{
                Transparency.render(qwery('[data-route=ranking]')[0], SCOREAPP.ranking);
                SCOREAPP.feedback.hideLoader(); //Hides loader
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
        teams: {
            text: function(params) {
            return this.team_1.name + " VS " + this.team_2.name;
            }
        },
        scores: {
            text: function(params) {
            return this.team_1_score + " - " + this.team_2_score;
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


    //Animations in the Score App
    SCOREAPP.animation = { 

        init: function(){ //Starts the animation function doMove
            var frisbee = document.getElementById('frisbee');
            frisbee.style.left = '0%'; //sets begin position 
            SCOREAPP.animation.doMove();
        },

        doMove: function(){ //Moves frisbee to the right
            frisbee.style.left = parseInt(frisbee.style.left)+1+'%'; 
            setTimeout(SCOREAPP.animation.doMove,20); //Activates function doMove every 20msec
            if(frisbee.style.left == "100%"){ //When the fribee reachs the end of the page go to the very left of the page
                frisbee.style.left = parseInt(frisbee.style.left)-100+'%';
            }
        }
    }; 


    //When the user swiped right change page
    $$('article#content').swipeRight(function() {
        SCOREAPP.router.swipe();
    });

    //When the user swiped left change page
    $$('article#content').swipeLeft(function() {
        SCOREAPP.router.swipe();
    });
           

    //DOM ready
    domready(function () {
        // Start application
        SCOREAPP.controller.init();
    });

})();



