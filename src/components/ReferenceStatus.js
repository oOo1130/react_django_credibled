import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useCookies } from "react-cookie";
import logo from "../assets/img/credibled_logo_205x45.png";
import { API } from "../Api";
import { withStyles } from "@material-ui/styles";
import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";
import InfoIcon from "@material-ui/icons/Info";
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import { jsPDF } from "jspdf";
import * as html2canvas from "html2canvas";

function ReferenceStatus() {
  const params = useParams();
  const [token, setToken, deleteToken] = useCookies(["credtoken"]);
  const [jobhistory, setJobHistory] = useState([]);
  const [loginUser, setLoginUser] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [role, setRole] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePhone, setCandidatePhone] = useState("");
  const [refereeFirstName, setRefereeFirstName] = useState("");
  const [refereeLastName, setRefereeLastName] = useState("");
  const [sliderVal1, setSliderVal1] = useState(0);
  const [sliderVal2, setSliderVal2] = useState(0);
  const [sliderVal3, setSliderVal3] = useState(0);
  const [sliderVal4, setSliderVal4] = useState(0);
  const [sliderVal5, setSliderVal5] = useState(0);
  const [sliderVal6, setSliderVal6] = useState(0);
  const [sliderVal7, setSliderVal7] = useState(0);
  const [sliderVal8, setSliderVal8] = useState(0);
  const [sliderVal9, setSliderVal9] = useState(0);
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");
  const [answer4, setAnswer4] = useState("");
  const [answer5, setAnswer5] = useState("");
  const [answer6, setAnswer6] = useState("");
  const [answer7, setAnswer7] = useState("");
  const [answer8, setAnswer8] = useState("");
  const [answer9, setAnswer9] = useState("");
  const [answer10, setAnswer10] = useState("");
  const [templateResponse, setTemplateResponse] = useState("");
  const [questionnaire, setQuestionnaire] = useState("");
  const [qtnType, setQtnType] = useState("");
  const [questionList, setQuestionList] = useState("");
  const [recruiterEmail, setRecruiterEmail] = useState("");
  var questionsArr;
  var html_tag;

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
    if (params.candidateHash) {
      API.getCandidateDetails(params.candidateHash)
        .then((data) => {
          setCandidateName(data[0].firstName + " " + data[0].lastName);
          setRole(data[0].role);
          setCandidateEmail(data[0].email);
          setCandidatePhone(data[0].phone);
          setRecruiterEmail(data[0].recruiter);
          setQuestionnaire(data[0].questionnaire);
        })
        .catch((error) => console.log(error));
      API.getRefereeDetails({
        candidateHash: params.candidateHash,
        refereeHash: params.refereeHash,
      })
        .then((data) => setJobHistory(data))
        .catch((error) => console.log(error));
    }
    API.getQuestionnaireData({
      candidateHash: params.candidateHash,
      refereeHash: params.refereeHash,
    })
      .then((data) => {
        setRefereeFirstName(data[0].refereeFirstName);
        setRefereeLastName(data[0].refereeLastName);
        setAnswer1(data[0].question1);
        setAnswer2(data[0].question2);
        setAnswer3(data[0].question3);
        setAnswer4(data[0].question4);
        setAnswer5(data[0].question5);
        setAnswer6(data[0].question6);
        setAnswer7(data[0].question7);
        setAnswer8(data[0].question8);
        setAnswer9(data[0].question9);
        setAnswer10(data[0].question10);
        setSliderVal1(data[0].rating1);
        setSliderVal2(data[0].rating2);
        setSliderVal3(data[0].rating3);
        setSliderVal4(data[0].rating4);
        setSliderVal5(data[0].rating5);
        setSliderVal6(data[0].rating6);
        setSliderVal7(data[0].rating7);
        setSliderVal8(data[0].rating8);
        setSliderVal9(data[0].rating9);
        setTemplateResponse(data[0].questionnaireResponse);
        if (data[0].questionnaireResponse != null) {
          setQtnType("user");
        } else {
          setQtnType("system");
        }
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
    if (qtnType == "user") {
      API.getTemplates({ questionnaire, email: recruiterEmail }).then(
        (resp) => {
          if (resp[0].questions) {
            setQuestionList(resp[0].questions);
          }
        }
      );
    }
  }, [qtnType]);

  const renderQtnTemplate = (questionList) => {
    var count = 1;
    html_tag = "";
    questionsArr = questionList.split("`CREDDIV`");
    for (let i = 0; i < questionsArr.length; i++) {
      var cred_ans_id = "qtn_" + count + "_ans";
      var scrnshtId = "captureQtn_" + count + "_ans";
      html_tag = (
        <span>
          {" "}
          {html_tag}{" "}
          <li>
            <div className="gray-box1" id={scrnshtId}>
              <table className="quest">
                <tr>
                  <td>{count}.</td>
                  <td className="question">
                    <span className="sup_char">
                      <sup>* </sup>
                    </span>
                    {questionsArr[i]}
                    <p className="answer" id={cred_ans_id}></p>
                  </td>
                </tr>
              </table>
            </div>
          </li>
        </span>
      );
      count++;
    }
    console.log(html_tag);
    return html_tag;
  };

  const renderTemplateResponse = (questionnaireResponse) => {
    var count = 1;
    var responseArr = questionnaireResponse.split("`CREDDIV`");
    for (let i = 0; i < responseArr.length; i++) {
      var cred_ans_id = "qtn_" + count + "_ans";
      if (document.getElementById(cred_ans_id)) {
        document.getElementById(cred_ans_id).innerText = responseArr[i];
      }

      count++;
    }
  };

  useEffect(() => {
    if (templateResponse) {
      renderTemplateResponse(templateResponse);
    }
  });

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

  const exportPDF = () => {
    var doc = new jsPDF("p", "pt", "a4");
    var pagesize = doc.internal.pageSize;
    console.log(pagesize.width);
    doc.html(document.querySelector('#resultsCapture'), {
      margin: [40,60,40,60],
      callback: function(pdf) {
        pdf.save("credibled_report.pdf");
      }
    });
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
                </ul>
              </div>
            </div>
          </nav>
          <div className="content row" id="resultsCapture" style={{ width: "fit-content" }}>
            <div className="col-md-1"> </div>
            <div className="container-fluid col-md-10">
              <div className="card-plain">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="card-plain bb10">
                        <div className="row">
                          <div className="col-md-4">
                            <h3> Results</h3>
                          </div>
                          <div
                            className="col-md-8 showonmobile"
                            style={{ display: "none" }}
                          >
                            <div className="btn-group setmobile">
                              {/* <input
                                type="button"
                                className="btn btn-secondary"
                                onClick={exportPDF}
                                value="Export Request"
                              /> */}
                              <div className="dropdown-menu">
                                <a className="dropdown-item" href="#">
                                  <div className="form-check"></div>
                                </a>
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
              <div className="row">
                <div className="col info-box-white">
                  <div className="row">
                    <div className="col bg-gray mbzero">
                      <div className="row">
                        <div className="col">
                          <p className="title">Candidate</p>
                          <p className="ref-name">{candidateName}</p>
                        </div>
                        <div className="col  text-right push-right pt1 hideonmobile">
                          <div className="btn-group">
                            <input
                              type="button"
                              className="btn btn-secondary"
                              onClick={exportPDF}
                              value="Export Request"
                            />
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
                        <div className="col-12">
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
                      </div>
                    </div>
                    <div className="in-between">&nbsp;</div>
                    {jobhistory.map((localState, index) => (
                      <div className="col bg-gray mbzero">
                        <div className="row">
                          <div className="col">
                            <p className="title">Referee</p>
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
                                    "/reference/status/" + params.candidateHash
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
                                Requested
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
                              </h4>
                            )}
                            <p className="details mr22">
                              {" "}
                              {/* Submitted on Jan 08/2021 7-30AM */}
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
                          <h6 className="hr-blue text-secondary">
                            Employed at the {localState.organization} for{" "}
                            {getYearDiff(
                              localState.startDate,
                              localState.endDate
                            )}{" "}
                            Years ({formatDate(localState.startDate)} -{" "}
                            {!!localState.endDate
                              ? formatDate(localState.endDate)
                              : "Till Date"}
                            )
                          </h6>
                          <p className="details">
                            {/* Feedback covers 10 years 5 months(4 May 2001 - 20
                            Oct 2020) */}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* <div className="col-md-12 pad_zero mt2">
                <div id="accordion" role="tablist">
                  <div className="card-collapse">
                    <div
                      className="card-header cust-head bg-amberlight"
                      role="tab"
                      id="headingOne"
                    >
                      <h5 className="mb-0">
                        <a
                          className="text-danger"
                          data-toggle="collapse"
                          href="#collapseOne"
                          aria-expanded="true"
                          aria-controls="collapseOne"
                        >
                          <table border="0" cellpadding="2px">
                            <tr>
                              <td>
                                <i className="material-icons-outlined">room</i>
                              </td>
                              <td>
                                <i className="material-icons-outlined">email</i>
                                &nbsp;
                              </td>
                              <td>
                                <i className="material-icons-outlined">monitor</i>
                                &nbsp;
                              </td>
                              <td>&nbsp;Unusual activity found!</td>
                            </tr>
                          </table>
                          <span className="fa fa-fw fa-angle-down field_icon down"></span>
                        </a>
                      </h5>
                    </div>
                    <div
                      id="collapseOne"
                      className="collapse show gray-box"
                      role="tabpanel"
                      aria-labelledby="headingOne"
                      data-parent="#accordion"
                    >
                      <div className="card-body">
                        <table className="quest" cellpadding="5px">
                          <tr>
                            <td colspan="2">
                              <h4>Reasons for the alert</h4>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <i className="text-danger material-icons-outlined">
                                room
                              </i>
                            </td>
                            <td>
                              Brad S and elvine accessed Credibled from the same
                              IP address{" "}
                              <span className="text-danger">
                                (meaning both the candidate and referee appear
                                to have been at the same location using the same
                                intenet connection).
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <i className="text-danger material-icons-outlined">
                                email
                              </i>
                            </td>
                            <td>
                              Elvine me completed the reference request using a
                              personal
                              <span className="text-danger">
                                (non-professional)
                              </span>{" "}
                              email address (gmail.com).
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <i className="text-danger material-icons-outlined">
                                monitor
                              </i>
                            </td>
                            <td>
                              Brad S and Elvine me used the{" "}
                              <span className="text-danger">
                                same operating system and internet browser
                              </span>{" "}
                              to access Credibled.
                            </td>
                          </tr>
                        </table>
                        <div className="box-pad1 bg-gray">
                          <div className="row">
                            <div className="col-md-5">
                              <h6>
                                Add note{" "}
                                <span className="text-secondary">
                                  (e.g.I'm investigating this)
                                </span>
                              </h6>
                              <div className="">
                                <textarea
                                  className="form-control"
                                  rows="2"
                                ></textarea>
                              </div>
                            </div>
                            <div className="col-md-5">
                              <h6 className="mtp1">Resolution</h6>
                              <div className="form-check form-check-radio">
                                <label className="form-check-label">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="exampleRadios"
                                    id="exampleRadios1"
                                    value="option1"
                                  />
                                  This is a suspicious reference
                                  <span className="circle">
                                    <span className="check"></span>
                                  </span>
                                </label>
                              </div>
                              <div className="form-check form-check-radio">
                                <label className="form-check-label">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="exampleRadios"
                                    id="exampleRadios2"
                                    value="option2"
                                  />
                                  This is a valid reference
                                  <span className="circle">
                                    <span className="check"></span>
                                  </span>
                                </label>
                              </div>
                            </div>
                            <div className="col-md-2 box-pad">
                              <a href="#" className="btn btn-primary">
                                Save
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

              <div className="row">
                <div className="col">
                  <div className="model_scroll1">
                    {qtnType == "system" ? (
                      <ul id="questionnaire">
                        <li class="pl1">
                          <h4>
                            Report from Referee -{" "}
                            <span className="text-secondary">
                              {refereeFirstName} {refereeLastName}
                            </span>
                          </h4>
                        </li>
                        <li>
                          <div class="gray-box1">
                            <table class="quest">
                              <tr>
                                <td>1.</td>
                                <td class="question">
                                  How long did you work together (
                                  <i>approx. dates</i>)? What was your working
                                  relationship?
                                  <p class="answer">{answer1}</p>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </li>
                        <li>
                          <div class="gray-box1">
                            <table class="quest">
                              <tr>
                                <td>2.</td>
                                <td class="question">
                                  What were the main duties of his/her job?
                                  <p class="answer">{answer2}</p>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </li>
                        <li>
                          <div class="gray-box1">
                            <table class="quest">
                              <tr>
                                <td>3.</td>
                                <td class="question">
                                  What is your overall appraisal of his/her
                                  work?
                                  <p class="answer">{answer3}</p>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </li>
                        <li>
                          <div class="gray-box1">
                            <table class="quest">
                              <tr>
                                <td>4.</td>
                                <td class="question">
                                  What are his/her strong points? What are
                                  his/her technical strengths? If you can,
                                  please give examples of how these strengths
                                  were demonstrated.
                                  <p class="answer">{answer4}</p>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </li>
                        <li>
                          <div class="gray-box1">
                            <table class="quest">
                              <tr>
                                <td>5.</td>
                                <td class="question">
                                  How does he/she perform under pressure?
                                  <p class="answer">{answer5}</p>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </li>
                        <li>
                          <div class="gray-box1">
                            <table class="quest">
                              <tr>
                                <td>6.</td>
                                <td class="question">
                                  How does he/she get along with other people? (
                                  <i>supervisors, peers, and subordinates</i>).
                                  <p class="answer">{answer6}</p>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </li>
                        <li>
                          <div class="gray-box1">
                            <table class="quest">
                              <tr>
                                <td>7.</td>
                                <td class="question">
                                  How are his/her communication skills?
                                  <p class="answer">{answer7}</p>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </li>
                        <li>
                          <div class="gray-box1">
                            <table class="quest">
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
                                        <div class="col-md-6 pt2">
                                          Attendance
                                        </div>
                                        <div class="col-md-6">
                                          <div class="range-slider">
                                            <span
                                              class="range-slider__value"
                                              style={{ marginRight: "20px" }}
                                            >
                                              {sliderVal1}
                                            </span>
                                            <PrettoSlider
                                              valueLabelDisplay="auto"
                                              aria-label="pretto slider"
                                              step={1}
                                              marks
                                              min={0}
                                              max={5}
                                              value={sliderVal1}
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
                                              {sliderVal2}
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
                                              value={sliderVal2}
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
                                              {sliderVal3}
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
                                              value={sliderVal3}
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
                                              {sliderVal4}
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
                                              value={sliderVal4}
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
                                              {sliderVal5}
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
                                              value={sliderVal5}
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
                                              {sliderVal6}
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
                                              value={sliderVal6}
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
                                              {sliderVal7}
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
                                              value={sliderVal7}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </li>

                                    <li>
                                      <div class="row pmzero">
                                        <div class="col-md-6 pt2">
                                          Leadership/Management ability and
                                          style
                                        </div>
                                        <div class="col-md-6">
                                          <div class="range-slider">
                                            <span
                                              class="range-slider__value"
                                              style={{ marginRight: "20px" }}
                                            >
                                              {sliderVal8}
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
                                              value={sliderVal8}
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
                                              {sliderVal9}
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
                                              value={sliderVal9}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  </ul>
                                  <p class="answer">{answer8}</p>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </li>
                        <li>
                          <div class="gray-box1">
                            <table class="quest">
                              <tr>
                                <td>9.</td>
                                <td class="question">
                                  Why did he/she leave your company? Would you
                                  re-employ?
                                  <p class="answer">{answer9}</p>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </li>
                        <li>
                          <div class="gray-box1">
                            <table class="quest">
                              <tr>
                                <td>10.</td>
                                <td class="question">
                                  Is there anything else of significance we
                                  should know? (
                                  <i>
                                    Any concerns or compliments or general
                                    comments
                                  </i>
                                  ?)
                                  <p class="answer">{answer10}</p>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </li>
                      </ul>
                    ) : (
                      <ul id="questionnaire">
                        <li class="pl1">
                          <h4>
                            Report from Referee -{" "}
                            <span className="text-secondary">
                              {refereeFirstName} {refereeLastName}
                            </span>
                          </h4>
                        </li>
                        {!!questionList
                          ? renderQtnTemplate(questionList)
                          : null}
                      </ul>
                    )}

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
            <div className="col-md-1"> </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReferenceStatus;
