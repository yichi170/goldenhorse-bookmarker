document.addEventListener("DOMContentLoaded", () => {
    const bookmarkList = document.getElementById("bookmark-list");

    function loadBookmarks() {
        bookmarkList.innerHTML = "";

        chrome.storage.local.get("bookmarkedScreenings", function(result) {
            const bookmarkedScreenings = result.bookmarkedScreenings || [];

            if (bookmarkedScreenings.length === 0) {
                bookmarkList.innerHTML = "<li>No bookmarks available</li>";
            } else {
                bookmarkedScreenings.sort((a, b) => {
                    const dateA = new Date(`${a.date} ${a.time}`);
                    const dateB = new Date(`${b.date} ${b.time}`);
                    return dateA - dateB;
                });

                bookmarkedScreenings.forEach((screening, index) => {
                    const listItem = document.createElement("li");

                    listItem.innerHTML = `
                        <div class="bookmark-card">
                            <div class="bookmark-content">
                                <a href="${screening.link}" target="_blank">${screening.title}</a>
                                <p>${screening.date} ${screening.time}<br>${screening.cinema}</p>
                            </div>
                            <div class="delete-button" data-title="${screening.title}" data-date="${screening.date}" data-time="${screening.time}" data-cinema="${screening.cinema}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                                    <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
                                </svg>
                            </div>

                        </div>
                    `;

                    bookmarkList.appendChild(listItem);
                });

                document.querySelectorAll(".delete-button").forEach(button => {
                    button.addEventListener("click", deleteBookmark);
                });
            }
        });
    }

    function deleteBookmark(event) {
        const title = event.currentTarget.getAttribute("data-title");
        const date = event.currentTarget.getAttribute("data-date");
        const time = event.currentTarget.getAttribute("data-time");
        const cinema = event.currentTarget.getAttribute("data-cinema");

        chrome.storage.local.get("bookmarkedScreenings", function(result) {
            const bookmarkedScreenings = result.bookmarkedScreenings || [];

            const updatedBookmarks = bookmarkedScreenings.filter(screening => {
                const match = screening.title === title && screening.date === date && screening.time === time && screening.cinema == cinema;
                return !match;
            });

            chrome.storage.local.set({ bookmarkedScreenings: updatedBookmarks }, function() {
                loadBookmarks();
            });
        });
    }

    loadBookmarks();
});
