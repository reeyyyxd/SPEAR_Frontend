import { Grid } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        backgroundImage: "url('/src/assets/imgs/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          zIndex: 1,
        }}
      ></div>

      {/* Full-Height Grid Container */}
      <Grid
        container
        style={{
          height: "100%",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Left Grid */}
        <Grid
          item
          xs={12}
          md={6}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "white",
          }}
        >
          <div style={{ marginLeft: "200px" }}>
            <h1 style={{ marginBottom: "20px", fontWeight: "750", fontSize: "60px", fontFamily: "sans-serif", lineHeight: "1.0" }}>
              Student Peer<br /> Evaluation and Review<br /> System (S.P.E.A.R.)
            </h1>
            <p style={{ marginBottom: "20px" }}>
              Empowering collaboration and academic excellence
            </p>
            <Link to="/register">
            <button
              style={{
                backgroundColor: "#f5b57f",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Get Started
            </button>
            </Link>
          </div>
        </Grid>

        {/* Right Grid */}
        <Grid
          item
          xs={12}
          md={6}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <div>
            <img
              src="src\assets\imgs\logo-light.png"
              alt="SPEAR Logo"
              style={{
                maxWidth: "100%",
                height: "auto",
                marginRight: "90px", 
                marginBottom: "60px",
              }}
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
