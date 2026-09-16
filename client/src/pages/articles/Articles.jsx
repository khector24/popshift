import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa6";

import { getPublishedArticles } from "../../services/articlesApi.js";

import "../../styles/pages/articles/Articles.css";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadArticles() {
      try {
        setLoading(true);
        setError("");

        const response = await getPublishedArticles();
        setArticles(response.data ?? []);
      } catch (err) {
        console.error(err);
        setError("Unable to load articles.");
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  return (
    <div className="articles-page">
      <header className="articles-page__header">
        <span>RegionLore Stories</span>
        <h1>Articles</h1>
        <p>
          Stories and analysis exploring the places, people, and trends shaping
          communities across the United States.
        </p>
      </header>

      {loading && <p className="articles-page__status">Loading articles...</p>}

      {error && <p className="articles-page__status">{error}</p>}

      {!loading && !error && articles.length === 0 && (
        <p className="articles-page__status">No articles published yet.</p>
      )}

      {!loading && !error && articles.length > 0 && (
        <div className="articles-page__grid">
          {articles.map((article) => {
            const preview =
              article.body.length > 180
                ? `${article.body.slice(0, 180).trim()}...`
                : article.body;

            const publishedDate = article.published_at
              ? new Date(article.published_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : null;

            return (
              <Link
                to={`/articles/${article.slug}`}
                className="articles-page__card"
                key={article.id}
              >
                <div className="articles-page__icon">
                  <FaBookOpen />
                </div>

                <div className="articles-page__card-content">
                  <div className="articles-page__meta">
                    <span>Article</span>
                    <span>Kenny Hector</span>
                    {publishedDate && <span>{publishedDate}</span>}
                  </div>

                  <h2>{article.title}</h2>

                  <p>{preview}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
