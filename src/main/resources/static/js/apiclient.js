var apiclient = (function () {
    function handleError(jqXHR, textStatus, errorThrown, callback) {
        console.error("API error:", textStatus, errorThrown);

        if (typeof callback === "function") {
            callback([]);
        }
    }

    return {
        getBlueprintsByAuthor: function (author, callback) {
            $.ajax({
                url: "/blueprints/" + encodeURIComponent(author),
                type: "GET",
                dataType: "json",
                success: function (data) {
                    if (typeof callback === "function") {
                        callback(data);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    handleError(jqXHR, textStatus, errorThrown, callback);
                },
            });
        },

        getBlueprintsByNameAndAuthor: function (author, name, callback) {
            $.ajax({
                url:
                    "/blueprints/" +
                    encodeURIComponent(author) +
                    "/" +
                    encodeURIComponent(name),
                type: "GET",
                dataType: "json",
                success: function (data) {
                    if (typeof callback === "function") {
                        callback(data);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    handleError(jqXHR, textStatus, errorThrown, callback);
                },
            });
        },

        postBlueprint: function (bp, callback) {
            $.ajax({
                url: "/blueprints",
                type: "POST",
                data: JSON.stringify(bp),
                contentType: "application/json",
                success: function (data) {
                    if (typeof callback === "function") {
                        callback(data);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    handleError(jqXHR, textStatus, errorThrown, callback);
                },
            });
        },

        deleteBlueprint: function (author, name, callback) {
            $.ajax({
                url:
                    "/blueprints/" +
                    encodeURIComponent(author) +
                    "/" +
                    encodeURIComponent(name),
                type: "DELETE",
                success: function (data) {
                    if (typeof callback === "function") {
                        callback(data);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    handleError(jqXHR, textStatus, errorThrown, callback);
                },
            });
        },
    };
})();
