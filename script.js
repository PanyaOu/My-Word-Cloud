const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSxHBxMz6cJfqzR29o1Cc-fe1pjOo-4-FNkvDsVk-CPeMf9CcIBCfc6HYZSrlqP3LLpeDjA0K3jECnP/pubhtml';

const width = 500;
const height = 500;

const svg = d3.select("#word-cloud")
    .attr("width", width)
    .attr("height", height);

async function FetchWordCloud() {
    const response = await fetch(sheetUrl);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const table = doc.querySelectorAll('table')[0];  // Get the second table (i.e., second sheet)

    const words = Array.from(table.rows)
        .slice(1)  // Skip the header row
        .map(row => ({
            text: row.cells[1].textContent,
            size: +row.cells[2].textContent,  // Convert string to number using unary plus operator
        }));
    
    length = words.length;

    d3.layout.cloud()
        .size([width, height])
        .words(words)
        .padding(8)
        .rotate(() => Math.random() < 0.75 ? 0 : 90)
        .fontSize(d => d.size * 10)
        .on("end", draw)
        .start();
}

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

document.getElementById("download-button").addEventListener("click", function() {
    let serializer = new XMLSerializer();
    let source = '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(svg.node());
    let url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
    
    let downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "word-cloud.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
});

FetchWordCloud();