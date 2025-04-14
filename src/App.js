/* New cleaned up version of App.js */
import React from "react";
// Importing react-router-dom to use the React Router
import { Route, Routes, HashRouter } from "react-router-dom";
import { Box, Typography, Zoom, Paper, Button } from "@mui/material";
import "./App.css";
import ScrollToTop from "./react-components/ScrollToTop";
import Home from "./react-components/Home";
import LeeLab from "./react-components/LeeLab";
import Projects from "./react-components/Projects";
import SocialNetworks from "./react-components/SocialNetworks";
import Experiences from "./react-components/Experiences";
import Contact from "./react-components/Contact";
import Education from "./react-components/VolunteerTeaching";
import Publications from "./react-components/Publications";
import More from "./react-components/More";
import ResponsiveAppBar from "./react-components/appBar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import Management from "./react-components/Management";
import ResearchExperiences from "./react-components/Home/ResearchExperiences/researchExperiences";
import theme from "./theme";
class App extends React.Component {
  // a 'global' state that you can pass through to any child componenets of App.
  //   In the Routes below they are passed to both the Home and Queue states.
  state = {
    title: "Rachel's Personal Website",
  };

  render() {
    return (
      <HashRouter>
        <ScrollToTop />
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ResponsiveAppBar></ResponsiveAppBar>
          <Box
            sx={{
              minHeight: "100vh",
              background: `linear-gradient(#fefae0, #ccd5ae, #e9edc9)`,
            }}
          >
            <Routes>
              {/* Similar to a switch statement - shows the component depending on the URL path */}
              {/* Each Route below shows a different component depending on the exact path in the URL  */}
              <>
                <Route path="/more" element={<More />}></Route>
                <Route path="/publications" element={<Publications />}></Route>
                <Route path="/management" element={<Management />}></Route>
                <Route path="/projects" element={<Projects />}></Route>
                <Route path="/experiences" element={<Experiences />}></Route>
                <Route
                  path="/research/social-networks"
                  element={<SocialNetworks />}
                ></Route>
                {/* Extra Curricular */}
                <Route path="/education" element={<Education />}></Route>
                <Route path="/research/lee-lab" element={<LeeLab />}></Route>
                {/* <Route exact path='/extracurricular/house-representative' render={() => 
                            (<HouseRepresentative appState={this.state}/>)}/>  */}
                <Route exact path="/" element={<Home />}></Route>
                <Route exact path="/about" element={<Home />}></Route>
                <Route path="/contact" element={<Contact />}></Route>
              </>
            </Routes>
          </Box>
        </ThemeProvider>
      </HashRouter>
    );
  }
}

export default App;
