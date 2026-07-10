import "../../styles/components/Footer.css";
import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__left">
          <h3 className="footer__title">PopShift</h3>

          <p className="footer__copyright">
            © 2026 PopShift. All rights reserved.
          </p>
        </div>

        <div className="footer__right">
          <NavLink to="/methodology">Methodology</NavLink>

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
