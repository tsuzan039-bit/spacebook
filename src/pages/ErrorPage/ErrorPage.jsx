import React from "react";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react";
import './ErrorPage.css';

export default function ErrorPage() {
  return (
    <div className="space-error-page ">

      <div className="error-star s1"></div>
      <div className="error-star s2"></div>
      <div className="error-star s3"></div>
      <div className="error-star s4"></div>
      <div className="error-star s5"></div>
      <div className="error-star s6"></div>

      <div className="planet"></div>

      <div className="error-card">

        <div className="astronaut">
          👨‍🚀
        </div>

        <h1>404</h1>

        <h2>Lost In Space</h2>

        <p>
          Oops! The page you're looking for has drifted
          into another galaxy.
        </p>

        <Button
          as={Link}
          to="/"
          className="home-btn"
        >
          🚀 Return Home
        </Button>

      </div>

    </div>
  );
}