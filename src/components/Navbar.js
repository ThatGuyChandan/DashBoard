import React from "react";

const Navbar = () => {
  return (
    <nav className="left-navbar">
      <div className="container">
        <div className="navbar-header">
          <a className="navbar-brand" href="/">
            Dashboard
          </a>
        </div>
        <ul className="nav navbar-nav">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="Sector">Sector Specific</a>
          </li>
          <li>
            <a href="Impact">Impact Analysis</a>
          </li>
          <li>
            <a href="Temporal">Temporal Analysis</a>
          </li>
          <li>
            <a href="Geographical">Geographical Insights</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
