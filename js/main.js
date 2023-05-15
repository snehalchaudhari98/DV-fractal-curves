
let kochColorScale;
  // Define the initial triangle
  var trianglePoints = [
    [250, 50],
    [450, 450],
    [50, 450],
  ];



// This function is called once the HTML page is fully loaded by the browser
document.addEventListener("DOMContentLoaded", function () {
  // Create SVG element
  var svg = d3.select("#canvas").attr("width", 500).attr("height", 500);

  var koch_curve = svg.append("g").attr("id", "koch_curve");
  const kochOrderSlider = document.getElementById("order_slider");
  const slider_output = document.getElementById("slider-value");
  slider_output.innerText = kochOrderSlider.value;
  let initial_slider = kochOrderSlider.value;

  console.log("initial_slider", initial_slider);

  kochOrderSlider.oninput = function () {
    slider_output.innerText = this.value;
  };

  // kock inpute slider
  d3.select("#order_slider")
    .attr("step", 1)
    .on("click", function () {
      slider_output.innerText = this.value;
      initial_slider = this.value;
      // Call the Koch Snowflake function for each side of the triangle
      d3.select("#koch_curve").remove();
      console.log(
        " removing prev. plot and new slider value is ",
        initial_slider
      );
      svg.append("g").attr("id", "koch_curve");
      kochSnowflake([trianglePoints[0], trianglePoints[1]], initial_slider);
      kochSnowflake([trianglePoints[1], trianglePoints[2]], initial_slider);
      kochSnowflake([trianglePoints[2], trianglePoints[0]], initial_slider);
    });

 drawKochCurve(initial_slider); // reversekoch curve

  // Sierpinski curev
  /*
  var sierpinski_triangles = d3
    .select("#canvas")
    .append("g")
    .attr("id", "sierpinski_triangles");/*

  const slider_output = document.getElementById("Sierpinski_silder-value");
  slider_output.innerText = document.getElementById("Sierpinski_slider").value;
  SierpinskiTriangle_curve();

  // dragon curve 
  /*var dragon_curves = d3
    .select("#canvas")
    .append("g")
    .attr("id", "dragon_curves");

  const slider_output = document.getElementById("dragon_slider-value");
  slider_output.innerText = document.getElementById("dragon_slider").value;
*/

//hilbercurve
// hilbertCurve();



});

function hilbertCurve(){
  // Define the size and margin of the SVG container
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const width = 500 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // Define the size of each square in the Hilbert Curve
  const squareSize = 10;

  // Define the Hilbert Curve order (the order of the curve determines the level of recursion)
  const order = 20;

  // Define the SVG container and add a group element for the Hilbert Curve
  const svg = d3
    .select("#canvas");

  const group = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Generate the Hilbert Curve points and create an SVG path string
  const points = hilbert(0, 0, squareSize, 0, 0, squareSize, order);
  const pathString = d3.line()(points);

  // Draw the Hilbert Curve path on the SVG
  group
    .append("path")
    .attr("d", pathString)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", squareSize);
}

function hilbert(x, y, xi, xj, yi, yj, n) {
  if (n <= 0) {
    const xx = x + (xi + yi) / 2;
    const yy = y + (xj + yj) / 2;
    return [[xx, yy]];
  }
  const a = hilbert(x, y, yi / 2, yj / 2, xi / 2, xj / 2, n - 1);
  const b = hilbert(
    x + xi / 2,
    y + xj / 2,
    xi / 2,
    xj / 2,
    yi / 2,
    yj / 2,
    n - 1
  );
  const c = hilbert(
    x + xi / 2 + yi / 2,
    y + xj / 2 + yj / 2,
    xi / 2,
    xj / 2,
    yi / 2,
    yj / 2,
    n - 1
  );
  const d = hilbert(
    x + xi / 2 + yi,
    y + xj / 2 + yj,
    -yi / 2,
    -yj / 2,
    -xi / 2,
    -xj / 2,
    n - 1
  );
  return a.concat(b, c, d);
}



function drawDragonCurve(){
  // Set initial variables
  var iterations = 15;
  var length = 400;
  var direction = 1;
  var path = "M0,0";
  var x = 0;
  var y = 0;

  // Generate the Dragon Curve
  dragonCurve(iterations, length, direction, path);

  // Create the SVG path and append it to the SVG element
  var svg = d3.select("svg");
  svg
    .append("path")
    .attr("d", path)
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("fill", "none");
}



// Recursive function to generate the Dragon Curve
function dragonCurve(iterations, length, direction, path) {
    if (iterations == 0) {
        return;
    }

    dragonCurve(iterations - 1, length, 1,path);
    path += "L" + (x += length * Math.cos(direction * Math.PI / 2)) + "," + (y += length * Math.sin(direction * Math.PI / 2));
    dragonCurve(iterations - 1, length, -1, path);
}


