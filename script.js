const apiKey = "38cba5bb6b784da0ab43bf1f19840cc5";

const blogContainer = document.getElementById("blog-container");
const searchField = document.getElementById("search-input");
const dateField = document.getElementById("date-input");
const searchButton = document.getElementById("search-button");

// Load default news on page load
async function fetchTopNews() {
    try {
        const url = `https://newsapi.org/v2/top-headlines?sources=bbc-news&pageSize=10&apiKey=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        return data.articles;
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Search button click
searchButton.addEventListener("click", async () => {
    const query = searchField.value.trim();
    const date = dateField.value;

    if (query !== "" || date !== "") {
        const articles = await fetchNewsByQueryAndDate(query, date);
        displayBlogs(articles);
    }
});

// 🔥 Date-wise + keyword search (FULL DAY RANGE)
async function fetchNewsByQueryAndDate(query, date) {
    try {
        if (query === "") {
            query = "news"; // default keyword (MANDATORY)
        }

        let url = `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`;

        if (date) {
            url += `&from=${date}T00:00:00&to=${date}T23:59:59`;
        }

        const res = await fetch(url);
        const data = await res.json();
        return data.articles;

    } catch (error) {
        console.error(error);
        return [];
    }
}

// Display news cards
function displayBlogs(articles) {
    blogContainer.innerHTML = "";

    if (!articles || articles.length === 0) {
        blogContainer.innerHTML = "<p>No news found for selected date.</p>";
        return;
    }

    articles.forEach(article => {
        const card = document.createElement("div");
        card.className = "blog-card";

        const img = document.createElement("img");
        img.src = article.urlToImage || "https://via.placeholder.com/300";
        img.alt = article.title || "News image";

        const title = document.createElement("h2");
        title.textContent = article.title
            ? (article.title.length > 30 ? article.title.slice(0, 30) + "..." : article.title)
            : "No title";

        const desc = document.createElement("p");
        desc.textContent = article.description || "No description available.";

        card.append(img, title, desc);

        card.addEventListener("click", () => {
            window.open(article.url, "_blank");
        });

        blogContainer.appendChild(card);
    });
}

// Initial load
(async () => {
    const articles = await fetchTopNews();
    displayBlogs(articles);
})();

