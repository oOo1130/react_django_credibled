import React, { useEffect, useState } from "react";
import logo from "../assets/img/credibled_logo_205x45.png";
import { API } from "../Api";
import { detectBrowser, getDate } from "../Common";
import { useCookies } from "react-cookie";
import Tooltip from "@material-ui/core/Tooltip";
import InfoIcon from "@material-ui/icons/Info";
import NumberFormat from "react-number-format";

function NewRequest() {
  const [token, setToken, deleteToken] = useCookies(["credtoken"]);
  const [loginUser, setLoginUser] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [questionnaires, setQuestionnaires] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [role, setRole] = useState("");
  const [questionnaire, setQuestionnaire] = useState("");
  const [countryISO, setCountryISO] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const response = "requested";

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
    setLoginUser(localStorage.getItem("creduser-a"));

    API.getQuestionnaires(token["credtoken"])
      .then((data) => {
        setQuestionnaires(data);
      })
      .catch((error) => console.log(error));

    API.getUserTemplates({
      email: localStorage.getItem("creduser"),
      action: null,
    }).then((data) => {
      setTemplates(data);
    });

    const sessionValidateInterval = setInterval(() => {
      if (getCookie("credtoken") == null) {
        signOutClicked();
        clearInterval(sessionValidateInterval);
        window.location.href = "/signin";
      }
    }, 60000);
  }, [token]);

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

  // const getCountryISOFunc = async (ip) => {
  //   let countryISO = await API.detectCountryISO(ip);
  //   return countryISO;
  // };

  const createRequest = () => {
    if (questionnaire == "") {
      var x = document.getElementById("questionnaireError");
      x.style.display = "block";
      return false;
    }
    if (role == "") {
      var x = document.getElementById("roleError");
      x.style.display = "block";
      return false;
    }
    if (firstName == "") {
      var x = document.getElementById("firstNameError");
      x.style.display = "block";
      return false;
    }
    if (lastName == "") {
      var x = document.getElementById("lastNameError");
      x.style.display = "block";
      return false;
    }
    if (email == "") {
      var x = document.getElementById("emailError");
      x.style.display = "block";
      return false;
    }
    if (email) {
      if (!email.match(EMAIL_REGEX)) {
        var x = document.getElementById("invalidEmailError");
        x.style.display = "block";
        return false;
      }
    }
    // if (phoneCode == "") {
    //   var x = document.getElementById("phoneError");
    //   x.style.display = "block";
    //   return false;
    // }
    if (phone == "") {
      var x = document.getElementById("phoneError");
      x.style.display = "block";
      return false;
    }

    // if (document.getElementById("checkBoxConfirm").checked == false) {
    //   return false;
    // }

    const recruiter = localStorage.getItem("creduser");
    let d = new Date();
    let year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
    let month = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d);
    let day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
    let requestDate = year + "-" + month + "-" + day;

    API.createRequest(
      {
        recruiter,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email,
        phone,
        role,
        questionnaire,
        requestDate,
        response,
        recruiterName: loginUser,
      },
      token["credtoken"]
    )
      .then((resp) => {
        if (resp.candidateHash) {
          const candidateHash = resp.candidateHash;
          API.sendEmploymentRequestEmail({
            loginUser,
            email,
            firstName: firstName.trim(),
            candidateHash,
          })
            .then(() => {
              API.updateLifeCycle({
                candidateHash,
                // refereeHash: "",
                userType: "Recruiter",
                name: loginUser,
                action: "Sent request to Candidate",
                date: getDate(),
                osBrowser: detectBrowser(),
                ipAddress: !!ipAddress ? ipAddress : null,
                locationISP: !!countryISO ? countryISO : null,
              }).then(() => {
                window.location.href = "/";
              });
            })
            .catch((error) => console.log(error));
        }
      })
      .catch((error) => console.log(error));
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
          <div onClick="" className="tile_side">
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
        {/* <!-- End Navbar --> */}
        <div className="content">
          <div className="container-fluid">
            <div className="card-plain">
              <div className="card-body ">
                <div className="row">
                  <div className="col-md-12">
                    <div className="card-plain bb10">
                      <div className="row">
                        <div className="col-md-4">
                          <h3>New Request</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="card tmzero">
                  <div className="row">
                    <div className="col-md-5 card-box">
                      <div className="row">
                        <div className="col-md-12">
                          <h4>
                            {" "}
                            Questionnaire{" "}
                            <Tooltip
                              placement="right"
                              title="This is the reference template you will use. Each questionnaire has a predefined set of questions. By default, your candidate will be required to submit details of 2 referees to complete this questionnaire."
                            >
                              <InfoIcon
                                style={{
                                  color: "#ED642A",
                                  position: "absolute",
                                  cursor: "pointer",
                                }}
                              />
                            </Tooltip>
                          </h4>
                          <label className="label-static">
                            Type
                            <span className="sup_char">
                              <sup>*</sup>
                            </span>
                          </label>

                          <div className="form-group">
                            <select
                              className="form-control select-top"
                              value={questionnaire}
                              onChange={(evt) => {
                                setQuestionnaire(evt.target.value);
                                var x =
                                  document.getElementById("questionnaireError");
                                x.style.display = "none";
                              }}
                            >
                              <option value="">Select</option>
                              {questionnaires.map((localState) => (
                                <option value={localState.title}>
                                  {localState.title}
                                </option>
                              ))}
                              {templates.map((localState) => (
                                <option value={localState.title}>
                                  {localState.title}
                                </option>
                              ))}
                            </select>
                            <span className="fa fa-fw fa-angle-down field_icon eye"></span>
                            <div className="notes">
                              {" "}
                              Minimun references: 2
                              <br />
                              <span className="txt_primary">
                                Questionnaire :
                              </span>
                              <a href="#">Senior (Leadership Level)</a>
                            </div>
                            <div
                              className="notes"
                              id="questionnaireError"
                              style={{ display: `none` }}
                            >
                              Questionnaire is required
                            </div>
                          </div>
                          <h4>
                            {" "}
                            Role / Department / Internal Ref.
                            <Tooltip
                              placement="right"
                              title="This is information will be displayed on the request summary page of the candidate."
                            >
                              <InfoIcon
                                style={{
                                  color: "#ED642A",
                                  position: "absolute",
                                  cursor: "pointer",
                                }}
                              />
                            </Tooltip>
                          </h4>
                          <div className="form-group">
                            <label className="bmd-label-floating">
                              Role / Department / Internal Ref.
                              <span className="sup_char">
                                <sup>*</sup>
                              </span>
                            </label>
                            <input
                              type="text"
                              value={role}
                              onChange={(evt) => {
                                if (!SPECIAL_REGEX.test(evt.target.value)) {
                                  setRole(evt.target.value);
                                  var x = document.getElementById("roleError");
                                  x.style.display = "none";
                                }
                              }}
                              className="form-control"
                              maxlength="50"
                            />
                            <div
                              className="notes"
                              id="roleError"
                              style={{ display: `none` }}
                            >
                              Role / Department / Internal Ref. is required
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-7 card-box">
                      <h4>
                        {" "}
                        Candidate Details
                        <Tooltip
                          placement="right"
                          title="These details are used to communicate with the candidate so please make sure they are upto date and correct."
                        >
                          <InfoIcon
                            style={{
                              color: "#ED642A",
                              position: "absolute",
                              cursor: "pointer",
                            }}
                          />
                        </Tooltip>
                      </h4>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group ">
                            <label className="bmd-label-floating">
                              First Name
                              <span className="sup_char">
                                <sup>*</sup>
                              </span>
                            </label>
                            <input
                              type="text"
                              value={firstName}
                              onChange={(evt) => {
                                if (!SPECIAL_REGEX.test(evt.target.value)) {
                                  setFirstName(evt.target.value.trim());
                                  var x =
                                    document.getElementById("firstNameError");
                                  x.style.display = "none";
                                }
                              }}
                              className="form-control"
                              maxlength="30"
                            />
                            <div
                              className="notes"
                              id="firstNameError"
                              style={{ display: `none` }}
                            >
                              First Name is required
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group ">
                            <label className="bmd-label-floating">
                              Last Name
                              <span className="sup_char">
                                <sup>*</sup>
                              </span>
                            </label>
                            <input
                              type="text"
                              value={lastName}
                              onChange={(evt) => {
                                if (!SPECIAL_REGEX.test(evt.target.value)) {
                                  setLastName(evt.target.value.trim());
                                  var x =
                                    document.getElementById("lastNameError");
                                  x.style.display = "none";
                                }
                              }}
                              className="form-control"
                              maxlength="30"
                            />
                            <div
                              className="notes"
                              id="lastNameError"
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
                              onChange={(evt) => {
                                setEmail(evt.target.value);
                                var x = document.getElementById("emailError");
                                x.style.display = "none";
                                var y =
                                  document.getElementById("invalidEmailError");
                                y.style.display = "none";
                              }}
                              className="form-control"
                            />
                            <div
                              className="notes"
                              id="emailError"
                              style={{ display: `none` }}
                            >
                              Email address is required
                            </div>
                            <div
                              className="notes"
                              id="invalidEmailError"
                              style={{ display: `none` }}
                            >
                              Please enter a valid Email address
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          {/* <div className="row"> */}
                          {/* <div className="col-md-8"> */}
                          <div className="form-group">
                            <label className="bmd-label-floating">
                              Phone#
                              <span className="sup_char">
                                <sup>*</sup>
                              </span>
                            </label>
                            {/* <input
                              type="text"
                              value={phone}
                              onChange={(evt) => {
                                if (/^\d*$/.test(evt.target.value)) {
                                  setPhone(evt.target.value);
                                }
                                var x = document.getElementById("phoneError");
                                x.style.display = "none";
                              }}
                              className="form-control"
                              maxlength="10"
                            /> */}
                            <NumberFormat
                              className="form-control"
                              format="(###) ###-####"
                              value={phone}
                              onChange={(evt) => {
                                // if (/^\d*$/.test(evt.target.value)) {
                                setPhone(evt.target.value);
                                // }
                                var x = document.getElementById("phoneError");
                                x.style.display = "none";
                              }}
                            />
                            <div
                              className="notes"
                              id="phoneError"
                              style={{ display: `none` }}
                            >
                              Phone# is required
                            </div>
                          </div>
                        </div>
                        {/* <div className="col-md-8">
                              <div className="form-group">
                                <input
                                  type="text"
                                  value={phone}
                                  onChange={(evt) => {
                                    if (/^\d*$/.test(evt.target.value)) {
                                      setPhone(evt.target.value);
                                    }
                                    var x = document.getElementById(
                                      "phoneError"
                                    );
                                    x.style.display = "none";
                                  }}
                                  className="form-control"
                                  maxlength="10"
                                />
                                <div
                                  className="notes"
                                  id="phoneError"
                                  style={{ display: `none` }}
                                >
                                  Phone# is required
                                </div>
                              </div>
                            </div> */}
                        {/* </div> */}
                        {/* </div> */}
                      </div>
                      {/* <div className="form-group form-check box-pad">
                        <label className="form-check-label fcl">
                          <input
                            id="checkBoxConfirm"
                            type="checkbox"
                            onChange={checkBoxClicked}
                          />
                          &nbsp; I confirm my candidate is prepped and aware I
                          am using Credibled to collect their references.
                        </label>
                      </div> */}
                      {/* <div className="clearfix"></div> */}
                      <div className="box-pad mextpad">
                        <a
                          href="#"
                          id="add-list"
                          className="btn btn-secondary-outline"
                        >
                          Add to List
                        </a>
                        &nbsp;
                        <input
                          type="button"
                          id="btnSendRequest"
                          onClick={createRequest}
                          className="btn btn-primary"
                          value=" Send Request"
                        />
                      </div>
                      <div className="clearfix"></div>
                    </div>
                  </div>
                </div>

                <div
                  className="card-plain new_block"
                  id="show-list"
                  style={{ display: `none` }}
                >
                  <div className="row">
                    <div className="col-md-3 info-box">
                      <div className="actions">
                        <a
                          className="open-icon"
                          data-toggle="modal"
                          data-target="#editInfo"
                          href="javascript:;"
                        >
                          <i className="fa fa-pencil-square-o"></i>
                        </a>
                        &nbsp;
                        <a
                          className="open-icon"
                          id="del-list"
                          href="javascript:;"
                        >
                          <i className="fa fa-trash"></i>
                        </a>
                      </div>
                      <h6 className="fw3 text-primary">
                        {/* Elvine Assouline */}
                        <br />
                        <span className="text-secondary font-sm">
                          {/* Product Manager */}
                        </span>
                      </h6>
                      <span className="font-sm">
                        {/* elvine@thefunmaster */}
                        <br />
                        {/* +1 45435435545 */}
                      </span>
                    </div>
                  </div>
                </div>
                <br />
                <br />
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

export default NewRequest;
