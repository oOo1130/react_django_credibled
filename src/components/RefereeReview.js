import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import logo from "../assets/img/credibled_logo_205x45.png";
import { withStyles } from "@material-ui/styles";
import Slider from "@material-ui/core/Slider";
import { API } from "../Api";

function RefereeReview() {
  const params = useParams();
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

  useEffect(() => {
    if (params.candidateHash && params.refereeHash) {
      // API.getRefereeDetails({
      //   candidateHash: params.candidateHash,
      //   refereeHash: params.refereeHash,
      // })
      //   .then((data) => {
      //     if (data[0].refereeResponse == "completed") {
      //       window.location.href =
      //         "/referee-summary/" +
      //         params.name +
      //         "/" +
      //         params.candidateHash +
      //         "/" +
      //         params.refereeHash;
      //     }
      //   })
      //   .catch((error) => console.log(error));
      API.getQuestionnaireData({
        candidateHash: params.candidateHash,
        refereeHash: params.refereeHash,
      })
        .then((data) => {
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
        })
        .catch((error) => console.log(error));
    }
  }, []);

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

  const submitClicked = () => {
    if (params.candidateHash && params.refereeHash) {
      window.location.href =
        "/referee-summary/" +
        params.name +
        "/" +
        params.candidateHash +
        "/" +
        params.refereeHash;
    }
    API.updateRefereeResponse({
      candidateHash: params.candidateHash,
      refereeHash: params.refereeHash,
      response: "completed",
    });
  };

  const goBackClicked = () => {
    if (params.name && params.candidateHash) {
      window.location.href =
        "/referee-questionnaire/" +
        params.name +
        "/" +
        params.candidateHash +
        "/" +
        params.refereeHash;
    }
  };

  return (
    <div>
      <div class="container-fluid">
        <div class="row">
          <div class="col-6 bg-primary text-left">&nbsp;</div>
          <div class="col-6 bg-secondary text-right">&nbsp;</div>
        </div>
      </div>
      <div class="wrapper">
        {/* <div class="main-panel"> */}
        <div class="content">
          <div class="container">
            <div class="row">
              <div class="col-md-12">
                <div class="mt3">
                  <a class="navbar-brand" href="index.html">
                    <img src={logo} alt="Credibled Logo" />
                  </a>
                </div>

                <div class="card-plain mt2">
                  <div class="stepper">
                    <div class="stepper-steps">
                      <div class="stepper-step ss25 stepper-step-isActive">
                        <div class="stepper-stepContent step_active_primary">
                          <a
                            href={
                              "/referee-accept/" +
                              params.name +
                              "/" +
                              params.candidateHash +
                              "/" +
                              params.refereeHash
                            }
                            class="text-primary"
                          >
                            <span class="stepper-stepMarker">1</span>Before we
                            begin
                          </a>
                        </div>
                      </div>
                      <div class="stepper-step ss25 stepper-step-isActive">
                        <div class="stepper-stepContent step_active_primary">
                          <a
                            href={
                              "/referee-verify/" +
                              params.name +
                              "/" +
                              params.candidateHash +
                              "/" +
                              params.refereeHash
                            }
                            class="text-primary"
                          >
                            <span class="stepper-stepMarker">2</span>Verify the
                            basics
                          </a>
                        </div>
                      </div>
                      <div class="stepper-step ss25 stepper-step-isActive">
                        <div class="stepper-stepContent step_active_primary">
                          <a
                            href={
                              "/referee-questionnaire/" +
                              params.name +
                              "/" +
                              params.candidateHash +
                              "/" +
                              params.refereeHash
                            }
                            class="text-primary"
                          >
                            <span class="stepper-stepMarker">3</span>
                            Questionnaire
                          </a>
                        </div>
                      </div>
                      <div class="stepper-step ss25 stepper-step-isActive">
                        <div class="stepper-stepContent step_active">
                          <span class="stepper-stepMarker">4</span>Review &
                          Submit
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-12">
                    {/* <h4 class="text-primary pl1">
                        Notes from the respective employer
                      </h4>

                      <div class="card-plain mb1 mlr1em" id="notes">
                        <div class="alert alert-warning fade show">
                          <strong>Lorem ipsum dolor sit amet,</strong>{" "}
                          consectetur adipiscing elit. Nulla vestibulum lobortis
                          nulla nec euismod. Pellentesque non ipsum leo.
                          Praesent nec purus nec orci ultricies auctor.
                        </div>
                      </div> */}

                    <ul id="questionnaire">
                      <li class="pl1">
                        <h4 class="text-secondary">10 Questions</h4>
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
                                What is your overall appraisal of his/her work?
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
                                What are his/her strong points? What are his/her
                                technical strengths? If you can, please give
                                examples of how these strengths were
                                demonstrated.
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
                                      <div class="col-md-6 pt2">Attendance</div>
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
                                            value={sliderVal7}
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
                                Is there anything else of significance we should
                                know? (
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
                  </div>
                </div>

                <div class="box-pad text-center mt1">
                  <span
                    onClick={goBackClicked}
                    class="btn btn-secondary-outline"
                  >
                    Go Back
                  </span>
                  &nbsp;
                  <span onClick={submitClicked} class="btn btn-primary">
                    Submit
                  </span>
                </div>
              </div>
            </div>
            <div class="clearfix"></div>
          </div>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}

export default RefereeReview;
