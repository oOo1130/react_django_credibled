import React, { useState, useEffect } from "react";
import { API } from "../Api";
import logo from "../assets/img/credibled_logo_205x45.png";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useCookies(["credtoken"]);
  var EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  useEffect(() => {
    if (token["credtoken"]) window.location.href = "/";
  }, [token]);

  const signInClicked = () => {
    if (username == "") {
      var x = document.getElementById("emailErrorMsg");
      x.style.display = "block";
      return false;
    }
    if (username) {
      if (!username.match(EMAIL_REGEX)) {
        var x = document.getElementById("emailInvalidMsg");
        x.style.display = "block";
        return false;
      }
    }
    if (password == "") {
      var x = document.getElementById("pwdErrorMsg");
      x.style.display = "block";
      return false;
    }

    API.login({ username, password })
      .then((resp) => {
        if (resp.token) {
          setToken("credtoken", resp.token, {
            path: "/",
            maxAge: process.env.REACT_APP_SESSION_MAX_AGE,
          });
          localStorage.setItem("creduser", username);
        } else if (resp.message == "Email confirmation required") {
          var z = document.getElementById("emailConfirmErrorMsg");
          z.style.display = "block";
          return false;
        } else {
          var z = document.getElementById("loginErrorMsg");
          z.style.display = "block";
          return false;
        }
      })
      .catch((error) => console.log(error));
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
                <div className="col-md-4 offset-md-3">
                  <div className="text-center">
                    <a className="navbar-brand" href="">
                      <img src={logo} alt="Credibled Logo" />
                    </a>
                    <h4>SignIn</h4>
                  </div>

                  <div className="card">
                    <div className="card-body">
                      {/* <form> */}
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group mt3">
                            <label className="bmd-label-floating">
                              Email address
                              <span className="sup_char">
                                <sup>*</sup>
                              </span>
                            </label>
                            <input
                              type="email"
                              value={username}
                              onChange={(evt) => {
                                setUsername(evt.target.value);
                                var x =
                                  document.getElementById("emailErrorMsg");
                                x.style.display = "none";
                                var y =
                                  document.getElementById("emailInvalidMsg");
                                y.style.display = "none";
                                var z =
                                  document.getElementById("loginErrorMsg");
                                z.style.display = "none";
                                var u = document.getElementById(
                                  "emailConfirmErrorMsg"
                                );
                                u.style.display = "none";
                              }}
                              className="form-control"
                            />
                            <div
                              className="notes"
                              id="emailErrorMsg"
                              style={{ display: `none` }}
                            >
                              Email address is required
                            </div>
                            <div
                              className="notes"
                              id="emailInvalidMsg"
                              style={{ display: `none` }}
                            >
                              Invalid Email address
                            </div>
                          </div>

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
                                var x = document.getElementById("pwdErrorMsg");
                                x.style.display = "none";
                                var y =
                                  document.getElementById("loginErrorMsg");
                                y.style.display = "none";
                                var z = document.getElementById(
                                  "emailConfirmErrorMsg"
                                );
                                z.style.display = "none";
                              }}
                              className="form-control"
                            />
                            <span
                              toggle="#password-field"
                              className="fa fa-fw fa-eye field_icon eye toggle-password"
                            ></span>
                            <div
                              className="notes"
                              id="pwdErrorMsg"
                              style={{ display: `none` }}
                            >
                              Password is required
                            </div>
                            <div
                              className="notes"
                              id="loginErrorMsg"
                              style={{ display: `none` }}
                            >
                              Invalid login credentials
                            </div>
                            <div
                              className="notes"
                              id="emailConfirmErrorMsg"
                              style={{ display: `none` }}
                            >
                              Email confirmation required to Signin
                            </div>
                          </div>

                          <div className="text-center">
                            <span
                              className="btn btn-primary mt2"
                              onClick={signInClicked}
                            >
                              Sign in
                            </span>
                            <div className="clearfix"></div>

                            {/* <div className="box-pad">
                              New around here?{" "}
                              <Link to="/signup">Sign up!</Link>
                              <br />
                              <Link to="/forgot-password">
                                Forgot Password?
                              </Link>
                              <br />
                              <br />
                              or
                            </div>

                            <div className="social-buttons-demo pb2">
                              <button className="btn btn-social  btn-google">
                                <i className="fa fa-google"></i>&nbsp; Sign in
                                with Google
                              </button>
                              <br />
                              <button className="btn btn-social  btn-linkedin">
                                <i className="fa fa-linkedin"></i>&nbsp; Sign in
                                with LinkedIn
                              </button>
                            </div> */}
                          </div>
                        </div>
                      </div>
                      <div className="clearfix"></div>
                      {/* </form> */}
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

export default SignIn;
