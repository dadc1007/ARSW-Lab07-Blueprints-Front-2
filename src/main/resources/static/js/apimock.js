var apimock = (function () {
    var mockdata = [];
    mockdata["juan"] = [
        {
            "author": "juan",
            "name": "house",
            "points": [
                { "x": 100, "y": 220 },
                { "x": 260, "y": 220 },
                { "x": 260, "y": 120 },
                { "x": 100, "y": 120 },
                { "x": 100, "y": 220 },
                { "x": 100, "y": 120 },
                { "x": 180, "y": 60  },
                { "x": 260, "y": 120 },
            ]
        },
        {
            "author": "juan",
            "name": "star",
            "points": [
                { "x": 240, "y": 60 },
                { "x": 270, "y": 150 },
                { "x": 360, "y": 150 },
                { "x": 290, "y": 200 },
                { "x": 320, "y": 290 },
                { "x": 240, "y": 230 },
                { "x": 160, "y": 290 },
                { "x": 190, "y": 200 },
                { "x": 120, "y": 150 },
                { "x": 210, "y": 150 },
                { "x": 240, "y": 60 }
            ]
        },
    ];

    mockdata["ana"] = [
        {
            author: "ana",
            name: "sketch1",
            points: [
                { x: 20, y: 30 },
                { x: 40, y: 90 },
                { x: 100, y: 120 },
            ],
        },
        {
            author: "ana",
            name: "sketch2",
            points: [
                { x: 200, y: 200 },
                { x: 250, y: 250 },
                { x: 300, y: 200 },
                { x: 250, y: 150 },
            ],
        },
    ];
    return {
        getBlueprintsByAuthor: function (author, callback) {
            callback(mockdata[author]);
        },
        getBlueprintsByNameAndAuthor: function (author, name, callback) {
            callback(
                mockdata[author].find(function (bp) {
                    return bp.name === name;
                })
            );
        },
    };
})();
