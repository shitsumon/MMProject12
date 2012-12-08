/*
    animation.js - File for application logic which deals with animation of characters.
    For any global variable or helper struct see helper.js!
*/

/*
    heroMovement() - Interface function which is called from HTML code

    The function reads out a global variable 'gTargetIdentifier' which
    holds the target canvas id. Based on the distance in relation to a
    fix velocity value, the movement vector is computed and used for the
    entire movement to the target canvas object.
*/
function heroMovement(){

    //Get objects of target and hero picture
    var hero = $("#protagonist1");
    var target = $("#"+gTargetIdentifier);

    var targetPos = target.offset();
    var heroPos = hero.offset();

    //Get current position of protagonist object and target clickable object
    var targetX = targetPos.left;
    var targetY = targetPos.top;

    var heroX = heroPos.left;
    var heroY = heroPos.top;

    //Calculate directional vector in dependence from velocity parameter
    if(!gMRset){

        gVecX = Math.abs(heroX - targetX) / gVelocityParam;
        gVecY = Math.abs(heroY - targetY) / gVelocityParam;
    }

    var newHx = 0;
    var newHy = 0;

    //calculate next movement step for x and y depending from direction
    if(heroX > targetX){
        newHx = heroX - gVecX;
    }else if(heroX < targetX){
        newHx = heroX + gVecX;
    }else{
        newHx = targetX;
    }

    if(heroY > targetY){
        newHy = heroY - gVecY;
    }else if(heroY < targetY){
        newHy = heroY + gVecY;
    }else{
        newHy = targetY;
    }

    //Check if hero collides with viewport borders
    switch(borderCollisionDetection("protagonist1")){
    case 1:
        newHx = 1;
        break;
    case 2:
        newHy = 1;
        break;
    case 3:
        newHx = $(window).width - hero.outerWidth() - 1;
        break;
    case 4:
        newHy = $(window).height - hero.outerHeight() - 1;
        break;
    case 0:
    default:
        break;
    }

    //set new position of hero
    var newPos = {
        left: newHx,
        top: newHy
    };

    hero.offset(newPos);

    //Check if hero intersects with clicked target, if yes stop movement action
    if(hero.intersectsWith(gTargetIdentifier)){

        //in case the hero object collided with a border on its way to the target,
        //the object is set one pixel away from it, to avoid remaining sticked
        //to the border
        if((hero.offset().top + hero.outerHeight()) > ($(window).height / 2)){
            newPos = {
                left: hero.offset().left,
                top: hero.offset().top += 1
            };

            hero.offset(newPos);
        }else{
            newPos = {
                left: hero.offset().left,
                top: hero.offset().top -= 1
            };

            hero.offset(newPos);
        }

        if((hero.offset().left + hero.outerWidth()) > ($(window).width / 2)){
            newPos = {
                left: hero.offset().left += 1,
                top: hero.offset().top
            };

            hero.offset(newPos);
        }else{
            newPos = {
                left: hero.offset().left -= 1,
                top: hero.offset().top
            };

            hero.offset(newPos);
        }

        //Stop intervall in order to stop the movement
        clearTimeout(gTimeoutDescriptor);

        //reset global variables
        gTargetIdentifier = "";
        gVecX             = 0.0;
        gVecY             = 0.0;
        gMRset            = false;

        return;
    }else{
        gTimeoutDescriptor = setTimeout(function(){heroMovement()}, 25);
    }
}

/*
    borderCollisionDetection() -

    Function which checks if the hero
    object has collided with one of the
    viewports borders.

    Input arguments:

    - objectName - current moving object

    Return values:

    0 - no collison
    1 - collision with left border
    2 - collision with upper border
    3 - collision with right border
    4 - collision with lower border
*/
function borderCollisionDetection(objectName){

    var movingObject        = $("#"+objectName);
    var objLeft             = movingObject.offset().left;
    var objTop              = movingObject.offset().top;
    var objLeftWithWidth    = objLeft + movingObject.width();
    var objTopWithHeight    = objTop  + movingObject.height();

    var newPos = 0;

    //collision with left border
    if(objLeft <= 0){

        newPos = {
            left: 0,
            top: objTop
        };

        movingObject.offset(newPos);

        return 1;
    }

    //collision with upper border
    if(objTop <= 0){

        newPos = {
            left: objLeft,
            top: 0
        };

        movingObject.offset(newPos);

        return 2;
    }

    //collision with right border
    if(objLeftWithWidth >= $(window).width()){

        newPos = {
            left: ($(window).width() - movingObject.width()),
            top: objTop
        };

        movingObject.offset(newPos);
        return 3;
    }

    //collision with lower border
    if(objTopWithHeight >= $(window).height()){

        newPos = {
            left: objLeft,
            top: ($(window).height() - movingObject.height())
        };

        movingObject.offset(newPos);
        return 4;
    }

    return 0;
}

/*
    $.fn.intersectsWith -

    JQuery Plugin which checks whether
    the hero intersects with it's target.
    The usage is quite convenient.
    Simply ask in every cycle

    "heroObject.intersectsWith(targetObject);"

    Which will return true if the objects intersect,
    and false if not.
*/
(function($){
     $.fn.intersectsWith = function(targetname) {
                 //alert(targetname);
                 var hero = this;
                 var target = $("#"+targetname);

                 if(!hero || !target){
                     return false;
                 }

                 var heroOffset = hero.offset();
                 var heroMinX   = heroOffset.left;
                 var heroMinY   = heroOffset.top;
                 var heroMaxX   = heroMinX + hero.outerWidth();
                 var heroMaxY   = heroMinY + hero.outerHeight();

                 var targetOffset = target.offset();
                 var targetMinX   = targetOffset.left;
                 var targetMinY   = targetOffset.top;
                 var targetMaxX   = targetMinX + target.outerWidth();
                 var targetMaxY   = targetMinY + target.outerHeight();

                 //No intersection
                 if(heroMinX >= targetMaxX ||
                         heroMaxX <= targetMinX ||
                         heroMinY >= targetMaxY ||
                         heroMaxY <= targetMinY){
                     return false;
                 }else{
                     return true;
                 }
             }
 })(jQuery);
