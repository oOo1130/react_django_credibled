import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import logo from "../assets/img/credibled_logo_205x45.png";
import { API } from "../Api";
import ThumbDownAltOutlinedIcon from "@material-ui/icons/ThumbDownAltOutlined";
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";

function Requests() {
  const [token, setToken, deleteToken] = useCookies(["credtoken"]);
  const [loginUser, setLoginUser] = useState("");
  const [requestedcount, setRequestedCount] = useState("");
  const [inprogresscount, setInprogressCount] = useState("");
  const [criteriacount, setCriteriaCount] = useState("");
  const [archivedcount, setArchivedCount] = useState("");
  const [candidateData, setCandidateData] = useState([]);
  const [mobileTabStyle, setMobileTabStyle] = useState("");
  const [mobileFilterRequest, setMobileFilterRequest] = useState("");

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
    localStorage.removeItem("creduser");
    localStorage.removeItem("creduser-a");
    API.logout(token["credtoken"])
      .then((resp) => console.log(resp.message))
      .catch((error) => console.log(error));
    deleteToken(["credtoken"]);
  };

  useEffect(() => {
    if (!token["credtoken"]) {
      window.location.href = "/signin";
    } else {
      setToken("credtoken", token["credtoken"], {
        path: "/",
        maxAge: process.env.REACT_APP_SESSION_MAX_AGE,
      });
    }

    const username = localStorage.getItem("creduser");

    if (localStorage.getItem("creduser-a")) {
      setLoginUser(localStorage.getItem("creduser-a"));
    } else {
      API.getCurrentUserData(username, token["credtoken"])
        .then((resp) => {
          setLoginUser(resp[0].firstName);
          localStorage.setItem("creduser-a", resp[0].firstName);
        })
        .catch((error) => console.log(error));
    }

    API.getSummaryCount(username, token["credtoken"])
      .then((resp) => {
        setRequestedCount(resp.requested);
        setInprogressCount(resp.inprogress);
        setCriteriaCount(resp.criteriamet);
        setArchivedCount(resp.archived);
      })
      .catch((error) => console.log(error));

    API.getCandidateData(username, "requested", token["credtoken"])
      .then((data) => {
        data.sort().reverse();
        setCandidateData(data);
        setMobileTabStyle("table mobile-data-table br5_primary");
        setMobileFilterRequest("Last 30 days");
      })
      .catch((error) => console.log(error));

    const sessionValidateInterval = setInterval(() => {
      if (getCookie("credtoken") == null) {
        signOutClicked();
        clearInterval(sessionValidateInterval);
        window.location.href = "/signin";
      }
    }, 60000);
  }, [token]);

  useEffect(() => {
    for (let i = 0; i < candidateData.length; i++) {
      API.getJobHistory(candidateData[i].candidateHash).then((res) => {
        for (let j = 0; j < res.length; j++) {
          let refereeResp = res[j].refereeResponse;
          let refereeName = res[j].refereeFirstName + res[j].refereeLastName;
          if (refereeResp == "completed") {
            refereeName =
              refereeName + "_upIcon_" + candidateData[i].candidateHash;
            var x = document.getElementById(refereeName);
            x.style.display = "block";
          } else if (refereeResp == "declined") {
            refereeName =
              refereeName + "_downIcon_" + candidateData[i].candidateHash;
            var x = document.getElementById(refereeName);
            x.style.display = "block";
          }
        }
      });
    }
  }, [candidateData]);

  const formatDate = (dateString) => {
    if (dateString) {
      let d = new Date(dateString);
      let year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
      let month = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
      let day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
      return month + " " + day + ", " + year;
    }
  };

  const formatFilterDate = (dateString) => {
    if (dateString) {
      let d = new Date(dateString);
      let year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
      let month = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d);
      let day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
      return year + "-" + month + "-" + day;
    }
  };

  const displayRequests = (flag) => {
    const username = localStorage.getItem("creduser");
    API.getCandidateData(username, flag, token["credtoken"])
      .then((data) => {
        data.sort().reverse();
        setCandidateData(data);
        if (flag == "inprogress") {
          setMobileTabStyle("table mobile-data-table br5_secondary");
        } else if (flag == "criteriamet") {
          setMobileTabStyle("table mobile-data-table br5_trisary");
        } else if (flag == "archived") {
          setMobileTabStyle("table mobile-data-table br5_gray");
        } else {
          setMobileTabStyle("table mobile-data-table br5_primary");
        }
      })
      .catch((error) => console.log(error));
  };

  const displayFilteredRequests = (days, text) => {
    const username = localStorage.getItem("creduser");
    let d = new Date();
    d.setDate(d.getDate() - days);
    console.log(formatFilterDate(d));
    API.filterRequests(
      { recruiter: username, startDate: formatFilterDate(d) },
      token["credtoken"]
    )
      .then((data) => {
        data.sort().reverse();
        setCandidateData(data);
        setMobileFilterRequest(text);
      })
      .catch((error) => console.log(error));
  };

  const updateArchive = (candidateHash) => {
    API.updateRequestResponse({
      candidateHash: candidateHash,
      response: "archived",
    })
      .then((data) => {
        if (data.message == "success") {
          window.location.reload();
        }
      })
      .catch((error) => console.log(error));
  };

  const handleRefereeIcon = (refereeNames, candidateHash) => {
    var refereeArray = refereeNames.split(", ");
    var html_tag;
    for (let i = 0; i < refereeArray.length; i++) {
      let downIcon_Id =
        refereeArray[i].replace(/ /g, "") + "_downIcon_" + candidateHash;
      let upIcon_Id =
        refereeArray[i].replace(/ /g, "") + "_upIcon_" + candidateHash;
      html_tag = (
        <span>
          {html_tag}{" "}
          <span
            style={{
              // position: "absolute",
              display: "block",
            }}
          >
            <ThumbDownAltOutlinedIcon
              id={downIcon_Id}
              style={{
                color: "#ED642A",
                cursor: "pointer",
                fontSize: "1.1em",
                display: "none",
              }}
            />
            <ThumbUpAltOutlinedIcon
              id={upIcon_Id}
              style={{
                cursor: "pointer",
                color: "#1396ed",
                fontSize: "1.1em",
                display: "none",
              }}
            />{" "}
            {refereeArray[i]}
            {" | "}
          </span>
        </span>
      );
    }
    // console.log(html_tag);
    return html_tag;
  };

  return (
    <div>
      {token["credtoken"] ? (
        <div
          className="sidebar"
          data-color="purple"
          data-background-color="white"
        >
          <div className="logo text-center">
            <a className="navbar-brand" href="/">
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
              <li className="nav-item active">
                <a className="nav-link active1" href="/">
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
                <a className="nav-link" href="/template-builder" target="_new">
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
              {/* <!-- your sidebar here --> */}
            </ul>
            <div
              onClick="javascript:window.location.href='credibled_buycredits.html'"
              className="tile_side"
            >
              <label className="h4">
                Credits&nbsp;
                <a href="/buy-credits" className="fw300sm">
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
                <img src="assets/img/ref-img.png" width="100%" />
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
                  <a href="#">Read more</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {token["credtoken"] ? (
        <div className="main-panel">
          {/* <!-- Navbar --> */}
          <nav className="navbar navbar-expand navbar-transparent navbar-absolute fixed-top mobile_logo">
            <div className="container-fluid">
              <div className="navbar-wrapper">
                <div className="showonmobile" style={{ display: `none` }}>
                  <a className="navbar-brand" href="index.html">
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
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick="md.showNotification1('bottom','right')"
                      >
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
                  {/* <!-- your navbar here --> */}
                </ul>
              </div>
            </div>
          </nav>
          {/* <!-- End Navbar --> */}

          <div className="content">
            <div className="container-fluid">
              <div className="card-plain hideonmobile">
                <div className="card-body ">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-3 col-sm-6 col-6">
                          <a onClick={() => displayRequests("requested")}>
                            <div className="tile">
                              <label className="h4">Requested</label>
                              <div className="h1 d-flex justify-content-between">
                                <span className="text-secondary material-icons-outlined">
                                  forward_to_inbox
                                </span>
                                <label>{requestedcount}</label>
                              </div>
                            </div>
                          </a>
                        </div>
                        <div className="col-md-3 col-sm-6 col-6">
                          <a onClick={() => displayRequests("inprogress")}>
                            <div className="tile">
                              <label className="h4">In Progress</label>
                              <div className="h1 d-flex justify-content-between">
                                <span className="text-secondary material-icons-outlined">
                                  watch_later
                                </span>
                                <label>{inprogresscount}</label>
                              </div>
                            </div>
                          </a>
                        </div>
                        <div className="col-md-3 col-sm-6 col-6">
                          <a onClick={() => displayRequests("criteriamet")}>
                            <div className="tile">
                              <label className="h4">Completed</label>
                              <div className="h1 d-flex justify-content-between">
                                <span className="text-secondary material-icons-outlined">
                                  done_outline
                                </span>
                                <label>{criteriacount}</label>
                              </div>
                            </div>
                          </a>
                        </div>
                        <div className="col-md-3 col-sm-6 col-6">
                          <a onClick={() => displayRequests("archived")}>
                            <div className="tile">
                              <label className="h4">Archived</label>
                              <div className="h1 d-flex justify-content-between">
                                <span className="text-secondary material-icons-outlined">
                                  inventory_2
                                </span>
                                <label>{archivedcount}</label>
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="card mt_zero mpad2 pad_zero">
                    <div className="search-box">
                      <div className="col-md-4">
                        <form className="navbar-form">
                          <div className="input-group no-border">
                            <i className="material-icons sr_icon">search</i>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search..."
                            />
                          </div>
                        </form>
                      </div>
                    </div>

                    {/* Mobile filters starts here */}

                    <div
                      className="card-plain showonmobile mb-1"
                      style={{ display: `none` }}
                    >
                      <div className="card-body ">
                        <div className="row">
                          <div className="col-md-12 pt2 lrpad2">
                            <div className="row">
                              <div className="col-6 filter_pad">
                                <a onClick={() => displayRequests("requested")}>
                                  <button className="btn mbtn100 btn-outline-primary">
                                    Requests{" "}
                                    <span className="badge mbadge badge-pill badge-primary">
                                      {requestedcount}
                                    </span>
                                    <span className="text-secondary fleft material-icons-outlined">
                                      forward_to_inbox
                                    </span>
                                    <div className="ripple-container"></div>
                                  </button>
                                </a>
                              </div>
                              <div className="col-6 filter_pad">
                                <a
                                  onClick={() => displayRequests("inprogress")}
                                >
                                  <button className="btn mbtn100 btn-outline-primary">
                                    In Progress{" "}
                                    <span className="badge mbadge badge-pill badge-secondary">
                                      {inprogresscount}
                                    </span>
                                    <span className="text-secondary fleft material-icons-outlined">
                                      watch_later
                                    </span>
                                    <div className="ripple-container"></div>
                                  </button>
                                </a>
                              </div>
                              <div className="col-6 filter_pad">
                                <a
                                  onClick={() => displayRequests("criteriamet")}
                                >
                                  <button className="btn mbtn100 btn-outline-primary">
                                    Completed{" "}
                                    <span className="badge mbadge badge-pill badge-trisary">
                                      {criteriacount}
                                    </span>
                                    <span className="text-secondary fleft material-icons-outlined">
                                      done_outline
                                    </span>
                                    <div className="ripple-container"></div>
                                  </button>
                                </a>
                              </div>
                              <div className="col-6 filter_pad">
                                <a onClick={() => displayRequests("archived")}>
                                  <button className="btn mbtn100 btn-outline-primary">
                                    Archived{" "}
                                    <span className="badge mbadge badge-pill badge-gray">
                                      {archivedcount}
                                    </span>
                                    <span className="text-secondary fleft material-icons-outlined">
                                      inventory_2
                                    </span>
                                    <div className="ripple-container"></div>
                                  </button>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* <!--Mobile filters ends here -->                         */}

                    <div className="card-plain lrpad">
                      <div className="row">
                        <div className="col-md-6">
                          <h3> Requests</h3>
                        </div>
                        <div className="col-md-6 text-right">
                          <div className="btn-group setmobile">
                            <button
                              type="button"
                              className="btn btnsm btn-secondary"
                              onClick={() =>
                                displayFilteredRequests(30, "Last 30 days")
                              }
                            >
                              {mobileFilterRequest}
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
                              <a
                                className="dropdown-item"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  displayFilteredRequests(15, "Last 15 days")
                                }
                              >
                                last 15 days
                              </a>
                              <a
                                className="dropdown-item"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  displayFilteredRequests(30, "Last 1 month")
                                }
                              >
                                last 1 month
                              </a>
                              <a
                                className="dropdown-item"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  displayFilteredRequests(90, "Last 3 months")
                                }
                              >
                                last 3 months
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* <!--Mobile View Table starts here --> */}

                    <div className="showonmobile" style={{ display: `none` }}>
                      {candidateData.map((localState) => (
                        <table className={mobileTabStyle} key={localState.id}>
                          <tr>
                            {" "}
                            <td>Requested</td>
                            <td>
                              {formatDate(localState.requestDate)} by{" "}
                              {localState.recruiterName}
                            </td>
                          </tr>
                          <tr></tr>
                          <tr>
                            {" "}
                            <td>Candidate</td>
                            <td>
                              <a
                                href={
                                  "/candidate/summary/" +
                                  localState.candidateHash
                                }
                              >
                                {localState.firstName} {localState.lasttName}
                              </a>
                            </td>
                          </tr>
                          <tr>
                            {" "}
                            <td>Email</td>
                            <td>{localState.email}</td>
                          </tr>
                          <tr>
                            {" "}
                            <td>Job Title</td>
                            <td>{localState.role}</td>
                          </tr>
                          <tr>
                            {" "}
                            <td>References</td>
                            <td>
                              {!!localState.references
                                ? localState.references
                                : "NA"}{" "}
                              <div className="more">
                                <a id="showmore" href="#">
                                  <i className="material-icons-outlined">
                                    more_horiz
                                  </i>
                                </a>
                              </div>
                            </td>
                          </tr>
                          {/* <tr id="showref" style={{ display: `none` }}>
                            {" "}
                            <td>&nbsp;</td>
                            <td>Referee 3</td>
                          </tr> */}
                          <tr>
                            {" "}
                            <td>Action</td>
                            <td>
                              <a
                                href="javascript:void(0)"
                                onClick={() =>
                                  updateArchive(localState.candidateHash)
                                }
                              >
                                <i className="fa fa-file-archive-o"></i>
                                &nbsp;&nbsp;Archive
                              </a>
                            </td>{" "}
                          </tr>
                        </table>
                      ))}
                      <br />
                    </div>

                    <div className="table-responsive hideonmobile">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th className="text-center">#</th>
                            <th className="sorting">Requested</th>
                            <th className="sorting">Candidate</th>
                            <th className="sorting">Email</th>
                            <th className="sorting">Job Title</th>
                            <th className="sorting">References</th>
                            <th className="sorting">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {candidateData.map((localState, index) => (
                            <tr key={localState.id}>
                              <td className="text-center">{index + 1}</td>
                              <td>
                                {formatDate(localState.requestDate)} by{" "}
                                {localState.recruiterName}
                              </td>
                              <td>
                                <a
                                  href={
                                    "/candidate/summary/" +
                                    localState.candidateHash
                                  }
                                >
                                  {localState.firstName} {localState.lastName}
                                </a>
                              </td>
                              <td>{localState.email}</td>
                              <td>{localState.role}</td>
                              <td>
                                {/* <ThumbDownAltOutlinedIcon
                                  style={{
                                    color: "#ED642A",
                                    cursor: "pointer",
                                    fontSize: "1.1em",
                                  }}
                                />
                                <ThumbUpAltOutlinedIcon
                                  style={{
                                    cursor: "pointer",
                                    color: "#1396ed",
                                    fontSize: "1.1em",
                                  }}
                                /> */}
                                {!!localState.references
                                  ? handleRefereeIcon(
                                      localState.references,
                                      localState.candidateHash
                                    )
                                  : "NA"}
                              </td>
                              <td>
                                {localState.response == "archived" ? (
                                  "Archived"
                                ) : (
                                  <a
                                    href="javascript:void(0)"
                                    onClick={() =>
                                      updateArchive(localState.candidateHash)
                                    }
                                  >
                                    <i className="fa fa-file-archive-o"></i>
                                    &nbsp;&nbsp;Archive
                                  </a>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {token["credtoken"] ? (
        <footer class="footer showonmobile" style={{ display: `none` }}>
          <nav class="col-md-12">
            <ul class="mobile_footer">
              <li class="nav-item">
                <a class="nav-link mobile-active" href="/">
                  <i class="material-icons-outlined">dvr</i>
                  <p>Requests</p>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/new-request">
                  <i class="material-icons-outlined">post_add</i>
                  <p>New Request</p>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/questionnaires">
                  <i class="material-icons-outlined">assignment</i>
                  <p>Questionnaires</p>
                </a>
              </li>
              <li class="nav-item dropdown">
                <a
                  class="nav-link"
                  href="#"
                  id="footermore"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i class="material-icons-outlined">more_vert</i>
                  <p>More</p>
                  <div class="dropdown-menu" aria-labelledby="footermore">
                    <a class="dropdown-item" href="/buy-credits">
                      Buy Credit
                    </a>
                    <a
                      class="dropdown-item"
                      href="/template-builder"
                      target="_new"
                    >
                      Template Builder
                    </a>
                    <a class="dropdown-item" href="/help">
                      Help & Training
                    </a>
                    <a class="dropdown-item" href="/settings">
                      Settings
                    </a>
                  </div>
                </a>
              </li>
            </ul>
          </nav>
        </footer>
      ) : null}
    </div>
  );
}

export default Requests;
