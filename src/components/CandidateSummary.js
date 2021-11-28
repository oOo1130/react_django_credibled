import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router";
import logo from "../assets/img/credibled_logo_205x45.png";
import { API } from "../Api";
import Tooltip from "@material-ui/core/Tooltip";
import InfoIcon from "@material-ui/icons/Info";
import ThumbDownAltOutlinedIcon from "@material-ui/icons/ThumbDownAltOutlined";
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";

function CandidateSummary() {
  const params = useParams();
  const [token, setToken, deleteToken] = useCookies(["credtoken"]);
  const [jobhistory, setJobHistory] = useState([]);
  const [lifeCycle, setLifeCycle] = useState([]);
  const [loginUser, setLoginUser] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [role, setRole] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePhone, setCandidatePhone] = useState("");

  const getCookie = (name) => {
    var cookieArr = document.cookie.split(";");
    for (var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split("=");
      if (name == cookiePair[0].trim()) {
        return decodeURIComponent(cookiePair[1]);
      }
    }

    return null;
  };

  const signOutClicked = () => {
    API.logout(token["credtoken"])
      .then((resp) => {
        if (resp.message == "success") {
          localStorage.removeItem("creduser");
          localStorage.removeItem("creduser-a");
          deleteToken(["credtoken"], { path: "/" });
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (!token["credtoken"]) {
      window.location.href = "/signin";
    } else {
      setToken("credtoken", token["credtoken"], {
        path: "/",
        maxAge: process.env.REACT_APP_SESSION_MAX_AGE,
      });

      API.getLifeCycleData({ candidateHash: params.hash }).then((data) => {
        data.sort().reverse();
        setLifeCycle(data);
      });
    }

    const username = localStorage.getItem("creduser");
    if (localStorage.getItem("creduser-a")) {
      setLoginUser(localStorage.getItem("creduser-a"));
    } else {
      API.getCurrentUserData(username, token["credtoken"])
        .then((resp) => {
          setLoginUser(resp.firstName);
          localStorage.setItem("creduser-a", resp.firstName);
        })
        .catch((error) => console.log(error));
    }
    if (params.hash) {
      API.getCandidateDetails(params.hash)
        .then((data) => {
          setCandidateName(data[0].firstName + " " + data[0].lastName);
          setRole(data[0].role);
          setCandidateEmail(data[0].email);
          setCandidatePhone(data[0].phone);
        })
        .catch((error) => console.log(error));
      API.getJobHistory(params.hash)
        .then((data) => setJobHistory(data))
        .catch((error) => console.log(error));
    }

    const sessionValidateInterval = setInterval(() => {
      if (getCookie("credtoken") == null) {
        signOutClicked();
        clearInterval(sessionValidateInterval);
        window.location.href = "/signin";
      }
    }, 60000);
  }, [token]);

  const formatDate = (dateString) => {
    if (dateString) {
      let d = new Date(dateString);
      let year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
      let month = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
      // let day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
      return month + " " + year;
    }
  };

  const getYearDiff = (date1, date2) => {
    if (date1 && date2) {
      let dateStart = new Date(date1);
      let dateEnd = new Date(date2);
      let yearsDiff = dateEnd.getFullYear() - dateStart.getFullYear();
      return yearsDiff;
    } else if (date1 && date2 == null) {
      let dateStart = new Date(date1);
      let dateEnd = new Date();
      let yearsDiff = dateEnd.getFullYear() - dateStart.getFullYear();
      return yearsDiff;
    } else return "0";
  };

  return (
    <div>
      <div className="wrapper">
        <div
          className="sidebar"
          data-color="purple"
          data-background-color="white"
        >
          <div className="logo text-center">
            <a className="navbar-brand" href="/signin">
              <img src={logo} alt="Credibled Logo" />
            </a>
          </div>
          <div className="sidebar-wrapper">
            <ul className="nav">
              <li className="nav-item">
                <a className="nav-link or_bg" href="/new-request">
                  <i className="material-icons txt_white">post_add</i>
                  <p className="new_req">New Request</p>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/">
                  <i className="material-icons">dvr</i>
                  <p>Requests</p>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/questionnaires">
                  <i className="material-icons-outlined">assignment</i>
                  <p>Questionnaires</p>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/template-builder">
                  <i className="material-icons-outlined">view_list</i>
                  <p>Template Builder</p>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/help">
                  <i className="material-icons-outlined">live_help</i>
                  <p>Help & Training</p>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/settings">
                  <i className="material-icons-outlined">settings</i>
                  <p>settings</p>
                </a>
              </li>
            </ul>
            <div
              onclick="javascript:window.location.href='credibled_buycredits.html'"
              className="tile_side"
            >
              <label className="h4">
                Credits&nbsp;
                <a href="credibled_buycredits.html" className="fw300sm">
                  Buy Now!
                </a>
              </label>
              <div className="h1 d-flex justify-content-between">
                <span className="text-secondary material-icons-outlined">
                  account_balance
                </span>
                <label>10</label>
              </div>
            </div>
            <div className="teaser-box">
              <div className="teaser_img">
                <img src="/assets/img/ref-img.png" width="100%" />
                <h4>
                  Before you hire
                  <br />
                  Check with here!
                </h4>
                <p>
                  {" "}
                  Automate your employment reference checking process. CREDIBLED
                  checking platform...{" "}
                </p>
                <p className="text-right">
                  <a href="#">Read more </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="main-panel">
          <nav className="navbar navbar-expand navbar-transparent navbar-absolute fixed-top mobile_logo">
            <div className="container-fluid">
              <div className="navbar-wrapper">
                <div className="showonmobile" style={{ display: `none` }}>
                  <a className="navbar-brand" href="/">
                    <img src={logo} width="80%" alt="Credibled Logo" />
                  </a>
                </div>
              </div>
              <div className="">
                <ul className="navbar-nav">
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link"
                      href="#"
                      id="navbarDropdownMenuLink"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="material-icons">notifications</i>
                      <span className="notification">5</span>
                    </a>
                    <div
                      className="dropdown-menu dropdown-menu-right"
                      aria-labelledby="navbarDropdownMenuLink"
                    >
                      <a className="dropdown-item" href="#">
                        Mike John responded to your email
                      </a>
                      <a className="dropdown-item" href="#">
                        You have 5 new tasks
                      </a>
                      <a className="dropdown-item" href="#">
                        You're now friend with Andrew
                      </a>
                      <a className="dropdown-item" href="#">
                        Another Notification
                      </a>
                      <a className="dropdown-item" href="#">
                        Another One
                      </a>
                    </div>
                  </li>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="navbarDropdownMenuLink"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="material-icons">language</i>
                      <span className="nomobile"> Language</span> (EN)
                    </a>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdownMenuLink"
                    >
                      <a className="dropdown-item" href="#">
                        English
                      </a>
                      <a className="dropdown-item" href="#">
                        French
                      </a>
                    </div>
                  </li>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="navbarDropdownMenuLink"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="material-icons">account_box</i> Hi{" "}
                      <span className="text-secondary">{loginUser}</span>
                    </a>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdownMenuLink"
                    >
                      <a className="dropdown-item" href="#">
                        Profile
                      </a>
                      <span
                        className="dropdown-item"
                        style={{ cursor: "pointer" }}
                        onClick={signOutClicked}
                      >
                        Sign out
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <div className="content">
            <div className="container-fluid">
              <div className="card-plain">
                <div className="card-body ">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="card-plain bb10">
                        <div className="row">
                          <div className="col-md-4">
                            <h3> Request Summary</h3>
                          </div>
                          <div
                            className="col-md-8 showonmobile"
                            style={{ display: `none` }}
                          >
                            <div className="btn-group setmobile">
                              {/* <button
                                type="button"
                                className="btn btnsm btn-secondary dropdown-toggle"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                              >
                                Export Request
                              </button> */}
                              <div className="dropdown-menu">
                                <a className="dropdown-item" href="#">
                                  <div className="form-check">
                                    {/* <label className="txt_body">
                                      <input
                                        className=""
                                        type="checkbox"
                                        value=""
                                      />
                                      Elvine AsLn
                                    </label> */}
                                  </div>
                                </a>
                                {/* <!-- <div className="dropdown-divider"></div> --> */}
                                <div className="clearfix"></div>
                                <div className="text-center box-pad-sm">
                                  <a
                                    href="#"
                                    className="btn btnxs btn-secondary-outline"
                                  >
                                    Cancel
                                  </a>
                                  <a href="#" className="btn btnxs btn-primary">
                                    Export
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row pb2">
                <div className="col info-box">
                  <div className="row">
                    <div className="col">
                      <p className="title">Candidate</p>
                      <p className="ref-name">{candidateName}</p>
                    </div>
                    <div className="col">
                      <table className="noborder">
                        <tbody>
                          <tr>
                            <td nowrap>
                              <b>Job Title</b>
                            </td>
                            <td className="text-primary fw300">
                              <strong>{role}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <b>E-mail</b>
                            </td>
                            <td>{candidateEmail}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Phone</b>
                            </td>
                            <td>{candidatePhone}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="col">
                      <p className="title">Criteria</p>
                      <p className="details">
                        2 References Minimum
                        <br />
                        Questionnaries{" "}
                        <a data-toggle="modal" data-target="#question" href="#">
                          show
                        </a>
                      </p>
                    </div>
                    <div className="col pt2 hideonmobile">
                      <div className="btn-group">
                        {/* <button
                          type="button"
                          className="btn btn-secondary dropdown-toggle"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          Export Request
                        </button> */}
                        <div className="dropdown-menu">
                          <a className="dropdown-item" href="#">
                            <div className="form-check">
                              {/* <label className="txt_body">
                                <input className="" type="checkbox" value="" />
                                &nbsp;Elvine AsLn
                              </label> */}
                            </div>
                          </a>
                          {/* <!-- <div className="dropdown-divider"></div> --> */}
                          <div className="clearfix"></div>
                          <div className="text-center box-pad-sm">
                            <a
                              href="#"
                              className="btn btnxs btn-secondary-outline"
                            >
                              Cancel
                            </a>
                            <a href="#" className="btn btnxs btn-primary">
                              Export
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row pb2 nopb">
                <div className="col info-box-white">
                  <div className="row">
                    {jobhistory.map((localState, index) => (
                      // <div>
                      <div className="col-6 bg-gray" key={localState.id}>
                        <div className="row">
                          <div className="col">
                            <p className="title">Referee{index + 1}</p>
                            <p className="ref-name">
                              {localState.refereeFirstName}{" "}
                              {localState.refereeLastName}
                            </p>
                          </div>
                          <div className="col text-right push-right">
                            {localState.refereeResponse == "completed" ? (
                              <h4
                                className="text-secondary"
                                style={{ paddingRight: "30px" }}
                              >
                                {" "}
                                <a
                                  href={
                                    "/reference/status/" +
                                    params.hash +
                                    "/" +
                                    localState.refereeHash
                                  }
                                >
                                  Answered
                                  <Tooltip
                                    placement="top"
                                    title="Referee has responded to the questionnaire."
                                  >
                                    <ThumbUpAltOutlinedIcon
                                      style={{
                                        color: "#ED642A",
                                        position: "absolute",
                                        cursor: "pointer",
                                        color: "#1396ed",
                                        marginLeft: "5px",
                                      }}
                                    />
                                  </Tooltip>
                                </a>
                              </h4>
                            ) : (
                              <h4
                                className="text-secondary"
                                style={{ paddingRight: "30px" }}
                              >
                                {" "}
                                {localState.refereeResponse == "declined"
                                  ? "Request Declined"
                                  : "Requested"}
                                {localState.refereeResponse == "declined" ? (
                                  <Tooltip
                                    placement="top"
                                    title="Referee has declined the request."
                                  >
                                    <ThumbDownAltOutlinedIcon
                                      style={{
                                        color: "#ED642A",
                                        position: "absolute",
                                        cursor: "pointer",
                                        marginLeft: "5px",
                                      }}
                                    />
                                  </Tooltip>
                                ) : (
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
                                )}
                              </h4>
                            )}

                            <p className="details mr22">
                              {/* Jan 08/2021 7-30AM */}
                              {localState.refereeResponse == "completed" ? (
                                <a
                                  href={
                                    "/reference/status/" +
                                    params.hash +
                                    "/" +
                                    localState.refereeHash
                                  }
                                  className="btn btnxs btn-secondary"
                                  aria-label="Close"
                                >
                                  Results
                                </a>
                              ) : (
                                ""
                              )}
                              <br />
                            </p>
                          </div>
                        </div>
                        <table className="noborder">
                          <tbody>
                            <tr>
                              <td>
                                <b>Organization</b>
                              </td>
                              <td className="text-primary fw300">
                                <strong>{localState.organization}</strong>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <b>Job Title</b>
                              </td>
                              <td>
                                <strong>{localState.refereeJobTitle}</strong>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <b>E-mail</b>
                              </td>
                              <td>{localState.refereeEmail}</td>
                            </tr>
                            <tr>
                              <td>
                                <b>Phone</b>
                              </td>
                              <td>{localState.refereePhone}</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="period">
                          <h5 className="hr-blue">
                            {getYearDiff(
                              localState.startDate,
                              localState.endDate
                            )}{" "}
                            Years
                          </h5>
                          <p className="details">
                            {formatDate(localState.startDate)}
                            {" - "}
                            {!!localState.endDate
                              ? formatDate(localState.endDate)
                              : "Till Date"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* LCD MobileVw Starts */}
              <div className="showonmobile" style={{ display: `none` }}>
                <div className="lrpad">
                  <div className="row">
                    <div className="col-md-6">
                      <h3> Life Cycle Data</h3>
                    </div>
                    <div className="col-md-6 text-right">
                      <div className="btn-group setmobile">
                        <button
                          type="button"
                          className="btn btnsm btn-secondary"
                        >
                          last 30 days
                        </button>
                        <button
                          type="button"
                          className="btn btnsm btn-secondary dropdown-toggle dropdown-toggle-split"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <span className="sr-only">Toggle Dropdown</span>
                        </button>
                        <div className="dropdown-menu">
                          <a className="dropdown-item" href="#">
                            last 15 days
                          </a>
                          <a className="dropdown-item" href="#">
                            last 1 month
                          </a>
                          <a className="dropdown-item" href="#">
                            last 3 months
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="search-box">
                  <div className="col-md-4">
                    <form className="navbar-form">
                      <div className="input-group no-border">
                        <i className="material-icons sr_icon">search</i>
                        <input
                          type="text"
                          value=""
                          className="form-control"
                          placeholder="Search..."
                        />
                      </div>
                    </form>
                  </div>
                </div>

                <table className="table">
                  <tr>
                    <td>
                      <div className="form-check form-check-m form-check-inline">
                        <label className="form-check-label">
                          <div className="circle1 green">&nbsp;</div>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inlineCheckbox1"
                            value="option1"
                          />{" "}
                          Criteria Met
                          <span className="form-check-sign">
                            <span className="check"></span>
                          </span>
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="form-check form-check-m form-check-inline">
                        <label className="form-check-label">
                          <div className="circle1 amber">&nbsp;</div>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inlineCheckbox2"
                            value="option2"
                          />{" "}
                          Pending
                          <span className="form-check-sign">
                            <span className="check"></span>
                          </span>
                        </label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="form-check form-check-m form-check-inline">
                        <label className="form-check-label">
                          <div className="circle1 red">&nbsp;</div>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inlineCheckbox3"
                            value="option3"
                          />{" "}
                          Rejected
                          <span className="form-check-sign">
                            <span className="check"></span>
                          </span>
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="form-check form-check-m form-check-inline">
                        <label className="form-check-label">
                          <div className="circle1 gray">&nbsp;</div>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inlineCheckbox3"
                            value="option3"
                          />{" "}
                          Archived
                          <span className="form-check-sign">
                            <span className="check"></span>
                          </span>
                        </label>
                      </div>
                    </td>
                  </tr>
                </table>
                {lifeCycle.map((localState) => (
                  <table
                    className="table mobile-data-table br5_green"
                    key={localState.id}
                  >
                    <tr>
                      {" "}
                      <td>User Type</td>
                      <td>{localState.userType}</td>
                    </tr>
                    <tr>
                      {" "}
                      <td>Name</td>
                      <td>{localState.name}</td>
                    </tr>
                    <tr>
                      {" "}
                      <td>Action</td>
                      <td>
                        <a
                          id="pop1"
                          className="txt_green fw400"
                          href="#"
                          data-toggle="popover"
                          data-content="Credibled request verified by the Referee"
                        >
                          {localState.action}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      {" "}
                      <td>Date</td>
                      <td> {localState.date}</td>
                    </tr>
                    <tr>
                      {" "}
                      <td>OS-Browser</td>
                      <td> {localState.osBrowser}</td>
                    </tr>
                    <tr>
                      {" "}
                      <td>IP Address</td>
                      <td> {localState.ipAddress}</td>
                    </tr>
                    <tr>
                      {" "}
                      <td>Location & ISP</td>
                      <td> {localState.locationISP}</td>
                    </tr>
                  </table>
                ))}
                <br />
                <br />
              </div>
              {/* Desktop View */}
              <div className="row hideonmobile">
                <div className="col-md-12">
                  <div className="card mt_zero pad_zero">
                    <div className="search-box">
                      <div className="col-md-12">
                        <div className="row">
                          <div className="col-md-3 col-sm-6">
                            <form className="navbar-form">
                              <div className="input-group no-border">
                                <i className="material-icons sr_icon">search</i>
                                <input
                                  type="text"
                                  value=""
                                  className="form-control"
                                  placeholder="Search..."
                                />
                              </div>
                            </form>
                          </div>
                          <div className="col pt1 text-right no-mobile">
                            <div className="form-check form-check-inline">
                              <label className="form-check-label">
                                <div className="circle1 green">&nbsp;</div>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="inlineCheckbox1"
                                  value="option1"
                                />{" "}
                                Criteria Met
                                <span className="form-check-sign">
                                  <span className="check"></span>
                                </span>
                              </label>
                            </div>
                            <div className="form-check form-check-inline">
                              <label className="form-check-label">
                                <div className="circle1 amber">&nbsp;</div>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="inlineCheckbox2"
                                  value="option2"
                                />{" "}
                                Pending
                                <span className="form-check-sign">
                                  <span className="check"></span>
                                </span>
                              </label>
                            </div>
                            <div className="form-check form-check-inline">
                              <label className="form-check-label">
                                <div className="circle1 red">&nbsp;</div>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="inlineCheckbox3"
                                  value="option3"
                                />{" "}
                                Rejected
                                <span className="form-check-sign">
                                  <span className="check"></span>
                                </span>
                              </label>
                            </div>
                            <div className="form-check form-check-inline">
                              <label className="form-check-label">
                                <div className="circle1 gray">&nbsp;</div>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="inlineCheckbox3"
                                  value="option3"
                                />{" "}
                                Archived
                                <span className="form-check-sign">
                                  <span className="check"></span>
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card-plain lrpad">
                      <div className="row">
                        <div className="col-md-6">
                          <h3> Life Cycle Data</h3>
                        </div>
                        <div className="col-md-6 text-right">
                          <div className="btn-group">
                            <button
                              type="button"
                              className="btn btnsm btn-secondary"
                            >
                              last 30 days
                            </button>
                            <button
                              type="button"
                              className="btn btnsm btn-secondary dropdown-toggle dropdown-toggle-split"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              <span className="sr-only">Toggle Dropdown</span>
                            </button>
                            <div className="dropdown-menu">
                              <a className="dropdown-item" href="#">
                                last 15 days
                              </a>
                              <a className="dropdown-item" href="#">
                                last 1 month
                              </a>
                              <a className="dropdown-item" href="#">
                                last 3 months
                              </a>
                              <div className="dropdown-divider"></div>
                              <a className="dropdown-item" href="#">
                                Separated link
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="table-responsive hideonmobile">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th className="text-center">#</th>
                            <th className="sorting">User Type</th>
                            <th className="sorting">Name</th>
                            <th className="sorting">Action</th>
                            <th className="sorting">Date</th>
                            <th className="sorting">OS Browser</th>
                            <th className="sorting">IP Address</th>
                            <th className="sorting">Location & ISP</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lifeCycle.map((localState, index) => (
                            <tr key={localState.id}>
                              {localState.action == "Agreed" ? (
                                <td className="br_amber text-center">
                                  {index + 1}
                                </td>
                              ) : null}

                              {localState.action == "Answered" ? (
                                <td className="br_green text-center">
                                  {index + 1}
                                </td>
                              ) : null}

                              {localState.action == "Verified" ? (
                                <td className="br_amber text-center">
                                  {index + 1}
                                </td>
                              ) : null}
                              {localState.action == "Declined" ? (
                                <td className="br_red text-center">
                                  {index + 1}
                                </td>
                              ) : null}
                              {localState.action == "Accessed" ? (
                                <td className="br_amber text-center">
                                  {index + 1}
                                </td>
                              ) : null}
                              {localState.action.includes("Sent request") ? (
                                <td className="br_gray text-center">
                                  {index + 1}
                                </td>
                              ) : null}

                              <td>{localState.userType}</td>
                              <td>{localState.name}</td>
                              <td>
                                {localState.action == "Agreed" ? (
                                  <a
                                    className="txt_amber fw400"
                                    href="javascript:void(0)"
                                    data-toggle="popover"
                                    data-content="Credibled request verified by the Referee"
                                  >
                                    {localState.action}
                                  </a>
                                ) : null}
                                {localState.action == "Verified" ? (
                                  <a
                                    className="txt_amber fw400"
                                    href="javascript:void(0)"
                                    data-toggle="popover"
                                    data-content="Credibled request verified by the Referee"
                                  >
                                    {localState.action}
                                  </a>
                                ) : null}
                                {localState.action == "Declined" ? (
                                  <a
                                    className="txt_red fw400"
                                    href="javascript:void(0)"
                                    data-toggle="popover"
                                    data-content="Credibled request verified by the Referee"
                                  >
                                    {localState.action}
                                  </a>
                                ) : null}
                                {localState.action == "Accessed" ? (
                                  <a
                                    className="txt_amber fw400"
                                    href="javascript:void(0)"
                                    data-toggle="popover"
                                    data-content="Credibled request verified by the Referee"
                                  >
                                    {localState.action}
                                  </a>
                                ) : null}
                                {localState.action == "Answered" ? (
                                  <a
                                    className="txt_green fw400"
                                    href={
                                      "/reference/status/" +
                                      params.hash +
                                      "/" +
                                      localState.refereeHash
                                    }
                                    data-toggle="popover"
                                    data-content="Credibled questionnaire answered by the Referee"
                                  >
                                    {localState.action}
                                  </a>
                                ) : null}
                                {localState.action.includes("Sent request") ? (
                                  <a
                                    id="pop1"
                                    className="txt_gray fw400"
                                    href="javascript:void(0)"
                                    data-toggle="popover"
                                    data-content="Credibled request verified by the Referee"
                                  >
                                    {localState.action}
                                  </a>
                                ) : null}
                              </td>
                              <td>{localState.date}</td>
                              <td>{localState.osBrowser}</td>
                              <td>{localState.ipAddress}</td>
                              <td>{localState.locationISP}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              {/* LCD Ends */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateSummary;
