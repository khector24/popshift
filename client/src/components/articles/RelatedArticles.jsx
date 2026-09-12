import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getPublishedArticlesByPlaceId } from "../../services/articlesApi.js";

export default function RelatedArticles({ placeId }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadArticles() {
      try {
        setLoading(true);
        setError("");

        const response = await getPublishedArticlesByPlaceId(placeId);

        setArticles(response.data ?? []);
      } catch (err) {
        console.error(err);
        setError("Unable to load related articles.");
      } finally {
        setLoading(false);
      }
    }

    if (!placeId) {
      setLoading(false);
      setArticles([]);
      return;
    }

    loadArticles();
  }, [placeId]);

  if (loading) {
    return <p>Loading related articles...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (articles.length === 0) {
    return <p>No related articles yet.</p>;
  }

  return (
    <div>
      {articles.map((article) => (
        <article key={article.id}>
          <h3>
            <Link to={`/articles/${article.slug}`}>{article.title}</Link>
          </h3>
        </article>
      ))}
    </div>
  );
}
