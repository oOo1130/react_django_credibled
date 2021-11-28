import React from "react";
import { useParams } from "react-router";
import logo from "../assets/img/credibled_logo_205x45.png";

function JobHistorySuccess() {
  const params = useParams();

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-6 bg-primary text-left">&nbsp;</div>
          <div className="col-6 bg-secondary text-right">&nbsp;</div>
        </div>
      </div>
      <div className="wrapper">
        <div className="main-panel">
          <div className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-8 offset-md-1">
                  <div className="">
                    <a className="navbar-brand" href="/signin">
                      <img src={logo} alt="Credibled Logo" />
                    </a>
                  </div>
                  <div className="card-plain mt2">
                    <h3 className="text-primary pt2">
                      Great! You're all done,{" "}
                      <span className="text-secondary">{params.name}</span>
                    </h3>
                    <p>
                      Thank you for your time.
                    </p>
                    {/* <p>
                      Thank you for taking the time to rate your experience.
                      Feel free to close your browser.
                    </p> */}
                    {/* <p className="text-secondary">
                      would you like to use Credibled to request references?
                    </p> */}
                    <p>
                      <a href="/signin" className="btn btn-primary mt2">
                        Try Credibled
                      </a>
                    </p>
                  </div>
                  <div className="clearfix"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobHistorySuccess;
