import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import ReactDOM from "react-dom";
import { useCookies } from "react-cookie";
import logo from "../assets/img/credibled_logo_205x45.png";
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

function TemplateBuilder() {
  // const params = useParams();
  const [token, setToken, deleteToken] = useCookies(["credtoken"]);
  const [loginUser, setLoginUser] = useState("");
  // const [industry, setIndustry] = useState("");
  // const [jobTitle, setJobTitle] = useState("");
  const [competency, setCompetency] = useState([]);
  const [questions, setQuestions] = useState([]);
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
    if (!token["credtoken"]) {
      window.location.href = "/signin";
    } else {
      setToken("credtoken", token["credtoken"], {
        path: "/",
        maxAge: process.env.REACT_APP_SESSION_MAX_AGE,
      });
    }
    setLoginUser(localStorage.getItem("creduser-a"));

    const sessionValidateInterval = setInterval(() => {
      if (getCookie("credtoken") == null) {
        signOutClicked();
        clearInterval(sessionValidateInterval);
        window.location.href = "/signin";
      }
    }, 60000);

    API.getCompetency().then((data) => {
      setCompetency(data);
    });

    API.getQuestionBuilder({
      recruiter: localStorage.getItem("creduser"),
    }).then((data) => setQuestions(data));
  }, [token]);

  useEffect(() => {
    renderCompetencyQuestions();
  }, [competency]);

  const renderCompetencyQuestions = () => {
    for (let i = 0; i < competency.length; i++) {
      API.getCompetencyQuestions({
        competencyHash: competency[i].competencyHash,
      }).then((data) => {
        var questionnaireId = "divQuest_" + competency[i].competencyHash;
        var count = 1;
        var questions_tags;
        for (let l = 0; l < data.length; l++) {
          questions_tags = (
            <span>
              {questions_tags}{" "}
              <ul id="questionnaire">
                <li>
                  <table className="quest">
                    <tr>
                      <td>{count}.</td>
                      <td>{data[l].question}</td>
                      <td className="text-right">
                        &nbsp;
                        <a
                          className="btn btnxs btn-secondary-outline"
                          data-dismiss="modal"
                          aria-label="Close"
                          onClick={() => addQuestion(data[l].question)}
                        >
                          <i className="material-icons">add_circle</i>
                          &nbsp; Add
                        </a>
                      </td>
                    </tr>
                  </table>
                </li>
              </ul>
            </span>
          );
          count++;
        }
        ReactDOM.render(
          questions_tags,
          document.getElementById(questionnaireId)
        );
      });
    }
  };

  const addQuestion = (question) => {
    const recruiter = localStorage.getItem("cred");
    if (recruiter) {
      API.addQuestion({ question: question, recruiter: recruiter });
    }
  };
  const handleSave = () => {
    // API.addTemplate({
    //   email: localStorage.getItem("creduser"),
    //   type: "Referee",
    //   industry: localStorage.getItem("cred-tb-industry"),
    //   buildDate: getDate(),
    //   noOfQuestions: "15",
    //   title: localStorage.getItem("cred-tb-title") + " - " + getCurrentDate(),
    //   questions:
    //     "Please detail the nature of your working relationship (i.e. direct boss, etc).`CREDDIV`Please outline their key duties and scope of responsibility. How would you assess their overall performance?`CREDDIV`What do you consider to be their main strengths? (Please consider both technical skills and personal attributes)`CREDDIV`Please rate and comment on their ability to find innovative ways to solve problems.`CREDDIV`What do you consider to be their main weakness?`CREDDIV`How would you rate their level of strategic planning? Please provide examples to support your answer.`CREDDIV`Are you happy for us to contact you for further information, if required?`CREDDIV`Would you rehire them if you were given the opportunity and had an appropriate role?`CREDDIV`How would you rate their level of strategic planning? Please provide examples to support your answer.`CREDDIV`Would you rehire them if you were given the opportunity and had an appropriate role?`CREDDIV`Please rate and comment on their overall performance.`CREDDIV`What level of drive and motivation did they display during the time that you worked with them?`CREDDIV`How would you rate their customer service skills? (Please explain your answer and provide an example)`CREDDIV`What level of drive and motivation did they display during the time that you worked with them?`CREDDIV`Please rate and comment on their overall performance.",
    // }).then(() => {
    //   window.location.href = "/template-builder/summary";
    // });
  };

  const handleClick = (data) => {
    var x = document.getElementById(data);
    x.style.backgroundColor = "#402693";
    // alert("You clicked the Chip.");
  };

  const getCurrentDate = () => {
    let d = new Date();
    let year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
    let month = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
    let day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
    return day + " " + month + " " + year;
  };

  const getDate = () => {
    let d = new Date();
    let year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
    let month = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d);
    let day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
    return year + "-" + month + "-" + day;
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
                        <a className="navbar-brand" href="index.html">
                          <img
                            src={logo}
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
                              href="javascript:void(0)"
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
                              <a
                                className="dropdown-item"
                                href="javascript:void(0)"
                              >
                                English
                              </a>
                              <a
                                className="dropdown-item"
                                href="javascript:void(0)"
                              >
                                French
                              </a>
                            </div>
                          </li>
                          <li className="nav-item dropdown">
                            <a
                              className="nav-link dropdown-toggle"
                              href="javascript:void(0)"
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
                                href="credibled_terms.html"
                                target="_new"
                              >
                                Terms of use
                              </a>
                              <a
                                className="dropdown-item"
                                href="credibled_privacy.html"
                                target="_new"
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
                    <div
                      className="showonmobile text-center"
                      style={{ display: "none" }}
                    >
                      <h2 className="text-secondary">Template Builder</h2>
                    </div>

                    <div className="row">
                      <div className="col-md-12 mt3">
                        <div className="search-box mt3">
                          <div className="col-md-12">
                            <form className="navbar-form">
                              <div className="input-group no-border">
                                {/* <!-- <a href="javascript:void(0)"><i id="showsearch" className="text-secondary material-icons sr_icon">reorder</i></a> --> */}
                                <input
                                  type="text"
                                  value=""
                                  className="form-control"
                                  placeholder="Search..."
                                />
                                <a href="javascript:void(0)">
                                  <i className="material-icons sr_icon">
                                    search
                                  </i>
                                </a>
                              </div>
                            </form>
                          </div>

                          <div className="search_chip">
                            <h6 className="text-secondary">
                              Search by Competency
                            </h6>

                            {/* Load Competencies */}
                            <div className="chips__filter cf-type">
                              {competency.map((localState) => (
                                <div
                                  className="chip"
                                  data-toggle="modal"
                                  data-target={"#" + localState.competencyHash}
                                  href="javascript:void(0)"
                                >
                                  <span className="icon icon--leadind chip--check">
                                    <i className="material-icons">done</i>
                                  </span>
                                  {localState.competency}
                                </div>
                              ))}
                            </div>

                            {/* <h6 className="text-secondary mt1">
                              Search by Competency
                            </h6> */}
                            {/* <div className="chips__filter"> */}
                            {/* <div
                                className="chip"
                                data-toggle="modal"
                                data-target="#question_lite"
                                href="javascript:void(0)"
                              >
                                <span className="icon icon--leadind chip--check">
                                  <i className="material-icons">done</i>
                                </span>
                                <span>Leadership</span>
                              </div>
                              <div className="chip">
                                <span className="icon icon--leadind chip--check">
                                  <i className="material-icons">done</i>
                                </span>
                                Attendance, Punctuality and Reliability
                              </div>
                              <div className="chip">
                                <span className="icon icon--leadind chip--check">
                                  <i className="material-icons">done</i>
                                </span>
                                Attention to Detail
                              </div>
                              <div className="chip">
                                <span className="icon icon--leadind chip--check">
                                  <i className="material-icons">done</i>
                                </span>
                                Computer Literacy
                              </div>
                              <div className="chip">
                                <span className="icon icon--leadind chip--check">
                                  <i className="material-icons">done</i>
                                </span>
                                Conduct and Behaviour
                              </div>
                              <div className="chip">
                                <span className="icon icon--leadind chip--check">
                                  <i className="material-icons">done</i>
                                </span>
                                Customer Service
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
                                Conflict Management
                              </div>
                              <div className="chip">
                                <span className="icon icon--leadind chip--check">
                                  <i className="material-icons">done</i>
                                </span>
                                Adaptability and Flexibility
                              </div>
                              <div className="chip">
                                <span className="icon icon--leadind chip--check">
                                  <i className="material-icons">done</i>
                                </span>
                                Conduct and Behaviour
                              </div>
                              <div className="chip">
                                <span className="icon icon--leadind chip--check">
                                  <i className="material-icons">done</i>
                                </span>
                                Customer Service
                              </div>
                              <div className="chip">
                                <span className="icon icon--leadind chip--check">
                                  <i className="material-icons">done</i>
                                </span>
                                Personal Presentation
                              </div>
                              <div className="chip">
                                <span className="icon icon--leadind chip--check">
                                  <i className="material-icons">done</i>
                                </span>
                                Targets and KPIs
                              </div>
                              <div className="chip">
                                <span className="icon icon--leadind chip--check">
                                  <i className="material-icons">done</i>
                                </span>
                                Adaptability and Flexibility
                              </div> */}

                            {/* <div id="showmore" className="ml1 mt1">
                                <a href="javascript:void(0)">View more...</a>
                              </div> */}
                            {/* <div
                                className="more-competency"
                                style={{ display: "none" }}
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
                              </div> */}
                            {/* </div> */}
                          </div>

                          <div className="col-md-12 mt3">
                            <h6 className="mtp2 ">Template Title</h6>
                            {/* <h3 className="text-primary mt-zero">
                              {" "}
                              {localStorage.getItem("cred-tb-title")} -{" "}
                              <span className="text-secondary">
                                {getCurrentDate()}
                              </span>
                            </h3> */}
                          </div>

                          <div
                            className="row pb2 showonmobile"
                            style={{ display: "none", margin: "0" }}
                          >
                            <div className="col info-box-thin1">
                              <div className="row">
                                <div className="col-12">
                                  <table border="0" padding="0" margin="0">
                                    <tr>
                                      <td nowrap>
                                        <h2 className="big-num text-primary">
                                          15
                                        </h2>
                                        <div className="push1">
                                          Questions{" "}
                                          <a
                                            id="pop"
                                            href="javascript:void(0)"
                                            data-toggle="popover"
                                            data-content="The Number of questions currently included in your template."
                                          >
                                            <i className="material-icons ism icon_info text-secondary">
                                              info
                                            </i>
                                          </a>
                                        </div>
                                      </td>
                                      <td>
                                        <ul id="quest">
                                          <li>
                                            <div className="al-icon1">
                                              <i className="material-icons txt_green">
                                                grade
                                              </i>
                                            </div>{" "}
                                            <span className="sm">05</span>{" "}
                                            Essential
                                            <a
                                              id="pop"
                                              href="javascript:void(0)"
                                              data-toggle="popover"
                                              data-content="We recommend including 5 essential questions about your candidate's previous employment and performance."
                                            >
                                              <i className="material-icons ism icon_info text-secondary">
                                                info
                                              </i>
                                            </a>
                                          </li>
                                          <li>
                                            <div className="al-icon1">
                                              <i className="material-icons  txt_amber1">
                                                account_box
                                              </i>
                                            </div>
                                            <span className="sm">05</span>{" "}
                                            Personal attributes
                                            <a
                                              id="pop"
                                              href="javascript:void(0)"
                                              data-toggle="popover"
                                              data-content="We recommend including 4 to 7 questions about your professional personality traits."
                                            >
                                              <i className="material-icons ism icon_info text-secondary">
                                                info
                                              </i>
                                            </a>
                                          </li>
                                          <li>
                                            <div className="al-icon1">
                                              <i className="material-icons txt_blue">
                                                work
                                              </i>
                                            </div>
                                            <span className="sm">05</span>{" "}
                                            Role-specific
                                            <a
                                              id="pop"
                                              href="javascript:void(0)"
                                              data-toggle="popover"
                                              data-content="We recommend including 4 to 7 questions about your professional capabilities."
                                            >
                                              <i className="material-icons ism icon_info text-secondary">
                                                info
                                              </i>
                                            </a>
                                          </li>
                                        </ul>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row pb2 hideonmobile">
                            <div className="col info-box-thin">
                              <div className="row">
                                <div className="col-12">
                                  <ul id="quest">
                                    <li>
                                      {" "}
                                      <span>15</span>Questions
                                      <a
                                        id="pop"
                                        href="javascript:void(0)"
                                        data-toggle="popover"
                                        data-content="The Number of questions currently included in your template."
                                      >
                                        <i className="material-icons ism icon_info text-secondary">
                                          info
                                        </i>
                                      </a>
                                    </li>

                                    <li>
                                      <div className="al-icon1">
                                        <i className="material-icons txt_green">
                                          grade
                                        </i>
                                      </div>{" "}
                                      <span className="sm">05</span> Essential
                                      <a
                                        id="pop"
                                        href="javascript:void(0)"
                                        data-toggle="popover"
                                        data-content="We recommend including 5 essential questions about your candidate's previous employment and performance."
                                      >
                                        <i className="material-icons ism icon_info text-secondary">
                                          info
                                        </i>
                                      </a>
                                    </li>
                                    <li>
                                      <div className="al-icon1">
                                        <i className="material-icons  txt_amber1">
                                          account_box
                                        </i>
                                      </div>
                                      <span className="sm">05</span> Personal
                                      attributes
                                      <a
                                        id="pop"
                                        href="javascript:void(0)"
                                        data-toggle="popover"
                                        data-content="We recommend including 4 to 7 questions about your professional personality traits."
                                      >
                                        <i className="material-icons ism icon_info text-secondary">
                                          info
                                        </i>
                                      </a>
                                    </li>
                                    <li>
                                      <div className="al-icon1">
                                        <i className="material-icons txt_blue">
                                          work
                                        </i>
                                      </div>
                                      <span className="sm">05</span>{" "}
                                      Role-specific
                                      <a
                                        id="pop"
                                        href="javascript:void(0)"
                                        data-toggle="popover"
                                        data-content="We recommend including 4 to 7 questions about your professional capabilities."
                                      >
                                        <i className="material-icons ism icon_info text-secondary">
                                          info
                                        </i>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>

                          <table id="qtable" className="qtable">
                            <thead>
                              <tr>
                                <th>
                                  {" "}
                                  <a
                                    id="pop"
                                    href="javascript:void(0)"
                                    data-toggle="popover"
                                    data-content="Drag the table rows to re-order the selected questions"
                                  >
                                    <span className="material-icons-outlined text-secondary">
                                      drag_indicator
                                    </span>
                                  </a>
                                </th>
                                <th>
                                  <h5 className="text-primary fw500">
                                    Selected Questions
                                  </h5>
                                </th>
                              </tr>
                            </thead>
                            {questions.map((localState) => (
                              <tr
                                className="draggable"
                                id="tr1"
                                draggable="true"
                                ondragstart="dragit(event)"
                                ondragover="dragover(event)"
                              >
                                <td>&nbsp; </td>
                                <td className="br">
                                  <div className="question">
                                    {localState.question}
                                  </div>
                                  <a
                                    className="open-icon mtrash"
                                    id="del-list"
                                    href="javascript:;"
                                  >
                                    {" "}
                                    <i className="fa fa-trash"></i>
                                  </a>
                                  <img
                                    className="mtrash1"
                                    id="re-order"
                                    src="assets/img/re-order.png"
                                    alt="re-order"
                                  />
                                </td>
                              </tr>
                            ))}
                            {/* <tr
                              className="draggable"
                              id="tr2"
                              draggable="true"
                              ondragstart="dragit(event)"
                              ondragover="dragover(event)"
                            >
                              <td>&nbsp; </td>
                              <td className="br-green">
                                <div className="al-icon">
                                  <i className="material-icons txt_green">
                                    grade
                                  </i>
                                </div>
                                <div className="question">
                                  Please outline their key duties and scope of
                                  responsibility. How would you assess their
                                  overall performance?
                                </div>
                                <a
                                  className="open-icon mtrash"
                                  id="del-list1"
                                  href="javascript:;"
                                >
                                  {" "}
                                  <i className="fa fa-trash"></i>
                                </a>
                                <img
                                  className="mtrash1"
                                  id="re-order1"
                                  src="assets/img/re-order.png"
                                  alt="re-order"
                                />
                              </td>
                            </tr> */}
                            {/* <tr
                              className="draggable"
                              id="tr3"
                              draggable="true"
                              ondragstart="dragit(event)"
                              ondragover="dragover(event)"
                            >
                              <td>&nbsp; </td>
                              <td className="br-green">
                                <div className="al-icon">
                                  <i className="material-icons txt_green">
                                    grade
                                  </i>
                                </div>
                                <div className="question">
                                  What do you consider to be their main
                                  strengths? (Please consider both technical
                                  skills and personal attributes)
                                </div>
                              </td>
                            </tr> */}
                            {/* <tr
                              className="draggable"
                              id="tr4"
                              draggable="true"
                              ondragstart="dragit(event)"
                              ondragover="dragover(event)"
                            >
                              <td>&nbsp; </td>
                              <td className="br-green">
                                <div className="al-icon">
                                  <i className="material-icons txt_green">
                                    grade
                                  </i>
                                </div>
                                <div className="question">
                                  Please rate and comment on their ability to
                                  find innovative ways to solve problems.
                                </div>
                              </td>
                            </tr> */}
                            {/* <tr
                              className="draggable"
                              id="tr5"
                              draggable="true"
                              ondragstart="dragit(event)"
                              ondragover="dragover(event)"
                            >
                              <td>&nbsp; </td>
                              <td className="br-green">
                                <div className="al-icon">
                                  <i className="material-icons txt_green">
                                    grade
                                  </i>
                                </div>
                                <div className="question">
                                  What do you consider to be their main
                                  weakness?
                                </div>
                              </td>
                            </tr> */}
                            {/* <tr
                              className="draggable"
                              id="tr6"
                              draggable="true"
                              ondragstart="dragit(event)"
                              ondragover="dragover(event)"
                            >
                              <td>&nbsp; </td>
                              <td className="br-amber">
                                <div className="al-icon">
                                  <i className="material-icons txt_amber1">
                                    account_box
                                  </i>
                                </div>
                                <div className="question">
                                  How would you rate their level of strategic
                                  planning? Please provide examples to support
                                  your answer.{" "}
                                </div>
                              </td>
                            </tr>
                            <tr
                              className="draggable"
                              id="tr7"
                              draggable="true"
                              ondragstart="dragit(event)"
                              ondragover="dragover(event)"
                            >
                              <td>&nbsp; </td>
                              <td className="br-amber">
                                <div className="al-icon">
                                  <i className="material-icons txt_amber1">
                                    account_box
                                  </i>
                                </div>
                                <div className="question">
                                  Are you happy for us to contact you for
                                  further information, if required?{" "}
                                </div>
                              </td>
                            </tr>
                            <tr
                              className="draggable"
                              id="tr8"
                              draggable="true"
                              ondragstart="dragit(event)"
                              ondragover="dragover(event)"
                            >
                              <td>&nbsp; </td>
                              <td className="br-amber">
                                <div className="al-icon">
                                  <i className="material-icons txt_amber1">
                                    account_box
                                  </i>
                                </div>
                                <div className="question">
                                  Would you rehire them if you were given the
                                  opportunity and had an appropriate role?{" "}
                                </div>
                              </td>
                            </tr>
                            <tr
                              className="draggable"
                              id="tr9"
                              draggable="true"
                              ondragstart="dragit(event)"
                              ondragover="dragover(event)"
                            >
                              <td>&nbsp; </td>
                              <td className="br-amber">
                                <div className="al-icon">
                                  <i className="material-icons txt_amber1">
                                    account_box
                                  </i>
                                </div>
                                <div className="question">
                                  How would you rate their level of strategic
                                  planning? Please provide examples to support
                                  your answer.
                               
                                </div>
                              </td>
                            </tr>
                            <tr
                              className="draggable"
                              id="tr10"
                              draggable="true"
                              ondragstart="dragit(event)"
                              ondragover="dragover(event)"
                            >
                              <td>&nbsp; </td>
                              <td className="br-amber">
                                <div className="al-icon">
                                  <i className="material-icons txt_amber1">
                                    account_box
                                  </i>
                                </div>
                                <div className="question">
                                  Would you rehire them if you were given the
                                  opportunity and had an appropriate role?{" "}
                                </div>
                              </td>
                            </tr>
                            <tr
                              className="draggable"
                              id="tr11"
                              draggable="true"
                              ondragstart="dragit(event)"
                              ondragover="dragover(event)"
                            >
                              <td>&nbsp; </td>
                              <td className="br-blue">
                                <div className="al-icon">
                                  <i className="material-icons txt_blue">
                                    work
                                  </i>
                                </div>
                                <div className="question">
                                  Please rate and comment on their overall
                                  performance.{" "}
                                </div>
                              </td>
                            </tr>
                            <tr
                              className="draggable"
                              id="tr12"
                              draggable="true"
                              ondragstart="dragit(event)"
                              ondragover="dragover(event)"
                            >
                              <td>&nbsp; </td>
                              <td className="br-blue">
                                <div className="al-icon">
                                  <i className="material-icons txt_blue">
                                    work
                                  </i>
                                </div>
                                <div className="question">
                                  What level of drive and motivation did they
                                  display during the time that you worked with
                                  them?{" "}
                                </div>
                              </td>
                            </tr>
                            <tr
                              className="draggable"
                              id="tr13"
                              draggable="true"
                              ondragstart="dragit(event)"
                              ondragover="dragover(event)"
                            >
                              <td>&nbsp; </td>
                              <td className="br-blue">
                                <div className="al-icon">
                                  <i className="material-icons txt_blue">
                                    work
                                  </i>
                                </div>
                                <div className="question">
                                  How would you rate their customer service
                                  skills? (Please explain your answer and
                                  provide an example){" "}
                                </div>
                              </td>
                            </tr>
                            <tr
                              className="draggable"
                              id="tr14"
                              draggable="true"
                              ondragstart="dragit(event)"
                              ondragover="dragover(event)"
                            >
                              <td>&nbsp; </td>
                              <td className="br-blue">
                                <div className="al-icon">
                                  <i className="material-icons txt_blue">
                                    work
                                  </i>
                                </div>
                                <div className="question">
                                  What level of drive and motivation did they
                                  display during the time that you worked with
                                  them?
                                  
                                </div>
                              </td>
                            </tr>
                            <tr
                              className="draggable"
                              id="tr15"
                              draggable="true"
                              ondragstart="dragit(event)"
                              ondragover="dragover(event)"
                            >
                              <td>&nbsp; </td>
                              <td className="br-blue">
                                <div className="al-icon">
                                  <i className="material-icons txt_blue">
                                    work
                                  </i>
                                </div>
                                <div className="question">
                                  Please rate and comment on their overall
                                  performance.{" "}
                                </div>
                              </td>
                            </tr> */}
                          </table>

                          <div className="col-md-12 mt3 pb3">
                            <div className="box-pad pt2 nomobile">
                              <a
                                href="/"
                                className="btn-lg  btn-secondary-outline"
                              >
                                Cancel
                              </a>
                              &nbsp;
                              <a
                                className="btn-lg txt_white btn-primary"
                                href="javascript:void(0)"
                                onClick={handleSave}
                              >
                                Save
                              </a>
                            </div>

                            <div
                              className="box-pad pt2 viewonmobile"
                              style={{ display: "none" }}
                            >
                              <a
                                href="credibled_template_builder.html"
                                className="btn btn-secondary-outline"
                              >
                                Cancel
                              </a>
                              &nbsp;
                              <a
                                href="credibled_template_builder2.html"
                                className="btn btn-primary"
                              >
                                Save
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="clearfix"></div>
                    </div>
                  </div>

                  {/* Load QuestionsModal */}
                  {competency.map((localState) => (
                    <div
                      className="modal fade"
                      id={localState.competencyHash}
                      tabindex="-1"
                      role="dialog"
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                              {localState.competency}
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
                            <div className="row">
                              <div
                                className="model_scroll"
                                id={"divQuest_" + localState.competencyHash}
                              >
                                {/* <ul id="questionnaire">
                                  <li>
                                    <table className="quest">
                                      <tr>
                                        <td>1.</td>
                                        <td>
                                        <i className="material-icons txt_green">
                                          grade
                                        </i>
                                      </td>
                                        <td>
                                          What roles do you think they would be
                                          suitable for in the future?
                                        </td>
                                        <td className="text-right">
                                          &nbsp;
                                          <a
                                            href="javascript:void(0)"
                                            className="btn btnxs btn-secondary-outline"
                                            data-dismiss="modal"
                                            aria-label="Close"
                                          >
                                            <i className="material-icons">
                                              add_circle
                                            </i>
                                            &nbsp; Add
                                          </a>
                                        </td>
                                      </tr>
                                    </table>
                                  </li>
                                </ul> */}
                              </div>
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary-outline"
                              data-dismiss="modal"
                            >
                              Clear Search
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* <!-- Modal --> */}
                  <div
                    class="modal fade"
                    id="question_lite"
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div class="modal-dialog" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="exampleModalLabel">
                            Leadership
                          </h5>
                          <button
                            type="button"
                            class="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">
                          <div class="row">
                            <div class="model_scroll">
                              <ul id="questionnaire">
                                <li>
                                  <table class="quest">
                                    <tr>
                                      <td>1.</td>
                                      <td>
                                        Please detail the nature of your working
                                        relationship (i.e. direct boss, etc).
                                      </td>
                                      <td class="text-right">
                                        <a
                                          href="javascript:void(0)"
                                          class="btn btnxs btn-secondary-outline"
                                          data-dismiss="modal"
                                          aria-label="Close"
                                        >
                                          <i class="material-icons">
                                            add_circle
                                          </i>
                                          &nbsp; Add
                                        </a>
                                      </td>
                                    </tr>
                                  </table>
                                </li>
                                <li>
                                  <table class="quest">
                                    <tr>
                                      <td>2.</td>
                                      <td>
                                        Please outline their key duties and
                                        scope of responsibility. How would you
                                        assess their overall performance?
                                      </td>
                                      <td class="text-right">
                                        <a
                                          href="javascript:void(0)"
                                          class="btn btnxs btn-gray"
                                        >
                                          Added
                                        </a>
                                      </td>
                                    </tr>
                                  </table>
                                </li>
                                <li>
                                  <table class="quest">
                                    <tr>
                                      <td>3.</td>
                                      <td>
                                        What do you consider to be their main
                                        strengths? (Please consider both
                                        technical skills and personal
                                        attributes)
                                      </td>
                                      <td class="text-right">
                                        <a
                                          href="javascript:void(0)"
                                          class="btn btnxs btn-secondary-outline"
                                          data-dismiss="modal"
                                          aria-label="Close"
                                        >
                                          <i class="material-icons">
                                            add_circle
                                          </i>
                                          &nbsp; Add
                                        </a>
                                      </td>
                                    </tr>
                                  </table>
                                </li>
                                <li>
                                  <table class="quest">
                                    <tr>
                                      <td>4.</td>
                                      <td>
                                        Please rate and comment on their ability
                                        to find innovative ways to solve
                                        problems.
                                      </td>
                                      <td class="text-right">
                                        <a
                                          href="javascript:void(0)"
                                          class="btn btnxs btn-secondary-outline"
                                        >
                                          <i class="material-icons">
                                            add_circle
                                          </i>
                                          &nbsp; Add
                                        </a>
                                      </td>
                                    </tr>
                                  </table>
                                </li>
                                <li>
                                  <table class="quest">
                                    <tr>
                                      <td>5.</td>
                                      <td>
                                        Please rate and comment on their
                                        willingness to accept responsibility and
                                        accountability
                                      </td>
                                      <td class="text-right">
                                        <a
                                          href="javascript:void(0)"
                                          class="btn btnxs btn-secondary-outline"
                                        >
                                          <i class="material-icons">
                                            add_circle
                                          </i>
                                          &nbsp; Add
                                        </a>
                                      </td>
                                    </tr>
                                  </table>
                                </li>
                                <li>
                                  <table class="quest">
                                    <tr>
                                      <td>6.</td>
                                      <td>
                                        Please rate and comment on their
                                        liaison, facilitation, negotiation and
                                        communication skills.
                                      </td>
                                      <td class="text-right">
                                        <a
                                          href="javascript:void(0)"
                                          class="btn btnxs btn-secondary-outline"
                                        >
                                          <i class="material-icons">
                                            add_circle
                                          </i>
                                          &nbsp; Add
                                        </a>
                                      </td>
                                    </tr>
                                  </table>
                                </li>
                                <li>
                                  <table class="quest">
                                    <tr>
                                      <td>7.</td>
                                      <td>
                                        How would you rate their level of
                                        strategic planning? Please provide
                                        examples to support your answer.
                                      </td>
                                      <td class="text-right">
                                        <a
                                          href="javascript:void(0)"
                                          class="btn btnxs btn-secondary-outline"
                                        >
                                          <i class="material-icons">
                                            add_circle
                                          </i>
                                          &nbsp; Add
                                        </a>
                                      </td>
                                    </tr>
                                  </table>
                                </li>
                                <li>
                                  <table class="quest">
                                    <tr>
                                      <td>8.</td>
                                      <td>
                                        Please rate and comment on their
                                        leadership I performance management
                                        skills. and their ability to coach both
                                        low and high performers to develop a
                                        high performance team
                                      </td>
                                      <td class="text-right">
                                        <a
                                          href="javascript:void(0)"
                                          class="btn btnxs btn-gray"
                                        >
                                          Added
                                        </a>
                                      </td>
                                    </tr>
                                  </table>
                                </li>
                                <li>
                                  <table class="quest">
                                    <tr>
                                      <td>9.</td>
                                      <td>
                                        Are you happy for us to contact you for
                                        further information, if required? If so,
                                        please indicate 0 what day and time
                                        would be best to do so
                                      </td>
                                      <td class="text-right">
                                        <a
                                          href="javascript:void(0)"
                                          class="btn btnxs btn-secondary-outline"
                                        >
                                          <i class="material-icons">
                                            add_circle
                                          </i>
                                          &nbsp; Add
                                        </a>
                                      </td>
                                    </tr>
                                  </table>
                                </li>
                                <li>
                                  <table class="quest">
                                    <tr>
                                      <td>10.</td>
                                      <td>
                                        Would you rehire them if you were given
                                        the opportunity and had an appropriate
                                        role?
                                      </td>
                                      <td class="text-right">
                                        <a
                                          href="javascript:void(0)"
                                          class="btn btnxs btn-secondary-outline"
                                        >
                                          <i class="material-icons">
                                            add_circle
                                          </i>
                                          &nbsp; Add
                                        </a>
                                      </td>
                                    </tr>
                                  </table>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div class="modal-footer">
                          <button
                            type="button"
                            class="btn btn-secondary-outline"
                            data-dismiss="modal"
                          >
                            Close
                          </button>
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
    </div>
  );
}

export default TemplateBuilder;
