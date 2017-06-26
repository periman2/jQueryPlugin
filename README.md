<h1>jQuery Tooltip Plugin</h1>

<h2>How to use:</h2>

<ul>
    <li><h3>You use the plugin by doing: $('myElementSelector').vitrinaboxTooltip();</h3></li>
    <li><h3>To move a tooltip on the page, click on the next location you want it to be in.</h3></li>
    <li><h3>If an element has more than one tooltips you can select the one you want to move by clicking on its point circle.</h3></li>
    <li><h3>You can parse functionality using various options:</h3></li>
    <h3>All options:</h3>
    <section>{<br />
        <strong>backgroundColor</strong>: Background box color(in color string)<br />
        <strong>text</strong>: The text to be displayed(in string)<br />
        <strong>textColor</strong>: The color fo the text(in color string)<br />
        <strong>pointColor</strong>: Color of the point(in color string)<br />
        <strong>count</strong>: Number of tooltips for each element selected (only one for hyperlinks)(in number of)<br />
        <strong>fontSize</strong>: The fontsize of the text inside the tooltip (in number of pixels)<br />
        <strong>boxWidth</strong>: The width of the tooltip(in number of pixels)<br />
        <strong>boxHeight</strong>: The height of the tooltip(in number of pixels)<br />
        <strong>pointThickness</strong>: The thickness of the tooltip(in number of pixels)<br />
        <strong>pointDiameter</strong>: Diameter of tooltip's circle point(in number of pixels)<br />
        <strong>onElementClick</strong>: Function to use on parent element click event(Default is to move the tooltip)(function)<br />
        <strong>onPointClick</strong>: Function to use on click of the point circle (function)<br />
        <strong>point_box_offset</strong>: Space between the point and the box(in number of pixels)<br />
    }</section>
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
    <section>{<br />
        <strong>backgroundColor</strong>: Default backgroundColor,<br />
        <strong>text</strong>: Default text,<br />
        <strong>textColor</strong>: Default text color,<br />
        <strong>pointColor</strong>: Default point color,<br />
        <strong>count</strong>: Default number of tooltips for each element.<br />
    }</section>
    <h3>Example: </h3>
    <code> 
        $.fn.vitrinaboxTooltip.defaults.text = 'New Text';
    </code>
</ul>