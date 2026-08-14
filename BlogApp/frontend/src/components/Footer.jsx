import "../styles/Footer.css";

const Footer = () => {
  const socials = ["Instagram", "X", "Facebook", "Discord", "TikTok"];

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">
            <div className="footer-logo-badge">H</div>
            <h2 className="footer-logo-text">Horizone</h2>
          </div>

          <p className="footer-description">
            Our mission is to equip modern explorers with cutting-edge,
            functional, and stylish bags that elevate every adventure.
          </p>

          <p className="footer-copyright">
            (c)2024 Horizone. All rights reserved.
          </p>
        </div>

        <div>
          <h3 className="footer-section-title">About</h3>

          <div className="footer-section-links">
            <a href="#">About Us</a>
            <a href="#">Blog</a>
            <a href="#">Career</a>
          </div>
        </div>

        <div>
          <h3 className="footer-section-title">Support</h3>

          <div className="footer-section-links">
            <a href="#">Contact Us</a>
            <a href="#">Return</a>
            <a href="#">FAQ</a>
          </div>
        </div>

        <div>
          <h3 className="footer-section-title">Get Updates</h3>

          <div className="footer-newsletter-container">
            <input
              type="email"
              placeholder="Enter your email"
              className="footer-newsletter-input"
            />

            <button className="footer-subscribe-btn">Subscribe</button>
          </div>

          <div className="footer-socials">
            {socials.map((item) => (
              <div key={item} className="footer-social-item">
                {item.charAt(0)}
              </div>
            ))}
          </div>

          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
