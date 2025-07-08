function removeYmmOnlyEntries(terms) {
    return terms.filter(vehicle => {
        return (
            vehicle.year !== null && vehicle.year !== undefined && vehicle.year !== "" ||
            vehicle.make !== null && vehicle.make !== undefined && vehicle.make !== "" ||
            vehicle.model !== null && vehicle.model !== undefined && vehicle.model !== ""
        );
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const searchTerms = JSON.parse(localStorage.getItem("searchTerms") || "[]");
    const cleanedTerms = removeYmmOnlyEntries(searchTerms);

    // Only proceed if cleanup actually removes something
    if (cleanedTerms.length < searchTerms.length) {
        localStorage.setItem("searchTerms", JSON.stringify(cleanedTerms));

        // Only reload ONCE
        if (localStorage.getItem("removedOldGarageData") !== "true") {
            localStorage.setItem("removedOldGarageData", "true");
            setTimeout(function () {
                location.reload();
            }, 100);
        }
    }
});