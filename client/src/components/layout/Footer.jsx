import "../../styles/components/Footer.css";
import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__left">
          <h3 className="footer__title">RegionLore</h3>

          <p className="footer__copyright">
            © 2026 RegionLore. All rights reserved.
          </p>
        </div>

        <div className="footer__right">
          <NavLink to="/methodology">Methodology</NavLink>
          <NavLink to="/data-sources">Data Sources</NavLink>
          {/* Later */}
          {/* <NavLink to="/data-sources">Data Sources</NavLink> */}
          {/* <NavLink to="/privacy">Privacy</NavLink> */}
          {/* <NavLink to="/terms">Terms</NavLink> */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
