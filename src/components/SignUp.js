import React, { useState, useEffect } from "react";
import { API } from "../Api";
import logo from "../assets/img/credibled_logo_205x45.png";
import { useCookies } from "react-cookie";
import stateJSON from "../assets/json/state.json";
import NumberFormat from "react-number-format";

function SignUp() {
  const [token] = useCookies(["credtoken"]);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);

  useEffect(() => {
    if (token["credtoken"]) window.location.href = "/";
    setCountryList(stateJSON);
    if (document.getElementById("btnCreateAccount")) {
      document.getElementById("btnCreateAccount").disabled = true;
    }
  }, [token]);

  const [isSignUpNxtView, setIsSignUpNxtView] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [State, setState] = useState("");
  const [Country, setCountry] = useState("");
  const [Organization, setOrganization] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [NoOfStaff, setNoOfStaff] = useState("");
  const [Email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [temptoken, setTempToken] = useState("");

  var EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  useEffect(() => {
    if (
      userId
        ? API.authUser({ username, password })
            .then((resp) => {
              setTempToken(resp.token);
            })
            .catch((error) => console.log(error))
        : console.log("userId is null")
    );
  }, [userId]);

  useEffect(() => {
    if (
      temptoken
        ? API.signUpUser(
            {
              firstName,
              lastName,
              Email,
              Organization,
              PhoneNumber,
              NoOfStaff: !!NoOfStaff ? NoOfStaff : null,
              State,
              Country,
              PhoneNumber,
            },
            temptoken
          )
            .then(() => {
              triggerVerifyEmail();
              window.location.href = "/signin";
            })
            .catch((error) => console.log(error))
        : console.log("token is null")
    );
  }, [temptoken]);

  const triggerVerifyEmail = () => {
    API.verifyEmail({ Email, firstName }, temptoken)
      .then((resp) => resp)
      .catch((error) => console.log(error));
  };

  const checkBoxClicked = () => {
    if (document.getElementById("checkBoxReview").checked == true) {
      var x = (document.getElementById("btnCreateAccount").disabled = false);
    } else {
      var x = (document.getElementById("btnCreateAccount").disabled = true);
    }
  };

  const signUpClicked = () => {
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

    if (Country == "") {
      var x = document.getElementById("countryError");
      x.style.display = "block";
      return false;
    }
    if (State == "") {
      var x = document.getElementById("stateError");
      x.style.display = "block";
      return false;
    }
    if (Email == "") {
      var x = document.getElementById("emailError");
      x.style.display = "block";
      return false;
    }
    if (Email) {
      if (!Email.match(EMAIL_REGEX)) {
        var x = document.getElementById("invalidEmailError");
        x.style.display = "block";
        return false;
      }
    }

    API.verifyUser({ Email })
      .then((resp) => {
        if (resp.success) {
          setIsSignUpNxtView(true);
        } else {
          var x = document.getElementById("userExistsError");
          x.style.display = "block";
          return false;
        }
      })
      .catch((error) => console.log(error));
  };

  const createUser = () => {
    if (Organization == "") {
      var x = document.getElementById("orgError");
      x.style.display = "block";
      return false;
    }
    // if (NoOfStaff == "") {
    //   var x = document.getElementById("noOfStaffError");
    //   x.style.display = "block";
    //   return false;
    // }
    // if (PhoneCode == "") {
    //   var x = document.getElementById("phnNumError");
    //   x.style.display = "block";
    //   return false;
    // }
    if (PhoneNumber == "") {
      var x = document.getElementById("phnNumError");
      x.style.display = "block";
      return false;
    }
    if (password == "") {
      var x = document.getElementById("pwdError");
      x.style.display = "block";
      return false;
    }
    // if (document.getElementById("checkBoxReview").checked == false) {
    //   return false;
    // }

    API.createUser({ username, password })
      .then((resp) => {
        if (resp.id) {
          setUserId(resp.id);
        }
      })
      .catch((error) => console.log(error));
  };

  const renderState = (country) => {
    for (let i = 0; i < countryList.length; i++) {
      if (countryList[i].country == country) {
        setStateList(countryList[i].states);
        console.log("states:  " + countryList[i].states);
      }
    }
    setState("");
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
        <div className="main-panel">
          <div className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-5 offset-md-2">
                  <div className="text-center">
                    <a className="navbar-brand" href="/signin">
                      <img src={logo} alt="Credibled Logo" />
                    </a>
                    <h4>Sign up</h4>
                  </div>

                  <div className="card">
                    <div className="card-body box-pad">
                      {isSignUpNxtView ? (
                        <div className="row">
                          <div className="col-md-12">
                            <h5>A few final details</h5>
                            <div className="row">
                              <div className="col-md-12">
                                <div className="form-group">
                                  <label className="bmd-label-floating">
                                    Organization
                                    <span className="sup_char">
                                      <sup>*</sup>
                                    </span>
                                  </label>
                                  <input
                                    type="text"
                                    value={Organization}
                                    onChange={(evt) => {
                                      setOrganization(evt.target.value);
                                      var x =
                                        document.getElementById("orgError");
                                      x.style.display = "none";
                                    }}
                                    className="form-control"
                                  />
                                  <div
                                    className="notes"
                                    id="orgError"
                                    style={{ display: `none` }}
                                  >
                                    Organization is required
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="form-group">
                                  <label className="bmd-label-floating">
                                    No. of Staff
                                  </label>
                                  <div className="form-group">
                                    <select
                                      className="form-control select-top"
                                      value={NoOfStaff}
                                      onChange={(evt) => {
                                        setNoOfStaff(evt.target.value);
                                        // var x = document.getElementById(
                                        //   "noOfStaffError"
                                        // );
                                        // x.style.display = "none";
                                      }}
                                    >
                                      <option value="">Select</option>
                                      <option>1-20</option>
                                      <option>21-100</option>
                                      <option>101-500</option>
                                      <option>501-1000</option>
                                      <option>1001-5000</option>
                                      <option>5001-10000</option>
                                      <option>10000+</option>
                                    </select>
                                    <span className="fa fa-fw fa-angle-down field_icon eye"></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label className="bmd-label-floating">
                                    Phone#
                                    <span className="sup_char">
                                      <sup>*</sup>
                                    </span>
                                  </label>
                                  {/* <input
                                    type="text"
                                    value={PhoneNumber}
                                    onChange={(evt) => {
                                      if (/^\d*$/.test(evt.target.value)) {
                                        setPhoneNumber(evt.target.value);
                                      }
                                      var x =
                                        document.getElementById("phnNumError");
                                      x.style.display = "none";
                                    }}
                                    className="form-control"
                                    maxlength="10"
                                  /> */}
                                  <NumberFormat
                                    className="form-control"
                                    format="(###) ###-####"
                                    value={PhoneNumber}
                                    onChange={(evt) => {
                                      setPhoneNumber(evt.target.value);

                                      var x =
                                        document.getElementById("phnNumError");
                                      x.style.display = "none";
                                    }}
                                  />
                                  <div
                                    className="notes"
                                    id="phnNumError"
                                    style={{ display: `none` }}
                                  >
                                    Phone# is required
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-6">
                                <div className="form-group">
                                  <label className="bmd-label-floating">
                                    Password
                                    <span className="sup_char">
                                      <sup>*</sup>
                                    </span>
                                  </label>
                                  <input
                                    type="password"
                                    value={password}
                                    onChange={(evt) => {
                                      setPassword(evt.target.value);
                                      var x =
                                        document.getElementById("pwdError");
                                      x.style.display = "none";
                                    }}
                                    className="form-control"
                                  />
                                  <span
                                    toggle="#password-field"
                                    className="fa fa-fw fa-eye field_icon eye toggle-password"
                                  ></span>
                                  <div
                                    className="notes"
                                    id="pwdError"
                                    style={{ display: `none` }}
                                  >
                                    Password is required
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-12 pb2 text-center">
                                <div className="form-check box-pad">
                                  <label className="">
                                    <input
                                      id="checkBoxReview"
                                      type="checkbox"
                                      onChange={checkBoxClicked}
                                    />
                                    &nbsp; I have reviewed and agree to the{" "}
                                    <a
                                      href="/terms-and-conditions"
                                      target="_new"
                                    >
                                      Terms and Conditions
                                    </a>
                                  </label>
                                </div>
                                <br />
                                <input
                                  type="button"
                                  id="btnCreateAccount"
                                  className="btn btn-primary"
                                  onClick={createUser}
                                  value="Create Account"
                                />

                                <br />
                                <a
                                  href=""
                                  onClick={() => setIsSignUpNxtView(true)}
                                >
                                  Previous
                                </a>
                              </div>
                            </div>
                          </div>
                          <div className="clearfix"></div>
                        </div>
                      ) : (
                        <div className="row">
                          <div className="col-md-12">
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-group mt3">
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
                                      setFirstName(evt.target.value);
                                      var x =
                                        document.getElementById(
                                          "firstNameError"
                                        );
                                      x.style.display = "none";
                                    }}
                                    className="form-control"
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
                                <div className="form-group mt3">
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
                                      setLastName(evt.target.value);
                                      var x =
                                        document.getElementById(
                                          "lastNameError"
                                        );
                                      x.style.display = "none";
                                    }}
                                    className="form-control"
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
                            </div>

                            <div className="row">
                              <div className="col-md-6">
                                <label className="label-static">
                                  Country
                                  <span className="sup_char">
                                    <sup>*</sup>
                                  </span>
                                </label>
                                <div className="form-group">
                                  <select
                                    className="form-control select-top"
                                    id="selectCountry"
                                    name="selectCountry"
                                    value={Country}
                                    onChange={(evt) => {
                                      setCountry(evt.target.value);
                                      renderState(evt.target.value);
                                      var x =
                                        document.getElementById("countryError");
                                      x.style.display = "none";
                                    }}
                                  >
                                    <option value="">Select Country</option>
                                    {countryList.map((localState) => (
                                      <option>{localState.country}</option>
                                    ))}
                                  </select>

                                  <span className="fa fa-fw fa-angle-down field_icon eye"></span>
                                  <div
                                    className="notes"
                                    id="countryError"
                                    style={{ display: `none` }}
                                  >
                                    Country is required
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-6">
                                <label className="label-static">
                                  State/Province
                                  <span className="sup_char">
                                    <sup>*</sup>
                                  </span>
                                </label>
                                <div className="form-group">
                                  <select
                                    className="form-control select-top"
                                    value={State}
                                    onChange={(evt) => {
                                      setState(evt.target.value);
                                      var x =
                                        document.getElementById("stateError");
                                      x.style.display = "none";
                                    }}
                                  >
                                    <option value="">Select State</option>
                                    {stateList.map((localState) => (
                                      <option>{localState}</option>
                                    ))}
                                  </select>
                                  <span className="fa fa-fw fa-angle-down field_icon eye"></span>
                                  <div
                                    className="notes"
                                    id="stateError"
                                    style={{ display: `none` }}
                                  >
                                    State is required
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-12">
                                <div className="form-group">
                                  <label className="bmd-label-floating">
                                    Email address
                                    <span className="sup_char">
                                      <sup>*</sup>
                                    </span>
                                  </label>
                                  <input
                                    type="email"
                                    value={Email}
                                    value={username}
                                    onChange={(evt) => {
                                      setEmail(evt.target.value);
                                      setUsername(evt.target.value);
                                      var x =
                                        document.getElementById("emailError");
                                      x.style.display = "none";
                                      var y =
                                        document.getElementById(
                                          "invalidEmailError"
                                        );
                                      y.style.display = "none";
                                      var y =
                                        document.getElementById(
                                          "userExistsError"
                                        );
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
                                    Email address is invalid
                                  </div>
                                  <div
                                    className="notes"
                                    id="userExistsError"
                                    style={{ display: `none` }}
                                  >
                                    User already registered
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12 pb2 text-center">
                              <span
                                className="btn btn-primary mt2"
                                onClick={signUpClicked}
                              >
                                Sign up
                              </span>
                              <div className="clearfix"></div>
                            </div>
                          </div>
                          <div className="clearfix"></div>
                        </div>
                      )}
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

export default SignUp;
