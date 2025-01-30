import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [fetchedNews, setFetchedNews] = useState([]);
  const [fetchedAllNews, setFetchedAllNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const fetchedData = await axios.get(
          "https://newsapi.org/v2/top-headlines?country=us&apiKey=bd69e9c2e0ec4a3391a8b283e486092a"
        );
        const fetchedNews = fetchedData.data.articles;
        setFetchedNews(fetchedNews);
        console.log(fetchedNews);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    const fetchAllNews = async () => {
      try {
        const fetchedAllNewsData = await axios.get(
          "https://newsapi.org/v2/everything?q=technology&apiKey=bd69e9c2e0ec4a3391a8b283e486092a"
        );
        const fetchedAllNews = fetchedAllNewsData.data.articles;
        setFetchedAllNews(fetchedAllNews);
        console.log(fetchedAllNews);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
    fetchAllNews();
  }, []);

  const Header = () => {
    return (
      <header>
        <h1>NewsApp</h1>
        <div id="search">
          <input
            type="text"
            id="search-box"
            placeholder="Search for Headlines"
          />
          <button id="search-btn">Search</button>
        </div>
      </header>
    );
  };

  const FirstSection = ({ fetchedNews }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const buttons = [0, 1, 2, 3, 4];

    return (
      <section id="first-section">
        <div id="first-section-first">
          <Carousel fetchedNews={fetchedNews} />
        </div>
        <div id="first-section-second">
          <div id="first-section-second-first">
            <a href={fetchedNews.length > 0 ? fetchedNews[5].url : ""}>
              <p>
                {fetchedNews.length > 0 ? fetchedNews[5].title : "Loading..."}
              </p>
            </a>
            <img
              src={
                fetchedNews.length > 0
                  ? fetchedNews[5].urlToImage
                  : "https://placehold.co/1000"
              }
            />
          </div>
          <div id="first-section-second-second">
            <a href={fetchedNews.length > 0 ? fetchedNews[6].url : ""}>
              {fetchedNews.length > 0 ? fetchedNews[6].title : "Loading..."}
            </a>
            <p>
              By {fetchedNews.length > 0 ? fetchedNews[6].author : "Loading..."}
            </p>
            <p>
              {fetchedNews.length > 0 ? fetchedNews[6].content : "Loading..."}
            </p>
          </div>
        </div>
      </section>
    );
  };

  const NewsCard = ({ fetchedAllNews, articleID }) => {
    const article =
      fetchedAllNews && fetchedAllNews.length > articleID
        ? fetchedAllNews[articleID]
        : null;

    return (
      <div className="news-card">
        {article ? (
          <>
            <img
              src={article.urlToImage || "https://placehold.co/1000"}
              alt={article.title || "Placeholder"}
            />
            <a href={article.url || "#"}>
              {article.title || "No Title Available"}
            </a>
          </>
        ) : (
          <>
            <img src="https://placehold.co/1000" alt="Placeholder" />
            <p>Loading or no data available</p>
          </>
        )}
      </div>
    );
  };

  const AsideCard = ({ fetchedNews, articleID }) => {
    const article =
      fetchedNews.length > articleID ? fetchedNews[articleID] : null;
    return (
      <div className="aside-card">
        <img src={article ? article.urlToImage : "https://placehold.co/1000"} />

        <div className="aside-card-text">
          <a href={article ? article.url : ""}>
            {article ? article.title : "Loading..."}
          </a>
          <p>
            {article && article.content
              ? article.content.split("[")[0] || "Content unavailable"
              : "Loading..."}
          </p>
        </div>
      </div>
    );
  };

  function Carousel({ fetchedNews }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const buttons = [0, 1, 2, 3, 4];

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % buttons.length);
      }, 3000); // Change slide every 3 seconds

      return () => clearInterval(interval); // Cleanup on unmount
    }, [buttons.length]);

    if (!fetchedNews || fetchedNews.length === 0) {
      return <p>Loading news...</p>;
    }

    return (
      <div id="carousel">
        <img
          src={
            fetchedNews.length > 0
              ? fetchedNews[currentSlide].urlToImage
              : "https://placehold.co/1000"
          }
        />

        <div id="carousel-controls">
          {buttons.map((index) => (
            <button
              key={index}
              className={`carousel-control ${
                currentSlide === index ? "active" : ""
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        <a id="carousel-text">
          {fetchedNews[currentSlide]?.title || "No article available"}
        </a>
      </div>
    );
  }

  const SecondSection = ({ fetchedNews, fetchedAllNews }) => {
    const [visibleArticles, setVisibleArticles] = useState(8);

    const handleViewMore = () => {
      setVisibleArticles((prev) => prev + 6);
    };

    const visibleAllNews = fetchedAllNews.slice(0, visibleArticles);

    return (
      <section id="second-section">
        <div id="news-section">
          <div id="news-section-title">
            <h2>Latest News</h2>
          </div>
          <div id="news-section-cards">
            {visibleAllNews.map((article, index) => (
              <NewsCard
                key={index}
                fetchedAllNews={fetchedAllNews}
                articleID={index}
              />
            ))}
          </div>
          {visibleArticles < fetchedAllNews.length && (
            <button onClick={handleViewMore}>View More</button>
          )}
        </div>
        <aside>
          <h2>Trending Headlines</h2>
          <AsideCard fetchedNews={fetchedNews} articleID={7} />
          <AsideCard fetchedNews={fetchedNews} articleID={8} />
          <AsideCard fetchedNews={fetchedNews} articleID={9} />
          <AsideCard fetchedNews={fetchedNews} articleID={10} />
          <AsideCard fetchedNews={fetchedNews} articleID={11} />
        </aside>
      </section>
    );
  };

  const Footer = () => {
    return (
      <footer>
        <p>© {new Date().getFullYear()} Newsletter, All Rights Reserved.</p>
      </footer>
    );
  };

  return (
    <div className="App">
      <Header />
      <FirstSection fetchedNews={fetchedNews} />
      <SecondSection
        fetchedNews={fetchedNews}
        fetchedAllNews={fetchedAllNews}
      />
      <Footer />
    </div>
  );
}

export default App;
