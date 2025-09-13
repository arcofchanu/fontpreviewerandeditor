import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-5xl sm:text-6xl font-display text-brand-primary">
        Font Previewer & Styler
      </h1>
      <p className="mt-2 text-lg text-dark-medium-text max-w-2xl mx-auto">
        Upload a font, type your text, customize its style, and copy it as a PNG for any project.
      </p>
    </header>
  );
};

export default Header;