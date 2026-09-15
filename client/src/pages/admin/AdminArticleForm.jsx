import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  createAdminArticle,
  getAdminArticleById,
  updateAdminArticle,
} from "../../services/adminArticlesApi.js";
import { searchPlaces } from "../../services/searchApi.js";

import "../../styles/pages/admin/AdminArticleForm.css";

export default function AdminArticleForm() {
  const navigate = useNavigate();

  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loadingArticle, setLoadingArticle] = useState(isEditing);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("draft");
  const [tags, setTags] = useState("");

  const [placeQuery, setPlaceQuery] = useState("");
  const [placeResults, setPlaceResults] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [searchingPlaces, setSearchingPlaces] = useState(false);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    async function loadArticle() {
      try {
        setLoadingArticle(true);
        setError("");

        const response = await getAdminArticleById(id);
        const article = response.data;

        setTitle(article.title);
        setBody(article.body);
        setStatus(article.status);
        setTags(article.tags.map((tag) => tag.name).join(", "));
        setSelectedPlaces(article.places);
      } catch (err) {
        if (err.status === 401) {
          navigate("/admin/login");
          return;
        }

        setError("Unable to load article.");
      } finally {
        setLoadingArticle(false);
      }
    }

    loadArticle();
  }, [id, isEditing, navigate]);

  useEffect(() => {
    const normalizedQuery = placeQuery.trim();

    if (!normalizedQuery) {
      setPlaceResults([]);
      setSearchingPlaces(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setSearchingPlaces(true);

        const response = await searchPlaces(normalizedQuery);

        const availablePlaces = (response.data ?? []).filter(
          (place) =>
            !selectedPlaces.some(
              (selectedPlace) => selectedPlace.id === place.id,
            ),
        );

        setPlaceResults(availablePlaces);
      } catch {
        setPlaceResults([]);
      } finally {
        setSearchingPlaces(false);
      }
    }, 250);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [placeQuery, selectedPlaces]);

  function handleSelectPlace(place) {
    setSelectedPlaces((currentPlaces) => [...currentPlaces, place]);
    setPlaceQuery("");
    setPlaceResults([]);
  }

  function handleRemovePlace(placeId) {
    setSelectedPlaces((currentPlaces) =>
      currentPlaces.filter((place) => place.id !== placeId),
    );
  }

  function getPlaceTypeLabel(place) {
    if (place.place_type === "state") {
      return "State";
    }

    if (place.place_type === "federal_district") {
      return "Federal District";
    }

    if (place.place_type === "metro") {
      return "Metro Area";
    }

    if (place.place_type === "city") {
      return "City";
    }

    return place.place_type;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const articleData = {
        title,
        body,
        status,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        placeIds: selectedPlaces.map((place) => place.id),
      };

      if (isEditing) {
        await updateAdminArticle(id, articleData);
      } else {
        await createAdminArticle(articleData);
      }

      navigate("/admin/articles");
    } catch (err) {
      if (err.status === 401) {
        navigate("/admin/login");
        return;
      }

      setError("Unable to save article. Please check the form and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingArticle) {
    return (
      <main className="admin-article-form">
        <p className="admin-article-form__muted">Loading article...</p>
      </main>
    );
  }

  return (
    <main className="admin-article-form">
      <header className="admin-article-form__header">
        <span>RegionLore Admin</span>
        <h1>{isEditing ? "Edit Article" : "Create Article"}</h1>
        <p>
          {isEditing
            ? "Update article content, publishing status, tags, and related places."
            : "Create a new RegionLore article and attach it to relevant places."}
        </p>
      </header>

      <form className="admin-article-form__form" onSubmit={handleSubmit}>
        <section className="admin-article-form__section">
          <h2>Article</h2>

          <div className="admin-article-form__field">
            <label htmlFor="article-title">Title</label>
            <input
              id="article-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div className="admin-article-form__field">
            <label htmlFor="article-body">Body</label>
            <textarea
              id="article-body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows="16"
              required
            />
          </div>
        </section>

        <section className="admin-article-form__section">
          <h2>Publishing</h2>

          <div className="admin-article-form__field">
            <label htmlFor="article-status">Status</label>
            <select
              id="article-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="admin-article-form__field">
            <label htmlFor="article-tags">Tags</label>
            <input
              id="article-tags"
              type="text"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="Population, California"
            />
            <p className="admin-article-form__help">
              Separate tags with commas.
            </p>
          </div>
        </section>

        <section className="admin-article-form__section">
          <h2>Related Places</h2>

          <div className="admin-article-form__field">
            <label htmlFor="article-place-search">
              Search cities, states, and metro areas
            </label>

            <input
              id="article-place-search"
              type="text"
              value={placeQuery}
              onChange={(event) => setPlaceQuery(event.target.value)}
              placeholder="Search places..."
              autoComplete="off"
            />
          </div>

          {searchingPlaces && (
            <p className="admin-article-form__muted">Searching...</p>
          )}

          {!searchingPlaces &&
            placeQuery.trim() &&
            placeResults.length === 0 && (
              <p className="admin-article-form__muted">No places found.</p>
            )}

          {placeResults.length > 0 && (
            <div className="admin-article-form__results">
              {placeResults.map((place) => (
                <button
                  type="button"
                  key={place.id}
                  onClick={() => handleSelectPlace(place)}
                >
                  <span>{place.name}</span>

                  <small>
                    {place.place_type === "city" && place.state_abbreviation
                      ? `City · ${place.state_abbreviation}`
                      : getPlaceTypeLabel(place)}
                  </small>
                </button>
              ))}
            </div>
          )}

          {selectedPlaces.length > 0 && (
            <div className="admin-article-form__selected">
              <p className="admin-article-form__selected-heading">
                Selected places
              </p>

              <div className="admin-article-form__selected-list">
                {selectedPlaces.map((place) => (
                  <div
                    className="admin-article-form__selected-item"
                    key={place.id}
                  >
                    <span>
                      {place.name} · {getPlaceTypeLabel(place)}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemovePlace(place.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {error && <p className="admin-article-form__error">{error}</p>}

        <div className="admin-article-form__actions">
          <button
            className="admin-article-form__submit"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? isEditing
                ? "Saving..."
                : "Creating..."
              : isEditing
                ? "Save changes"
                : "Create article"}
          </button>

          <button
            className="admin-article-form__cancel"
            type="button"
            onClick={() => navigate("/admin/articles")}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
