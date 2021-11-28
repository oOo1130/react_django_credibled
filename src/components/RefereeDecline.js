import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import logo from "../assets/img/credibled_logo_205x45.png";
import { API } from "../Api";
import { detectBrowser, getDate } from "../Common";

function RefereeDecline() {
  const params = useParams();
  const [countryISO, setCountryISO] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const publicIp = require("public-ip");
  var refereeName = "";
  publicIp
    .v4({
      onlyHttps: true,
    })
    .then((ip) => {
      setIpAddress(ip);
    });

  useEffect(() => {
    API.getRefereeDetails({
      candidateHash: params.candidateHash,
      refereeHash: params.refereeHash,
    })
      .then((data) => {
        refereeName = data[0].refereeFirstName + " " + data[0].refereeLastName;
        if (data[0].refereeResponse != "declined") {
          API.updateRefereeResponse({
            candidateHash: params.candidateHash,
            refereeHash: params.refereeHash,
            response: "declined",
          })
            .then((resp) => {
              if (resp.message == "success") {
                API.updateLifeCycle({
                  candidateHash: params.candidateHash,
                  refereeHash: params.refereeHash,
                  userType: "Referee",
                  name: refereeName,
                  action: "Declined",
                  date: getDate(),
                  osBrowser: detectBrowser(),
                  ipAddress: !!ipAddress ? ipAddress : null,
                  locationISP: !!countryISO ? countryISO : null,
                });
              }
            })
            .catch((error) => console.log(error));
        }
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <div class="container-fluid">
        <div class="row">
          <div class="col-6 bg-primary text-left">&nbsp;</div>
          <div class="col-6 bg-secondary text-right">&nbsp;</div>
        </div>
      </div>
      <div class="wrapper">
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
                    <h3 class="text-primary pt2">Thank you for your time!</h3>
                    <p>
                      Your reference request has been declined and the candidate
                      has been asked to provide an alternative contact. <br />
                      If you decide you would like to provide a reference, you
                      can still do so by clicking the link in your{" "}
                      <span class="text-secondary">request email.</span>
                    </p>
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

export default RefereeDecline;
