import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import logo from "../assets/img/credibled_logo_205x45.png";
import { API } from "../Api";
import { detectBrowser, getDate } from "../Common";

function CandidateJobHistory() {
  const params = useParams();
  const [archivedFlag, setArchivedFlag] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [countryISO, setCountryISO] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const publicIp = require("public-ip");

  publicIp
    .v4({
      onlyHttps: true,
    })
    .then((ip) => {
      setIpAddress(ip);
    });

  useEffect(() => {
    if (params.name && params.id) {
      var refereeExists = "N";
      API.getJobHistory(params.id).then((data) => {
        if (data.length > 0) {
          refereeExists = "Y";
          window.location.href =
            "/job-history/" + params.name + "/" + params.id;
        }
      });

      if (refereeExists == "N") {
        API.getCandidateDetails(params.id).then((data) => {
          setCandidateName(data[0].firstName + " " + data[0].lastName);
          if (data[0].response == "archived") {
            setArchivedFlag("archived");
          } else {
            var x = document.getElementById("divStartJobHistory");
            x.style.display = "block";
          }
        });

        API.updateLifeCycle({
          candidateHash: params.id,
          userType: "Candidate",
          name: candidateName,
          action: "Accessed",
          date: getDate(),
          osBrowser: detectBrowser(),
          ipAddress: !!ipAddress ? ipAddress : null,
          locationISP: !!countryISO ? countryISO : null,
        });
      }
    }
  });

  useEffect(() => {
    if (ipAddress) {
      API.getCountryISO(ipAddress).then((resp) => {
        if (resp.city) {
          setCountryISO(
            resp.city + " " + resp.countryCode + " - " + resp.country
          );
        }
      });
    }
  }, [ipAddress]);

  const startClicked = () => {
    if (params.name && params.id) {
      API.updateLifeCycle({
        candidateHash: params.id,
        userType: "Candidate",
        name: candidateName,
        action: "Agreed",
        date: getDate(),
        osBrowser: detectBrowser(),
        ipAddress: !!ipAddress ? ipAddress : null,
        locationISP: !!countryISO ? countryISO : null,
      });
      API.updateRequestResponse({
        candidateHash: params.id,
        response: "inprogress",
      })
        .then((data) => {
          if (data.message == "success") {
            window.location.href = "/job-info/" + params.name + "/" + params.id;
          }
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-6 bg-primary text-left">&nbsp;</div>
          <div className="col-6 bg-secondary text-right">&nbsp;</div>
        </div>
      </div>
      {archivedFlag == "archived" ? (
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
                        The requested link is no longer active.
                      </h3>
                      <p>
                        The requested information has been archived and
                        deactivated in our application.
                      </p>
                    </div>

                    <div className="clearfix"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <div
        className="wrapper"
        id="divStartJobHistory"
        style={{ display: "none" }}
      >
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
                    <h3 className="jh-title pt2">Tell Us Your Job History</h3>

                    <h5 className="jh-subtitle">
                      complete your work history with the following
                      requirements:
                    </h5>

                    <ul className="cretiria">
                      <li>Minimum 2 references</li>
                      <li>All fields are mandatory.</li>
                    </ul>

                    <span
                      className="btn btn-primary mt2"
                      onClick={startClicked}
                    >
                      Start
                    </span>
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

export default CandidateJobHistory;
