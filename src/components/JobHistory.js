import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import logo from "../assets/img/credibled_logo_205x45.png";
import { API } from "../Api";

function JobHistory() {
  const params = useParams();
  const [jobhistory, setJobHistory] = useState([]);

  useEffect(() => {
    if (params.name && params.id) {
      API.getJobHistory(params.id)
        .then((data) => setJobHistory(data))
        .catch((error) => console.log(error));
    }
  }, []);

  const formatDate = (dateString) => {
    if (dateString) {
      let d = new Date(dateString);
      let year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
      let month = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
      // let day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
      return month + " " + year;
    }
  };

  const deleteClicked = (id) => {
    API.removeJobHistory(id)
      .then(
        API.getJobHistory(params.id)
          .then((data) => setJobHistory(data))
          .catch((error) => console.log(error))
      )
      .catch((error) => console.log(error));
  };

  const reviewClicked = () => {
    if (params.name && params.id) {
      if (jobhistory.length >= 2) {
        window.location.href = "/job-summary/" + params.name + "/" + params.id;
      }
    }
  };

  const jobInfoClicked = () => {
    if (params.name && params.id) {
      window.location.href = "/job-info/" + params.name + "/" + params.id;
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
                          <div className="stepper-stepContent step_active_primary">
                            <span
                              className="text-primary"
                              onClick={jobInfoClicked}
                            >
                              <span className="stepper-stepMarker">1</span>Job
                              Information
                            </span>
                          </div>
                        </div>
                        <div className="stepper-step stepper-step-isActive">
                          <div className="stepper-stepContent step_active">
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
                      {jobhistory.length < 2 ? (
                        <div className="row">
                          <div className="pl3 pb2">
                            <h3 className="jh-title">
                              Tell Us Your Job History
                            </h3>
                            <h5 className="jh-subtitle">
                              complete your work history with the following
                              requirements:
                            </h5>

                            <ul className="cretiria1">
                              <li>
                                Minimum 2 references &nbsp;
                                <i className="fa fa-close"></i>{" "}
                              </li>
                            </ul>
                          </div>
                        </div>
                      ) : null}

                      {jobhistory.map((localState) => (
                        <div className="row" key={localState.id}>
                          <div className="col-md-12 pl3 pb5">
                            <h3 className="jh-title-primary">
                              {localState.organization}
                            </h3>
                            <h5 className="jh-subtitle-primary">
                              {formatDate(localState.startDate)} -{" "}
                              {!!localState.endDate
                                ? formatDate(localState.endDate)
                                : "Till Date"}
                            </h5>
                            <div className="remove">
                              <a
                                href={
                                  "/edit-job-info/" +
                                  params.name +
                                  "/" +
                                  params.id +
                                  "/" +
                                  localState.id
                                }
                                class="text-secondary"
                              >
                                <i
                                  class="fa fa-pencil-square-o"
                                  aria-hidden="true"
                                ></i>{" "}
                              </a>
                              <i
                                className="fa fa-times-circle-o"
                                aria-hidden="true"
                                style={{ cursor: "pointer" }}
                                onClick={() => deleteClicked(localState.id)}
                              ></i>
                            </div>
                            <i className="acc-icon material-icons">
                              account_box
                            </i>{" "}
                            <div className="jh-subtitle-acc">
                              {localState.refereeFirstName} -{" "}
                              {localState.refereeEmail}
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="box-pad text-center mt1">
                        <button
                          type="button"
                          className="btn btn-secondary-outline"
                          onClick={jobInfoClicked}
                        >
                          Add
                        </button>
                        &nbsp;
                        {jobhistory.length > 1 ? (
                          <input
                            type="button"
                            id="btnCredReview"
                            className="btn btn-primary"
                            onClick={reviewClicked}
                            value="Review"
                          />
                        ) : null}
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
      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="addjobhistory"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add New Job History
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row lrpad">
                <div className="col-md-12">
                  <h5 className="jh-subtitle pt1">Entry Type</h5>

                  <label className="label-static">
                    Employment
                    <span className="sup_char">
                      <sup>*</sup>
                    </span>
                  </label>
                  <div className="form-group">
                    <select className="form-control select-top">
                      <option value="">Select employment type</option>
                      <option>Employment 1</option>
                      <option>Employment 2</option>
                      <option>Employment 3</option>
                    </select>
                    <span className="fa fa-fw fa-angle-down field_icon eye"></span>
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
                    <input type="text" className="form-control" />
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
                    <input type="date" className="form-control" />
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
                    <input type="date" className="form-control" />
                  </div>
                </div>

                <div className="col-md-12 text-right">
                  <div className="form-check box-pad">
                    <label className="form-check-label">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                      />
                      Currently working here
                      <span className="form-check-sign">
                        <span className="check"></span>
                      </span>
                    </label>
                  </div>
                </div>

                <div className="col-md-12">
                  <h5 className="jh-subtitle pt2">Referee Information</h5>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label className="bmd-label-floating">
                      First Name
                      <span className="sup_char">
                        <sup>*</sup>
                      </span>
                    </label>
                    <input type="text" className="form-control" />
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
                    <input type="text" className="form-control" />
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
                    <input type="email" value="" className="form-control" />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label className="bmd-label-floating">
                      Phone#
                      <span className="sup_char">
                        <sup>*</sup>
                      </span>
                    </label>
                    <input type="text" value="" className="form-control" />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <input type="text" value="" className="form-control" />
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="form-group">
                    <a
                      id="pop"
                      href="#"
                      data-toggle="popover"
                      data-content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sed tincidunt quam, in finibus ex."
                    >
                      <i className="material-icons icon-fix text-secondary">
                        info
                      </i>
                    </a>
                    <label className="bmd-label-floating">
                      Referee job title at the time
                      <span className="sup_char">
                        <sup>*</sup>
                      </span>
                    </label>
                    <input type="text" className="form-control" />
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="form-group">
                    <a
                      id="pop"
                      href="#"
                      data-toggle="popover"
                      data-content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sed tincidunt quam, in finibus ex."
                    >
                      <i className="material-icons icon-fix text-secondary">
                        info
                      </i>
                    </a>
                    <label className="bmd-label-floating">
                      Your role at the time
                      <span className="sup_char">
                        <sup>*</sup>
                      </span>
                    </label>
                    <textarea className="form-control" rows="2"></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary-outline"
                data-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-dismiss="modal"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobHistory;
