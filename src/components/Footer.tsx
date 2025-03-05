const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-left">
          <h1 style={{ marginTop: 0, marginBottom: 4, color: 'var(--text-color-secondary)' }}>Pantheon</h1>
          <div>
            An open-source project by <a href="https://mosaic-labs.org" target="_blank" rel="noopener noreferrer">Mosaic Labs</a>
            <br />
            Built with support from the <a href="https://funds.effectivealtruism.org/funds/far-future" target="_blank" rel="noopener noreferrer">Long-Term Future Fund</a>
            <br />
            © 2025
          </div>
        </div>

        <div className="footer-links">
          <div><b>LINKS</b></div>
          <a href="/">Home</a>
          <a href="https://www.lesswrong.com/posts/JHsfMWtwxBGGTmb8A/pantheon-interface" target="_blank" rel="noopener noreferrer">Background</a>
          <a href="https://github.com/nickkeesG/Pantheon" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>

        <div className="footer-links">
          <div><b>ABOUT</b></div>
          <a href="https://mosaic-labs.org" target="_blank" rel="noopener noreferrer">Mosaic Labs</a>
          <a href="mailto:hello@mosaic-labs.org">Get in touch</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;