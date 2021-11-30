import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router";
import { useCookies } from "react-cookie";
import Chip from "@material-ui/core/Chip";
import { API } from "../Api";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    color: "white",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  chip: {
    color: "white",
    margin: theme.spacing.unit / 2,
  },
}));

function TB_Homepage() {
  const params = useParams();
  const [token, setToken, deleteToken] = useCookies(["credtoken"]);
  const [loginUser, setLoginUser] = useState("");
  const [industry, setIndustry] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const classes = useStyles();

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
    // if (params.id) {
    if (!token["credtoken"]) {
      window.location.href = "/signin";
    } else {
      setToken("credtoken", token["credtoken"], {
        path: "/",
        maxAge: process.env.REACT_APP_SESSION_MAX_AGE,
      });
    }
    setLoginUser(localStorage.getItem("creduser-a"));
    // }

    const sessionValidateInterval = setInterval(() => {
      if (getCookie("credtoken") == null) {
        signOutClicked();
        clearInterval(sessionValidateInterval);
        window.location.href = "/signin";
      }
    }, 60000);
  }, [token]);

  const handleBuildTemplate = () => {
    if (industry == "") {
      var x = document.getElementById("industryError");
      x.style.display = "block";
      return false;
    }
    if (jobTitle == "") {
      var x = document.getElementById("jobTitleError");
      x.style.display = "block";
      return false;
    }
    localStorage.setItem("cred-tb-industry", industry);
    localStorage.setItem("cred-tb-title", jobTitle);
    window.location.href = "/template-builder/home";
  };

  const handleClick = (data) => {
    var x = document.getElementById(data);
    x.style.backgroundColor = "#402693";
    // alert("You clicked the Chip.");
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
        <div className="main-panel w100">
          <div className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-10 offset-md-1">
                  <nav className="navbar navbar-expand navbar-transparent navbar-absolute fixed-top mobile_logo">
                    <div className="container-fluid">
                      <div className="logo">
                        <a className="navbar-brand" href="/">
                          <img
                            src="assets/img/credibled_logo_205x45.png"
                            className="mob_logo"
                            alt="Credibled Logo"
                          />
                        </a>
                        <div className="nomobile fl-right">
                          <h5>Template Builder</h5>
                        </div>
                      </div>

                      <div className="text-right">
                        <ul className="navbar-nav mobile_nav">
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
                              <span className="text-secondary">
                                {loginUser}
                              </span>
                            </a>
                            <div
                              className="dropdown-menu"
                              aria-labelledby="navbarDropdownMenuLink"
                            >
                              <a
                                className="dropdown-item"
                                href="terms"
                                target="_blank"
                              >
                                Terms of use
                              </a>
                              <a
                                className="dropdown-item"
                                href="privacy-policy"
                                target="_blank"
                              >
                                Privacy Policy
                              </a>
                              <a
                                className="dropdown-item"
                                href="javascript:void(0)"
                                onClick={signOutClicked}
                              >
                                Sign out
                              </a>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </nav>

                  <div className="card-plain mt3">
                    <div className="showonmobile" style={{ display: `none` }}>
                      <h2 className="text-secondary">Template Builder</h2>
                    </div>

                    <div className="row">
                      <div className="col-md-12 pl2">
                        <h3 className="jh-title no-pt2 pt2">
                          Let's get started{" "}
                        </h3>

                        <h5 className="jh-subtitle">
                          Based on the Information you share about the role,
                          we'll craft your editable template.
                        </h5>

                        <div className="pt2">
                          <h4>
                            {" "}
                            What industry will the role be based in?{" "}
                            <span className="sup_char">
                              {" "}
                              <sup>*</sup>{" "}
                            </span>
                          </h4>

                          <div className="form-group pt1">
                            <select
                              className="form-control select-top"
                              value={industry}
                              onChange={(evt) => {
                                setIndustry(evt.target.value);
                                var x =
                                  document.getElementById("industryError");
                                x.style.display = "none";
                              }}
                            >
                              <option value="">Select industry</option>
                              <option>
                                Advertising, Media &amp; Entertainment
                              </option>
                              <option> Agriculture </option>
                              <option> Architecture </option>
                              <option>
                                Call Centre &amp; Customer Services
                              </option>
                              <option>
                                Construction &amp; Civil Engineering
                              </option>
                              <option>
                                Defence, Military &amp; Armed Forces
                              </option>
                              <option> Education </option>
                              <option> Energy </option>
                              <option> Engineering </option>
                              <option>Facilities Management</option>
                              <option>Finance, Accounting &amp; Banking</option>
                              <option>Food &amp; Hospitality</option>
                              <option>Government - Federal/Central </option>
                              <option> Government - Local </option>
                              <option> Government - State </option>
                              <option> Healthcare &amp; Medical </option>
                              <option> HR &amp; Recruitment </option>
                              <option> Information Technology </option>
                              <option> Insurance </option>
                              <option> Legal </option>
                              <option> Manufacturing </option>
                              <option> NFP - Charity </option>
                              <option> NFP - Non-Charity </option>
                              <option> Office &amp; Administration </option>
                              <option> Oil &amp; Gas </option>
                              <option> Other </option>
                              <option> Procurement </option>
                              <option> Professional Services </option>
                              <option> Property &amp; Real Estate </option>
                              <option> Resources &amp; Mining </option>
                              <option> Retail &amp; Consumer Products </option>
                              <option> Sales &amp; Marketing </option>
                              <option>
                                Science, Biotech &amp; Pharmaceuticals
                              </option>
                              <option> Telecommunications </option>
                              <option> Transport &amp; Logistics </option>
                              <option> Travel &amp; Tourism </option>
                              <option> Utilities </option>
                              <option> Wealth &amp; Investment </option>
                            </select>
                            <span className="fa fa-fw fa-angle-down field_icon eye"></span>
                            <div
                              className="notes"
                              id="industryError"
                              style={{ display: `none` }}
                            >
                              Industry is required
                            </div>
                          </div>

                          <div className="form-group bmd-form-group">
                            <h4>
                              {" "}
                              What is the job title?{" "}
                              <span className="sup_char">
                                {" "}
                                <sup>*</sup>{" "}
                              </span>{" "}
                            </h4>
                            <input
                              type="text"
                              value={jobTitle}
                              onChange={(evt) => {
                                setJobTitle(evt.target.value);
                                var x =
                                  document.getElementById("jobTitleError");
                                x.style.display = "none";
                              }}
                              className="form-control"
                            />
                            <div
                              className="notes"
                              id="jobTitleError"
                              style={{ display: `none` }}
                            >
                              Job Title is required
                            </div>
                          </div>

                          <div className="pt2">
                            <h5>
                              {" "}
                              Identify the key competencies that are important
                              for this role{" "}
                            </h5>
                            <span className="text-primary">
                              Choose 3 to 7 options from the list below
                            </span>

                            <div
                              className="chips__filter pt2"
                              // className={classes.root}
                            >
                              <Chip
                                id="chip_01"
                                label="Ability to Learn"
                                onClick={() => handleClick("chip_01")}
                                style={{
                                  color: "white",
                                  backgroundColor: "#aaaaaa",
                                  marginRight: "5px",
                                  marginBottom: "5px",
                                }}
                              />
                              <Chip
                                id="chip_02"
                                label="Attendance, Punctuality and Reliability"
                                onClick={() => handleClick("chip_02")}
                                style={{
                                  color: "white",
                                  backgroundColor: "#aaaaaa",
                                  marginRight: "5px",
                                  marginBottom: "5px",
                                }}
                              />
                              <Chip
                                id="chip_03"
                                label="Attention to Detail"
                                onClick={() => handleClick("chip_03")}
                                style={{
                                  color: "white",
                                  backgroundColor: "#aaaaaa",
                                  marginRight: "5px",
                                  marginBottom: "5px",
                                }}
                              />
                              <Chip
                                id="chip_04"
                                label="Computer Literacy"
                                onClick={() => handleClick("chip_04")}
                                style={{
                                  color: "white",
                                  backgroundColor: "#aaaaaa",
                                  marginRight: "5px",
                                  marginBottom: "5px",
                                }}
                              />
                              <Chip
                                id="chip_05"
                                label="Conflict Management"
                                onClick={() => handleClick("chip_05")}
                                style={{
                                  color: "white",
                                  backgroundColor: "#aaaaaa",
                                  marginRight: "5px",
                                  marginBottom: "5px",
                                }}
                              />
                              <Chip
                                id="chip_06"
                                label="Analytical Skills"
                                onClick={() => handleClick("chip_06")}
                                style={{
                                  color: "white",
                                  backgroundColor: "#aaaaaa",
                                  marginRight: "5px",
                                  marginBottom: "5px",
                                }}
                              />
                              <Chip
                                id="chip_07"
                                label="Customer Service"
                                onClick={() => handleClick("chip_07")}
                                style={{
                                  color: "white",
                                  backgroundColor: "#aaaaaa",
                                  marginRight: "5px",
                                  marginBottom: "5px",
                                }}
                              />
                              <Chip
                                id="chip_08"
                                label="Conduct and Behaviour"
                                onClick={() => handleClick("chip_08")}
                                style={{
                                  color: "white",
                                  backgroundColor: "#aaaaaa",
                                  marginRight: "5px",
                                  marginBottom: "5px",
                                }}
                              />
                              <Chip
                                id="chip_09"
                                label="Adaptability and Flexibility"
                                onClick={() => handleClick("chip_09")}
                                style={{
                                  color: "white",
                                  backgroundColor: "#aaaaaa",
                                  marginRight: "5px",
                                  marginBottom: "5px",
                                }}
                              />
                              <Chip
                                id="chip_10"
                                label="Targets and KPIs"
                                onClick={() => handleClick("chip_10")}
                                style={{
                                  color: "white",
                                  backgroundColor: "#aaaaaa",
                                  marginRight: "5px",
                                  marginBottom: "5px",
                                }}
                              />

                              {/* <div id="showmore" className="ml1 mt2">
                                <a href="#">View more...</a>
                              </div> */}
                              <div
                                className="more-competency"
                                style={{ display: `none` }}
                              >
                                <div className="chip">
                                  <span className="icon icon--leadind chip--check">
                                    <i className="material-icons">done</i>
                                  </span>
                                  Follow Instructions
                                </div>
                                <div className="chip">
                                  <span className="icon icon--leadind chip--check">
                                    <i className="material-icons">done</i>
                                  </span>
                                  Listening Skills
                                </div>
                                <div className="chip">
                                  <span className="icon icon--leadind chip--check">
                                    <i className="material-icons">done</i>
                                  </span>
                                  Prioritise Effectively
                                </div>
                                <div className="chip">
                                  <span className="icon icon--leadind chip--check">
                                    <i className="material-icons">done</i>
                                  </span>
                                  Work Under Pressure
                                </div>
                                <div className="chip">
                                  <span className="icon icon--leadind chip--check">
                                    <i className="material-icons">done</i>
                                  </span>
                                  Analytical Skills
                                </div>
                                <div className="chip">
                                  <span className="icon icon--leadind chip--check">
                                    <i className="material-icons">done</i>
                                  </span>
                                  Interpersonal Skills
                                </div>
                              </div>

                              <br />
                              <br />
                            </div>
                          </div>

                          <div className="box-pad pt2 nomobile">
                            <a
                              href="javascript:void(0)"
                              className="btn-lg txt_white btn-primary"
                              onClick={handleBuildTemplate}
                            >
                              Build my template
                            </a>
                            &nbsp;
                          </div>

                          <div
                            className="box-pad pt2 viewonmobile"
                            style={{ display: `none` }}
                          >
                            <a
                              href="javascript:void(0)"
                              className="btn btn-primary"
                              onClick={handleBuildTemplate}
                            >
                              Build my template
                            </a>
                            &nbsp;
                            {/* <!-- <a href="#" className="btn btn-secondary-outline">Cancel</a> --> */}
                          </div>
                        </div>
                      </div>
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
  );
}

export default TB_Homepage;
