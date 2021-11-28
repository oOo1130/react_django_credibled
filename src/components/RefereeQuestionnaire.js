import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import logo from "../assets/img/credibled_logo_205x45.png";
import { API } from "../Api";
import { withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import { detectBrowser, getDate } from "../Common";

function RefereeQuestionnaire() {
  const params = useParams();
  const [recruiterName, setRecruiterName] = useState("");
  const [recruiterEmail, setRecruiterEmail] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [candidateLName, setCandidateLName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [questionnaire, setQuestionnaire] = useState("");
  const [qtnType, setQtnType] = useState("");
  const [noOfQuestions, setNoOfQuestions] = useState("");
  const [questionList, setQuestionList] = useState("");
  const [refereeFirstName, setRefereeFirstName] = useState("");
  const [refereeLastName, setRefereeLastName] = useState("");
  const [refereeEmail, setRefereeEmail] = useState("");
  const [refereeOrg, setRefereeOrg] = useState("");
  const [sliderVal1, setSliderVal1] = useState(0);
  const [sliderVal2, setSliderVal2] = useState(0);
  const [sliderVal3, setSliderVal3] = useState(0);
  const [sliderVal4, setSliderVal4] = useState(0);
  const [sliderVal5, setSliderVal5] = useState(0);
  const [sliderVal6, setSliderVal6] = useState(0);
  const [sliderVal7, setSliderVal7] = useState(0);
  const [sliderVal8, setSliderVal8] = useState(0);
  const [sliderVal9, setSliderVal9] = useState(0);
  const [countryISO, setCountryISO] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const qtnCount = 10;
  const errorMessage = "This is required";
  var questionsArr;
  var html_tag;

  const publicIp = require("public-ip");
  publicIp
    .v4({
      onlyHttps: true,
    })
    .then((ip) => {
      setIpAddress(ip);
    });

  useEffect(() => {
    if (params.candidateHash && params.refereeHash) {
      API.getCandidateDetails(params.candidateHash)
        .then((data) => {
          setRecruiterName(data[0].recruiterName);
          setCandidateName(data[0].firstName);
          setCandidateLName(data[0].lastName);
          setCandidateEmail(data[0].email);
          setRecruiterEmail(data[0].recruiter);
          setQuestionnaire(data[0].questionnaire);
        })
        .catch((error) => console.log(error));

      API.getRefereeDetails({
        candidateHash: params.candidateHash,
        refereeHash: params.refereeHash,
      })
        .then((data) => {
          setRefereeFirstName(data[0].refereeFirstName);
          setRefereeLastName(data[0].refereeLastName);
          setRefereeOrg(data[0].refereeOrganization);
          setRefereeEmail(data[0].refereeEmail);
          if (data[0].refereeResponse == "completed") {
            window.location.href =
              "/referee-summary/" +
              params.name +
              "/" +
              params.candidateHash +
              "/" +
              params.refereeHash;
          }
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

  useEffect(() => {
    API.getTemplates({ questionnaire, email: recruiterEmail }).then((resp) => {
      if (resp.length > 0) {
        setQtnType("user");
        setQuestionList(resp[0].questions);
        setNoOfQuestions(resp[0].noOfQuestions);
      } else {
        setQtnType("system");
      }
    });
  }, [questionnaire]);

  // useEffect(() => {}, [questionList]);

  const renderQtnTemplate = (questionList) => {
    var count = 1;
    html_tag = "";
    questionsArr = questionList.split("`CREDDIV`");
    for (let i = 0; i < questionsArr.length; i++) {
      var errorMsgId = "qtn_" + count + "_Error";
      html_tag = (
        <span>
          {" "}
          {html_tag}{" "}
          <li>
            <div className="gray-box1">
              <table className="quest">
                <tr>
                  <td>{count}.</td>
                  <td className="question">
                    <span className="sup_char">
                      <sup>* </sup>
                    </span>
                    {questionsArr[i]}
                    <p className="answer">
                      <div className="form-group bmd-form-group">
                        <label className="bmd-label-floating">
                          Your comments:
                        </label>
                        <textarea
                          maxlength="8000"
                          className="form-control"
                          rows="2"
                          id={"qtn_" + count}
                          onChange={() => {
                            var x = document.getElementById(errorMsgId);
                            x.style.display = "none";
                          }}
                        ></textarea>
                      </div>
                      <div
                        className="notes"
                        id={errorMsgId}
                        style={{ display: `none` }}
                      >
                        {errorMessage}
                      </div>
                    </p>
                  </td>
                </tr>
              </table>
            </div>
          </li>
        </span>
      );
      count++;
    }
    // console.log(html_tag);
    return html_tag;
  };

  const handleSlider1Change = (event, newValue) => {
    setSliderVal1(newValue);
    var x = document.getElementById("qtn_8_Error");
    x.style.display = "none";
  };
  const handleSlider2Change = (event, newValue) => {
    setSliderVal2(newValue);
    var x = document.getElementById("qtn_8_Error");
    x.style.display = "none";
  };
  const handleSlider3Change = (event, newValue) => {
    setSliderVal3(newValue);
    var x = document.getElementById("qtn_8_Error");
    x.style.display = "none";
  };
  const handleSlider4Change = (event, newValue) => {
    setSliderVal4(newValue);
    var x = document.getElementById("qtn_8_Error");
    x.style.display = "none";
  };
  const handleSlider5Change = (event, newValue) => {
    setSliderVal5(newValue);
    var x = document.getElementById("qtn_8_Error");
    x.style.display = "none";
  };
  const handleSlider6Change = (event, newValue) => {
    setSliderVal6(newValue);
    var x = document.getElementById("qtn_8_Error");
    x.style.display = "none";
  };
  const handleSlider7Change = (event, newValue) => {
    setSliderVal7(newValue);
    var x = document.getElementById("qtn_8_Error");
    x.style.display = "none";
  };
  const handleSlider8Change = (event, newValue) => {
    setSliderVal8(newValue);
  };
  const handleSlider9Change = (event, newValue) => {
    setSliderVal9(newValue);
    var x = document.getElementById("qtn_8_Error");
    x.style.display = "none";
  };

  const PrettoSlider = withStyles({
    root: {
      color: "#250c77",
      height: 8,
      width: 350,
      position: "absolute",
    },
    thumb: {
      height: 24,
      width: 24,
      backgroundColor: "#ef7441",
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
      transition: "none",
    },
    rail: {
      height: 8,
      borderRadius: 4,
    },
  })(Slider);

  const checkBoxChanged = () => {
    // if (document.getElementById("checkBoxContact").checked == true) {
    //   var x = (document.getElementById("btnQuestSubmit").disabled = false);
    // } else {
    //   var x = (document.getElementById("btnQuestSubmit").disabled = true);
    // }
  };

  const submitClicked = () => {
    if (qtnType == "system") {
      for (let i = 1; i <= qtnCount; i++) {
        if (i == 8) {
          continue;
        }

        let qtn_id = "qtn_" + i;
        if (document.getElementById(qtn_id)) {
          if (document.getElementById(qtn_id).value == "") {
            document.getElementById(qtn_id).focus();
            var x = document.getElementById(qtn_id + "_Error");
            x.style.display = "block";
            return false;
          }
        }
      }

      if (
        sliderVal1 == 0 ||
        sliderVal2 == 0 ||
        sliderVal3 == 0 ||
        sliderVal4 == 0 ||
        sliderVal5 == 0 ||
        sliderVal6 == 0 ||
        sliderVal7 == 0 ||
        sliderVal8 == 0 ||
        sliderVal9 == 0
      ) {
        var x = document.getElementById("qtn_8_Error");
        x.style.display = "block";
        document.getElementById("ratingRequired").focus();
        return false;
      }

      API.questionnaireResponse({
        candidateHash: params.candidateHash,
        refereeHash: params.refereeHash,
        refereeFirstName: refereeFirstName,
        refereeLastName: refereeLastName,
        response: "answered",
        question1: document.getElementById("qtn_1").value,
        question2: document.getElementById("qtn_2").value,
        question3: document.getElementById("qtn_3").value,
        question4: document.getElementById("qtn_4").value,
        question5: document.getElementById("qtn_5").value,
        question6: document.getElementById("qtn_6").value,
        question7: document.getElementById("qtn_7").value,
        question8: !!document.getElementById("qtn_8").value
          ? document.getElementById("qtn_8").value
          : null,
        question9: document.getElementById("qtn_9").value,
        question10: document.getElementById("qtn_10").value,
        rating1: sliderVal1,
        rating2: sliderVal2,
        rating3: sliderVal3,
        rating4: sliderVal4,
        rating5: sliderVal5,
        rating6: sliderVal6,
        rating7: sliderVal7,
        rating8: sliderVal8,
        rating9: sliderVal9,
      })
        .then(() => {
          API.updateLifeCycle({
            candidateHash: params.candidateHash,
            refereeHash: params.refereeHash,
            userType: "Referee",
            name: refereeFirstName + " " + refereeLastName,
            action: "Answered",
            date: getDate(),
            osBrowser: detectBrowser(),
            ipAddress: !!ipAddress ? ipAddress : null,
            locationISP: !!countryISO ? countryISO : null,
          });

          API.updateRefereeResponse({
            candidateHash: params.candidateHash,
            refereeHash: params.refereeHash,
            response: "completed",
          })
            .then(() => {
              API.sendRefCompleteMail({
                email: refereeEmail,
                sender: "referee",
                recruiterName: recruiterName,
                candidateFName: candidateName,
                candidateLName,
                refereeName: refereeFirstName,
                organisation: refereeOrg,
              }).catch((error) => console.log(error));

              API.sendRefCompleteMail({
                email: candidateEmail,
                sender: "candidate",
                recruiterName: recruiterName,
                candidateFName: candidateName,
                candidateLName,
                refereeName: refereeFirstName,
                organisation: refereeOrg,
              }).catch((error) => console.log(error));

              API.sendRefCompleteMail({
                email: recruiterEmail,
                sender: "recruiter",
                recruiterName: recruiterName,
                candidateFName: candidateName,
                candidateLName,
                refereeName: refereeFirstName,
                organisation: refereeOrg,
              })
                .then((resp) => {
                  if (resp.message == "email sent successfully") {
                    window.location.href =
                      "/referee-summary/" +
                      params.name +
                      "/" +
                      params.candidateHash +
                      "/" +
                      params.refereeHash;
                  }
                })
                .catch((error) => console.log(error));
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    } else if (qtnType == "user") {
      var answers = "";
      for (let i = 1; i <= questionsArr.length; i++) {
        let qtn_id = "qtn_" + i;
        if (document.getElementById(qtn_id)) {
          if (document.getElementById(qtn_id).value == "") {
            document.getElementById(qtn_id).focus();
            var x = document.getElementById(qtn_id + "_Error");
            x.style.display = "block";
            return false;
          }
        }
        if (answers == "") {
          answers = document.getElementById(qtn_id).value;
        } else {
          answers =
            answers + "`CREDDIV`" + document.getElementById(qtn_id).value;
        }
      }

      API.questionnaireResponse({
        candidateHash: params.candidateHash,
        refereeHash: params.refereeHash,
        refereeFirstName: refereeFirstName,
        refereeLastName: refereeLastName,
        response: "answered",
        questionnaireResponse: answers,
      })
        .then(() => {
          API.updateLifeCycle({
            candidateHash: params.candidateHash,
            refereeHash: params.refereeHash,
            userType: "Referee",
            name: refereeFirstName + " " + refereeLastName,
            action: "Answered",
            date: getDate(),
            osBrowser: detectBrowser(),
            ipAddress: !!ipAddress ? ipAddress : null,
            locationISP: !!countryISO ? countryISO : null,
          });

          API.updateRefereeResponse({
            candidateHash: params.candidateHash,
            refereeHash: params.refereeHash,
            response: "completed",
          })
            .then(() => {
              API.sendRefCompleteMail({
                email: refereeEmail,
                sender: "referee",
                recruiterName: recruiterName,
                candidateFName: candidateName,
                candidateLName,
                refereeName: refereeFirstName,
                organisation: refereeOrg,
              }).catch((error) => console.log(error));

              API.sendRefCompleteMail({
                email: candidateEmail,
                sender: "candidate",
                recruiterName: recruiterName,
                candidateFName: candidateName,
                candidateLName,
                refereeName: refereeFirstName,
                organisation: refereeOrg,
              }).catch((error) => console.log(error));

              API.sendRefCompleteMail({
                email: recruiterEmail,
                sender: "recruiter",
                recruiterName: recruiterName,
                candidateFName: candidateName,
                candidateLName,
                refereeName: refereeFirstName,
                organisation: refereeOrg,
              })
                .then((resp) => {
                  if (resp.message == "email sent successfully") {
                    window.location.href =
                      "/referee-summary/" +
                      params.name +
                      "/" +
                      params.candidateHash +
                      "/" +
                      params.refereeHash;
                  }
                })
                .catch((error) => console.log(error));
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    }
  };

  // const reviewClicked = () => {
  //   window.location.href =
  //     "/referee-review/" +
  //     params.name +
  //     "/" +
  //     params.candidateHash +
  //     "/" +
  //     params.refereeHash;
  // };

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-6 bg-primary text-left">&nbsp;</div>
          <div className="col-6 bg-secondary text-right">&nbsp;</div>
        </div>
      </div>
      <div className="wrapper">
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="mt3">
                  <a className="navbar-brand" href="index.html">
                    <img src={logo} alt="Credibled Logo" />
                  </a>
                </div>

                <div className="card-plain mt2">
                  <div className="stepper">
                    <div className="stepper-steps">
                      <div className="stepper-step ss25 stepper-step-isActive">
                        <div className="stepper-stepContent step_active_primary">
                          <a
                            href={
                              "/referee-accept/" +
                              params.name +
                              "/" +
                              params.candidateHash +
                              "/" +
                              params.refereeHash
                            }
                            className="text-primary"
                          >
                            <span className="stepper-stepMarker">1</span>Before
                            we begin
                          </a>
                        </div>
                      </div>
                      <div className="stepper-step ss25 stepper-step-isActive">
                        <div className="stepper-stepContent step_active_primary">
                          <a
                            href={
                              "/referee-verify/" +
                              params.name +
                              "/" +
                              params.candidateHash +
                              "/" +
                              params.refereeHash
                            }
                            className="text-primary"
                          >
                            <span className="stepper-stepMarker">2</span>Verify
                            the basics
                          </a>
                        </div>
                      </div>
                      <div className="stepper-step ss25 stepper-step-isActive">
                        <div className="stepper-stepContent step_active">
                          <span className="stepper-stepMarker">3</span>
                          Questionnaire
                        </div>
                      </div>
                      <div className="stepper-step ss25">
                        <div className="stepper-stepContent">
                          <span className="stepper-stepMarker">4</span>Review &
                          Submit
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      {/* <h4 className="text-primary pl1">
                        Notes from the respective employer&nbsp;
                        <a id="shownotes">
                          <i className="fa fa-plus-circle text-secondary"></i>
                        </a>
                      </h4>

                      <div
                        className="card-plain mb1 mlr1em"
                        id="notes"
                        style={{ display: "none" }}
                      >
                        <div className="alert alert-warning fade show">
                          <strong>Lorem ipsum dolor sit amet,</strong>{" "}
                          consectetur adipiscing elit. Nulla vestibulum lobortis
                          nulla nec euismod. Pellentesque non ipsum leo.
                          Praesent nec purus nec orci ultricies auctor.
                        </div>
                      </div> */}
                      {/* Questionnaire Start */}
                      {qtnType == "system" ? (
                        <ul id="questionnaire">
                          <li className="pl1">
                            <h4 className="text-secondary">10 Questions</h4>
                            <small>
                              (&nbsp;
                              <span className="sup_char">
                                <sup>*</sup>
                              </span>{" "}
                              Mandatory)
                            </small>
                          </li>

                          <li>
                            <div className="gray-box1">
                              <table className="quest">
                                <tr>
                                  <td>1.</td>
                                  <td className="question">
                                    <span className="sup_char">
                                      <sup>* </sup>
                                    </span>
                                    How long did you work together (
                                    <i>approx. dates</i>)? What was your working
                                    relationship?
                                    <p className="answer">
                                      <div className="form-group bmd-form-group">
                                        <label className="bmd-label-floating">
                                          Your comments:
                                        </label>
                                        <textarea
                                          maxlength="8000"
                                          className="form-control"
                                          rows="2"
                                          id="qtn_1"
                                          onChange={() => {
                                            var x =
                                              document.getElementById(
                                                "qtn_1_Error"
                                              );
                                            x.style.display = "none";
                                          }}
                                        ></textarea>
                                      </div>
                                      <div
                                        className="notes"
                                        id="qtn_1_Error"
                                        style={{ display: `none` }}
                                      >
                                        {errorMessage}
                                      </div>
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </li>
                          <li>
                            <div className="gray-box1">
                              <table className="quest">
                                <tr>
                                  <td>2.</td>
                                  <td className="question">
                                    <span className="sup_char">
                                      <sup>* </sup>
                                    </span>
                                    What were the main duties of their job?
                                    <p className="answer">
                                      <div className="form-group bmd-form-group">
                                        <label className="bmd-label-floating">
                                          Your comments:
                                        </label>
                                        <textarea
                                          maxlength="8000"
                                          className="form-control"
                                          rows="2"
                                          id="qtn_2"
                                          onChange={() => {
                                            var x =
                                              document.getElementById(
                                                "qtn_2_Error"
                                              );
                                            x.style.display = "none";
                                          }}
                                        ></textarea>
                                      </div>
                                      <div
                                        className="notes"
                                        id="qtn_2_Error"
                                        style={{ display: `none` }}
                                      >
                                        {errorMessage}
                                      </div>
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </li>
                          <li>
                            <div className="gray-box1">
                              <table className="quest">
                                <tr>
                                  <td>3.</td>
                                  <td className="question">
                                    <span className="sup_char">
                                      <sup>* </sup>
                                    </span>
                                    What is your overall appraisal of their
                                    work?
                                    <p className="answer">
                                      <div className="form-group bmd-form-group">
                                        <label className="bmd-label-floating">
                                          Your comments:
                                        </label>
                                        <textarea
                                          maxlength="8000"
                                          className="form-control"
                                          rows="2"
                                          id="qtn_3"
                                          onChange={() => {
                                            var x =
                                              document.getElementById(
                                                "qtn_3_Error"
                                              );
                                            x.style.display = "none";
                                          }}
                                        ></textarea>
                                      </div>
                                      <div
                                        className="notes"
                                        id="qtn_3_Error"
                                        style={{ display: `none` }}
                                      >
                                        {errorMessage}
                                      </div>
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </li>
                          <li>
                            <div className="gray-box1">
                              <table className="quest">
                                <tr>
                                  <td>4.</td>
                                  <td className="question">
                                    <span className="sup_char">
                                      <sup>* </sup>
                                    </span>
                                    What are their strong points? What are their
                                    technical strengths? If you can, please give
                                    examples of how these strengths were
                                    demonstrated.
                                    <p className="answer">
                                      <div className="form-group bmd-form-group">
                                        <label className="bmd-label-floating">
                                          Your comments:
                                        </label>
                                        <textarea
                                          maxlength="8000"
                                          className="form-control"
                                          rows="2"
                                          onChange={() => {
                                            var x =
                                              document.getElementById(
                                                "qtn_4_Error"
                                              );
                                            x.style.display = "none";
                                          }}
                                          id="qtn_4"
                                        ></textarea>
                                      </div>
                                      <div
                                        className="notes"
                                        id="qtn_4_Error"
                                        style={{ display: `none` }}
                                      >
                                        {errorMessage}
                                      </div>
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </li>
                          <li>
                            <div className="gray-box1">
                              <table className="quest">
                                <tr>
                                  <td>5.</td>
                                  <td className="question">
                                    <span className="sup_char">
                                      <sup>* </sup>
                                    </span>
                                    How does they perform under pressure?
                                    <p className="answer">
                                      <div className="form-group bmd-form-group">
                                        <label className="bmd-label-floating">
                                          Your comments:
                                        </label>
                                        <textarea
                                          maxlength="8000"
                                          className="form-control"
                                          rows="2"
                                          id="qtn_5"
                                          onChange={() => {
                                            var x =
                                              document.getElementById(
                                                "qtn_5_Error"
                                              );
                                            x.style.display = "none";
                                          }}
                                        ></textarea>
                                      </div>
                                      <div
                                        className="notes"
                                        id="qtn_5_Error"
                                        style={{ display: `none` }}
                                      >
                                        {errorMessage}
                                      </div>
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </li>
                          <li>
                            <div className="gray-box1">
                              <table className="quest">
                                <tr>
                                  <td>6.</td>
                                  <td className="question">
                                    <span className="sup_char">
                                      <sup>* </sup>
                                    </span>
                                    How does they get along with other people? (
                                    <i>supervisors, peers, and subordinates</i>
                                    ).
                                    <p className="answer">
                                      <div className="form-group bmd-form-group">
                                        <label className="bmd-label-floating">
                                          Your comments:
                                        </label>
                                        <textarea
                                          maxlength="8000"
                                          className="form-control"
                                          rows="2"
                                          id="qtn_6"
                                          onChange={() => {
                                            var x =
                                              document.getElementById(
                                                "qtn_6_Error"
                                              );
                                            x.style.display = "none";
                                          }}
                                        ></textarea>
                                      </div>
                                      <div
                                        className="notes"
                                        id="qtn_6_Error"
                                        style={{ display: `none` }}
                                      >
                                        {errorMessage}
                                      </div>
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </li>
                          <li>
                            <div className="gray-box1">
                              <table className="quest">
                                <tr>
                                  <td>7.</td>
                                  <td className="question">
                                    <span className="sup_char">
                                      <sup>* </sup>
                                    </span>
                                    How are their communication skills?
                                    <p className="answer">
                                      <div className="form-group bmd-form-group">
                                        <label className="bmd-label-floating">
                                          Your comments:
                                        </label>
                                        <textarea
                                          maxlength="8000"
                                          className="form-control"
                                          rows="2"
                                          id="qtn_7"
                                          onChange={() => {
                                            var x =
                                              document.getElementById(
                                                "qtn_7_Error"
                                              );
                                            x.style.display = "none";
                                          }}
                                        ></textarea>
                                      </div>
                                      <div
                                        className="notes"
                                        id="qtn_7_Error"
                                        style={{ display: `none` }}
                                      >
                                        {errorMessage}
                                      </div>
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </li>
                          <li>
                            <div className="gray-box1">
                              <table className="quest">
                                <tr>
                                  <td>8.</td>
                                  <td className="question">
                                    <span className="sup_char">
                                      <sup>* </sup>
                                    </span>
                                    Please comment on each of the following:{" "}
                                    <h6 className="pt1">
                                      1-<span> Poor</span>&nbsp; 2-
                                      <span> Average</span>&nbsp; 3-
                                      <span> Fair</span> &nbsp; 4-
                                      <span> Good </span> &nbsp; 5-
                                      <span> Excellent</span>{" "}
                                    </h6>
                                    <span
                                      className="notes"
                                      id="qtn_8_Error"
                                      style={{
                                        display: `none`,
                                        textAlign: "center",
                                      }}
                                    >
                                      Ratings are Required
                                      <input
                                        id="ratingRequired"
                                        style={{
                                          opacity: "0",
                                          width: "0",
                                        }}
                                      />
                                    </span>
                                    <ul id="rating">
                                      <li>
                                        <div className="row pmzero">
                                          <div className="col-md-6 pt2">
                                            Attendance
                                          </div>
                                          <div className="col-md-6">
                                            <div className="range-slider">
                                              <span
                                                className="range-slider__value"
                                                style={{ marginRight: "20px" }}
                                              >
                                                {sliderVal1}
                                              </span>
                                              <Slider
                                                valueLabelDisplay="auto"
                                                step={1}
                                                marks
                                                min={0}
                                                max={5}
                                                value={sliderVal1}
                                                onChange={handleSlider1Change}
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
                                        <div className="row pmzero">
                                          <div className="col-md-6 pt2">
                                            Dependability & Overall Attitude
                                          </div>
                                          <div className="col-md-6">
                                            <div className="range-slider">
                                              <span
                                                className="range-slider__value"
                                                style={{ marginRight: "20px" }}
                                              >
                                                {sliderVal2}
                                              </span>
                                              <Slider
                                                valueLabelDisplay="auto"
                                                aria-label="pretto slider"
                                                step={1}
                                                marks
                                                min={0}
                                                max={5}
                                                defaultValue={0}
                                                value={sliderVal2}
                                                onChange={handleSlider2Change}
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
                                        <div className="row pmzero">
                                          <div className="col-md-6 pt2">
                                            Ability to take on Responsibility
                                          </div>
                                          <div className="col-md-6">
                                            <div className="range-slider">
                                              <span
                                                className="range-slider__value"
                                                style={{ marginRight: "20px" }}
                                              >
                                                {sliderVal3}
                                              </span>
                                              <Slider
                                                valueLabelDisplay="auto"
                                                aria-label="pretto slider"
                                                step={1}
                                                marks
                                                min={0}
                                                max={5}
                                                defaultValue={0}
                                                value={sliderVal3}
                                                onChange={handleSlider3Change}
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
                                        <div className="row pmzero">
                                          <div className="col-md-6 pt2">
                                            Potential for advancement
                                          </div>
                                          <div className="col-md-6">
                                            <div className="range-slider">
                                              <span
                                                className="range-slider__value"
                                                style={{ marginRight: "20px" }}
                                              >
                                                {sliderVal4}
                                              </span>
                                              <Slider
                                                valueLabelDisplay="auto"
                                                aria-label="pretto slider"
                                                step={1}
                                                marks
                                                min={0}
                                                max={5}
                                                defaultValue={0}
                                                value={sliderVal4}
                                                onChange={handleSlider4Change}
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
                                        <div className="row pmzero">
                                          <div className="col-md-6 pt2">
                                            Degree of Supervision needed
                                          </div>
                                          <div className="col-md-6">
                                            <div className="range-slider">
                                              <span
                                                className="range-slider__value"
                                                style={{ marginRight: "20px" }}
                                              >
                                                {sliderVal5}
                                              </span>
                                              <Slider
                                                valueLabelDisplay="auto"
                                                aria-label="pretto slider"
                                                step={1}
                                                marks
                                                min={0}
                                                max={5}
                                                defaultValue={0}
                                                value={sliderVal5}
                                                onChange={handleSlider5Change}
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
                                        <div className="row pmzero">
                                          <div className="col-md-6 pt2">
                                            Attention to detail
                                          </div>
                                          <div className="col-md-6">
                                            <div className="range-slider">
                                              <span
                                                className="range-slider__value"
                                                style={{ marginRight: "20px" }}
                                              >
                                                {sliderVal6}
                                              </span>
                                              <Slider
                                                valueLabelDisplay="auto"
                                                aria-label="pretto slider"
                                                step={1}
                                                marks
                                                min={0}
                                                max={5}
                                                defaultValue={0}
                                                value={sliderVal6}
                                                onChange={handleSlider6Change}
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
                                        <div className="row pmzero">
                                          <div className="col-md-6 pt2">
                                            Ability to make decisions
                                          </div>
                                          <div className="col-md-6">
                                            <div className="range-slider">
                                              <span
                                                className="range-slider__value"
                                                style={{ marginRight: "20px" }}
                                              >
                                                {sliderVal7}
                                              </span>
                                              <Slider
                                                valueLabelDisplay="auto"
                                                aria-label="pretto slider"
                                                step={1}
                                                marks
                                                min={0}
                                                max={5}
                                                defaultValue={0}
                                                value={sliderVal7}
                                                onChange={handleSlider7Change}
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
                                        <div className="row pmzero">
                                          <div className="col-md-6 pt2">
                                            Leadership/Management ability and
                                            style
                                          </div>
                                          <div className="col-md-6">
                                            <div className="range-slider">
                                              <span
                                                className="range-slider__value"
                                                style={{ marginRight: "20px" }}
                                              >
                                                {sliderVal8}
                                              </span>
                                              <Slider
                                                valueLabelDisplay="auto"
                                                aria-label="pretto slider"
                                                step={1}
                                                marks
                                                min={0}
                                                max={5}
                                                defaultValue={0}
                                                value={sliderVal8}
                                                onChange={handleSlider8Change}
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
                                        <div className="row pmzero">
                                          <div className="col-md-6 pt2">
                                            Problem solving and strategic
                                            thinking
                                          </div>
                                          <div className="col-md-6">
                                            <div className="range-slider">
                                              <span
                                                className="range-slider__value"
                                                style={{ marginRight: "20px" }}
                                              >
                                                {sliderVal9}
                                              </span>
                                              <Slider
                                                valueLabelDisplay="auto"
                                                aria-label="pretto slider"
                                                step={1}
                                                marks
                                                min={0}
                                                max={5}
                                                defaultValue={0}
                                                value={sliderVal9}
                                                onChange={handleSlider9Change}
                                                style={{
                                                  width: "75%",
                                                  position: "absolute",
                                                }}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </li>
                                    </ul>
                                    <p className="answer">
                                      <div className="form-group bmd-form-group">
                                        <label className="bmd-label-floating">
                                          Your comments:
                                        </label>
                                        <textarea
                                          maxlength="8000"
                                          className="form-control"
                                          rows="2"
                                          id="qtn_8"
                                        ></textarea>
                                      </div>
                                      <div
                                        className="notes"
                                        id="qtn_8_Error"
                                        style={{ display: `none` }}
                                      >
                                        Ratings are Required
                                      </div>
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </li>
                          <li>
                            <div className="gray-box1">
                              <table className="quest">
                                <tr>
                                  <td>9.</td>
                                  <td className="question">
                                    <span className="sup_char">
                                      <sup>* </sup>
                                    </span>
                                    Why did they leave your company? Would you
                                    re-employ?
                                    <p className="answer">
                                      <div className="form-group bmd-form-group">
                                        <label className="bmd-label-floating">
                                          Your comments:
                                        </label>
                                        <textarea
                                          maxlength="8000"
                                          className="form-control"
                                          rows="2"
                                          id="qtn_9"
                                          onChange={() => {
                                            var x =
                                              document.getElementById(
                                                "qtn_9_Error"
                                              );
                                            x.style.display = "none";
                                          }}
                                        ></textarea>
                                      </div>
                                      <div
                                        className="notes"
                                        id="qtn_9_Error"
                                        style={{ display: `none` }}
                                      >
                                        {errorMessage}
                                      </div>
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </li>
                          <li>
                            <div className="gray-box1">
                              <table className="quest">
                                <tr>
                                  <td>10.</td>
                                  <td className="question">
                                    <span className="sup_char">
                                      <sup>* </sup>
                                    </span>
                                    Is there anything else of significance we
                                    should know? (
                                    <i>
                                      Any concerns or compliments or general
                                      comments
                                    </i>
                                    ?)
                                    <p className="answer">
                                      <div className="form-group bmd-form-group">
                                        <label className="bmd-label-floating">
                                          Your comments:
                                        </label>
                                        <textarea
                                          maxlength="8000"
                                          className="form-control"
                                          rows="2"
                                          id="qtn_10"
                                          onChange={() => {
                                            var x =
                                              document.getElementById(
                                                "qtn_10_Error"
                                              );
                                            x.style.display = "none";
                                          }}
                                        ></textarea>
                                      </div>
                                      <div
                                        className="notes"
                                        id="qtn_10_Error"
                                        style={{ display: `none` }}
                                      >
                                        {errorMessage}
                                      </div>
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </li>
                        </ul>
                      ) : (
                        <ul id="questionnaire">
                          <li className="pl1">
                            <h4 className="text-secondary">
                              {noOfQuestions} Questions
                            </h4>
                            <small>
                              (&nbsp;
                              <span className="sup_char">
                                <sup>*</sup>
                              </span>{" "}
                              Mandatory)
                            </small>
                          </li>
                          {!!questionList
                            ? renderQtnTemplate(questionList)
                            : null}
                        </ul>
                      )}

                      {/* Questionnaire End */}
                    </div>
                  </div>

                  <div className="form-check box-pad">
                    <label className="form-check-label">
                      <input
                        className=""
                        type="checkbox"
                        id="checkBoxContact"
                        onChange={checkBoxChanged}
                      />
                      &nbsp;
                      <small>
                        &nbsp; I agree to be contacted by{" "}
                        <b className="text-secondary">
                          {recruiterName.toUpperCase()}
                        </b>{" "}
                        (Recruiter)
                      </small>
                    </label>
                  </div>

                  <div className="box-pad text-center mt1">
                    {/* <span
                      onClick={reviewClicked}
                      className="btn btn-secondary-outline"
                    >
                      Review
                    </span> */}
                    &nbsp;
                    <input
                      type="button"
                      onClick={submitClicked}
                      className="btn btn-primary"
                      id="btnQuestSubmit"
                      value="Submit"
                    />
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

export default RefereeQuestionnaire;
