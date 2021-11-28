import React, { useState } from "react";
import logo from "../assets/img/credibled_logo_205x45.png";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [username, setUsername] = useState("");
  var EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const resetPassword = () => {
    if (username == "") {
      var x = document.getElementById("emailErrorMsg");
      x.style.display = "block";
    }

    if (username) {
      if (!username.match(EMAIL_REGEX)) {
        var x = document.getElementById("emailInvalidMsg");
        x.style.display = "block";
        return false;
      }
    }
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
                    <a className="navbar-brand" href="/">
                      <img src={logo} alt="Credibled Logo" />
                    </a>
                    <h4>Forgot Password</h4>
                  </div>

                  <div className="card">
                    <div className="card-body">
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
                                var x = document.getElementById(
                                  "emailErrorMsg"
                                );
                                var y = document.getElementById(
                                  "emailInvalidMsg"
                                );
                                x.style.display = "none";
                                y.style.display = "none";
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

                          <div className="text-center">
                            <span
                              onClick={resetPassword}
                              className="btn btn-primary mt2"
                            >
                              Reset Password Link
                            </span>
                            <div className="clearfix"></div>

                            <div className="box-pad">
                              <Link to="/signin">Sign in!</Link>
                              <br />
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
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
