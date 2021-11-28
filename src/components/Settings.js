import React, { useState, useEffect } from "react";
import { API } from "../Api";
import logo from "../assets/img/credibled_logo_205x45.png";
import { useCookies } from "react-cookie";
import stateJSON from "../assets/json/state.json";

function Settings() {
  const [token, setToken, deleteToken] = useCookies(["credtoken"]);
  const [loginUser, setLoginUser] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [postCode, setPostCode] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [image, setImage] = useState("");
  const [stateList, setStateList] = useState([]);
  const [countryList, setCountryList] = useState([]);

  var EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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

  const renderState = (country) => {
    for (let i = 0; i < countryList.length; i++) {
      if (countryList[i].country == country) {
        setStateList(countryList[i].states);
        console.log("states:  " + countryList[i].states);
      }
    }
    setState("");
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
    setCountryList(stateJSON);

    const username = localStorage.getItem("creduser");
    API.getCurrentUserData(username, token["credtoken"])
      .then((data) => {
        setFirstName(data[0].firstName);
        setEmail(data[0].Email);
        setLastName(data[0].lastName);
        setPhone(data[0].PhoneNumber);
        setAddress1(data[0].address1);
        setAddress2(data[0].address2);
        setPostCode(data[0].postCode);
        setState(data[0].State);
        setCity(data[0].city);
        setCountry(data[0].Country);
        setImage(data[0].profilePicture);
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

  const handleUpdate = () => {
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
        var x = document.getElementById("emailInvalidError");
        x.style.display = "block";
        return false;
      }
    }
    if (phone == "") {
      var x = document.getElementById("phoneError");
      x.style.display = "block";
      return false;
    }
    if (city == "") {
      var x = document.getElementById("cityError");
      x.style.display = "block";
      return false;
    }
    if (postCode == "") {
      var x = document.getElementById("postCodeError");
      x.style.display = "block";
      return false;
    }
    if (country == "") {
      var x = document.getElementById("countryError");
      x.style.display = "block";
      return false;
    }
    if (state == "") {
      var x = document.getElementById("stateError");
      x.style.display = "block";
      return false;
    }

    API.updateUserData(
      {
        email,
        firstName,
        lastName,
        phone,
        address1: !!address1 ? address1 : null,
        address2: !!address2 ? address2 : null,
        city,
        postCode,
        country,
        state,
      },
      token["credtoken"]
    )
      .then((resp) => {
        if (resp.message == "success") {
          var z = document.getElementById("profileUpdSuccess");
          z.style.display = "block";
        }
      })
      .catch((error) => console.log(error));
  };

  const handleProfileCancel = () => {
    var x = document.getElementById("link1");
    x.style.display = "none";
    const username = localStorage.getItem("creduser");
    API.getCurrentUserData(username, token["credtoken"])
      .then((data) => {
        setFirstName(data[0].firstName);
        setEmail(data[0].Email);
        setLastName(data[0].lastName);
        setPhone(data[0].PhoneNumber);
        setAddress1(data[0].address1);
        setAddress2(data[0].address2);
        setPostCode(data[0].postCode);
        setState(data[0].State);
        setCity(data[0].city);
        setCountry(data[0].Country);
        setImage(data[0].profilePicture);
      })
      .catch((error) => console.log(error));
  };

  const handleUpdatePwd = () => {
    if (newPwd == "") {
      var x = document.getElementById("newPwdError");
      x.style.display = "block";
      return false;
    }
    if (confirmPwd == "") {
      var x = document.getElementById("confirmPwdError");
      x.style.display = "block";
      return false;
    }
    if (confirmPwd != newPwd) {
      var x = document.getElementById("pwdMatchError");
      x.style.display = "block";
      return false;
    }

    API.updatePassword({ email, password: confirmPwd }, token["credtoken"])
      .then((resp) => {
        if (resp.message == "success") {
          var z = document.getElementById("pwdUpdSuccess");
          z.style.display = "block";
        }
      })
      .catch((error) => console.log(error));
  };

  function getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }

  const handleUpdateImg = () => {
    let fi = document.getElementById("cred_ProfileImg");
    let fileName = document.querySelector("#cred_ProfileImg").value;
    let extension = fileName.split(".").pop().toUpperCase();
    // alert(extension);
    if (extension == "JPG" || extension == "PNG" || extension == "JPEG") {
      if (fi.files.length > 0) {
        let fsize = fi.files.item(0).size;
        let file = Math.round(fsize / 1024);
        // limit image to 1mb
        if (file >= 1024) {
          return false;
        }

        let profilePicture = "";
        getBase64(fi.files.item(0), (result) => {
          profilePicture = result;
          API.updateProfileImg({ email, profilePicture }, token["credtoken"])
            .then((resp) => {
              if (resp.message == "success") {
                window.location.reload();
              }
            })
            .catch((error) => console.log(error));
        });
      }
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
            <li className="nav-item active">
              <a className="nav-link active1" href="/settings">
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
                        <div className="col-md-6">
                          <h3>Account Settings</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row pb1">
              <div className="col info-box-thin">
                <div className="row">
                  <div className="col">
                    <div className="thumbnail">
                      {image ? (
                        <img
                          src={image}
                          width="60px"
                          height="75px"
                          alt="User"
                        />
                      ) : (
                        <img
                          src="/assets/img/user.png"
                          width="60px"
                          height="75px"
                          alt="User"
                        />
                      )}
                    </div>

                    <div className="user_details">
                      <h4>
                        {firstName} {lastName}
                      </h4>
                      <p className="details">
                        {email}
                        <br />
                        <span className="text-secondary">{phone}</span>
                      </p>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-8">
                    <div className="title-sm">
                      Address{" "}
                      {/* <a
                        data-toggle="modal"
                        data-target="#addAddress"
                        href="javascript:;"
                      >
                        {" "}
                        (Add New){" "}
                      </a> */}
                    </div>
                    <p className="details">
                      {address1} {address2}
                      <br />
                      {!!city ? city + " " : null}
                      {!!state ? state : null}
                      {!!postCode ? ", " + postCode : null}
                      {!!country ? ", " + country : null}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <div className="card">
                  <ul
                    className="nav nav-pills nav-pills-primary nvpills"
                    role="tablist"
                  >
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        role="tablist"
                        href="#"
                        aria-expanded="false"
                        onClick={() => {
                          var y = document.getElementById("link3");
                          y.style.display = "none";
                          var z = document.getElementById("link2");
                          z.style.display = "none";
                          var x = document.getElementById("link1");
                          x.style.display = "block";
                        }}
                      >
                        Edit Profile
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="#"
                        role="tablist"
                        aria-expanded="false"
                        onClick={() => {
                          var x = document.getElementById("link1");
                          x.style.display = "none";
                          var y = document.getElementById("link3");
                          y.style.display = "none";
                          var z = document.getElementById("link2");
                          z.style.display = "block";
                        }}
                      >
                        Change Password
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="#"
                        role="tablist"
                        aria-expanded="false"
                        onClick={() => {
                          var x = document.getElementById("link1");
                          x.style.display = "none";
                          var z = document.getElementById("link2");
                          z.style.display = "none";
                          var y = document.getElementById("link3");
                          y.style.display = "block";
                        }}
                      >
                        Update Profile Image
                      </a>
                    </li>
                  </ul>
                  <div className="tab-content tab-space">
                    <div className="tab-pane" id="link1" aria-expanded="true">
                      <h5>Personal Details</h5>

                      <div className="row">
                        <div className="col-md-3">
                          <div className="form-group bmd-form-group is-filled">
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
                                  document.getElementById("firstNameError");
                                x.style.display = "none";
                                var z =
                                  document.getElementById("profileUpdSuccess");
                                z.style.display = "none";
                              }}
                              className="form-control bmd-form-group is-filled"
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
                        <div className="col-md-3">
                          <div className="form-group bmd-form-group is-filled">
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
                                  document.getElementById("lastNameError");
                                x.style.display = "none";
                                var z =
                                  document.getElementById("profileUpdSuccess");
                                z.style.display = "none";
                              }}
                              className="form-control bmd-form-group is-filled"
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
                        <div className="col-md-3">
                          <div className="form-group bmd-form-group is-filled">
                            <label className="bmd-label-floating">
                              Email address
                              <span className="sup_char">
                                <sup>*</sup>
                              </span>
                            </label>
                            <input
                              type="email"
                              value={email}
                              onChange={(evt) => {
                                setEmail(evt.target.value);
                                var x = document.getElementById("emailError");
                                x.style.display = "none";
                                var y =
                                  document.getElementById("emailInvalidError");
                                y.style.display = "none";
                                var z =
                                  document.getElementById("profileUpdSuccess");
                                z.style.display = "none";
                              }}
                              className="form-control bmd-form-group is-filled"
                            />
                            <div
                              className="notes"
                              id="emailError"
                              style={{ display: `none` }}
                            >
                              Email is required
                            </div>
                            <div
                              className="notes"
                              id="emailInvalidError"
                              style={{ display: `none` }}
                            >
                              Invalid Email
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group bmd-form-group is-filled">
                            <label className="bmd-label-floating">
                              Phone#
                              <span className="sup_char">
                                <sup>*</sup>
                              </span>
                            </label>
                            <input
                              type="text"
                              value={phone}
                              onChange={(evt) => {
                                if (/^\d*$/.test(evt.target.value)) {
                                  setPhone(evt.target.value);
                                  var x = document.getElementById("phoneError");
                                  x.style.display = "none";
                                  var z =
                                    document.getElementById(
                                      "profileUpdSuccess"
                                    );
                                  z.style.display = "none";
                                }
                              }}
                              className="form-control bmd-form-group is-filled"
                            />
                            <div
                              className="notes"
                              id="phoneError"
                              style={{ display: `none` }}
                            >
                              Phone is required
                            </div>
                          </div>
                        </div>
                      </div>

                      <h5>Address</h5>
                      <div className="row">
                        <div className="col-md-2">
                          <div className="form-group bmd-form-group is-filled">
                            <label className="bmd-label-floating">
                              Address1
                            </label>
                            <input
                              type="text"
                              value={address1}
                              onChange={(evt) => {
                                setAddress1(evt.target.value);
                                var z =
                                  document.getElementById("profileUpdSuccess");
                                z.style.display = "none";
                              }}
                              className="form-control bmd-form-group is-filled"
                            />
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="form-group bmd-form-group is-filled">
                            <label className="bmd-label-floating">
                              Address2
                            </label>
                            <input
                              type="text"
                              value={address2}
                              onChange={(evt) => {
                                setAddress2(evt.target.value);
                                var z =
                                  document.getElementById("profileUpdSuccess");
                                z.style.display = "none";
                              }}
                              className="form-control bmd-form-group is-filled"
                            />
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="form-group bmd-form-group is-filled">
                            <label className="bmd-label-floating">
                              City
                              <span className="sup_char">
                                <sup>*</sup>
                              </span>
                            </label>
                            <input
                              type="text"
                              value={city}
                              onChange={(evt) => {
                                setCity(evt.target.value);
                                var x = document.getElementById("cityError");
                                x.style.display = "none";
                                var z =
                                  document.getElementById("profileUpdSuccess");
                                z.style.display = "none";
                              }}
                              className="form-control bmd-form-group is-filled"
                            />
                            <div
                              className="notes"
                              id="cityError"
                              style={{ display: `none` }}
                            >
                              City is required
                            </div>
                          </div>
                        </div>

                        <div className="col-md-2">
                          <div className="form-group bmd-form-group is-filled">
                            <label className="bmd-label-floating">
                              Post Code
                              <span className="sup_char">
                                <sup>*</sup>
                              </span>
                            </label>
                            <input
                              type="text"
                              value={postCode}
                              onChange={(evt) => {
                                setPostCode(evt.target.value);
                                var x =
                                  document.getElementById("postCodeError");
                                x.style.display = "none";
                                var z =
                                  document.getElementById("profileUpdSuccess");
                                z.style.display = "none";
                              }}
                              className="form-control bmd-form-group is-filled"
                            />
                            <div
                              className="notes"
                              id="postCodeError"
                              style={{ display: `none` }}
                            >
                              Post Code is required
                            </div>
                          </div>
                        </div>

                        <div className="col-md-2">
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
                              value={country}
                              onChange={(evt) => {
                                setCountry(evt.target.value);
                                renderState(evt.target.value);
                                var x = document.getElementById("countryError");
                                x.style.display = "none";
                                var z =
                                  document.getElementById("profileUpdSuccess");
                                z.style.display = "none";
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

                        <div className="col-md-2">
                          <label className="label-static">
                            State/Province
                            <span className="sup_char">
                              <sup>*</sup>
                            </span>
                          </label>
                          <div className="form-group">
                            <select
                              className="form-control select-top"
                              value={state}
                              onChange={(evt) => {
                                setState(evt.target.value);
                                var x = document.getElementById("stateError");
                                x.style.display = "none";
                                var z =
                                  document.getElementById("profileUpdSuccess");
                                z.style.display = "none";
                              }}
                            >
                              {stateList.map((localState) => (
                                <option>{localState}</option>
                              ))}

                              {state ? (
                                <option value={state} selected>
                                  {state}
                                </option>
                              ) : (
                                <option value="">Select State</option>
                              )}
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
                        <div className="col-md-12">
                          <div className="box-pad">
                            <a
                              id="hide-info"
                              className="btn btn-secondary-outline"
                              onClick={handleProfileCancel}
                            >
                              Cancel
                            </a>
                            &nbsp;
                            <a
                              id="hide-info1"
                              className="btn btn-primary col-white"
                              onClick={handleUpdate}
                            >
                              Update
                            </a>
                          </div>
                          <div
                            className="notes"
                            id="profileUpdSuccess"
                            style={{ display: `none` }}
                          >
                            Update Success
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="tab-pane" id="link2" aria-expanded="false">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="form-group">
                            <label className="bmd-label-floating">
                              New Password
                              <span className="sup_char">
                                <sup>*</sup>
                              </span>
                            </label>
                            <input
                              type="password"
                              value={newPwd}
                              onChange={(evt) => {
                                setNewPwd(evt.target.value);
                                var x = document.getElementById("newPwdError");
                                x.style.display = "none";
                                var z =
                                  document.getElementById("pwdUpdSuccess");
                                z.style.display = "none";
                                var y =
                                  document.getElementById("pwdMatchError");
                                y.style.display = "none";
                              }}
                              className="form-control"
                            />
                            <div
                              className="notes"
                              id="newPwdError"
                              style={{ display: `none` }}
                            >
                              New Password is required
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label className="bmd-label-floating">
                              Confirm Password
                              <span className="sup_char">
                                <sup>*</sup>
                              </span>
                            </label>
                            <input
                              type="password"
                              value={confirmPwd}
                              onChange={(evt) => {
                                setConfirmPwd(evt.target.value);
                                var x =
                                  document.getElementById("confirmPwdError");
                                x.style.display = "none";
                                var z =
                                  document.getElementById("pwdUpdSuccess");
                                z.style.display = "none";
                                var y =
                                  document.getElementById("pwdMatchError");
                                y.style.display = "none";
                              }}
                              className="form-control"
                            />
                            <span
                              toggle="#password-field"
                              className="fa fa-fw fa-eye field_icon eye toggle-password"
                            ></span>
                            <div
                              className="notes"
                              id="confirmPwdError"
                              style={{ display: `none` }}
                            >
                              Confirm Password is required
                            </div>
                            <div
                              className="notes"
                              id="pwdMatchError"
                              style={{ display: `none` }}
                            >
                              Both password did not match
                            </div>
                            <div
                              className="notes"
                              id="pwdUpdSuccess"
                              style={{ display: `none` }}
                            >
                              Update Success
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="box-pad">
                            <a
                              id="hide-pass"
                              className="btn  btn-secondary-outline"
                              onClick={() => {
                                setNewPwd("");
                                setConfirmPwd("");
                                var x = document.getElementById("link2");
                                x.style.display = "none";
                              }}
                            >
                              Cancel
                            </a>
                            &nbsp;
                            <a
                              id="hide-pass1"
                              className="btn btn-primary col-white"
                              onClick={handleUpdatePwd}
                            >
                              Update
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane" id="link3" aria-expanded="false">
                      <div className="row">
                        <div className="col-md-6">
                          <div
                            className="fileinput fileinput-new pt1"
                            data-provides="fileinput"
                          >
                            <div>
                              <div className="btn btn-upload btn-file w100">
                                <input
                                  className="text-primary"
                                  type="file"
                                  id="cred_ProfileImg"
                                  name="..."
                                />
                              </div>
                              <br />
                              <div className="byline1">
                                Image size should be below <span>1MB</span>.
                                Acceptable image formats are{" "}
                                <span>.jpg and .png.</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="box-pad">
                            <a
                              id="hide-pass"
                              className="btn  btn-secondary-outline"
                              onClick={() => {
                                var x = document.getElementById("link3");
                                x.style.display = "none";
                              }}
                            >
                              Cancel
                            </a>
                            &nbsp;
                            <a
                              id="hide-pass1"
                              className="btn btn-primary col-white"
                              onClick={handleUpdateImg}
                            >
                              Update
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

export default Settings;
