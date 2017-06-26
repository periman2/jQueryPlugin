<h1>jQuery Tooltip Plugin</h1>

<h2>How to use:</h2>

<ul>
    <li><h3>You use the plugin by doing: $('myElementSelector').vitrinaboxTooltip();</h3></li>
    <li><h3>To move a tooltip on the page, click on the next location you want it to be in.</h3></li>
    <li><h3>If an element has more than one tooltips you can select the one you want to move by clicking on its point circle.</h3></li>
    <li><h3>You can parse functionality using various options:</h3></li>
    <h3>All options:</h3>
    <code>{<br />
        backgroundColor: Background box color(in color string)<br />
        text: The text to be displayed(in string)<br />
        textColor: The color fo the text(in color string)<br />
        pointColor: Color of the point(in color string)<br />
        count: Number of tooltips for each element selected (only one for hyperlinks)(in number of)<br />
        fontSize: The fontsize of the text inside the tooltip (in number of pixels)<br />
        boxWidth: The width of the tooltip(in number of pixels)<br />
        boxHeight: The height of the tooltip(in number of pixels)<br />
        pointThickness: The thickness of the tooltip(in number of pixels)<br />
        pointDiameter: Diameter of tooltip's circle point(in number of pixels)<br />
        onElementClick: Function to use on parent element click event(Default is to move the tooltip)(function)<br />
        onPointClick: Function to use on click of the point circle (function)<br />
        point_box_offset: Space between the point and the box(in number of pixels)<br />
    }</code>
    <h3>Example:</h3>
        <p>Put 3 tooltips in each image element on the screen with pointThichness of 2px.</p>
    <code> 
        $('img').vitrinaboxTooltip({
            pointThickness: 2,
            count: 3
        });
    </code>
    <li><h3>The plugin will be set in default upwards position in hyperlinks and it will have no point, just the box.</h3></li>
    <li><h3>You can also change certain default options:</h3></li>
    <h3>You do this before any plugin code by doing: $.fn.vitrinaboxTooltip.defaults.DefaultOption = 'Choosen Default Option'</h3>
    <h3>Available default options:</h3>
    <code>{<br />
        backgroundColor: Default backgroundColor,<br />
        text: Default text,<br />
        textColor: Default text color,<br />
        pointColor: Default point color,<br />
        count: Default number of tooltips for each element.<br />
    }</code>
    <h3>Example: </h3>
    <code> 
        $.fn.vitrinaboxTooltip.defaults.text = 'New Text';
    </code>
</ul>