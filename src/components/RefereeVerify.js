import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import logo from "../assets/img/credibled_logo_205x45.png";
import { API } from "../Api";
import Tooltip from "@material-ui/core/Tooltip";
import InfoIcon from "@material-ui/icons/Info";
import TextField from "@material-ui/core/TextField";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizaitonProvider from "@material-ui/lab/LocalizationProvider";
import DatePicker from "@material-ui/lab/DatePicker";
import { detectBrowser, getDate } from "../Common";

function RefereeBasics() {
  const params = useParams();
  const [candidateName, setCandidateName] = useState("");
  const [organization, setOrganization] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [radio, setRadio] = useState(null);
  const [refereeJobTitle, setRefereeJobTitle] = useState("");
  const [candidateRole, setCandidateRole] = useState("");
  const [partStartDate, setPartStartDate] = useState("");
  const [partEndDate, setPartEndDate] = useState("");
  const [refereeName, setRefereeName] = useState("");
  const [currentlyWorking, setCurrentWorking] = useState("");
  const [countryISO, setCountryISO] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  var SPECIAL_REGEX = /[*|\":<>[\]{}`\\()';@&$%!#^_+=-]/;
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
      document.getElementById("btnVerifyContinue").disabled = true;
      API.getRefereeDetails({
        candidateHash: params.candidateHash,
        refereeHash: params.refereeHash,
      })
        .then((data) => {
          setRefereeName(
            data[0].refereeFirstName + " " + data[0].refereeLastName
          );
          setOrganization(data[0].organization);
          setStartDate(formatDate(data[0].startDate));
          setEndDate(formatDate(data[0].endDate));
          setRefereeJobTitle(data[0].refereeJobTitle);
          setCandidateRole(data[0].candidateRole);
          setPartStartDate(data[0].partStartDate);
          setPartEndDate(data[0].partEndDate);
          setCurrentWorking(data[0].currentlyWorkingHere);
          document.getElementById("dtStartDate").placeholder = "MM YYYY";
          document.getElementById("dtEndDate").placeholder = "MM YYYY";
          if (data[0].currentlyWorkingHere == "true") {
            document.getElementById("dtEndDate").placeholder = "Present";
          }
          document.getElementById("dtPartStartDate").placeholder = "MM YYYY";
          document.getElementById("dtPartEndDate").placeholder = "MM YYYY";
        })
        .catch((error) => console.log(error));
      API.getCandidateDetails(params.candidateHash)
        .then((data) =>
          setCandidateName(data[0].firstName + " " + data[0].lastName)
        )
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

  const formatDate = (dateString) => {
    if (dateString) {
      let d = new Date(dateString);
      let year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
      let month = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d);
      let day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
      return year + "-" + month + "-" + day;
    } else {
      return null;
    }
  };

  const verifyClicked = () => {
    if (params.candidateHash && params.refereeHash) {
      if (validationCheck()) {
        API.updateJobHistory({
          candidateHash: params.candidateHash,
          refereeHash: params.refereeHash,
          organization,
          startDate,
          endDate,
          candidateRole,
          refereeJobTitle,
          partStartDate,
          partEndDate,
          radio,
        });

        API.updateLifeCycle({
          candidateHash: params.candidateHash,
          refereeHash: params.refereeHash,
          userType: "Referee",
          name: refereeName,
          action: "Verified",
          date: getDate(),
          osBrowser: detectBrowser(),
          ipAddress: !!ipAddress ? ipAddress : null,
          locationISP: !!countryISO ? countryISO : null,
        }).then(() => {
          window.location.href =
            "/referee-questionnaire/" +
            params.name +
            "/" +
            params.candidateHash +
            "/" +
            params.refereeHash;
        });
      }
    }
  };

  const mandateSymbol = () => {
    if (radio == 1) {
      return <sup>*</sup>;
    }
  };
  const changeRadio = (val) => {
    setRadio(val);
    if (val == 0) {
      var x = document.getElementById("divPartFromDate");
      x.style.display = "none";
      var y = document.getElementById("divPartToDate");
      y.style.display = "none";
    } else {
      var x = document.getElementById("divPartFromDate");
      x.style.display = "block";
      var y = document.getElementById("divPartToDate");
      y.style.display = "block";
      document.getElementById("dtPartStartDate").placeholder = "MM YYYY";
      document.getElementById("dtPartEndDate").placeholder = "MM YYYY";
    }
  };

  const checkBoxClicked = () => {
    if (document.getElementById("checkBoxConfirm").checked == true) {
      var x = (document.getElementById("btnVerifyContinue").disabled = false);
    } else {
      var x = (document.getElementById("btnVerifyContinue").disabled = true);
    }
  };

  const validationCheck = () => {
    if (organization == "") {
      var x = document.getElementById("organizationError");
      x.style.display = "block";
      return false;
    }
    if (startDate == "" || startDate == null) {
      var x = document.getElementById("startDateError");
      x.style.display = "block";
      return false;
    }
    if (endDate == "" || endDate == null) {
      if (currentlyWorking != "true") {
        var x = document.getElementById("endDateError");
        x.style.display = "block";
        return false;
      }
    }
    if (candidateRole == "") {
      var x = document.getElementById("candidateRoleError");
      x.style.display = "block";
      return false;
    }
    if (refereeJobTitle == "") {
      var x = document.getElementById("refereeJobTitleError");
      x.style.display = "block";
      return false;
    }
    if (radio == null) {
      // var x = document.getElementById("radioMandateMessage");
      // x.style.display = "block";
      return false;
    }
    if (radio == 1) {
      if (partStartDate == "" || partStartDate == null) {
        var x = document.getElementById("partStartDateError");
        x.style.display = "block";
        return false;
      }
      if (partEndDate == "" || partEndDate == null) {
        var x = document.getElementById("partEndDateError");
        x.style.display = "block";
        return false;
      }
    }

    return true;
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
                    <a className="navbar-brand" href="index.html">
                      <img src={logo} alt="Credibled Logo" />
                    </a>
                  </div>

                  <div className="card-plain mt2">
                    <div className="stepper">
                      <div className="stepper-steps">
                        <div className="stepper-step ss25 stepper-step-isActive">
                          <div className="stepper-stepContent step_active_primary">
                            <a
                              href={
                                "/referee-accept/" +
                                params.name +
                                "/" +
                                params.candidateHash +
                                "/" +
                                params.refereeHash
                              }
                              className="text-primary"
                            >
                              <span className="stepper-stepMarker">1</span>
                              Before we begin
                            </a>
                          </div>
                        </div>
                        <div className="stepper-step ss25 stepper-step-isActive">
                          <div className="stepper-stepContent step_active">
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
                    <div className="col-md-12">
                      <h3 className="text-primary pb1">Verify the basics</h3>

                      <div
                        className="alert alert-warning alert-dismissible fade show"
                        role="alert"
                      >
                        This reference applies to the time that{" "}
                        <strong className="text-primary">
                          {candidateName}
                        </strong>{" "}
                        spent at{" "}
                        <strong className="text-secondary">
                          {organization}
                        </strong>
                        . Please check and if necessary, update the information
                        accordingly.
                        <button
                          type="button"
                          className="close"
                          data-dismiss="alert"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                    </div>

                    <div className="col-md-12">
                      <h5 className="jh-subtitle pt2">Employed at</h5>
                      <div className="form-group mt3 bmd-form-group is-filled">
                        <label className="bmd-label-floating">
                          Organization
                          <span className="sup_char">
                            <sup>*</sup>
                          </span>
                        </label>
                        <input
                          type="text"
                          value={organization}
                          maxLength="100"
                          onChange={(evt) => {
                            if (!SPECIAL_REGEX.test(evt.target.value)) {
                              setOrganization(evt.target.value);
                              var x =
                                document.getElementById("organizationError");
                              x.style.display = "none";
                            }
                          }}
                          className="form-control bmd-form-group is-filled"
                        />
                        <div
                          className="notes"
                          id="organizationError"
                          style={{ display: `none` }}
                        >
                          Organization is required
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <Tooltip
                          placement="right"
                          title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sed tincidunt quam, in finibus ex."
                        >
                          <InfoIcon
                            style={{
                              color: "#ED642A",
                              position: "absolute",
                              cursor: "pointer",
                            }}
                          />
                        </Tooltip>
                        <label
                          className="bmd-label-floating"
                          style={{
                            paddingLeft: "30px",
                          }}
                        >
                          {candidateName}'s Start Date
                          <span className="sup_char">
                            <sup>*</sup>
                          </span>
                        </label>
                        {/* <input
                          type="date"
                          value={startDate}
                          onChange={(evt) => {
                            setStartDate(evt.target.value);
                            var x = document.getElementById("startDateError");
                            x.style.display = "none";
                          }}
                          className="form-control"
                        /> */}
                        <LocalizaitonProvider dateAdapter={AdapterDateFns}>
                          <div>
                            <DatePicker
                              views={["year", "month"]}
                              // label="Year and Month"
                              // minDate={new Date("2012-03-01")}
                              maxDate={new Date()}
                              value={startDate}
                              onChange={(newValue) => {
                                setStartDate(formatDate(newValue));
                                var x =
                                  document.getElementById("startDateError");
                                x.style.display = "none";
                              }}
                              renderInput={(params) => (
                                <TextField
                                  id="dtStartDate"
                                  {...params}
                                  margin="normal"
                                  helperText={null}
                                  variant="standard"
                                />
                              )}
                            />
                          </div>
                        </LocalizaitonProvider>
                        <div
                          className="notes"
                          id="startDateError"
                          style={{ display: `none` }}
                        >
                          Start Date is required
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <Tooltip
                          placement="right"
                          title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sed tincidunt quam, in finibus ex."
                        >
                          <InfoIcon
                            style={{
                              color: "#ED642A",
                              position: "absolute",
                              cursor: "pointer",
                            }}
                          />
                        </Tooltip>

                        <label
                          className="bmd-label-floating"
                          style={{
                            paddingLeft: "30px",
                          }}
                        >
                          {candidateName}'s End Date
                          {currentlyWorking != "true" ? (
                            <span className="sup_char">
                              <sup>*</sup>
                            </span>
                          ) : null}
                        </label>

                        <LocalizaitonProvider dateAdapter={AdapterDateFns}>
                          <div>
                            <DatePicker
                              views={["year", "month"]}
                              minDate={startDate}
                              maxDate={new Date()}
                              value={endDate}
                              onChange={(newValue) => {
                                setEndDate(formatDate(newValue));
                                var x = document.getElementById("endDateError");
                                x.style.display = "none";
                              }}
                              renderInput={(params) => (
                                <TextField
                                  id="dtEndDate"
                                  {...params}
                                  margin="normal"
                                  helperText={null}
                                  variant="standard"
                                />
                              )}
                            />
                          </div>
                        </LocalizaitonProvider>
                        <div
                          className="notes"
                          id="endDateError"
                          style={{ display: `none` }}
                        >
                          End Date is required
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group bmd-form-group is-filled">
                        <label className="bmd-label-floating">
                          Candidate's role at the time
                          <span className="sup_char">
                            <sup>*</sup>
                          </span>
                        </label>
                        <input
                          type="text"
                          value={candidateRole}
                          maxLength="50"
                          onChange={(evt) => {
                            if (!SPECIAL_REGEX.test(evt.target.value)) {
                              setCandidateRole(evt.target.value);
                              var x =
                                document.getElementById("candidateRoleError");
                              x.style.display = "none";
                            }
                          }}
                          className="form-control bmd-form-group is-filled"
                        />
                        <div
                          className="notes"
                          id="candidateRoleError"
                          style={{ display: `none` }}
                        >
                          Candidate's Role is required
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group bmd-form-group is-filled">
                        <label className="bmd-label-floating">
                          Your job title at the time
                          <span className="sup_char">
                            <sup>*</sup>
                          </span>
                        </label>
                        <input
                          type="text"
                          value={refereeJobTitle}
                          maxLength="50"
                          onChange={(evt) => {
                            if (!SPECIAL_REGEX.test(evt.target.value)) {
                              setRefereeJobTitle(evt.target.value);
                              var x = document.getElementById(
                                "refereeJobTitleError"
                              );
                              x.style.display = "none";
                            }
                          }}
                          className="form-control bmd-form-group is-filled"
                        />
                        <div
                          className="notes"
                          id="refereeJobTitleError"
                          style={{ display: `none` }}
                        >
                          Your Job Title is required
                        </div>
                      </div>
                    </div>

                    <div className="col-md-12">
                      <h5 className="jh-subtitle pt2">
                        Please select an option
                        <span className="sup_char">
                          <sup>*</sup>
                        </span>
                      </h5>

                      <div className="form-check form-check-radio fc_more">
                        <label className="form-check-label txt_body">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="feedbackRadio"
                            onChange={() => changeRadio(0)}
                          />
                          My feedback will cover the entire time{" "}
                          <b className="text-primary">{candidateName}</b> spent
                          at the organization.
                          <span className="circle">
                            <span className="check"></span>
                          </span>
                        </label>
                      </div>
                      <div className="form-check form-check-radio fc_more">
                        <label className="form-check-label txt_body">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="feedbackRadio"
                            onChange={() => changeRadio(1)}
                          />
                          My feedback will cover only part of the time{" "}
                          <b className="text-primary">{candidateName}</b> spent
                          at the organization.
                          <span className="circle">
                            <span className="check"></span>
                          </span>
                        </label>
                      </div>
                      {/* <div
                        className="notes"
                        id="radioMandateMessage"
                        style={{ display: `none` }}
                      >
                        Please select an option
                      </div> */}
                    </div>

                    <div
                      className="col-md-6 mt2"
                      id="divPartFromDate"
                      style={{ display: "none" }}
                    >
                      <div className="form-group">
                        <label className="bmd-label mt-2">
                          From
                          <span className="sup_char">{mandateSymbol()}</span>
                        </label>
                        <LocalizaitonProvider dateAdapter={AdapterDateFns}>
                          <div>
                            <DatePicker
                              views={["year", "month"]}
                              minDate={startDate}
                              maxDate={!!endDate ? endDate : new Date()}
                              value={partStartDate}
                              onChange={(newValue) => {
                                setPartStartDate(formatDate(newValue));
                                var x =
                                  document.getElementById("partStartDateError");
                                x.style.display = "none";
                              }}
                              renderInput={(params) => (
                                <TextField
                                  id="dtPartStartDate"
                                  {...params}
                                  margin="normal"
                                  helperText={null}
                                  variant="standard"
                                />
                              )}
                            />
                          </div>
                        </LocalizaitonProvider>
                        <div
                          className="notes"
                          id="partStartDateError"
                          style={{ display: `none` }}
                        >
                          From Date is required
                        </div>
                      </div>
                    </div>

                    <div
                      className="col-md-6 mt2"
                      id="divPartToDate"
                      style={{ display: "none" }}
                    >
                      <div className="form-group">
                        <label className="bmd-label mt-2">
                          To
                          <span className="sup_char">{mandateSymbol()}</span>
                        </label>
                        <LocalizaitonProvider dateAdapter={AdapterDateFns}>
                          <div>
                            <DatePicker
                              views={["year", "month"]}
                              // label="Year and Month"
                              minDate={
                                !!partStartDate ? partStartDate : startDate
                              }
                              maxDate={!!endDate ? endDate : new Date()}
                              value={partEndDate}
                              onChange={(newValue) => {
                                setPartEndDate(formatDate(newValue));
                                var x =
                                  document.getElementById("partEndDateError");
                                x.style.display = "none";
                              }}
                              renderInput={(params) => (
                                <TextField
                                  id="dtPartEndDate"
                                  {...params}
                                  margin="normal"
                                  helperText={null}
                                  variant="standard"
                                />
                              )}
                            />
                          </div>
                        </LocalizaitonProvider>
                        <div
                          className="notes"
                          id="partEndDateError"
                          style={{ display: `none` }}
                        >
                          To Date is required
                        </div>
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="form-check box-pad">
                        <label className="form-check-label">
                          <input
                            id="checkBoxConfirm"
                            type="checkbox"
                            onChange={checkBoxClicked}
                          />
                          &nbsp; The information above is true and accurate.
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="box-pad mt1">
                    <input
                      type="button"
                      className="btn btn-primary"
                      id="btnVerifyContinue"
                      value="Verify & Continue"
                      onClick={verifyClicked}
                    />
                  </div>
                </div>
              </div>
              <div className="clearfix"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RefereeBasics;
