import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import {notification} from 'antd'
import Play from './Components/NavLinks/Play/Play'
import Stats from './Components/NavLinks/Stats/Stats'
import Forum from './Components/NavLinks/Forum/Forum'
import Post from './Components/NavLinks/Forum/Post/Post'
import NavigationBar from './Components/NavBar/NavBar'
import Profile from './Components/NavLinks/Stats/Profile'
import './App.css'

notification.config({
  placement: 'topRight',
  top: 60,
  duration: 2,
  rtl: false,
});

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <NavigationBar />
        <Switch>
          <Route exact path="/">
            <Play />
          </Route>
          <Route exact path="/Play">
            <Play />
          </Route>
          <Route exact path="/Stats/page=:pagenumber">
            <Stats />
          </Route>
          <Route exact path="/:username/Stats/page=:pagenumber">
            <Profile />
          </Route>
          <Route exact path="/Forum/page=:pagenumber">
            <Forum/>
          </Route>
          <Route exact path="/Forum/postid=:postid&page=:pagenumber">
            <Post/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}