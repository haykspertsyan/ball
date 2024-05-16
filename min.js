$("#game_over").hide();

var probabilitys = [];
var scores =[];

var gameParameters = {
    colors: {
        red: {
            score: 4,
            probability: 0.25
        },
        green: {
            score: 3,
            probability: 0.45
        },
        blue: {
            score: 2,
            probability: 0.65
        },
        black: {
            score: 1,
            probability: 0.8
        },
    },
    animationSpeed: 5000,
    points: 0,
    RandomNum: 160,
    backgroundColor: "black",
    balls: undefined,
}

$("#start").on("click", function() {
    (new ball(gameParameters)).init();
});

function ball(config) {
    var that = this;
    var timerId ;
    var calculator = $("#calculator");
    this.init = function() {

        this.addElement();
        this.setEvents();

        this.timerId = window.setInterval(function(){
            that.addElement();
        }, 1200);
        // this.addElement();
    };

    this.getRandomInRange = function(min, max) {
        config.RandomNum = Math.floor(Math.random() * (max - min + 1) + min);
    };

    this.ballProbabilitys = function(){
        $.each(config.colors, function(key, value) {
            probabilitys.push(value.probability)
            scores.push(value.score)
        });
    }

    this.getRandom = function(weights, results) {
        let num = Math.random(),
            s = 0,
            lastIndex = weights.length - 1;

        for (let i = 0; i < lastIndex; ++i) {
            s += weights[i];
            if (num < s) {
                return results[i];
            }
        }

        return results[lastIndex];
    };

    this.addElement = function() {
        
        this.ballProbabilitys();

        this.getRandomColors();

        config.balls = $("<div class='ball'></div>").css('left', config.RandomNum)
            .css("backgroundColor", config.backgroundColor).data('color', config.backgroundColor);
        $("#box").append(config.balls);

        this.getRandomInRange(0, 320);

        config.balls.animate({
            top: "550px",
        }, config.animationSpeed, "linear", function() {
            $(".ball").stop();
            clearInterval(that.timerId);
            $(".ball").hide();

           that.gameOver();
        });
    };


    this.getRandomColors = function() {
        var keys = Object.keys(config.colors);
        var randomNumber = Math.floor(Math.random() * keys.length);
        config.backgroundColor = this.getRandom(probabilitys, keys);
    };

    this.gameOver = function() {
        $("#game_over").show();
        $("#start").prop("disabled", true);

        $(document).ready(function() {
            $(".reload").click(function() {
                location.reload(true);
                $("#start").prop("disabled", false)
            });
        });
    };

    this.setEvents = function(){
        $(document).on("click", '.ball', function() {
            config.points = calculator.html();
        
            calculator.html(parseInt(config.points) + config.colors[$(this).data('color')].score);
            $(this).stop().remove();
        
        
            switch (config.points) {
                case "10":
                    config.animationSpeed = 3500;
                    break;
                case "15":
                    config.animationSpeed = 2500;
                    break;
                case "20":
                    config.animationSpeed = 1500;
                    break;
            };
        });
    }
}
