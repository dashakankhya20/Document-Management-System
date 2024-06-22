import React from "react";
import { Typography } from "@mui/material";
import "./Dashboard.css";
import CarouselContainer from "./CarouselContainer";
import Footer from "./Footer";

const DashboardPage = () => {
  return (
    <div>
      <CarouselContainer />
      <section class="services-section">
        <div class="services-header">
        <Typography component="h4" variant="h4">
        What we do
      </Typography>
        </div>
        <div className="services_container">
          <div className="services_card">
            <i class="fas fa-satellite-dish fa-3x"></i>
            <h4>Satellite Communication</h4>
            <p>
              To promote and facilitate the use of satellite broadcasting
              network for distant interactive training, education and
              extensions.
            </p>
          </div>

          <div className="services_card">
            <i class="fas fa-satellite fa-3x"></i>
            <h4>Remote Sensing Applications</h4>
            <p>
              For inventory mapping, developmental planning and monitoring of
              natural and man-made resources.
            </p>
          </div>
          <div className="services_card">
            <i class="fa fa-database fa-3x"></i>

            <h4>Photogrammetry</h4>
            <p>
              For creation of Digital Elevation Model, Terrain characteristics,
              Resource planning etc.
            </p>
          </div>

          <div className="services_card">
            <i class="fa fa-camera fa-3x"></i>

            <h4>Disaster Management</h4>
            <p>
              To Prepare geo-spatial information to provide necessary inputs to
              Government to assess and mitigate damage in the event of disaster.
            </p>
          </div>

          <div className="services_card">
            <i class="fa fa-database fa-3x"></i>

            <h4>Software Development</h4>
            <p>
              To provide low-cost Decision Support System, Geo-informatics
              applications (desktop as well as web-based) to users for wider
              usage.
            </p>
          </div>

          {/* <div className="services_card">
            <i class="fa fa-align-left fa-3x"></i>

            <h4>Technology Transfer</h4>
            <p>To transfer technology to a large number of end users.</p>
          </div> */}

          <div className="services_card">
            <i class="fa fa-align-left fa-3x"></i>

            <h4>Global Navigation Satellite System and Land Survey</h4>
            <p>
              For Location-based services, Geo-referencing, Engineering
              Applications, and Research.
            </p>
          </div>

          <div className="services_card">
            <i class="fa fa-camera fa-3x"></i>
            <h4>Value Added Services</h4>
            <p>
              To provide tools that can be customized as per the needs of the
              users.
            </p>
          </div>

          <div className="services_card">
            <i class="fa fa-camera fa-3x"></i>

            <h4>Education, Research and Training</h4>
            <p>
              To provide education, research and training facilities to promote
              a number of end users through Academy for Geo-informatics.
            </p>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default DashboardPage;
