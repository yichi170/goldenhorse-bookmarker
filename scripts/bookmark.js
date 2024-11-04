function addBookmarkButtons() {
    // Select all screening rows
    const rows = document.querySelectorAll(".table.special.show-list tbody tr.text-center");
    const dateInput = document.querySelector("#search_date");
    const screeningDate = dateInput ? dateInput.value.replace(/-/g, "/") : "";

    rows.forEach((row) => {
        if (row.querySelector(".bookmark-button")) return;

        const timeCell = row.querySelector(".time");
        const roomCell = row.querySelector(".room span");
        const titleCell = row.querySelector(".title .film_url a");

        if (!timeCell || !titleCell) return;

        const screeningTime = timeCell.textContent.trim();
        const filmTitle = titleCell.textContent.trim();
        const filmLink = titleCell.href;
        const cinemaHall = roomCell ? roomCell.textContent.trim() : '';
        console.log(cinemaHall);

        const bookmarkButton = document.createElement("button");
        bookmarkButton.classList.add("bookmark-button");
        bookmarkButton.style.backgroundColor = "#aa794b";
        bookmarkButton.style.color = "white";
        bookmarkButton.style.cursor = "pointer";

        chrome.storage.local.get("bookmarkedScreenings", function(result) {
            const bookmarkedScreenings = result.bookmarkedScreenings || [];
            const isBookmarked = bookmarkedScreenings.some(
                (screening) => screening.date === screeningDate &&
                               screening.time === screeningTime &&
                               screening.title === filmTitle &&
                               screening.cinema == cinemaHall
            );

            if (isBookmarked) {
                bookmarkButton.textContent = "✅";
                bookmarkButton.disabled = true; // Optionally disable the button
            } else {
                bookmarkButton.textContent = "➕";
            }

            // Add click event listener to button
            bookmarkButton.addEventListener("click", function () {
                // Add new screening to bookmarks
                bookmarkedScreenings.push({
                    date: screeningDate,
                    time: screeningTime,
                    title: filmTitle,
                    link: filmLink,
                    cinema: cinemaHall
                });

                // Save updated bookmarks to chrome.storage.local
                chrome.storage.local.set({ bookmarkedScreenings }, function() {
                    console.log('Bookmark saved to chrome.storage.local');
                    alert(`Bookmarked "${filmTitle}" on ${screeningDate} at ${screeningTime}`);
                    bookmarkButton.textContent = "✅";
                    bookmarkButton.disabled = true; // Disable the button after bookmarking
                });
            });
        });

        // Append the button to the last cell in the row
        const lastCell = row.querySelector(".add");
        if (lastCell) {
            lastCell.appendChild(bookmarkButton);
        }
    });
}

addBookmarkButtons();
