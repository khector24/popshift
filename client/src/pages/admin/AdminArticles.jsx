import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getAdminArticles,
  deleteAdminArticle,
} from "../../services/adminArticlesApi.js";
import { getCurrentAdmin, logoutAdmin } from "../../services/adminAuthApi.js";

import "../../styles/pages/admin/AdminArticles.css";

export default function AdminArticles() {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAdminArticles() {
      try {
        setLoading(true);
        setError("");

        await getCurrentAdmin();

        const response = await getAdminArticles();

        setArticles(response.data ?? []);
      } catch (err) {
        if (err.status === 401) {
          navigate("/admin/login");
          return;
        }

        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadAdminArticles();
  }, [navigate]);

  async function handleDeleteArticle(article) {
    const confirmation = window.prompt(
      `Permanently delete "${article.title}"?\n\nThis cannot be undone.\n\nType DELETE to continue.`,
    );

    if (confirmation !== "DELETE") {
      return;
    }

    try {
      setError("");

      await deleteAdminArticle(article.id);

      setArticles((currentArticles) =>
        currentArticles.filter(
          (currentArticle) => currentArticle.id !== article.id,
        ),
      );
    } catch (err) {
      if (err.status === 401) {
        navigate("/admin/login");
        return;
      }

      setError(err.message);
    }
  }

  async function handleLogout() {
    try {
      await logoutAdmin();
      navigate("/admin/login");
    } catch (err) {
      setError(err.message);
    }
  }

  function renderArticleGroup(title, groupArticles, emptyMessage) {
    return (
      <section className="admin-articles__group">
        <div className="admin-articles__group-heading">
          <h2>{title}</h2>
          <span>{groupArticles.length}</span>
        </div>

        {groupArticles.length === 0 ? (
          <p className="admin-articles__empty">{emptyMessage}</p>
        ) : (
          <div className="admin-articles__list">
            {groupArticles.map((article) => (
              <article className="admin-articles__item" key={article.id}>
                <h3>{article.title}</h3>

                <div className="admin-articles__actions">
                  <Link to={`/admin/articles/${article.id}/edit`}>
                    Edit article
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDeleteArticle(article)}
                  >
                    Permanently delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    );
  }

  if (loading) {
    return (
      <main className="admin-articles">
        <p className="admin-articles__empty">Loading articles...</p>
      </main>
    );
  }

  const publishedArticles = articles.filter(
    (article) => article.status === "published",
  );

  const draftArticles = articles.filter(
    (article) => article.status === "draft",
  );

  const archivedArticles = articles.filter(
    (article) => article.status === "archived",
  );

  return (
    <main className="admin-articles">
      <header className="admin-articles__header">
        <div>
          <span>RegionLore Admin</span>
          <h1>Admin Articles</h1>
          <p>Manage RegionLore articles.</p>
        </div>

        <div className="admin-articles__header-actions">
          <Link className="admin-articles__create" to="/admin/articles/new">
            Create article
          </Link>

          <button
            className="admin-articles__logout"
            type="button"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </header>

      {error && <p className="admin-articles__error">{error}</p>}

      {!error && (
        <div className="admin-articles__groups">
          {renderArticleGroup(
            "Published",
            publishedArticles,
            "No published articles.",
          )}

          {renderArticleGroup("Drafts", draftArticles, "No draft articles.")}

          {renderArticleGroup(
            "Archived",
            archivedArticles,
            "No archived articles.",
          )}
        </div>
      )}
    </main>
  );
}
