document.addEventListener("DOMContentLoaded", () => {
    const bookmarkList = document.getElementById("bookmark-list");

    function loadBookmarks() {
        bookmarkList.innerHTML = "";

        chrome.storage.local.get("bookmarkedScreenings", function(result) {
            const bookmarkedScreenings = result.bookmarkedScreenings || [];

            if (bookmarkedScreenings.length === 0) {
                bookmarkList.innerHTML = "<li>No bookmarks available</li>";
            } else {
                bookmarkedScreenings.forEach((screening, index) => {
                    const listItem = document.createElement("li");

                    listItem.innerHTML = `
                        <a href="${screening.link}" target="_blank">${screening.title} at ${screening.date} ${screening.time}</a>
                        <button class="delete-button" data-index="${index}">Delete</button>
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
        const index = parseInt(event.target.getAttribute("data-index"));

        chrome.storage.local.get("bookmarkedScreenings", function(result) {
            const bookmarkedScreenings = result.bookmarkedScreenings || [];

            bookmarkedScreenings.splice(index, 1);

            chrome.storage.local.set({ bookmarkedScreenings }, function() {
                loadBookmarks();
            });
        });
    }

    loadBookmarks();
});
