import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import logo from "../assets/img/credibled_logo_205x45.png";
import { API } from "../Api";
import Tooltip from "@material-ui/core/Tooltip";
import InfoIcon from "@material-ui/icons/Info";
import TextField from "@material-ui/core/TextField";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizaitonProvider from "@material-ui/lab/LocalizationProvider";
import DatePicker from "@material-ui/lab/DatePicker";
import NumberFormat from "react-number-format";

function JobInformation() {
  const params = useParams();
  const [candidateHash, setCandidateHash] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [organization, setOrganization] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentlyWorkingHere, setCurrentlyWorkingHere] = useState("");
  const [refereeFirstName, setRefereeFirstName] = useState("");
  const [refereeLastName, setRefereeLastName] = useState("");
  const [refereeEmail, setRefereeEmail] = useState("");
  const [refereePhone, setRefereePhone] = useState("");
  const [refereeJobTitle, setRefereeJobTitle] = useState("");
  const [candidateRole, setCandidateRole] = useState("");
  const [jobhistory, setJobHistory] = useState([]);

  useEffect(() => {
    if (params.name && params.id) {
      setCandidateHash(params.id);
      API.getJobHistory(params.id)
        .then((data) => {
          setJobHistory(data);
          document.getElementById("dtStartDate").placeholder = "MM YYYY";
          document.getElementById("dtEndDate").placeholder = "MM YYYY";
        })
        .catch((error) => console.log(error));
    }
  }, []);

  var EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var SPECIAL_REGEX = /[*|\":<>[\]{}`\\()';@&$%!#^_+=-]/;

  const checkBoxChange = () => {
    if (document.getElementById("checkBox_CurrentlyWorkHere").checked == true) {
      document.getElementById("dtEndDate").value = "";
      document.getElementById("dtEndDate").placeholder = "Present";
      document.getElementById("dtEndDate").disabled = true;
      setEndDate("");
      setCurrentlyWorkingHere("true");
      var x = document.getElementById("endDateError");
      x.style.display = "none";
    } else {
      document.getElementById("dtEndDate").disabled = false;
      document.getElementById("dtEndDate").placeholder = "MM YYYY";
      setCurrentlyWorkingHere("false");
    }
  };

  const saveClicked = () => {
    if (employmentType == "") {
      var x = document.getElementById("employmentTypeError");
      x.style.display = "block";
      return false;
    }
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
    if ((endDate == "" || endDate == null) && currentlyWorkingHere == false) {
      var x = document.getElementById("endDateError");
      x.style.display = "block";
      return false;
    }
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
    if (refereeEmail == "") {
      var x = document.getElementById("refereeEmailError");
      x.style.display = "block";
      return false;
    }
    if (refereeEmail) {
      if (!refereeEmail.match(EMAIL_REGEX)) {
        var x = document.getElementById("invalidEmailError");
        x.style.display = "block";
        return false;
      }
    }
    if (employmentType == "") {
      var x = document.getElementById("employmentTypeError");
      x.style.display = "block";
      return false;
    }
    // if (refereePhoneCode == "") {
    //   var x = document.getElementById("refereePhoneError");
    //   x.style.display = "block";
    //   return false;
    // }
    if (refereePhone == "") {
      var x = document.getElementById("refereePhoneError");
      x.style.display = "block";
      return false;
    }
    if (refereeJobTitle == "") {
      var x = document.getElementById("refereeJobTitleError");
      x.style.display = "block";
      return false;
    }
    if (candidateRole == "") {
      var x = document.getElementById("candidateRoleError");
      x.style.display = "block";
      return false;
    }

    API.addJobHistory({
      candidateHash,
      employmentType,
      organization,
      startDate,
      endDate: !!endDate ? endDate : null,
      currentlyWorkingHere: !!currentlyWorkingHere
        ? currentlyWorkingHere
        : null,
      refereeFirstName: refereeFirstName.trim(),
      refereeLastName: refereeLastName.trim(),
      refereeEmail,
      refereeOrganization: organization,
      refereePhone,
      refereeJobTitle,
      candidateRole,
    })
      .then(() => {
        window.location.href = "/job-history/" + params.name + "/" + params.id;
      })
      .catch((error) => console.log(error));
  };

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

  const goBackClicked = () => {
    if (jobhistory.length > 0) {
      window.location.href = "/job-history/" + params.name + "/" + params.id;
    } else {
      window.location.href =
        "/candidate-job-history/" + params.name + "/" + params.id;
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
                    <a className="navbar-brand" href="/signin">
                      <img src={logo} alt="Credibled Logo" />
                    </a>
                  </div>

                  <div className="card-plain mt2">
                    <div className="stepper">
                      <div className="stepper-steps">
                        <div className="stepper-step stepper-step-isActive">
                          <div className="stepper-stepContent step_active">
                            <span className="stepper-stepMarker">1</span>Job
                            Information
                          </div>
                        </div>
                        <div className="stepper-step">
                          <div className="stepper-stepContent">
                            <span className="stepper-stepMarker">2</span>Job
                            History
                          </div>
                        </div>
                        <div className="stepper-step">
                          <div className="stepper-stepContent">
                            <span className="stepper-stepMarker">3</span>Summary
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-12  bg-amberlight1">
                          <h5 className="jh-subtitle pt1">Employment Type</h5>

                          <label className="label-static">
                            Employment
                            <span className="sup_char">
                              <sup>*</sup>
                            </span>
                          </label>
                          <div className="form-group">
                            <select
                              className="form-control select-top"
                              value={employmentType}
                              onChange={(evt) => {
                                setEmploymentType(evt.target.value);
                                var x = document.getElementById(
                                  "employmentTypeError"
                                );
                                x.style.display = "none";
                              }}
                            >
                              <option value="">Select Employment Type</option>
                              <option>Full-Time Employee</option>
                              <option>Part-Time Employee</option>
                              <option>Temporary/Contract Employee</option>
                            </select>
                            <span className="fa fa-fw fa-angle-down field_icon eye"></span>
                            <div
                              className="notes"
                              id="employmentTypeError"
                              style={{ display: `none` }}
                            >
                              Employment Type is required
                            </div>
                          </div>
                        </div>

                        <div className="col-md-12">
                          <h5 className="jh-subtitle pt2">Employed at</h5>
                          <div className="form-group mt3">
                            <label className="bmd-label-floating">
                              Organization
                              <span className="sup_char">
                                <sup>*</sup>
                              </span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={organization}
                              onChange={(evt) => {
                                if (!SPECIAL_REGEX.test(evt.target.value)) {
                                  setOrganization(evt.target.value);
                                  var x =
                                    document.getElementById(
                                      "organizationError"
                                    );
                                  x.style.display = "none";
                                }
                              }}
                              maxLength="100"
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
                          <div className="form-group mt3">
                            <label className="bmd-label-static">
                              Start Date
                              <span className="sup_char">
                                <sup>*</sup>
                              </span>
                            </label>
                            {/* <input
                              type="date"
                              className="form-control"
                              value={startDate}
                              onChange={(evt) => {
                                setStartDate(evt.target.value);
                                var x = document.getElementById(
                                  "startDateError"
                                );
                                x.style.display = "none";
                              }}
                            /> */}
                            <LocalizaitonProvider dateAdapter={AdapterDateFns}>
                              <div>
                                <DatePicker
                                  views={["year", "month"]}
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
                          <div className="form-group mt3">
                            <label className="bmd-label-static">
                              End Date
                              <span className="sup_char">
                                <sup>*</sup>
                              </span>
                            </label>

                            <LocalizaitonProvider dateAdapter={AdapterDateFns}>
                              <div>
                                <DatePicker
                                  views={["year", "month"]}
                                  // label="Year and Month"
                                  minDate={startDate}
                                  maxDate={new Date()}
                                  value={endDate}
                                  onChange={(newValue) => {
                                    setEndDate(formatDate(newValue));
                                    var x =
                                      document.getElementById("endDateError");
                                    x.style.display = "none";
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      id="dtEndDate"
                                      {...params}
                                      id="dtEndDate"
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

                        <div className="col-md-12 text-right">
                          <div className="form-check box-pad">
                            <label className="form-check-label">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="checkBox_CurrentlyWorkHere"
                                // value={currentlyWorkingHere}
                                onChange={checkBoxChange}
                              />
                              Currently working here
                              <span className="form-check-sign">
                                <span className="check"></span>
                              </span>
                            </label>
                          </div>
                        </div>

                        <div className="col-md-12">
                          <h5 className="jh-subtitle pt2">
                            Referee Information
                          </h5>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="bmd-label-floating">
                              First Name
                              <span className="sup_char">
                                <sup>*</sup>
                              </span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={refereeFirstName}
                              maxlength="30"
                              onChange={(evt) => {
                                if (!SPECIAL_REGEX.test(evt.target.value)) {
                                  setRefereeFirstName(evt.target.value.trim());
                                  var x = document.getElementById(
                                    "refereeFirstNameError"
                                  );
                                  x.style.display = "none";
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
                          <div className="form-group">
                            <label className="bmd-label-floating">
                              Last Name
                              <span className="sup_char">
                                <sup>*</sup>
                              </span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={refereeLastName}
                              maxlength="30"
                              onChange={(evt) => {
                                if (!SPECIAL_REGEX.test(evt.target.value)) {
                                  setRefereeLastName(evt.target.value.trim());
                                  var x = document.getElementById(
                                    "refereeLastNameError"
                                  );
                                  x.style.display = "none";
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
                          <div className="form-group">
                            <label className="bmd-label-floating">
                              Email address
                              <span className="sup_char">
                                <sup>*</sup>
                              </span>
                            </label>
                            <input
                              type="email"
                              value={refereeEmail}
                              onChange={(evt) => {
                                setRefereeEmail(evt.target.value);
                                var x =
                                  document.getElementById("refereeEmailError");
                                x.style.display = "none";
                                var y =
                                  document.getElementById("invalidEmailError");
                                y.style.display = "none";
                              }}
                              className="form-control"
                            />
                            <div
                              className="notes"
                              id="refereeEmailError"
                              style={{ display: `none` }}
                            >
                              Email address is required
                            </div>
                            <div
                              className="notes"
                              id="invalidEmailError"
                              style={{ display: `none` }}
                            >
                              Email address is invalid
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="bmd-label-floating">
                              Phone#
                              <span className="sup_char">
                                <sup>*</sup>
                              </span>
                            </label>
                            {/* <input
                              type="text"
                              value={refereePhone}
                              onChange={(evt) => {
                                if (/^\d*$/.test(evt.target.value)) {
                                  setRefereePhone(evt.target.value);
                                }
                                var x =
                                  document.getElementById("refereePhoneError");
                                x.style.display = "none";
                              }}
                              className="form-control"
                              maxlength="10"
                            /> */}
                            <NumberFormat
                              className="form-control"
                              format="(###) ###-####"
                              value={refereePhone}
                              onChange={(evt) => {
                                setRefereePhone(evt.target.value);
                                var x =
                                  document.getElementById("refereePhoneError");
                                x.style.display = "none";
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

                        <div className="col-md-12">
                          <div className="form-group">
                            <label className="bmd-label-floating">
                              <Tooltip
                                placement="top"
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
                              <span style={{ marginLeft: "30px" }}>
                                Referee job title at the time
                              </span>
                              <span className="sup_char">
                                <sup>*</sup>
                              </span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              maxLength="50"
                              value={refereeJobTitle}
                              onChange={(evt) => {
                                if (!SPECIAL_REGEX.test(evt.target.value)) {
                                  setRefereeJobTitle(evt.target.value);
                                  var x = document.getElementById(
                                    "refereeJobTitleError"
                                  );
                                  x.style.display = "none";
                                }
                              }}
                            />
                            <div
                              className="notes"
                              id="refereeJobTitleError"
                              style={{ display: `none` }}
                            >
                              Job Title is required
                            </div>
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="form-group">
                            <label className="bmd-label-floating">
                              <Tooltip
                                placement="top"
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
                              <span style={{ marginLeft: "30px" }}>
                                Your role at the time
                              </span>
                              <span className="sup_char">
                                <sup>*</sup>
                              </span>
                            </label>
                            <textarea
                              className="form-control"
                              rows="2"
                              value={candidateRole}
                              onChange={(evt) => {
                                if (!SPECIAL_REGEX.test(evt.target.value)) {
                                  setCandidateRole(evt.target.value);
                                  var x =
                                    document.getElementById(
                                      "candidateRoleError"
                                    );
                                  x.style.display = "none";
                                }
                              }}
                            ></textarea>
                            <div
                              className="notes"
                              id="candidateRoleError"
                              style={{ display: `none` }}
                            >
                              Role is required
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="box-pad text-center mt1">
                        <span
                          className="btn btn-secondary-outline"
                          onClick={goBackClicked}
                        >
                          Go back
                        </span>
                        &nbsp;
                        <span onClick={saveClicked} className="btn btn-primary">
                          Save
                        </span>
                      </div>
                    </div>
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

export default JobInformation;
