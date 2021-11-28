import React from "react";
import ReactDOM from "react-dom";
import "./assets/css/material-credibled.css";
import "./assets/css/custom_credibled.css";
import reportWebVitals from "./reportWebVitals";
import { Route, BrowserRouter } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import NewRequest from "./components/NewRequest";
import Requests from "./components/Requests";
import ForgotPassword from "./components/ForgotPassword";
import UserVerified from "./components/UserVerified";
import CandidateJobHistory from "./components/CandidateJobHistory";
import JobInformation from "./components/JobInformation";
import JobHistory from "./components/JobHistory";
import JobSummary from "./components/JobSummary";
import JobHistorySuccess from "./components/JobHistorySuccess";
import Referee from "./components/Referee";
import RefereeBegin from "./components/RefereeBegin";
import RefereeBasics from "./components/RefereeVerify";
import RefereeQuestionnaire from "./components/RefereeQuestionnaire";
import RefereeReview from "./components/RefereeReview";
import RefereeSummary from "./components/RefereeSummary";
import RefereeDecline from "./components/RefereeDecline";
import CandidateSummary from "./components/CandidateSummary";
import ReferenceStatus from "./components/ReferenceStatus";
import Settings from "./components/Settings";
import Questionnaires from "./components/Questionnaires";
import QuestionnaireData from "./components/QuestionnaireData";
import EditJobInformation from "./components/EditJobInformation";
// import TB_Homepage from "./components/TemplateBuilder";
import TemplateBuilder from "./components/TemplateBuilder_Main";
import TB_Summary from "./components/TemplateBuilder_Summary";

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <BrowserRouter>
        <Route exact path="/signin" component={SignIn} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route exact path="/new-request" component={NewRequest} />
        <Route exact path="/settings" component={Settings} />
        {/* <Route exact path="/template-builder" component={TB_Homepage} /> */}
        <Route exact path="/template-builder" component={TemplateBuilder} />
        <Route exact path="/template-builder/summary" component={TB_Summary} />
        <Route exact path="/" component={Requests} />
        <Route exact path="/candidate/summary/:hash" component={CandidateSummary} />
        <Route exact path="/verify/:name/:id" component={UserVerified} />
        <Route exact path="/candidate-job-history/:name/:id" component={CandidateJobHistory} />
        <Route exact path="/job-info/:name/:id" component={JobInformation} />
        <Route exact path="/edit-job-info/:name/:candidateHash/:id" component={EditJobInformation} />
        <Route exact path="/job-history/:name/:id" component={JobHistory} />
        <Route exact path="/job-summary/:name/:id" component={JobSummary} />
        <Route exact path="/job-history-complete/:name/:id" component={JobHistorySuccess} />
        <Route exact path="/referee/:name/:candidateHash/:refereeHash" component={Referee} />
        <Route exact path="/referee-accept/:name/:candidateHash/:refereeHash" component={RefereeBegin} />
        <Route exact path="/referee-verify/:name/:candidateHash/:refereeHash" component={RefereeBasics} />
        <Route exact path="/referee-questionnaire/:name/:candidateHash/:refereeHash" component={RefereeQuestionnaire} />
        <Route exact path="/referee-review/:name/:candidateHash/:refereeHash" component={RefereeReview} />
        <Route exact path="/referee-summary/:name/:candidateHash/:refereeHash" component={RefereeSummary} />
        <Route exact path="/reference/status/:candidateHash/:refereeHash" component={ReferenceStatus} />
        <Route exact path="/referee-declined/:candidateHash/:refereeHash" component={RefereeDecline} />
        <Route exact path="/questionnaires" component={Questionnaires} />
        <Route exact path="/questionnaires/:questionnaireHash" component={QuestionnaireData} />
        {/* <Route path='*' exact={true} component={SignIn} /> */}

      </BrowserRouter>
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
