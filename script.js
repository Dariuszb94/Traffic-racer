$(function() {

    let anim_id;

    //setting variable
    let container = $('#container');
    let car = $('#car');
    let car_1 = $('#car_1');
    let car_2 = $('#car_2');
    let car_3 = $('#car_3');
    let line_1 = $('#line_1');
    let line_2 = $('#line_2');
    let line_3 = $('#line_3');
    let restart_div = $('#restart_div');
    let restart_btn = $('#restart');
    let score = $('#score');
    let high_score = localStorage.getItem('high_score');
    $('#high_score').text(high_score);
   let easy_mode=false;

   
    let container_left = parseInt(container.css('left'));
    let container_width = parseInt(container.width());
    let container_height = parseInt(container.height());
    let car_width = parseInt(car.width());
    let car_height = parseInt(car.height());

 
    let game_over = false;
    let score_counter = 1;
    let speed = 2;
    let line_speed = 5;
    let move_right = false;
    let move_left = false;
    let move_up = false;
    let move_down = false;

    $(document).ready(function() {
        $("#easy_mode_button").click(function(){
        if(easy_mode){
           easy_mode=false;
           speed=4;
line_speed=7;
        }
        else{
            easy_mode=true;
         }

        }); 
   
    });

//steering from keyboard
    $(document).on('keydown', function(e) {
        if (game_over === false) {
            let key = e.keyCode;
            if (key === 37 && move_left === false) {
                move_left = requestAnimationFrame(left);
            } else if (key === 39 && move_right === false) {
                move_right = requestAnimationFrame(right);
            } else if (key === 38 && move_up === false) {
                move_up = requestAnimationFrame(up);
            } else if (key === 40 && move_down === false) {
                move_down = requestAnimationFrame(down);
            }
        }
    });

    $(document).on('keyup', function(e) {
        if (game_over === false) {
            let key = e.keyCode;
            if (key === 37) {
                cancelAnimationFrame(move_left);
                move_left = false;
            } else if (key === 39) {
                cancelAnimationFrame(move_right);
                move_right = false;
            } else if (key === 38) {
                cancelAnimationFrame(move_up);
                move_up = false;
            } else if (key === 40) {
                cancelAnimationFrame(move_down);
                move_down = false;
            }
        }
    });

    function left() {
        if (game_over === false && parseInt(car.css('left')) > 0) { //game cant be over and car cant move outside the container
            car.css('left', parseInt(car.css('left')) - 5);
            move_left = requestAnimationFrame(left);
        }
    }

    function right() {
        if (game_over === false && parseInt(car.css('left')) < container_width - car_width) { //game cant be over and car cant move outside the container
            car.css('left', parseInt(car.css('left')) + 5);
            move_right = requestAnimationFrame(right);
        }
    }

    function up() {
        if (game_over === false && parseInt(car.css('top')) > 0) { //game cant be over and car cant move outside the container
            car.css('top', parseInt(car.css('top')) - 3);
            move_up = requestAnimationFrame(up);
        }
    }

    function down() {
        if (game_over === false && parseInt(car.css('top')) < container_height - car_height) { //game cant be over and car cant move outside the container
            car.css('top', parseInt(car.css('top')) + 3);
            move_down = requestAnimationFrame(down);
        }
    }
//steering from screen
$(document).ready(function() {
    $("#left").click(function(){
        cancelAnimationFrame(move_right);
 move_right=false;
        move_left = requestAnimationFrame(left);
        setTimeout(leftHandlerDown,65);
    }); 
    $("#right").click(function(){
        move_right = requestAnimationFrame(right);
        setTimeout(rightHandlerDown,65);
        cancelAnimationFrame(move_left);
 move_left=false;
    }); 
    $("#up").click(function(){
        move_up = requestAnimationFrame(up);
        setTimeout(upHandlerDown,65);
    }); 
    $("#down").click(function(){
        move_down = requestAnimationFrame(down);
        setTimeout(downHandlerDown,65);
    }); 
});

function leftHandlerDown (){
cancelAnimationFrame(move_left);
 move_left=false;
}
function rightHandlerDown (){
cancelAnimationFrame(move_right);
 move_right=false;
}
function upHandlerDown (){
cancelAnimationFrame(move_up);
 move_up=false;
}
function downHandlerDown (){
cancelAnimationFrame(move_down);
 move_down=false;
}
    anim_id = requestAnimationFrame(repeat);

    function repeat() { //stopping game if collision is detected
        if (collision(car, car_1) || collision(car, car_2) || collision(car, car_3)) {
            stop_the_game();
            return;
        }

score_counter++;

        if (score_counter % 20 == 0) {
            score.text(parseInt(score.text()) + 1);
        }
        if (score_counter % 500 == 0) {
            speed++;
            line_speed++
        }

if (easy_mode==true){
    speed=1;
    line_speed=1;
}


        car_down(car_1);
        car_down(car_2);
        car_down(car_3);

        line_down(line_1);
        line_down(line_2);
        line_down(line_3);

        anim_id = requestAnimationFrame(repeat);
    }

    function car_down(car) { //moving car 
        let car_current_top = parseInt(car.css('top'));
        if (car_current_top > container_height) {
            car_current_top = -2;
            let car_left = parseInt(Math.random() * (container_width - car_width)); //random car appearance 
            car.css('left', car_left); 
        }
        car.css('top', car_current_top + speed);
    }

    function line_down(line) {
        let line_current_top = parseInt(line.css('top'));
        if (line_current_top > container_height) {
            line_current_top = -3;
        }
        line.css('top', line_current_top + line_speed);
    }

    restart_btn.click(function() {
        location.reload();
    });

    function stop_the_game() {
        game_over = true;
        cancelAnimationFrame(anim_id);
        cancelAnimationFrame(move_right);
        cancelAnimationFrame(move_left);
        cancelAnimationFrame(move_up);
        cancelAnimationFrame(move_down);
        restart_div.slideDown();
        restart_btn.focus();
        setHighScore();
    }

    function setHighScore() {
        if (high_score < parseInt(score.text())) {
            high_score = parseInt(score.text());
            localStorage.setItem('high_score', parseInt(score.text()));
        }
        $('#high_score').text(high_score);
    }



    function collision($div1, $div2) {
        let x1 = $div1.offset().left;
        let y1 = $div1.offset().top;
        let h1 = $div1.outerHeight(true);
        let w1 = $div1.outerWidth(true);
        let b1 = y1 + h1;
        let r1 = x1 + w1;
        let x2 = $div2.offset().left;
        let y2 = $div2.offset().top;
        let h2 = $div2.outerHeight(true);
        let w2 = $div2.outerWidth(true);
        let b2 = y2 + h2;
        let r2 = x2 + w2;

        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
        return true;
    }



});
