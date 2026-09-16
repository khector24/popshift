import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getPublishedArticleBySlug } from "../../services/articlesApi.js";

import "../../styles/pages/articles/ArticleDetail.css";

export default function ArticleDetail() {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadArticle() {
      try {
        setLoading(true);
        setError("");

        const response = await getPublishedArticleBySlug(slug);

        setArticle(response.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load article.");
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [slug]);

  if (loading) {
    return (
      <main className="article-detail">
        <p className="article-detail__status">Loading article...</p>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className="article-detail">
        <p className="article-detail__status">
          {error || "Article not found."}
        </p>
      </main>
    );
  }

  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main className="article-detail">
      <article className="article-detail__article">
        <header className="article-detail__header">
          <span>Stories & Analysis</span>

          <h1>{article.title}</h1>

          {publishedDate && (
            <p className="article-detail__date">Published {publishedDate}</p>
          )}
        </header>

        <div className="article-detail__body">{article.body}</div>

        {article.tags?.length > 0 && (
          <div className="article-detail__tags">
            {article.tags.map((tag) => (
              <span key={tag.id}>{tag.name}</span>
            ))}
          </div>
        )}
      </article>
    </main>
  );
}
