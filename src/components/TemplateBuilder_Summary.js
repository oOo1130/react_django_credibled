import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import logo from "../assets/img/credibled_logo_205x45.png";
import { API } from "../Api";

function TB_Summary() {
  const [token, setToken, deleteToken] = useCookies(["credtoken"]);
  const [loginUser, setLoginUser] = useState("");

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

  return (
    <div>
      <div class="container-fluid">
        <div class="row">
          <div class="col-6 bg-primary text-left">&nbsp;</div>
          <div class="col-6 bg-secondary text-right">&nbsp;</div>
        </div>
      </div>
      <div class="wrapper">
        <div class="main-panel w100">
          <div class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-10 offset-md-1">
                  <nav class="navbar navbar-expand navbar-transparent navbar-absolute fixed-top mobile_logo">
                    <div class="container-fluid">
                      <div class="logo">
                        <a class="navbar-brand" href="/">
                          <img
                            src={logo}
                            class="mob_logo"
                            alt="Credibled Logo"
                          />
                        </a>
                        <div class="nomobile fl-right">
                          <h5>Template Builder</h5>
                        </div>
                      </div>

                      <div class="text-right">
                        <ul class="navbar-nav mobile_nav">
                          <li class="nav-item dropdown">
                            <a
                              class="nav-link dropdown-toggle"
                              href="javascript:void(0)"
                              id="navbarDropdownMenuLink"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              <i class="material-icons">language</i>
                              <span class="nomobile"> Language</span> (EN)
                            </a>
                            <div
                              class="dropdown-menu"
                              aria-labelledby="navbarDropdownMenuLink"
                            >
                              <a
                                class="dropdown-item"
                                href="javascript:void(0)"
                              >
                                English
                              </a>
                              <a
                                class="dropdown-item"
                                href="javascript:void(0)"
                              >
                                French
                              </a>
                            </div>
                          </li>
                          <li class="nav-item dropdown">
                            <a
                              class="nav-link dropdown-toggle"
                              href="javascript:void(0)"
                              id="navbarDropdownMenuLink"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              <i class="material-icons">account_box</i> Hi{" "}
                              <span class="text-secondary">{loginUser}</span>
                            </a>
                            <div
                              class="dropdown-menu"
                              aria-labelledby="navbarDropdownMenuLink"
                            >
                              <a
                                class="dropdown-item"
                                href="credibled_terms.html"
                                target="_new"
                              >
                                Terms of use
                              </a>
                              <a
                                class="dropdown-item"
                                href="credibled_privacy.html"
                                target="_new"
                              >
                                Privacy Policy
                              </a>
                              <a
                                class="dropdown-item"
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

                  <div class="card-plain mt3">
                    <div class="row">
                      <div class="col-md-7 mt3 offset-md-2 text-center">
                        <h3 class="text-primary no-pt2 pt2">
                          Awesome{" "}
                          <span class="text-secondary">{loginUser}!</span>
                          , your template has been added to your Credibled
                          Questionnaires.{" "}
                        </h3>
                        <br />

                        <a href="/questionnaires">Back to Questionnaire Page</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="clearfix"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TB_Summary;
