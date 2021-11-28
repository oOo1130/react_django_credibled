import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import logo from "../assets/img/credibled_logo_205x45.png";
import { API } from "../Api";
import { detectBrowser, getDate } from "../Common";

function Referee() {
  const params = useParams();
  const [candidateName, setCandidateName] = useState("");
  const [archivedFlag, setArchivedFlag] = useState("");
  const [refereeName, setRefereeName] = useState("");
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
    if (params.candidateHash && params.refereeHash) {
      API.getCandidateDetails(params.candidateHash)
        .then((data) => {
          setCandidateName(data[0].firstName + " " + data[0].lastName);
          if (data[0].response == "archived") {
            setArchivedFlag("archived");
          } else {
            var x = document.getElementById("divRefereeInfoStart");
            x.style.display = "block";
          }
        })
        .catch((error) => console.log(error));

      API.getRefereeDetails({
        candidateHash: params.candidateHash,
        refereeHash: params.refereeHash,
      })
        .then((data) => {
          setRefereeName(
            data[0].refereeFirstName + " " + data[0].refereeLastName
          );
          if (data[0].refereeResponse == "completed") {
            window.location.href =
              "/referee-summary/" +
              params.name +
              "/" +
              params.candidateHash +
              "/" +
              params.refereeHash;
          } else if (data[0].refereeResponse == "declined") {
            window.location.href =
              "/referee-declined/" +
              params.candidateHash +
              "/" +
              params.refereeHash;
          }
        })
        .catch((error) => console.log(error));

      API.updateLifeCycle({
        candidateHash: params.candidateHash,
        refereeHash: params.refereeHash,
        userType: "Referee",
        name: refereeName,
        action: "Accessed",
        date: getDate(),
        osBrowser: detectBrowser(),
        ipAddress: !!ipAddress ? ipAddress : null,
        locationISP: !!countryISO ? countryISO : null,
      });
    }
  }, []);

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
    if (params.candidateHash && params.refereeHash) {
      window.location.href =
        "/referee-accept/" +
        params.name +
        "/" +
        params.candidateHash +
        "/" +
        params.refereeHash;
    }
  };

  const handleDecline = () => {
    window.location.href =
      "/referee-declined/" + params.candidateHash + "/" + params.refereeHash;
  };

  return (
    <div>
      <div class="container-fluid">
        <div class="row">
          <div class="col-6 bg-primary text-left">&nbsp;</div>
          <div class="col-6 bg-secondary text-right">&nbsp;</div>
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
      <div class="wrapper" id="divRefereeInfoStart" style={{ display: "none" }}>
        <div class="main-panel">
          <div class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-8 offset-md-1">
                  <div class="">
                    <a class="navbar-brand" href="/signin">
                      <img src={logo} alt="Credibled Logo" />
                    </a>
                  </div>

                  <div class="card-plain mt2">
                    <h3 class="jh-title pt2">
                      <span class="text-primary">Hi,</span>
                      &nbsp;{params.name}
                    </h3>

                    <h5 class="jh-subtitle">
                      {candidateName} has provided your name as a referee and
                      Credibled helps you to complete the referencing process
                      quickly and securely online
                    </h5>

                    <ul class="cretiria">
                      <li class="title">You will be asked to:</li>
                      <li>Confirm your details</li>
                      <li>
                        Agree to the <span class="text-primary">Credibled</span>{" "}
                        Collection Statement
                      </li>
                      <li>
                        Verify{" "}
                        <span class="text-primary">{candidateName}'s</span>{" "}
                        information
                      </li>
                      <li>
                        Answer a questionnaire about{" "}
                        <span class="text-primary">{candidateName}</span>
                      </li>
                    </ul>

                    <div class="box-pad">
                      <a
                        class="btn btn-secondary-outline"
                        onClick={handleDecline}
                      >
                        Decline
                      </a>
                      &nbsp; &nbsp;
                      <span onClick={startClicked} class="btn btn-primary">
                        Let's do it
                      </span>
                    </div>
                  </div>

                  <div class="clearfix"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Referee;
