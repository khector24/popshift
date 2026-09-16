import { FaNewspaper } from "react-icons/fa6";
import RelatedArticles from "../articles/RelatedArticles.jsx";
import "../../styles/components/metro/MetroRelatedArticles.css";

export default function MetroRelatedArticles({ placeId }) {
  return (
    <section className="metro-related-articles">
      <div className="metro-related-articles__heading">
        <FaNewspaper />

        <div>
          <span>Stories & Analysis</span>
          <h2>Related Articles</h2>
        </div>
      </div>

      <RelatedArticles placeId={placeId} />
    </section>
  );
}
