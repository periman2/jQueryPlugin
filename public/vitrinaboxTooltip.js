$(document).ready(function(){


  // ==================
  // START PLUGIN CODE
  // ==================

    (function( $ ) {
      elements = [];
      index = 0;
      // Setting the main function for the plugin
      $.fn.vitrinaboxTooltip = function (options) {     
        //The this.each means that tooltip(s) are going to be created for any number of elements if the user chooses to add it in a general tag or a class for example 'div' or 'a'.
        this.each(function(){
          // Save to a variable for accessability
          let element = $(this);

          //Initialization of the current element
          let elementObj = {
            tagName: element.prop('tagName'),
            element: element, 
            index: index, 
            tooltips: []
          }

          //The object rect is the offset from the viewport while coords is the offset from the dom;
          let coords = element.offset();

          //Initializing the parent element's height and width as well as the tooltip's box.
          let width = element.width();
          let height = element.height();
          let boxWidth = width * 0.09;
          let boxHeight = boxWidth / 3.5;
          let defaultDiameter = boxHeight / 3;
          let defaultThickness = 2;
          let defaultFontSize = defaultDiameter * 2 + 'px';

          //Extends the settings for the plugin to use the defaults and the parsed options if they exist. This way the user is able to later change the DEFAULT values too.
          defaults = {
            backgroundColor: 'red',
            text: 'VitrinaBox hello',
            textColor: 'white',
            fontSize: defaultFontSize,
            boxWidth: boxWidth,
            boxHeight: boxHeight,
            pointThickness: defaultThickness,
            pointColor: 'white',
            parentPositionX: getParentCoordinates(coords).x,
            parentPositionY: getParentCoordinates(coords).y,
            pointDiameter: defaultDiameter,
            onElementClick: changePosition,
          };

          let settings = $.extend(
          {},
          // $.fn.vitrinaboxTooltip.defaults,
          defaults,
          $.fn.vitrinaboxTooltip.defaults,
          options
          );

          //The function to create the tooltip(s)
        (function (){
          //Loop through the count and make a tooltip for each instance as the user requested
          for(var i = 1; i <= settings.count; i++ ){

            //Selects the first tooltip as the one that moves with the click of the button as default
            let selected = false;
            if(i === 1){
              selected = true;
            }

            // Create point and paragraph elements
            let $p = createDiv();
            let $point = createSpan();

            // Puts selected text in the 'p' element
            $p.append(settings.text);
            

            // ====================
            // INITIAL STYLING HERE
            // ====================

            //Function to initialize the tooltips position and css in general.         
            (function (){
              // Styling and setting up of the css default properties of point.
              let pointCoords = getPointInitialCoordinates($point, i)
              let cssObjPoint = $.extend(getPointInitialDiameter(), pointCoords, getPointDefaultCss());
              $point.css(cssObjPoint);
              
              //And for the box.
              let cssObjBox = $.extend({} , getBoxDefaultCss(), getBoxInitialPosition($point));
              $p.css(cssObjBox);
            })();

            //Appends the point and p to the body.
            $("body").append($point, $p);

            let tooltip = {
              point: $point,
              p: $p,
              index: i,
              selected: selected
            }

            //Make onClick method for tooltip
            $point.bind('click', this, clickTooltip);

            elementObj.tooltips.push(tooltip);
          }
        //end of createTooltip function
        })();

        //Create and bind event listener for click event on the parent element
        element.bind("click", this, changePosition);

        //Create and bind even listener for window scroll.
        $(window).bind('scroll', this, changeBoxOnScroll);

        function changeBoxOnScroll(ev){
          allTooltips = elementObj.tooltips;
          allTooltips.forEach(function(tooltip){
            let offset = tooltip.point.offset();
            let rect = tooltip.point[0].getBoundingClientRect();
            let pointDiameter = tooltip.point.width() + settings.pointThickness * 2;

            if(!(rect.top > 0 
            && rect.left + rect.width > 0 
            && rect.top + rect.height > 0 
            && rect.left > 0)) {
              return
            }
            let pointPos = {};
            pointPos.Y = offset.top;
            pointPos.X = offset.left;
            pointPos.client = {
              X: rect.left,
              Y: rect.top
            }

            let viewport = getCustomViewport(elementObj);
            //Gets the updated position of the box in realtion to the new position of the point.
            let viewBoxPos = getBoxRelPos(tooltip, viewport, pointDiameter, pointPos.client);

            // MOVE THE BOX TO FIT SCREEN
            moveBox(tooltip.p, viewBoxPos);
          })
        }
        
        function changePosition(ev){
          // Coordinates of click event in a new position object.
          let mousePos = {}
          mousePos.X = ev.originalEvent.pageX;
          mousePos.Y = ev.originalEvent.pageY;
          mousePos.client = {
            X: ev.clientX,
            Y: ev.clientY
          }
          console.log(mousePos.client)

          // Accesing the currently selected tooltip
          currentTooltip = elementObj.tooltips.filter((t)=> t.selected)[0];

          getNewPosition(currentTooltip, elementObj, mousePos);

        //End of changePosition function
        }
          

        function getNewPosition(currentTooltip, elementObj, mousePos){

          let pointDiameter = currentTooltip.point.width() + settings.pointThickness * 2;

          let newPos = {};
          //Put the newpos position in the center of the circle as a general case.
          newPos.X = mousePos.client.X - pointDiameter / 2;
          newPos.Y = mousePos.client.Y - pointDiameter / 2;

          //Gets the coordinates of the element according to the screen as well as the VISIBLE width and height of it.
          let viewport = getCustomViewport(elementObj);

          //Gets the position in relation to the visible window
          let viewPos = checkPointLocation(viewport, pointDiameter, mousePos.client, newPos);   
          console.log('this is the viewpos', viewPos);

          //MOVE THE POINT FIRST
          movePoint(currentTooltip.point, viewPos);

          //Gets the updated position of the box in realtion to the new position of the point.
          let viewBoxPos = getBoxRelPos(currentTooltip, viewport, pointDiameter, viewPos);

          //MOVE THE BOX SECOND
          moveBox(currentTooltip.p, viewBoxPos);

          let pointPosition = $.extend({}, newPos, viewPos);
        //End of get new pointPosition function
        }

        function getCustomViewport(elementObj){

          let elementPosViewport = elementObj.element[0].getBoundingClientRect();
          let elementWidth = elementObj.element.width();
          let elementHeight = elementObj.element.height();
          //Change viewport object to be compatible with checkPointLocation function. in a visible width and height and in viewport coordinate format
          let windowWidth = document.body.clientWidth;
          let windowHeight = document.body.clientHeight;
          let viewport = {}
          viewport.width = elementWidth;
          viewport.height = elementHeight;

          viewport.left = elementPosViewport.left;
          viewport.top = elementPosViewport.top;
          //Gets the left top values as well as the width and height of the element that is currently on the screeen
          if(elementPosViewport.left <= 0){
            viewport.left = 0;

            //Set width if it's cut from left side
            viewport.width += elementPosViewport.left;
            if(windowWidth < elementWidth){
              viewport.width = windowWidth;
            }
          } else {
            // Set width if it's cut from right side
            if(windowWidth - viewport.left < elementWidth){
              viewport.width = windowWidth - viewport.left
            } else {
              viewport.width = elementWidth;
            }
          }

          if(elementPosViewport.top <= 0){
            viewport.top = 0;
            //Set width if it's cut from above
            viewport.height += elementPosViewport.top;
            if(windowHeight < elementHeight){
              viewport.height = windowHeight;
            }
          } else {
            //Set width if it's cut from bellow
            if(windowHeight - viewport.top < elementHeight){
              viewport.height = windowHeight - viewport.top;
            } else {
              viewport.height = elementHeight;
            }
          }

          return viewport;
        //End of get custom viewport function
        }

        function checkPointLocation(elementPos, pointDiameter, mousePos, newPos){
          //Update the width and height according to the viewport
          let elementWidth = elementPos.width;
          let elementHeight = elementPos.height;
          pos = Object.assign({}, newPos);

          //Check if click is in the left edge or corners.
          if(elementPos.left + pointDiameter / 2 > mousePos.X){
            //Check up left corner.
            if(elementPos.top + pointDiameter / 2 > mousePos.Y){
              pos.Y = elementPos.top + pointDiameter / 2;
            //Check down left corner.
            } else if(elementPos.top + elementHeight - pointDiameter / 2 < mousePos.Y){
              pos.Y = elementPos.top + elementHeight - pointDiameter / 2;
            }
            //General case for left edge.
            pos.X = elementPos.left;
          }

          //Check if click is in the right edges.
          if(elementPos.left + elementWidth - pointDiameter / 2 < mousePos.X){
            //Check up right corner.
            if(elementPos.top + pointDiameter > mousePos.Y){
              pos.Y = elementPos.top + pointDiameter / 2;
            //Check down right corner.
            } else if (elementPos.top + elementHeight - pointDiameter < mousePos.Y){
              pos.Y = elementPos.top + elementHeight - pointDiameter;
            }
            // General case for right edge.
            pos.X = elementPos.left + elementWidth - pointDiameter;
          }

          //Check if click is in the top edge
          if(elementPos.top + pointDiameter > mousePos.Y){
            pos.Y = elementPos.top;
          }

          //Check if click is in the bottom edge
          if(elementPos.top + elementHeight - pointDiameter < mousePos.Y){
            pos.Y = elementPos.top + elementHeight - pointDiameter
          }

          return pos
        //End of checkPointLocation function
        }
      
        function getBoxRelPos(currentTooltip, viewport, pointDiameter, pointPos){

          let point = currentTooltip.point;
          let box = currentTooltip.p;
          let boxWidth = box.width();
          let boxHeight = box.height();

          //Position relative to visible element
          relPos = {};
          relPos.Y = pointPos.Y - viewport.top;
          relPos.X = pointPos.X - viewport.left;

          //Initialize at the 'up' position
          let boxPos = chooseBoxRelativePosition('up', point);

          //Check for margin and show accordingly
          if(relPos.X < boxWidth / 2 - pointDiameter / 2){
            boxPos = chooseBoxRelativePosition('right', point);
          } else if ( relPos.X >  viewport.width - (boxWidth)){
            boxPos = chooseBoxRelativePosition('left', point);
          } else if ( relPos.Y < pointDiameter + boxHeight + settings.point_box_offset){
            boxPos = chooseBoxRelativePosition('down', point);
          }
          
          return boxPos;
        }

        function chooseBoxRelativePosition(relPos, point){

          //Get current css properties of point to maximize reusability
          let pointTop = point.offset().top
          let pointLeft = point.offset().left;
          let pointDiameter = point.width();
          let pointThickness = parseFloat(point.css('border-top-width'));
          let wholePointDiameter = (pointDiameter + pointThickness * 2);

          //Making the code more dry by using variables for the same values;
          let LeftAndRightY = pointTop - settings.boxHeight / 2 + pointDiameter / 2
          let UpAndDownX = pointLeft + wholePointDiameter / 2 - settings.boxWidth / 2;

          let pos = {};

          switch(relPos){
            case 'down':
            // Make the box to be under the point
            pos.top = pointTop + wholePointDiameter + settings.point_box_offset,
            pos.left = UpAndDownX 
            break;
            case 'up':
            // Make the box to be above the point
            pos.top = pointTop - settings.boxHeight - settings.point_box_offset// - wholePointDiameter / 2 - settings.boxHeight - settings.point_box_offset;
            pos.left = UpAndDownX 
            break;
            case 'right':
            // Make the box to be on the right of the point
            pos.top = LeftAndRightY;
            pos.left = pointLeft + wholePointDiameter + settings.point_box_offset;
            break;
            case 'left':
            // Make the box to be on the left of the point
            pos.top = LeftAndRightY
            pos.left = pointLeft - settings.point_box_offset - pointThickness - settings.boxWidth;
            break;
          }
          return pos;
        // End of chooseBoxRelativePosition funciton
        }

        function movePoint(point, newPos){
          point.css({
            top: newPos.Y + window.pageYOffset,
            left: newPos.X + window.pageXOffset
          })
        }

        function moveBox(box, newPos){
          box.css({
            top: newPos.top,
            left: newPos.left
          })
        }
        
        // Creates the paragraph element
        function createP(){
          return $(document.createElement('p'));
        }
        // Creates span element
        function createSpan(){
          return $(document.createElement('span'));
        }

        // Creates the div element
        function createDiv(){
          return $(document.createElement('div'));
        }
          
        function clickTooltip(ev){
          // Gets the currently selected tooltip and unselects it.
          let selected = elementObj.tooltips.filter((t) => t.selected)[0];
          elementObj.tooltips[selected.index - 1].selected = false;

          // Gets current tooltip.
          currentTooltip = elementObj.tooltips.filter((t) => t.point.is($(this)))[0];

          // Selects the current one
          currentTooltip.selected = true;
        }

        function getParentCoordinates(coords){
          let box = {};
          box.x = coords.left;
          box.y = coords.top;
          return box;
        }

        function getPointInitialCoordinates(point, i){
          return {
            // Positioning the tooltip at the top of the element. 
            top: settings.parentPositionY + settings.pointDiameter / 2,
            // Divide the width by the number of tooltips and then add to it the multiple of that division that corresponds to the current tooltip.
            left: settings.parentPositionX + width / (settings.count + 1) - settings.pointDiameter / 2 + (i - 1) * width / (settings.count + 1),
          }
        }

        function getPointInitialDiameter(){
          return {
            width: settings.pointDiameter + 'px',
            height: settings.pointDiameter + 'px'
          }
        }

        // =====================
        // DEFAULT CSS FUNCTIONS
        // =====================
        function getPointDefaultCss(){
          return {
              position: 'absolute',
              display: 'inline-block',
              border: settings.pointThickness + 'px solid ' + settings.pointColor,
              borderRadius: '50%'
            }
        }

        function getBoxDefaultCss(){
          return {
            position: 'absolute',
            textAlign: 'center',
            display: 'block',
            fontSize: settings.fontSize,
            width: settings.boxWidth,
            height: settings.boxHeight,
            // border: '2px solid white',
            backgroundColor: settings.backgroundColor,
            color: settings.textColor
          }
        }

        function getBoxInitialPosition(point){
          let pos = chooseBoxRelativePosition('down', point);
          return pos;
        }

        //Pushes the element into the array of all elements that have a tooltip.
        elements.push(elementObj)
        
        index ++
      //End of function this.each
    });

    // We return the whole scope using 'this'.
    return this;
  //End of general function
};

$.fn.vitrinaboxTooltip.defaults = {
  backgroundColor: 'red',
  text: 'VitrinaBox',
  textColor: 'white',
  pointColor: 'white',
  point_box_offset: 10,
  count: 1
};

// End of main function for widthet.
})( jQuery );
  

  $('img').vitrinaboxTooltip({
    pointThickness: 3,
    count: 3,
    boxWidth: 200
  });

  $('a').vitrinaboxTooltip();

  $('#blackbox').vitrinaboxTooltip();
  
  // ==================
  // END PLUGIN
  // ================== 
  
})