import "../styles/pages/About.css";

function About() {
  return (
    <div className="about">
      <h1>About PopShift</h1>

      <section>
        <h2>What is PopShift?</h2>
        <p>
          PopShift is a population analytics dashboard designed to help users
          explore how U.S. states changed from 2010 to 2025. The goal is to make
          state-by-state population trends easier to understand through
          rankings, charts, and visual comparisons.
        </p>
      </section>

      <section>
        <h2>Why It Matters</h2>
        <p>
          Population shifts across states are often tied to larger trends such
          as economic opportunity, cost of living, and tax policy. In recent
          years, there has been increasing discussion around which states are
          growing, which are declining, and how these changes impact things like
          tax revenue, housing, and regional development. PopShift was inspired
          by these conversations, with the goal of making it easier to explore
          and understand how population trends are evolving across the United
          States.
        </p>

        <p>
          This project was built as a way to better visualize and explore these
          trends in a more interactive format.
        </p>
      </section>

      <section>
        <h2>Data Source</h2>
        <p>
          This project is built around U.S. Census population data. It focuses
          on statewide population totals, growth trends, and each state's share
          of the total U.S. population over time.
        </p>
      </section>

      <section>
        <h2>Tech Stack</h2>
        <p>React, Express, Node.js, and custom processed population data.</p>
      </section>
    </div>
  );
}

export default About;
