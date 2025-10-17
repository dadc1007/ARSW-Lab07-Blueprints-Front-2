var app = (function () {
    var selectedAuthor = null;
    var currentBlueprint = null;
    var blueprints = [];

    var api = apiclient; // o apimock

    function mapBlueprints(list) {
        return list.map(bp => ({
            name: bp.name,
            points: bp.points.length,
        }));
    }

    function clearCanvas() {
        const canvas = document.getElementById("canvasBlueprint");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawPoints(points) {
        const canvas = document.getElementById("canvasBlueprint");
        const ctx = canvas.getContext("2d");
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (points.length > 0) {
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();
        }
    }

    function refreshBlueprints(author, list) {
        blueprints = mapBlueprints(list);
        $("table tbody").empty();
        blueprints.forEach(bp => {
            const row = `
        <tr>
          <td>${bp.name}</td>
          <td>${bp.points}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary" 
                    onclick="app.drawBlueprint('${author}','${bp.name}')">Open</button>
          </td>
        </tr>`;
            $("table tbody").append(row);
        });

        const total = blueprints.reduce((acc, bp) => acc + bp.points, 0);
        $("#total-points").text("Total user points: " + total);
    }

    function initCanvasEvents() {
        const canvas = document.getElementById("canvasBlueprint");
        if (!canvas) return;

        canvas.addEventListener("pointerdown", function (event) {
            if (!currentBlueprint) return;

            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            currentBlueprint.points.push({x: x, y: y});
            clearCanvas();
            drawPoints(currentBlueprint.points);
        });
    }

    return {
        loadBlueprints: function (author) {
            if (!author) return alert("Please enter an author");
            selectedAuthor = author;

            api.getBlueprintsByAuthor(author, function (data) {
                if (!data || data.length === 0) {
                    $("table tbody").empty();
                    $("#author-blueprints").text(`${author}'s blueprints:`);
                    $("#total-points").text("Total user points: 0");
                    $("#current-blueprint-name").text("None");
                    clearCanvas();
                    currentBlueprint = null;

                    alert(`No blueprints found for author "${author}".`);
                    return;
                }

                refreshBlueprints(author, data);
                clearCanvas();
                $("#current-blueprint-name").text("None");
                currentBlueprint = null;
            });
        },

        drawBlueprint: function (author, name) {
            api.getBlueprintsByNameAndAuthor(author, name, function (bp) {
                currentBlueprint = bp;
                $("#current-blueprint-name").text(bp.name + " (by " + bp.author + ")");
                clearCanvas();
                drawPoints(bp.points);
            });
        },

        saveOrUpdateBlueprint: function () {
            if (!currentBlueprint) return alert("No blueprint selected.");

            const author = currentBlueprint.author;
            const name = currentBlueprint.name;
            const points = currentBlueprint.points;

            const method = currentBlueprint.isNew ? "POST" : "PUT";
            const url =
                method === "POST"
                    ? "/blueprints"
                    : `/blueprints/${encodeURIComponent(author)}/${encodeURIComponent(name)}`;
            const data = method === "POST" ? currentBlueprint : points;

            $.ajax({
                url: url,
                type: method,
                data: JSON.stringify(data),
                contentType: "application/json",
            })
                .then(() => {
                    currentBlueprint.isNew = false;
                    return new Promise(resolve =>
                        api.getBlueprintsByAuthor(author, resolve)
                    );
                })
                .then(data => {
                    refreshBlueprints(author, data);
                    alert("Blueprint saved successfully!");
                })
                .catch(() => alert("Error saving blueprint"));
        },

        createNewBlueprint: function () {
            if (!selectedAuthor) return alert("Select an author first.");
            const name = prompt("Enter name for new blueprint:");
            if (!name) return;

            clearCanvas();
            currentBlueprint = {
                author: selectedAuthor,
                name: name,
                points: [],
                isNew: true,
            };
            $("#current-blueprint-name").text(name + " (new)");
        },

        deleteBlueprint: function () {
            if (!currentBlueprint) return alert("No blueprint selected.");
            const author = currentBlueprint.author;
            const name = currentBlueprint.name;

            $.ajax({
                url: `/blueprints/${encodeURIComponent(author)}/${encodeURIComponent(name)}`,
                type: "DELETE",
            })
                .then(() => {
                    clearCanvas();
                    $("#current-blueprint-name").text("None");
                    currentBlueprint = null;
                    return new Promise(resolve =>
                        api.getBlueprintsByAuthor(author, resolve)
                    );
                })
                .then(data => {
                    refreshBlueprints(author, data);
                    alert("Blueprint deleted.");
                })
                .catch(() => alert("Error deleting blueprint"));
        },

        initCanvasEvents: initCanvasEvents,
    };
})();

$(document).ready(function () {
    const canvas = document.getElementById("canvasBlueprint");
    if (canvas) {
        canvas.width = 480;
        canvas.height = 360;
    }

    if (app && app.initCanvasEvents) {
        app.initCanvasEvents();
    }
});
