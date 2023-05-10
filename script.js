const words = [
    {text: "Happy", size: 10},
    {text: "Sad", size: 1},
    {text: "Nice", size: 2},
    {text: "Amazing", size: 8},
    {text: "Joyful", size: 7},
    {text: "Exciting", size: 9},
    {text: "Peaceful", size: 4},
    {text: "Determined", size: 6},
    {text: "Friendly", size: 3},
    {text: "Innovative", size: 5}
];

const width = 500;
const height = 500;

const svg = d3.select("#word-cloud")
    .attr("width", width)
    .attr("height", height);

d3.layout.cloud()
    .size([width, height])
    .words(words)
    .padding(5)
    .rotate(() => ~~(Math.random() * 2) * 90)
    .fontSize(d => d.size * 10)
    .on("end", draw)
    .start();

function draw(words) {
    svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", d => `${d.size}px`)
        .style("fill", () => `hsl(${~~(Math.random() * 360)}, 80%, 60%)`)
        .style("font-family", "Arial")
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
        .text(d => d.text);
}