function updateSierpinski(){
     const SierpinskiOrderSlider = document.getElementById("Sierpinski_slider");
     const slider_output = document.getElementById("Sierpinski_silder-value");
     slider_output.innerText = SierpinskiOrderSlider.value;
     let initial_slider = SierpinskiOrderSlider.value;

      d3.select("#sierpinski_triangles").remove();
      console.log(
        "Sierpinski : removing prev. plot and new slider value is ",
        initial_slider
      );
      d3.select("#canvas").append("g").attr("id", "sierpinski_triangles");

     SierpinskiTriangle_curve();
}

function SierpinskiTriangle_curve() {
  SierpinskiColorScale = d3
    .scaleSequential()
    .domain([0, 500]) // Set the color domain to the range of the side lengths
    // .interpolator(d3.interpolateTurbo); // Use the Viridis color scheme
    // .interpolator(d3.interpolatePurples); // Use the Viridis color scheme
    .interpolator(d3.interpolateMagma); // Use the Viridis color scheme

  let initialSierpinski_order = 10;
  const SierpinskiOrderSlider = document.getElementById("Sierpinski_slider");

  // Call the recursive function with the vertices of the initial triangle
  //Get a reference to the SVG and get its dimensions
  const svg = d3.select("#canvas");
  const width = +svg.style("width").replace("px", "");
  const height = +svg.style("height").replace("px", "");

  const triangle = [
    { x: 0, y: height },
    { x: width / 2, y: 0 },
    { x: width, y: height },
  ];

  sierpinski(triangle, 0, SierpinskiOrderSlider.value);
}

const drawTriangle = (triangle) => {
d3.select("#sierpinski_triangles")
  .append("polygon")
  .style("stroke", (d) => SierpinskiColorScale(triangle[1].y))
  .style("fill", "transparent")
  .attr(
    "points",
    `${triangle[0].x},${triangle[0].y} ${triangle[1].x},${triangle[1].y} ${triangle[2].x},${triangle[2].y}`
  );
};


const sierpinski = (triangle, depth, maxDepth) => {
  if (depth > maxDepth) {
    return;
  }

  drawTriangle(triangle);

  const [a, b, c] = triangle;

  const ab = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const bc = { x: (b.x + c.x) / 2, y: (b.y + c.y) / 2 };
  const ca = { x: (c.x + a.x) / 2, y: (c.y + a.y) / 2 };

  sierpinski([a, ab, ca], depth + 1, maxDepth);
  sierpinski([ab, b, bc], depth + 1, maxDepth);
  sierpinski([ca, bc, c], depth + 1, maxDepth);
};


function drawKochCurve(initial_slider) {


  kochColorScale = d3
    .scaleSequential()
    .domain([0, 500]) // Set the color domain to the range of the side lengths
    .interpolator(d3.interpolateViridis); // Use the Viridis color scheme

  // Call the Koch Snowflake function for each side of the triangle
  kochSnowflake([trianglePoints[0], trianglePoints[1]], initial_slider);
  kochSnowflake([trianglePoints[1], trianglePoints[2]], initial_slider);
  kochSnowflake([trianglePoints[2], trianglePoints[0]], initial_slider);
}

  // Define the Koch Snowflake function
  function kochSnowflake(points, order) {
    if (order == 0) {
      // Draw the line segment
      var line = d3
        .select("#koch_curve")
        .append("line")
        // .transition()
        // .duration(500)
        .attr("x1", points[0][0])
        .attr("y1", points[0][1])
        .attr("x2", points[1][0])
        .attr("y2", points[1][1])
        .style("stroke", (d) => kochColorScale(distanceBetweenPoints(points)))
        .style("stroke-width", "2");
    } else {
      // Divide the line segment into 3 parts
      var pointA = points[0];
      var pointB = points[1];
      var pointC = [
        (2 * pointA[0] + pointB[0]) / 3,
        (2 * pointA[1] + pointB[1]) / 3,
      ];
      var pointD = [
        (pointA[0] + pointB[0]) / 2 -
          (Math.sqrt(3) * (pointB[1] - pointA[1])) / 6,
        (pointA[1] + pointB[1]) / 2 +
          (Math.sqrt(3) * (pointB[0] - pointA[0])) / 6,
      ];
      var pointE = [
        (pointA[0] + 2 * pointB[0]) / 3,
        (pointA[1] + 2 * pointB[1]) / 3,
      ];

      // Recursively call the function for each line segment
      kochSnowflake([pointA, pointC], order - 1);
      kochSnowflake([pointC, pointD], order - 1);
      kochSnowflake([pointD, pointE], order - 1);
      kochSnowflake([pointE, pointB], order - 1);
    }
  }

  function distanceBetweenPoints(points) {
    //  let x = points[0][0] - points[1][0];
    // let y = points[0][1] - points[1][1];

    //     let x = points[1][0] ;
    // let y = points[1][1] ;

    return points[0][0];
    // return Math.sqrt(x * x + y * y);
  }

