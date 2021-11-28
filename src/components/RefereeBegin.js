import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import logo from "../assets/img/credibled_logo_205x45.png";
import { API } from "../Api";
import { detectBrowser, getDate } from "../Common";
import NumberFormat from "react-number-format";

function RefereeBegin() {
  const params = useParams();
  const [refereeFirstName, setRefereeFirstName] = useState("");
  const [refereeLastName, setRefereeLastName] = useState("");
  const [refereeTitle, setRefereeTitle] = useState("");
  const [refereeCurrentCompany, setRefereeCurrentCompany] = useState("");
  const [refereeEmail, setRefereeEmail] = useState("");
  const [refereePhone, setRefereePhone] = useState("");
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

  var EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var SPECIAL_REGEX = /[*|\":<>[\]{}`\\()';@&$%!#^_+=-]/;

  useEffect(() => {
    if (params.candidateHash && params.refereeHash) {
      document.getElementById("btnAcceptContinue").disabled = true;
      API.getRefereeDetails({
        candidateHash: params.candidateHash,
        refereeHash: params.refereeHash,
      })
        .then((data) => {
          if (data[0].refereeResponse == "completed") {
            window.location.href =
              "/referee-summary/" +
              params.name +
              "/" +
              params.candidateHash +
              "/" +
              params.refereeHash;
          }
          setRefereeFirstName(data[0].refereeFirstName);
          setRefereeLastName(data[0].refereeLastName);
          setRefereePhone(data[0].refereePhone);
          setRefereeEmail(data[0].refereeEmail);
          setRefereeTitle(data[0].refereeJobTitle);
          setRefereeCurrentCompany(data[0].refereeOrganization);
        })
        .catch((error) => console.log(error));
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

  const acceptClicked = () => {
    if (params.candidateHash && params.refereeHash) {
      API.updateLifeCycle({
        candidateHash: params.candidateHash,
        refereeHash: params.refereeHash,
        userType: "Referee",
        name: `${refereeFirstName} ${refereeLastName}`,
        action: "Agreed",
        date: getDate(),
        osBrowser: detectBrowser(),
        ipAddress: !!ipAddress ? ipAddress : null,
        locationISP: !!countryISO ? countryISO : null,
      }).then(() => {
        window.location.href =
          "/referee-verify/" +
          params.name +
          "/" +
          params.candidateHash +
          "/" +
          params.refereeHash;
      });
    }
  };
  const updateClicked = () => {
    if (refereeFirstName == "") {
      var x = document.getElementById("refereeFirstNameError");
      x.style.display = "block";
      return false;
    }
    if (refereeLastName == "") {
      var x = document.getElementById("refereeLastNameError");
      x.style.display = "block";
      return false;
    }
    if (refereeTitle == "") {
      var x = document.getElementById("refereeTitleError");
      x.style.display = "block";
      return false;
    }
    if (refereeCurrentCompany == "") {
      var x = document.getElementById("refereeCurrentCompanyError");
      x.style.display = "block";
      return false;
    }
    if (refereePhone == "") {
      var x = document.getElementById("refereePhoneError");
      x.style.display = "block";
      return false;
    }
    if (refereeEmail == "") {
      var x = document.getElementById("refereeEmailError");
      x.style.display = "block";
      return false;
    }
    if (refereeEmail) {
      if (!refereeEmail.match(EMAIL_REGEX)) {
        var x = document.getElementById("refereeEmailInvalid");
        x.style.display = "block";
        return false;
      }
    }

    API.updateRefereeDetails({
      candidateHash: params.candidateHash,
      refereeHash: params.refereeHash,
      firstName: refereeFirstName.trim(),
      lastName: refereeLastName.trim(),
      title: refereeTitle,
      company: refereeCurrentCompany,
      phone: refereePhone,
      email: refereeEmail,
    })
      .then((data) => {
        if (data.message == "success") {
          var x = document.getElementById("updateMessage");
          x.style.display = "block";
        }
      })
      .catch((error) => console.log(error));
  };

  const checkBoxClicked = () => {
    if (document.getElementById("checkBoxConfirm").checked == true) {
      var x = (document.getElementById("btnAcceptContinue").disabled = false);
    } else {
      var x = (document.getElementById("btnAcceptContinue").disabled = true);
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
      <div className="wrapper">
        <div className="main-panel">
          <div className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-9">
                  <div className="">
                    <a className="navbar-brand" href="/">
                      <img src={logo} alt="Credibled Logo" />
                    </a>
                  </div>

                  <div className="card-plain mt2">
                    <div className="stepper">
                      <div className="stepper-steps">
                        <div className="stepper-step ss25 stepper-step-isActive">
                          <div className="stepper-stepContent step_active">
                            <span className="stepper-stepMarker">1</span>Before
                            we begin
                          </div>
                        </div>
                        <div className="stepper-step ss25">
                          <div className="stepper-stepContent">
                            <span className="stepper-stepMarker">2</span>Verify
                            the basics
                          </div>
                        </div>
                        <div className="stepper-step ss25">
                          <div className="stepper-stepContent">
                            <span className="stepper-stepMarker">3</span>
                            Questionnaire
                          </div>
                        </div>
                        <div className="stepper-step ss25">
                          <div className="stepper-stepContent">
                            <span className="stepper-stepMarker">4</span>Review
                            & Submit
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 pl3">
                      <h3 className="text-primary pb1">Before we begin</h3>

                      <div className="text-primary pt1 fw400">
                        {refereeFirstName} {refereeLastName} &nbsp;
                      </div>
                      <p className="text-secondary">
                        {!!refereePhone ? refereePhone : ""}
                      </p>
                    </div>
                  </div>

                  <div className="lrpad border">
                    <div className="row pt1">
                      <div className="col-md-6">
                        <div className="form-group bmd-form-group is-filled">
                          <label className="bmd-label-floating">
                            First Name
                            <span className="sup_char">
                              <sup>*</sup>
                            </span>
                          </label>
                          <input
                            type="text"
                            value={refereeFirstName}
                            className="form-control bmd-form-group is-filled"
                            maxLength="30"
                            onChange={(evt) => {
                              if (!SPECIAL_REGEX.test(evt.target.value)) {
                                setRefereeFirstName(evt.target.value.trim());
                                var x = document.getElementById(
                                  "refereeFirstNameError"
                                );
                                x.style.display = "none";
                                var z =
                                  document.getElementById("updateMessage");
                                z.style.display = "none";
                              }
                            }}
                          />
                          <div
                            className="notes"
                            id="refereeFirstNameError"
                            style={{ display: `none` }}
                          >
                            First Name is required
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group bmd-form-group is-filled">
                          <label className="bmd-label-floating">
                            Last Name
                            <span className="sup_char">
                              <sup>*</sup>
                            </span>
                          </label>
                          <input
                            type="text"
                            value={refereeLastName}
                            className="form-control bmd-form-group is-filled"
                            maxLength="30"
                            onChange={(evt) => {
                              if (!SPECIAL_REGEX.test(evt.target.value)) {
                                setRefereeLastName(evt.target.value.trim());
                                var x = document.getElementById(
                                  "refereeLastNameError"
                                );
                                x.style.display = "none";
                                var z =
                                  document.getElementById("updateMessage");
                                z.style.display = "none";
                              }
                            }}
                          />
                          <div
                            className="notes"
                            id="refereeLastNameError"
                            style={{ display: `none` }}
                          >
                            Last Name is required
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group bmd-form-group is-filled">
                          <label className="bmd-label-floating">
                            Current Title
                            <span className="sup_char">
                              <sup>*</sup>
                            </span>
                          </label>
                          <input
                            type="text"
                            value={refereeTitle}
                            className="form-control bmd-form-group is-filled"
                            maxLength="50"
                            onChange={(evt) => {
                              if (!SPECIAL_REGEX.test(evt.target.value)) {
                                setRefereeTitle(evt.target.value);
                                var x =
                                  document.getElementById("refereeTitleError");
                                x.style.display = "none";
                                var z =
                                  document.getElementById("updateMessage");
                                z.style.display = "none";
                              }
                            }}
                          />
                          <div
                            className="notes"
                            id="refereeTitleError"
                            style={{ display: `none` }}
                          >
                            Current Title is required
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group bmd-form-group is-filled">
                          <label className="bmd-label-floating">
                            Current Company
                            <span className="sup_char">
                              <sup>*</sup>
                            </span>
                          </label>
                          <input
                            type="text"
                            value={refereeCurrentCompany}
                            className="form-control bmd-form-group is-filled"
                            maxLength="100"
                            onChange={(evt) => {
                              if (!SPECIAL_REGEX.test(evt.target.value)) {
                                setRefereeCurrentCompany(evt.target.value);
                                var x = document.getElementById(
                                  "refereeCurrentCompanyError"
                                );
                                x.style.display = "none";
                                var z =
                                  document.getElementById("updateMessage");
                                z.style.display = "none";
                              }
                            }}
                          />
                          <div
                            className="notes"
                            id="refereeCurrentCompanyError"
                            style={{ display: `none` }}
                          >
                            Current Company is required
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group bmd-form-group is-filled">
                          <label className="bmd-label-floating">
                            Phone#
                            <span className="sup_char">
                              <sup>*</sup>
                            </span>
                          </label>
                          {/* <input
                            type="text"
                            value={refereePhone}
                            className="form-control bmd-form-group is-filled"
                            maxLength="10"
                            onChange={(evt) => {
                              if (/^\d*$/.test(evt.target.value)) {
                                setRefereePhone(evt.target.value);
                              }
                              var x =
                                document.getElementById("refereePhoneError");
                              x.style.display = "none";
                              var z = document.getElementById("updateMessage");
                              z.style.display = "none";
                            }}
                          /> */}
                          <NumberFormat
                            className="form-control bmd-form-group is-filled"
                            format="(###) ###-####"
                            value={refereePhone}
                            onChange={(evt) => {
                              setRefereePhone(evt.target.value);
                              var x =
                                document.getElementById("refereePhoneError");
                              x.style.display = "none";
                              var z = document.getElementById("updateMessage");
                              z.style.display = "none";
                            }}
                          />
                          <div
                            className="notes"
                            id="refereePhoneError"
                            style={{ display: `none` }}
                          >
                            Phone# is required
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group bmd-form-group is-filled">
                          <label className="bmd-label-floating">
                            Email
                            <span className="sup_char">
                              <sup>*</sup>
                            </span>
                          </label>
                          <input
                            type="text"
                            value={refereeEmail}
                            className="form-control bmd-form-group is-filled"
                            onChange={(evt) => {
                              setRefereeEmail(evt.target.value);
                              var x =
                                document.getElementById("refereeEmailError");
                              x.style.display = "none";
                              var y = document.getElementById(
                                "refereeEmailInvalid"
                              );
                              y.style.display = "none";
                              var z = document.getElementById("updateMessage");
                              z.style.display = "none";
                            }}
                          />
                          <div
                            className="notes"
                            id="refereeEmailError"
                            style={{ display: `none` }}
                          >
                            Email is required
                          </div>
                          <div
                            className="notes"
                            id="refereeEmailInvalid"
                            style={{ display: `none` }}
                          >
                            Email is Invalid
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="modal-footer pt1">
                      <div
                        className="notes"
                        id="updateMessage"
                        style={{ display: `none`, paddingBottom: "15px" }}
                      >
                        Updated Successfully!
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={updateClicked}
                      >
                        Update
                      </button>
                    </div>
                  </div>

                  <div className="gray-box-text">
                    <p style={{ fontSize: ".9rem" }}>
                      If you feel that you do not have the ability to provide a
                      suitable reference, please decline. <br />
                      <br />
                      Provision of the information requested by Credibled is
                      voluntary. We will use your information for the following
                      purpose(s):
                      <br />
                      <br />
                      <li>
                        The information is being collected to provide
                        clarification, confirmation and additional information
                        on the candidate who has selected you as a reference. It
                        assists the Employer in their hiring process.
                      </li>
                      <br />
                      References to an Employer also include references to a
                      recruitment agent where a recruiter has requested the
                      reference on behalf of an Employer.
                      <br />
                      <br />
                      Authority to collect information contained on this form
                      the purposes described above is provided under the
                      authority of the Employment and Social Development Canada
                      Act. Your personal information is administered under the
                      federal 
                      <i>
                        <a
                          href="https://laws-lois.justice.gc.ca/eng/acts/P-21/index.html"
                          target="_new"
                        >
                          Privacy Act
                        </a>
                      </i>
                       , which states that you have the right to access your
                      personal information and request changes to incorrect
                      information. If you wish to avail yourself of this right
                      or require clarification about this Statement, contact our
                      Privacy Coordinator by calling 855-583-7873, or write to:
                      <br />
                      <br />
                      <strong>Privacy Coordinator</strong>
                      <br />
                      <strong>Credibled</strong>
                      <br />
                      391 Keele Street <br /> Toronto, ON <br />
                      M6P 2K9
                      <br />
                      <br />
                      The information collected by Credibled will be retained
                      indefinitely. <br />
                      <br />
                      Credibled protects the personal information it has control
                      over by making reasonable security arrangements to prevent
                      unauthorised access, collection, use, disclosure, copying,
                      modification, disposal or similar risks. <br />
                      <br />
                      Your personal information may be accessed by the
                      candidate’s potential Employer who requested the reference
                      and/or our service providers (as the case may be), and/or
                      stored at, a destination outside the country in which you
                      are located, whose data protection laws may be different
                      than those in your country. The Employer’s processing of
                      such personal information will be subject to the privacy
                      policy of the Employer. We take our responsibility to
                      safeguard your personal information, as required by the 
                      <i>Privacy Act</i>, very seriously.
                    </p>
                  </div>

                  <div className="form-check box-pad">
                    <label className="form-check-label">
                      <input
                        id="checkBoxConfirm"
                        type="checkbox"
                        onChange={checkBoxClicked}
                      />
                      &nbsp;
                      <small>
                        My details are correct and I agree to the Credibled
                        collection statement.
                      </small>
                    </label>
                  </div>
                  <br />
                  <div className="box-pad pl1 mt1">
                    <input
                      type="button"
                      id="btnAcceptContinue"
                      onClick={acceptClicked}
                      className="btn btn-primary"
                      value="Accept & Continue"
                    />
                  </div>
                </div>
              </div>
              <div className="clearfix"></div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="rate_experience1"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header border-none">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body text-center">
              <div className="row">
                <div className="col">
                  <h4 className="text-primary">
                    Out of 5 stars, how would you rate your experience of
                    providing a reference using Credibled?
                  </h4>

                  <p className="pt2">
                    <i className="text-secondary fs2em material-icons">star</i>
                    <i className="text-secondary fs2em material-icons">star</i>
                    <i className="text-secondary fs2em material-icons">star</i>
                    <i className="text-secondary fs2em material-icons">
                      star_outline
                    </i>
                    <i className="text-secondary fs2em material-icons">
                      star_outline
                    </i>
                  </p>

                  <div className="box-pad">
                    <a
                      href="credibled_candidate_job_history5.html"
                      className="btn btn-primary"
                    >
                      Submit
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RefereeBegin;
