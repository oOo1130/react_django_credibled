import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useCookies } from "react-cookie";
import logo from "../assets/img/credibled_logo_205x45.png";
import { API } from "../Api";
import { withStyles } from "@material-ui/styles";
import Slider from "@material-ui/core/Slider";

function QuestionnaireData() {
  const params = useParams();
  const [token, setToken, deleteToken] = useCookies(["credtoken"]);
  const [loginUser, setLoginUser] = useState("");

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

    const sessionValidateInterval = setInterval(() => {
      if (getCookie("credtoken") == null) {
        signOutClicked();
        clearInterval(sessionValidateInterval);
        window.location.href = "/signin";
      }
    }, 60000);
  }, [token]);

  const PrettoSlider = withStyles({
    root: {
      color: "#250c77",
      height: 8,
      width: "80%",
      position: "absolute",
    },
    thumb: {
      height: 24,
      width: 24,
      backgroundColor: "#ef7441",
      // border: "2px solid currentColor",
      marginTop: -8,
      marginLeft: -12,
      "&:focus, &:hover, &$active": {
        boxShadow: "inherit",
      },
    },
    active: {},
    valueLabel: {
      left: "calc(-50% + 4px)",
    },
    track: {
      height: 8,
      borderRadius: 4,
    },
    rail: {
      height: 8,
      borderRadius: 4,
    },
  })(Slider);

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
              <li className="nav-item active">
                <a className="nav-link active1" href="/questionnaires">
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
              {/* <!-- your sidebar here --> */}
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
                <div className="showonmobile" style={{ display: "none" }}>
                  <a className="navbar-brand" href="/signin">
                    <img src={logo} className="mob_logo" alt="Credibled Logo" />
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
                  {/* <!-- your navbar here --> */}
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
                        <div className="col-md-12">
                          <h3
                            style={{
                              fontWeight: "400",
                              fontSize: "1.2rem",
                              color: "#ed642b",
                            }}
                          >
                            Questionnaire - Intermediate (Management Level)
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="model_scroll1">
                    <ul id="questionnaire">
                      <li>
                        <div>
                          <table class="quest">
                            <tr>
                              <td>1.</td>
                              <td class="question">
                                How long did you work together (
                                <i>approx. dates</i>)? What was your working
                                relationship?
                              </td>
                            </tr>
                            <tr>
                              <td>2.</td>
                              <td class="question">
                                What were the main duties of his/her job?
                              </td>
                            </tr>
                            <tr>
                              <td>3.</td>
                              <td class="question">
                                What is your overall appraisal of his/her work?
                              </td>
                            </tr>
                            <tr>
                              <td>4.</td>
                              <td class="question">
                                What are his/her strong points? What are his/her
                                technical strengths? If you can, please give
                                examples of how these strengths were
                                demonstrated.
                              </td>
                            </tr>
                            <tr>
                              <td>5.</td>
                              <td class="question">
                                How does he/she perform under pressure?
                              </td>
                            </tr>
                            <tr>
                              <td>6.</td>
                              <td class="question">
                                How does he/she get along with other people? (
                                <i>supervisors, peers, and subordinates</i>).
                              </td>
                            </tr>
                            <tr>
                              <td>7.</td>
                              <td class="question">
                                How are his/her communication skills?
                              </td>
                            </tr>
                            <tr>
                              <td>8.</td>
                              <td class="question">
                                Please comment on each of the following:
                                <h6 class="pt1">
                                  1-<span> Poor</span>&nbsp; 2-
                                  <span> Average</span>&nbsp; 3-
                                  <span> Fair</span> &nbsp; 4-
                                  <span> Good </span> &nbsp; 5-
                                  <span> Excellent</span>{" "}
                                </h6>
                                <ul id="rating">
                                  <li>
                                    <div class="row pmzero">
                                      <div class="col-md-6 pt2">Attendance</div>
                                      <div class="col-md-6">
                                        <div class="range-slider">
                                          <span
                                            class="range-slider__value"
                                            style={{ marginRight: "20px" }}
                                          >
                                            0
                                          </span>
                                          <PrettoSlider
                                            valueLabelDisplay="auto"
                                            aria-label="pretto slider"
                                            step={1}
                                            marks
                                            min={0}
                                            max={5}
                                            value={0}
                                            defaultValue={0}
                                            style={{
                                              width: "75%",
                                              position: "absolute",
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </li>

                                  <li>
                                    <div class="row pmzero">
                                      <div class="col-md-6 pt2">
                                        Dependability & Overall Attitude
                                      </div>
                                      <div class="col-md-6">
                                        <div class="range-slider">
                                          <span
                                            class="range-slider__value"
                                            style={{ marginRight: "20px" }}
                                          >
                                            0
                                          </span>
                                          <PrettoSlider
                                            valueLabelDisplay="auto"
                                            aria-label="pretto slider"
                                            step={1}
                                            marks
                                            min={0}
                                            max={5}
                                            defaultValue={0}
                                            style={{
                                              width: "75%",
                                              position: "absolute",
                                            }}
                                            value={0}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </li>

                                  <li>
                                    <div class="row pmzero">
                                      <div class="col-md-6 pt2">
                                        Ability to take on Responsibility
                                      </div>
                                      <div class="col-md-6">
                                        <div class="range-slider">
                                          <span
                                            class="range-slider__value"
                                            style={{ marginRight: "20px" }}
                                          >
                                            0
                                          </span>
                                          <PrettoSlider
                                            valueLabelDisplay="auto"
                                            aria-label="pretto slider"
                                            step={1}
                                            marks
                                            min={0}
                                            max={5}
                                            defaultValue={0}
                                            style={{
                                              width: "75%",
                                              position: "absolute",
                                            }}
                                            value={0}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </li>

                                  <li>
                                    <div class="row pmzero">
                                      <div class="col-md-6 pt2">
                                        Potential for advancement
                                      </div>
                                      <div class="col-md-6">
                                        <div class="range-slider">
                                          <span
                                            class="range-slider__value"
                                            style={{ marginRight: "20px" }}
                                          >
                                            0
                                          </span>
                                          <PrettoSlider
                                            valueLabelDisplay="auto"
                                            aria-label="pretto slider"
                                            step={1}
                                            marks
                                            min={0}
                                            max={5}
                                            defaultValue={0}
                                            style={{
                                              width: "75%",
                                              position: "absolute",
                                            }}
                                            value={0}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </li>

                                  <li>
                                    <div class="row pmzero">
                                      <div class="col-md-6 pt2">
                                        Degree of Supervision needed
                                      </div>
                                      <div class="col-md-6">
                                        <div class="range-slider">
                                          <span
                                            class="range-slider__value"
                                            style={{ marginRight: "20px" }}
                                          >
                                            0
                                          </span>
                                          <PrettoSlider
                                            valueLabelDisplay="auto"
                                            aria-label="pretto slider"
                                            step={1}
                                            marks
                                            min={0}
                                            max={5}
                                            defaultValue={0}
                                            style={{
                                              width: "75%",
                                              position: "absolute",
                                            }}
                                            value={0}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </li>

                                  <li>
                                    <div class="row pmzero">
                                      <div class="col-md-6 pt2">
                                        Attention to detail
                                      </div>
                                      <div class="col-md-6">
                                        <div class="range-slider">
                                          <span
                                            class="range-slider__value"
                                            style={{ marginRight: "20px" }}
                                          >
                                            0
                                          </span>
                                          <PrettoSlider
                                            valueLabelDisplay="auto"
                                            aria-label="pretto slider"
                                            step={1}
                                            marks
                                            min={0}
                                            max={5}
                                            defaultValue={0}
                                            style={{
                                              width: "75%",
                                              position: "absolute",
                                            }}
                                            value={0}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </li>

                                  <li>
                                    <div class="row pmzero">
                                      <div class="col-md-6 pt2">
                                        Ability to make decisions
                                      </div>
                                      <div class="col-md-6">
                                        <div class="range-slider">
                                          <span
                                            class="range-slider__value"
                                            style={{ marginRight: "20px" }}
                                          >
                                            0
                                          </span>
                                          <PrettoSlider
                                            valueLabelDisplay="auto"
                                            aria-label="pretto slider"
                                            step={1}
                                            marks
                                            min={0}
                                            max={5}
                                            defaultValue={0}
                                            style={{
                                              width: "75%",
                                              position: "absolute",
                                            }}
                                            value={0}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </li>

                                  <li>
                                    <div class="row pmzero">
                                      <div class="col-md-6 pt2">
                                        Leadership/Management ability and style
                                      </div>
                                      <div class="col-md-6">
                                        <div class="range-slider">
                                          <span
                                            class="range-slider__value"
                                            style={{ marginRight: "20px" }}
                                          >
                                            0
                                          </span>
                                          <PrettoSlider
                                            valueLabelDisplay="auto"
                                            aria-label="pretto slider"
                                            step={1}
                                            marks
                                            min={0}
                                            max={5}
                                            defaultValue={0}
                                            style={{
                                              width: "75%",
                                              position: "absolute",
                                            }}
                                            value={0}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </li>

                                  <li>
                                    <div class="row pmzero">
                                      <div class="col-md-6 pt2">
                                        Problem solving and strategic thinking
                                      </div>
                                      <div class="col-md-6">
                                        <div class="range-slider">
                                          <span
                                            class="range-slider__value"
                                            style={{ marginRight: "20px" }}
                                          >
                                            0
                                          </span>
                                          <PrettoSlider
                                            valueLabelDisplay="auto"
                                            aria-label="pretto slider"
                                            step={1}
                                            min={0}
                                            max={5}
                                            defaultValue={0}
                                            style={{
                                              width: "75%",
                                              position: "absolute",
                                            }}
                                            value={0}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              </td>
                            </tr>
                            <tr>
                              <td>9.</td>
                              <td class="question">
                                Why did he/she leave your company? Would you
                                re-employ?
                              </td>
                            </tr>
                            <tr>
                              <td>10.</td>
                              <td class="question">
                                Is there anything else of significance we should
                                know? (
                                <i>
                                  Any concerns or compliments or general
                                  comments
                                </i>
                                ?)
                              </td>
                            </tr>
                          </table>
                        </div>
                      </li>
                    </ul>
                    <br />
                    <br />
                  </div>
                </div>
              </div>
              <footer
                className="footer showonmobile"
                style={{ display: "none" }}
              >
                <nav className="col-md-12">
                  <ul className="mobile_footer">
                    <li className="nav-item">
                      <a
                        className="nav-link mobile-active"
                        href="credibled_requests.html"
                      >
                        <i className="material-icons-outlined">dvr</i>
                        <p>Requests</p>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="credibled_newrequest.html">
                        <i className="material-icons-outlined">post_add</i>
                        <p>New Request</p>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="credibled_questionnaire.html"
                      >
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
                        <div
                          className="dropdown-menu"
                          aria-labelledby="footermore"
                        >
                          <a
                            className="dropdown-item"
                            href="credibled_buycredits.html"
                          >
                            Buy Credit
                          </a>
                          <a
                            className="dropdown-item"
                            href="credibled_template_builder.html"
                          >
                            Template Builder
                          </a>
                          <a
                            className="dropdown-item"
                            href="credibled_help.html"
                          >
                            Help & Training
                          </a>
                          <a
                            className="dropdown-item"
                            href="credibled_settings.html"
                          >
                            Settings
                          </a>
                        </div>
                      </a>
                    </li>
                  </ul>
                </nav>
                {/* <!-- your footer here --> */}
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionnaireData;
