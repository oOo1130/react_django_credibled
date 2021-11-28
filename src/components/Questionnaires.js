import React, { useState, useEffect } from "react";
import { API } from "../Api";
import logo from "../assets/img/credibled_logo_205x45.png";
import { useCookies } from "react-cookie";
import Tooltip from "@material-ui/core/Tooltip";
import InfoIcon from "@material-ui/icons/Info";

function Questionnaires() {
  const [token, setToken, deleteToken] = useCookies(["credtoken"]);
  const [loginUser, setLoginUser] = useState("");
  const [questionnaires, setQuestionnaires] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [archiveChkBox, setArchiveChkBox] = useState(0);
  localStorage.setItem("cred-tableIndex", 0);

  const handleIndex = (count) => {
    var count = localStorage.getItem("cred-tableIndex");
    localStorage.setItem("cred-tableIndex", parseInt(count) + 1);
    return localStorage.getItem("cred-tableIndex");
  };

  const handleArchive = (tbHash) => {
    API.updateUserTemplates({ tbHash, action: "archived" }).then((data) => {
      if (data.message == "success") {
        API.getUserTemplates({
          email: localStorage.getItem("creduser"),
          action: null,
        }).then((data) => {
          setTemplates(data);
        });
      }
    });
  };

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
    }

    if (localStorage.getItem("creduser-a")) {
      setLoginUser(localStorage.getItem("creduser-a"));
    }

    const sessionValidateInterval = setInterval(() => {
      if (getCookie("credtoken") == null) {
        signOutClicked();
        clearInterval(sessionValidateInterval);
        window.location.href = "/signin";
      }
    }, 60000);

    API.getQuestionnaires(token["credtoken"]).then((data) => {
      setQuestionnaires(data);
    });

    API.getUserTemplates({
      email: localStorage.getItem("creduser"),
      action: null,
    }).then((data) => {
      setTemplates(data);
    });
  }, [token]);

  const handleArchived = () => {
    if (document.getElementById("chkBoxArchived").checked) {
      setArchiveChkBox(1);
      setQuestionnaires([]);
      setTemplates([]);

      API.getUserTemplates({
        email: localStorage.getItem("creduser"),
        action: "archived",
      }).then((data) => {
        setTemplates(data);
      });
    } else {
      setArchiveChkBox(0);
      API.getQuestionnaires(token["credtoken"]).then((data) => {
        setQuestionnaires(data);
      });

      API.getUserTemplates({
        email: localStorage.getItem("creduser"),
        action: null,
      }).then((data) => {
        setTemplates(data);
      });
    }
  };

  return (
    <div className="wrapper">
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
            <li className="nav-item">
              <a className="nav-link" href="/">
                <i className="material-icons">dvr</i>
                <p>Requests</p>
              </a>
            </li>
            <li className="nav-item active">
              <a className="nav-link active1" href="/questionnaires">
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
      <div className="main-panel">
        <nav className="navbar navbar-expand navbar-transparent navbar-absolute fixed-top mobile_logo">
          <div className="container-fluid">
            <div className="navbar-wrapper">
              <div className="showonmobile" style={{ display: `none` }}>
                <a className="navbar-brand" href="index.html">
                  <img
                    src="assets/img/credibled_logo_205x45.png"
                    className="mob_logo"
                    alt="Credibled Logo"
                  />
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
                          <h3> Questionnaires </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 lrpad">
                <div className="card mt_zero pad_zero">
                  <div className="search-box">
                    <div className="row">
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
                      <div className="col-md-8 pt1 text-right nomobile">
                        <div className="form-check form-check-inline">
                          <label className="form-check-label">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="chkBoxArchived"
                              value={archiveChkBox}
                              onChange={handleArchived}
                            />
                            Archived
                            <span className="form-check-sign">
                              <span className="check"></span>
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <!--Mobile View Table starts here --> */}

                  <div
                    className="showonmobile mt3 lrpad"
                    style={{ display: "none" }}
                  >
                    <div className="row">
                      <table className="table">
                        <tr>
                          <td>
                            <div className="form-check form-check-m form-check-inline">
                              <label className="form-check-label">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="chkBoxArchived"
                                  value={archiveChkBox}
                                  onChange={handleArchived}
                                />
                                Archived
                                <span className="form-check-sign">
                                  <span className="check"></span>
                                </span>
                              </label>
                            </div>
                          </td>
                        </tr>
                      </table>
                      {questionnaires.map((localState, index) => (
                        <table className="table mobile-data-table">
                          <tr>
                            {" "}
                            <td className="w30">Title</td>
                            <td>
                              <a
                                href={
                                  "/questionnaires/" +
                                  localState.QuestionnaireHash
                                }
                              >
                                {localState.title}
                              </a>
                            </td>
                          </tr>
                          <tr>
                            {" "}
                            <td>Type</td>
                            <td>{localState.type}</td>
                          </tr>
                          <tr>
                            {" "}
                            <td>
                              Questions
                              <Tooltip
                                placement="top"
                                title="The total number of questions used in the questionnaire."
                              >
                                <InfoIcon
                                  style={{
                                    color: "#ED642A",
                                    cursor: "pointer",
                                  }}
                                />
                              </Tooltip>
                            </td>
                            <td>{localState.noOfQuestions}</td>
                          </tr>
                          <tr>
                            {" "}
                            <td>Times Used</td>
                            <td>{localState.timesUsed}</td>
                          </tr>
                          <tr>
                            {" "}
                            <td>Actions</td>
                            <td>-</td>
                          </tr>
                        </table>
                      ))}
                      {templates.map((localState) => (
                        <table className="table mobile-data-table">
                          <tr>
                            {" "}
                            <td className="w30">Title</td>
                            <td>
                              <a
                                href={
                                  "/questionnaires/" +
                                  localState.TempBuilderHash
                                }
                              >
                                {localState.title}
                              </a>
                            </td>
                          </tr>
                          <tr>
                            {" "}
                            <td>Type</td>
                            <td>{localState.type}</td>
                          </tr>
                          <tr>
                            {" "}
                            <td>
                              Questions
                              <Tooltip
                                placement="top"
                                title="The total number of questions used in the questionnaire."
                              >
                                <InfoIcon
                                  style={{
                                    color: "#ED642A",
                                    cursor: "pointer",
                                  }}
                                />
                              </Tooltip>
                            </td>
                            <td>{localState.noOfQuestions}</td>
                          </tr>
                          <tr>
                            {" "}
                            <td>Times Used</td>
                            <td>{localState.timesUsed}</td>
                          </tr>
                          <tr>
                            {" "}
                            <td>Actions</td>
                            <td>
                              {localState.action == "archived" ? (
                                "Archived"
                              ) : (
                                <a
                                  href="javascript:void(0)"
                                  onClick={() =>
                                    handleArchive(localState.TempBuilderHash)
                                  }
                                >
                                  <i className="fa fa-file-archive-o"></i>
                                  &nbsp;&nbsp;Archive
                                </a>
                              )}
                            </td>
                          </tr>
                        </table>
                      ))}
                    </div>
                  </div>

                  {/* <!--Mobile View Table starts here --> */}

                  <div className="table-responsive hideonmobile">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th className="text-center">#</th>
                          <th className="sorting">Title</th>
                          <th className="sorting">Type</th>
                          <th className="sorting">
                            Questions
                            <Tooltip
                              placement="top"
                              title="The total number of questions used in the questionnaire."
                            >
                              <InfoIcon
                                style={{
                                  color: "#ED642A",
                                  cursor: "pointer",
                                }}
                              />
                            </Tooltip>
                          </th>
                          <th className="sorting">Times Used</th>
                          <th className="sorting">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {questionnaires.map((localState) => (
                          <tr>
                            <td className="text-center">{handleIndex()}</td>
                            <td>
                              <a
                                href={
                                  "/questionnaires/" +
                                  localState.QuestionnaireHash
                                }
                              >
                                {localState.title}
                              </a>
                            </td>
                            <td>{localState.type}</td>
                            <td>{localState.noOfQuestions}</td>
                            <td>{localState.timesUsed}</td>
                            <td>-</td>
                          </tr>
                        ))}
                        {templates.map((localState) => (
                          <tr>
                            <td className="text-center">{handleIndex()}</td>
                            <td>
                              <a
                                href={
                                  "/questionnaires/" +
                                  localState.TempBuilderHash
                                }
                              >
                                {localState.title}
                              </a>
                            </td>
                            <td>{localState.type}</td>
                            <td>{localState.noOfQuestions}</td>
                            <td>{localState.timesUsed}</td>
                            <td>
                              {localState.action == "archived" ? (
                                "Archived"
                              ) : (
                                <a
                                  href="javascript:void(0)"
                                  onClick={() =>
                                    handleArchive(localState.TempBuilderHash)
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
      <footer className="footer showonmobile" style={{ display: `none` }}>
        <nav className="col-md-12">
          <ul className="mobile_footer">
            <li className="nav-item">
              <a className="nav-link" href="/">
                <i className="material-icons-outlined">dvr</i>
                <p>Requests</p>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link mobile-active" href="/new-request">
                <i className="material-icons-outlined">post_add</i>
                <p>New Request</p>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/questionnaires">
                <i className="material-icons-outlined">assignment</i>
                <p>Questionnaires</p>
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="footermore"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="material-icons-outlined">more_vert</i>
                <p>More</p>
                <div className="dropdown-menu" aria-labelledby="footermore">
                  <a className="dropdown-item" href="/buy-credit">
                    Buy Credit
                  </a>
                  <a
                    className="dropdown-item"
                    href="/template-builder"
                    target="_new"
                  >
                    Template Builder
                  </a>
                  <a className="dropdown-item" href="/help">
                    Help & Training
                  </a>
                  <a className="dropdown-item" href="/settings">
                    Settings
                  </a>
                </div>
              </a>
            </li>
          </ul>
        </nav>
      </footer>
    </div>
  );
}

export default Questionnaires;
