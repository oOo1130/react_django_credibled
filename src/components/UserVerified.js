import React, { useEffect } from "react";
import { useParams } from "react-router";
import { API } from "../Api";

function UserVerified() {
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      API.getConfirmEmail(params.id)
        .then((resp) => resp)
        .catch((error) => console.log(error));
    }
  }, []);

  return (
    <body>
      {/* <!-- Start of preheader --> */}
      <table
        width="100%"
        bgcolor="#e8eaed"
        cellpadding="0"
        cellspacing="0"
        border="0"
        id="backgroundTable"
      >
        <tbody>
          <tr>
            <td>
              <table
                width="600"
                cellpadding="0"
                cellspacing="0"
                border="0"
                align="center"
                class="devicewidth"
              >
                <tbody>
                  <tr>
                    <td width="100%">
                      <table
                        width="600"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        align="center"
                        class="devicewidth"
                      >
                        <tbody>
                          <tr>
                            <td>
                              <table
                                width="100%"
                                align="left"
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="devicewidth"
                              >
                                <tbody>
                                  <tr>
                                    <td
                                      width="50%"
                                      align="left"
                                      valign="middle"
                                      style={{
                                        bgColor: `#250c77`,
                                        height: `8px`,
                                      }}
                                    ></td>
                                    <td
                                      width="50%"
                                      align="right"
                                      valign="middle"
                                      style={{
                                        bgColor: `#ed642b`,
                                        height: `8px`,
                                      }}
                                    ></td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      {/* <!-- End of preheader -->  */}
      {/* <!-- start textbox-with-title --> */}
      <table
        width="100%"
        bgcolor="#e8eaed"
        cellpadding="0"
        cellspacing="0"
        border="0"
        id="backgroundTable"
      >
        <tbody>
          <tr>
            <td>
              <table
                width="600"
                cellpadding="0"
                cellspacing="0"
                border="0"
                align="center"
                class="devicewidth"
              >
                <tbody>
                  <tr>
                    <td width="100%">
                      <table
                        bgcolor="#ffffff"
                        width="600"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        align="center"
                        class="devicewidth"
                      >
                        <tbody>
                          {/* <!-- Spacing --> */}
                          <tr>
                            <td width="100%" height="50"></td>
                          </tr>
                          {/* <!-- Spacing --> */}
                          <tr>
                            {/* <!-- start of image --> */}
                            <td>
                              <a target="_blank" href="#">
                                <img
                                  border="0"
                                  style={{
                                    display: `block`,
                                    paddingLeft: `1.5em`,
                                    border: `none`,
                                    outline: `none`,
                                    textDecoration: `none`,
                                  }}
                                  src="http://localhost:3000/assets/img/credibled_logo_205x45.png"
                                  alt="Credibled Logo"
                                  class="logo"
                                />
                              </a>
                            </td>
                          </tr>
                          {/* <!-- Spacing --> */}
                          <tr>
                            <td width="100%" height="20"></td>
                          </tr>
                          {/* <!-- Spacing --> */}
                          <tr>
                            <td style={{ paddingLeft: `1em` }}>
                              <table
                                width="560"
                                align="center"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                                class="devicewidthinner"
                              >
                                <tbody>
                                  <tr>
                                    <td
                                      style={{
                                        fontFamily: `Roboto, arial, sans-serif`,
                                        fontSize: `18px`,
                                        fontWeight: `bold`,
                                        color: "#250c77",
                                        textAlign: `left`,
                                        lineHeight: `24px`,
                                        padding: `1em .5em`,
                                      }}
                                    >
                                      You're ready to start reference checking
                                    </td>
                                  </tr>
                                  {/* <!-- End of Title --> */}
                                  {/* <!-- spacing --> */}
                                  <tr>
                                    <td height="5"></td>
                                  </tr>
                                  {/* <!-- End of spacing --> */}
                                  {/* <!-- content --> */}
                                  <tr>
                                    <td
                                      style={{
                                        fontFamily: `Roboto, arial, sans-serif`,
                                        fontSize: `13px`,
                                        color: `#333333`,
                                        textAlign: `left`,
                                        lineHeight: `24px`,
                                        padding: `1em`,
                                        fontWeight: `500`,
                                      }}
                                    >
                                      Hi {params.name},
                                    </td>
                                  </tr>

                                  <tr>
                                    <td
                                      style={{
                                        fontFamily: `Roboto, arial, sans-serif`,
                                        fontSize: `13px`,
                                        color: `#333333`,
                                        textAlign: `left`,
                                        lineWeight: `24px`,
                                        padding: `1em`,
                                      }}
                                    >
                                      Your <span>CREDIBLED</span> account is now
                                      ready to go. If you haven’t already, make
                                      sure you login and use your free credit,
                                      which allows you to take up to two
                                      references on a candidate.
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <p
                                        style={{
                                          fontFamily: `Roboto, arial, sans-serif`,
                                          fontSize: `13px`,
                                          color: `#333333`,
                                          textAlign: `left`,
                                          lineHeight: `24px`,
                                          padding: `1em`,
                                        }}
                                      >
                                        {" "}
                                        To learn more about{" "}
                                        <span>CREDIBLED</span> and how to use
                                        all features, make sure you access Help
                                        & Training from within your account.
                                        <br />
                                        <br />
                                        Enjoy!
                                      </p>
                                    </td>
                                  </tr>
                                  {/* <!-- Spacing --> */}
                                  <tr>
                                    <td width="100%" height="20"></td>
                                  </tr>
                                  {/* <!-- Spacing -->                                              */}
                                  <tr>
                                    <td style={{ paddingLeft: `.5em` }}>
                                      <table cellspacing="0" cellpadding="0">
                                        <tr>
                                          <td class="button">
                                            <a
                                              href="credibled_help.html"
                                              target="_blank"
                                            >
                                              Go to Help & Training
                                            </a>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>

                                  {/* <!-- End of content --> */}
                                  {/* <!-- Spacing --> */}
                                  <tr>
                                    <td width="100%" height="25"></td>
                                  </tr>
                                  {/* <!-- Spacing --> */}
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      {/* <!-- end of textbox-with-title --> */}
      {/* <!-- Start of postfooter --> */}
      <table
        width="100%"
        bgcolor="#e8eaed"
        cellpadding="0"
        cellspacing="0"
        border="0"
        id="backgroundTable"
      >
        <tbody>
          <tr>
            <td>
              <table
                width="600"
                cellpadding="0"
                cellspacing="0"
                border="0"
                align="center"
                class="devicewidth"
              >
                <tbody>
                  <tr>
                    <td width="100%">
                      <table
                        bgcolor="#ffffff"
                        width="600"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        align="center"
                        class="devicewidth"
                      >
                        <tbody>
                          {/* <!-- Spacing --> */}
                          <tr>
                            <td width="100%" height="20"></td>
                          </tr>
                          {/* <!-- Spacing --> */}
                          <tr>
                            <td
                              valign="middle"
                              style={{
                                fontFamily: `Roboto, arial, sans-serif`,
                                fontSize: `12px`,
                                color: `#454545`,
                                borderTop: `1px solid #ed642b`,
                                padding: `2em`,
                              }}
                            >
                              <p style={{ paddingBottom: `1em` }}>
                                {" "}
                                This message (including any attachments) is
                                confidential and may be legally privileged. If
                                you are not the intended recipient, you should
                                not disclose, copy or use any part of it -
                                please delete all copies immediately and notify
                                the <span>CREDIBLED</span> team.
                              </p>
                              <p style={{ paddingBottom: `1em` }}>
                                All sent and received email from/to CREDIBLED is
                                automatically scanned for the presence of
                                computer viruses, security issues and
                                inappropriate content.
                              </p>
                              <p style={{ paddingBottom: `1em` }}>
                                To contact <span>CREDIBLED</span> or for further
                                information on the services that CREDIBLED
                                provide visit{" "}
                                <a href="https://www.credibled.com">
                                  www.credibled.com.
                                </a>
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      {/* <!-- End of postfooter --> */}
    </body>
  );
}

export default UserVerified;
