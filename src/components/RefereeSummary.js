import React, { useEffect } from "react";
import { useParams } from "react-router";
import logo from "../assets/img/credibled_logo_205x45.png";
import { API } from "../Api";

function RefereeSummary() {
  const params = useParams();

  useEffect(() => {
    if (params.candidateHash && params.refereeHash) {
      API.getRefereeResponseCount({ candidateHash: params.candidateHash })
        .then((data) => {
          if (data.count > 1) {
            API.updateRequestResponse({
              candidateHash: params.candidateHash,
              response: "criteriamet",
            });
          }
        })
        .catch((error) => console.log(error));
    }
  }, []);

  const handleFeedback = (feedback) => {
    API.updateFeedback({
      candidateHash: params.candidateHash,
      refereeHash: params.refereeHash,
      feedback,
    }).then((resp) => {
      if (resp.message == "success") {
        var x = document.getElementById("msg");
        x.style.display = "block";
        setTimeout(() => {
          window.location.href = "http://www.credibled.com/ws/index.html";
        }, 3000);
      }
    });
  };

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
                    <a className="navbar-brand" href="index.html">
                      <img src={logo} alt="Credibled Logo" />
                    </a>
                  </div>

                  <div className="card-plain mt2">
                    <h3 className="text-primary pt2">
                      Great! You're all done,{" "}
                      <span className="text-secondary">{params.name}</span>
                    </h3>

                    <h4>
                      Your confidential reference has been successfully
                      submitted.
                    </h4>

                    <p style={{ fontSize: ".9rem" }}>
                      Your comments are invaluable in helping with their career
                      search.{" "}
                    </p>

                    <p style={{ fontSize: ".9rem" }}>
                      If you wish to connect with one of our representatives at{" "}
                      <span className="text-secondary">
                        <b>Credibled</b>
                      </span>{" "}
                      for hiring purposes in your current organization or for
                      help with finding a new and exciting role for yourself,
                      please select one of the options below.
                    </p>

                    <div className="box-pad">
                      <a
                        href="javascript:void(0)"
                        id="lh"
                        className="btn btn-primary"
                        onClick={() => handleFeedback("looking to hire")}
                      >
                        I'm looking to hire
                      </a>
                      &nbsp;
                      <a
                        href="javascript:void(0)"
                        id="lj"
                        className="btn btn-primary"
                        onClick={() => handleFeedback("looking for job")}
                      >
                        I'm looking for a job
                      </a>
                      {/* &nbsp;&nbsp; */}
                      {/* <a
                        href="javascript:void(0)"
                        onClick={handleFeedback("None")}
                      >
                        None
                      </a> */}
                      <div
                        id="msg"
                        className="mt1 pl1 notes"
                        style={{ display: "none", marginTop: "1em" }}
                      >
                        Notification has been sent!
                      </div>
                    </div>

                    {/* <p>
                      Thank you for taking the time to give the reference. Feel
                      free to close your browser.
                    </p> */}

                    {/* <p className="text-secondary">
                      would you like to use Credibled to request references?
                      <br />
                      <a href="/signin" className="btn btn-primary mt2">
                        Try Credibled
                      </a>
                    </p> */}
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

export default RefereeSummary;
