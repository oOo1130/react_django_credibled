import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import logo from "../assets/img/credibled_logo_205x45.png";
import { API } from "../Api";
// import { makeStyles } from "@material-ui/core/styles";
import { detectBrowser, getDate, detectCountryISO } from "../Common";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Rating from "@material-ui/lab/Rating";

var timeOutVar;
// const useStyles = makeStyles((theme) => ({
//   modal: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   paper: {
//     backgroundColor: theme.palette.background.paper,
//     borderRadius: 10,
//     boxShadow: theme.shadows[5],
//     padding: theme.spacing(2, 4, 3),
//   },
// }));

function JobSummary() {
  // const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openRating, setOpenRating] = useState(false);
  const params = useParams();
  const [jobhistory, setJobHistory] = useState([]);
  const [ratingValue, setRatingValue] = useState(3);
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
      document.getElementById("btnSubmit").disabled = true;
      API.getJobHistory(params.id)
        .then((data) => setJobHistory(data))
        .catch((error) => console.log(error));

      API.getCandidateDetails(params.id)
        .then((data) => {
          setCandidateName(data[0].firstName + " " + data[0].lastName);
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

  const goBackClicked = () => {
    if (params.name && params.id) {
      window.location.href = "/job-history/" + params.name + "/" + params.id;
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRatingClose = () => {
    setOpenRating(false);
  };

  const submitClicked = () => {
    let references = "";

    for (let i = 0; i < jobhistory.length; i++) {
      if (references == "") {
        references =
          jobhistory[i].refereeFirstName + " " + jobhistory[i].refereeLastName;
      } else {
        references =
          references +
          ", " +
          jobhistory[i].refereeFirstName +
          " " +
          jobhistory[i].refereeLastName;
      }
      if (jobhistory[i].emailFlag != "Y") {
        API.sendRefereeRequestEmail({
          candidateFirstName: params.name,
          candidateHash: jobhistory[i].candidateHash,
          refereeFirstName: jobhistory[i].refereeFirstName,
          refereeEmail: jobhistory[i].refereeEmail,
          refereeHash: jobhistory[i].refereeHash,
        });

        API.updateLifeCycle({
          candidateHash: params.id,
          userType: "Candidate",
          name: candidateName,
          action:
            "Sent request to " +
            jobhistory[i].refereeFirstName +
            " " +
            jobhistory[i].refereeLastName,
          date: getDate(),
          osBrowser: detectBrowser(),
          ipAddress: !!ipAddress ? ipAddress : null,
          locationISP: !!countryISO ? countryISO : null,
        });
      }
    }

    API.updateRefereeNames({
      candidateHash: params.id,
      references: references,
    }).then(() => {
      window.location.href =
        "/job-history-complete/" + params.name + "/" + params.id;
    });
  };

  const checkBoxClicked = () => {
    if (document.getElementById("checkBoxConfirm").checked == true) {
      var x = (document.getElementById("btnSubmit").disabled = false);
    } else {
      var x = (document.getElementById("btnSubmit").disabled = true);
    }
  };

  const jobInfoClicked = () => {
    if (params.name && params.id) {
      window.location.href = "/job-info/" + params.name + "/" + params.id;
    }
  };

  const jobHistoryClicked = () => {
    if (params.name && params.id) {
      window.location.href = "/job-history/" + params.name + "/" + params.id;
    }
  };

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
                <div class="col-md-9">
                  <div class="">
                    <a class="navbar-brand" href="/signin">
                      <img src={logo} alt="Credibled Logo" />
                    </a>
                  </div>

                  <div class="card-plain mt2">
                    <div class="stepper">
                      <div class="stepper-steps">
                        <div class="stepper-step stepper-step-isActive">
                          <div class="stepper-stepContent step_active_primary">
                            <span class="text-primary" onClick={jobInfoClicked}>
                              <span class="stepper-stepMarker">1</span>Job
                              Information
                            </span>
                          </div>
                        </div>
                        <div class="stepper-step stepper-step-isActive">
                          <div class="stepper-stepContent step_active_primary">
                            <span
                              class="text-primary"
                              onClick={jobHistoryClicked}
                            >
                              <span class="stepper-stepMarker">2</span>Job
                              History
                            </span>
                          </div>
                        </div>
                        <div class="stepper-step stepper-step-isActive">
                          <div class="stepper-stepContent step_active">
                            <span class="stepper-stepMarker">3</span>Summary
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-12 pl3 pb2">
                          <h3 class="jh-title">Summary</h3>

                          <div
                            class="alert alert-warning alert-dismissible fade show"
                            role="alert"
                          >
                            <strong>{jobhistory.length} Referees added.</strong>{" "}
                            Review their information and submit the request.
                            <button
                              type="button"
                              class="close"
                              data-dismiss="alert"
                              aria-label="Close"
                            >
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {jobhistory.map((localState) => (
                        <div class="row" key={localState.id}>
                          <div class="col-md-12 pl3">
                            <h3 class="jh-title-primary">
                              {localState.organization}
                            </h3>
                            <h5 class="jh-subtitle-primary-nb">
                              {localState.startDate} -{" "}
                              {!!localState.endDate
                                ? localState.endDate
                                : "Till Date"}
                            </h5>
                            <br />
                            <h6 class="text-primary">
                              Your role at the time :{" "}
                            </h6>
                            <p>{localState.candidateRole}</p>
                            <i class="acc-icon material-icons">account_box</i>
                            <div class="jh-subtitle-acc">
                              {localState.refereeFirstName} -{" "}
                              {localState.refereeEmail}
                            </div>
                            <p class="text-secondary">
                              {localState.refereePhone}
                            </p>
                            <hr class="seperator" />
                          </div>
                        </div>
                      ))}

                      <div class="box-pad text-center mt1">
                        <div class="form-check box-pad">
                          <label class="form-check-label">
                            <input
                              id="checkBoxConfirm"
                              type="checkbox"
                              onChange={checkBoxClicked}
                            />
                            <small>
                              &nbsp; I confirm the contact information of these
                              referees are up-to-date and correct.
                            </small>
                          </label>
                        </div>
                        <br />
                        <span
                          onClick={goBackClicked}
                          class="btn btn-secondary-outline"
                        >
                          Go back
                        </span>
                        &nbsp;
                        <input
                          type="button"
                          data-toggle="modal"
                          id="btnSubmit"
                          data-target="#rate_experience"
                          onClick={submitClicked}
                          class="btn btn-primary"
                          value="Submit"
                        />
                        <Modal
                          aria-labelledby="transition-modal-title"
                          aria-describedby="transition-modal-description"
                          // className={classes.modal}
                          open={open}
                          onClose={handleClose}
                          closeAfterTransition
                          BackdropComponent={Backdrop}
                          BackdropProps={{
                            timeout: 500,
                          }}
                        >
                          <Fade in={open}>
                            <div >
                            {/* <div className={classes.paper}> */}
                              <div class="modal-body text-center">
                                <div class="row">
                                  <div class="col">
                                    <h3 class="text-primary">
                                      <span class="text-secondary">
                                        Thank you
                                      </span>{" "}
                                      for Providing a reference.
                                    </h3>
                                    <p>
                                      <span
                                        onClick={() => {
                                          clearTimeout(timeOutVar);
                                          setOpenRating(true);
                                        }}
                                        class="btn btn-primary mt2"
                                        data-dismiss="modal"
                                        aria-label="Close"
                                        data-toggle="modal"
                                        data-target="#rate_experience1"
                                      >
                                        Rate your Experience
                                      </span>
                                    </p>
                                    <p>
                                      you will be redirected in 5 seconds...
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Fade>
                        </Modal>
                        <Modal
                          aria-labelledby="transition-modal-title"
                          aria-describedby="transition-modal-description"
                          // className={classes.modal}
                          open={openRating}
                          onClose={handleRatingClose}
                          closeAfterTransition
                          BackdropComponent={Backdrop}
                          BackdropProps={{
                            timeout: 500,
                          }}
                        >
                          <Fade in={open}>
                            <div >
                            {/* <div className={classes.paper}> */}
                              <div class="modal-body text-center">
                                <div class="row">
                                  <div class="col">
                                    <h4 class="text-primary">
                                      Out of 5 stars, how would you rate your
                                      experience of providing a reference using
                                      Credibled?
                                    </h4>
                                    <p class="pt2">
                                      <Rating
                                        name="pristine"
                                        value={ratingValue}
                                      />{" "}
                                    </p>

                                    <div class="box-pad">
                                      <a
                                        href={
                                          "/job-history-complete/" +
                                          params.name +
                                          "/" +
                                          params.id
                                        }
                                        class="btn btn-primary"
                                      >
                                        Submit
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Fade>
                        </Modal>
                      </div>
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

export default JobSummary;
