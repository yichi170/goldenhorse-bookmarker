function highlightScreenings() {
    chrome.storage.local.get("bookmarkedScreenings", function(result) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
        }

        const bookmarkedScreenings = result.bookmarkedScreenings || [];
        const rows = document.querySelectorAll("tr.gridc.fcTxt");

        console.log("Selected rows:", rows);

        rows.forEach((row) => {
            const dateTimeCell = row.querySelector("td:nth-child(1)");
            const titleCell = row.querySelector("td:nth-child(2)");

            if (!dateTimeCell || !titleCell) return;

            let [screeningDate, , , screeningTime] = dateTimeCell.textContent.trim().split(" ");
            screeningDate = screeningDate.trim();
            screeningTime = screeningTime.trim();
            const filmTitle = titleCell.textContent.trim();

            const isBookmarked = bookmarkedScreenings.some(
                (screening) =>
                    screening.date === screeningDate &&
                    screening.time === screeningTime &&
                    screening.title === filmTitle
            );

            if (isBookmarked) {
                row.style.backgroundColor = "#ffff99"; // Highlight if bookmarked
            }
        });
    });
}

function observeTableChanges() {
    const targetNode = document.getElementById("gameListContainer");

    if (!targetNode) return;

    const config = { childList: true, subtree: true };

    const callback = (mutationsList) => {
        for (const mutation of mutationsList) {
            console.log(mutation);
            if (mutation.type === "childList") {
                highlightScreenings(); // Call highlight when changes occur
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
}


highlightScreenings(); // for working on https://tghff.tixcraft.com/activity/game/*
observeTableChanges(); // for working on https://tghff.tixcraft.com/activity/detail/*
