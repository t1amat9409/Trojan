import React, { Component } from 'react';
import logo from './logo.svg';
import FakeData from './fake-data';
//import io from 'socket.io-client';
import './App.css';
import './css/styles.css';
import './css/training.css';
import createBrowserHistory from 'history/createBrowserHistory';

import HeaderUI from './components/HeaderUI';
import FooterUI from './components/FooterUI';
import Geosuggest from 'react-geosuggest';
import { IntroOverlayTarget, ChatBoxList, Modal, EmptyState, LoadingState } from './components/Common';
import DatePicker from './components/DatePicker'
import FireBase from 'firebase';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { TransitionGroup, CSSTransition } from 'react-transition-group'

//PAGES
import { GMCView, GMCCore } from './pages/GMC';
import League from './pages/LEAGUE';
import Team from './pages/TEAM';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Game from './pages/GAME';
import Search from './pages/Search';
import Create from './pages/CREATE';
import TournamentInit from './pages/CreatePages/TournamentInit';
import ClubInt from './pages/CreatePages/ClubInit';
import EducationInit from './pages/CreatePages/EducationInit';
import TeamInit from './pages/CreatePages/TeamInit';
import TestView from './pages/Test';
import PostView from './pages/PostView';
import Club from './pages/Club';
import Institution from './pages/Institution';
import Group from './pages/Group';
import TacticBoard from './pages/TacticBoard';
import Home from './pages/Home';
import Event from './pages/Event';
import Events from './pages/Events';

import { BrowserRouter, HashRouter, Route, Link, withRouter, Switch, Redirect, Prompt } from 'react-router-dom';
import Sports from './pages/Sports';
import Dashboard from './pages/Dashboard';
//import { Router } from 'react-static'
/*import axios from 'axios';

axios.defaults.baseURL = FakeData.URL;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.post['Accept'] = 'application/json';*/

const $ = window.$;
const jQuery = window.jQuery;

const { port, hash, hostname, host, href, protocol } = window.location;
const { EventSource } = window;

//console.log(process.env);

const fakeAuth = {
  isAuthenticated: (getCookie("supotsu-user") === "" || getCookie("supotsu-user").split("-")[1] === undefined) ? false : true,
  authenticate(cb, username) {
    this.isAuthenticated = true
    const cookie = FakeData.makeid(10) + "-" + username + "-" + FakeData.makeid(10);
    setCookie("supotsu-user", cookie, 60);
    setTimeout(cb, 1000)
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 1000)
  }
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const getUserID = () => {
  const user = getCookie("supotsu-user").split("-");
  return user[1];
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      openChats: []
    }

    this.onNavChanged = this.onNavChanged.bind(this);
  }

  componentWillMount() {
    const _that = this;

    FakeData.shared("mainThread", this)
    if (getCookie("supotsu-user") === "") {
      this.system = null;
      this.setState({
        isLogged: false
      });
      this.initSystem();
    } else {
      const user = getCookie("supotsu-user").split("-");
      //this.system = new EventSource(FakeData.URL + '/testServer.php?auth0&user=' + user[1]);
      this.setState({
        isLogged: true,
        userId: user[1]
      });
      //this.initSystem(user[1]);
    }

    var config = {
      apiKey: "AIzaSyAp-0AkrekWQWPxC5_0mqevwXZ1mcdzmaE",
      authDomain: "supotsu-dev.firebaseapp.com",
      databaseURL: "https://supotsu-dev.firebaseio.com",
      projectId: "supotsu-dev",
      storageBucket: "supotsu-dev.appspot.com",
      messagingSenderId: "379646265003"
    };
    FireBase.initializeApp(config);
  }

  initSystem = (username = null) => {
    if (username === null) {
      return;
    }

    /*this.system = new EventSource(FakeData.URL + '/testServer.php?auth0&user=' + username);
    if (this.system !== null) {
      //this.system.addEventListener()
      this.system.addEventListener('message', function (e) {
        console.log(e.data);
      }, false);

      this.system.addEventListener('open', function (e) {
        // Connection was opened.
        //console.log(e)
      }, false);

      this.system.addEventListener('error', function (e) {
        if (e.readyState == EventSource.CLOSED) {
          // Connection was closed.
          FakeData.shared("mainThread").initSystem();
        }
      }, false);
    }*/
  }

  componentDidMount() {
    if (this.state.isLogged) {
      this.getData()
      this.setOnline()
      this.getMessageNotice()
      this.getEventNotice()
      this.getTeams()
      this.getSports()
      this.getGeoData()
      //this.socket = io(hostname);
    } else {
      this.getTeams()
      this.getSports()
    }

    window.addEventListener("hashchange", this.onNavChanged)
    document.querySelector('#root').scrollIntoView({
      behavior: 'smooth'
    });
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.onNavChanged)
    this.initSystem();
  }

  onNavChanged(e) {
    document.getElementById("root").scrollTop = 0;
  }

  getGeoData = () => {
    const _that = this;
    //https://freegeoip.net/json/
    /* FakeData.post('https://freegeoip.net/json/', {}, {
       success: ((res) => {
         FakeData.setData("geo-data", res);
         //console.log(res);
         setTimeout(() => {
           _that.getGeoData()
         }, 1000)
       }),
       error: ((err) => {
 
       })
     })*/
  }

  getData() {
    const _that = this
    let userId = getUserID()

    FakeData.post('/getUserProfile.php?auth0&id=' + userId + '&them=' + userId, {}, {
      success: ((res) => {
        FakeData.setData("yoo", res);
        //console.log(res);
        _that.setLeagueIds(res.leagues)
        _that.setTeamsFollowed(res.teamsFollowed, res.myTeams, res.ownTeams)
        _that.setClubIds(res.clubs)
        _that.setInstitutionsIds(res.institutions)
        _that.setFriendsIds(res.friends)
        setTimeout(() => {
          _that.getData()
        }, 1000)
      }),
      error: ((err) => {

      })
    })
  }

  getTeams() {
    const _that = this
    FakeData.post("/getAllTeams.php?auth0", {}, {
      success: ((res) => {

        FakeData.setData("all_teams", res);
      }),
      error: ((err) => {

      })
    })

    setTimeout(() => {
      _that.getTeams()
    }, 1000)
  }

  getSports() {
    const _that = this
    FakeData.post("/getAllSports.php?auth0", {}, {
      success: ((res) => {

        FakeData.setData("all_sports", res);
        setTimeout(() => {
          _that.getSports()
        }, 1000)
      }),
      error: ((err) => {

      })
    })
  }

  setInstitutionsIds(arr) {
    const list = []
    for (let i = 0; i < arr.length; i++) {
      list.push(arr[i].id)
    }

    FakeData.setData("instIds", list);
  }

  setFriendsIds(arr) {
    const list = []
    for (let i = 0; i < arr.length; i++) {
      list.push(arr[i].id)
    }

    FakeData.setData("friendIds", list);
  }

  setLeagueIds(arr) {
    const list = []
    for (let i = 0; i < arr.length; i++) {
      list.push(arr[i].id)
    }

    FakeData.setData("leagueIds", list);
  }

  setClubIds(arr) {
    const list = []
    for (let i = 0; i < arr.length; i++) {
      list.push(arr[i].id)
    }

    FakeData.setData("clubIds", list);
  }

  setOnline() {
    const _that = this
    let id = (typeof FakeData.getData("yoo") === "object") ? FakeData.getData("yoo").id : getUserID();
    if (id === null || id === "") {
      setTimeout(() => {
        _that.setOnline()
      }, 5000)
    }

    FakeData.post("/setOnline.php?auth0", { userId: id }, {
      success: ((res) => {
        setTimeout((() => {
          _that.setOnline()
        }), 50000)
      }),
      error: ((err) => {

      })
    })
  }

  getMessageNotice() {
    const _that = this
    if (!FakeData.getData("yoo") || typeof FakeData.getData("yoo") !== "object") {
      setTimeout(() => {
        _that.getMessageNotice()
      }, 5000)
      return
    }
    const dataTo = {
      user: FakeData.getData("yoo")
    }

    FakeData.post("/getMessageNotice.php?auth0", dataTo, {
      success: ((res) => {
        FakeData.setData("unreadMgs", res)
        setTimeout(() => {
          _that.getMessageNotice()
        }, 2000)
      }),
      error: ((err) => {

      })
    })
  }

  getEventNotice() {
    const _that = this
    if (!FakeData.getData("yoo") || typeof FakeData.getData("yoo") !== "object") {
      setTimeout(() => {
        _that.getEventNotice()
      }, 5000)
      return
    }
    const dataTo = {
      user: FakeData.getData("yoo")
    }

    FakeData.post("/getEventNotice.php?auth0", dataTo, {
      success: ((res) => {
        FakeData.setData("unreadEvt", res)
        setTimeout(() => {
          _that.getEventNotice()
        }, 2000)
      }),
      error: ((err) => {

      })
    })
  }

  setTeamsFollowed(arr, arr2, arr3) {
    const list = []
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === 0) {
        continue;
      }
      list.push(arr[i].id)
    }

    for (let i = 0; i < arr2.length; i++) {
      if (arr2[i].id === 0) {
        continue;
      }
      if (list.indexOf(arr2[i].id) > -1) {
        continue;
      }

      list.push(arr2[i].id)
    }

    for (let i = 0; i < arr3.length; i++) {
      if (arr3[i].id === 0) {
        continue;
      }
      if (list.indexOf(arr3[i].id) > -1) {
        continue;
      }

      list.push(arr3[i].id)
    }

    FakeData.setData("teamIds", list);
  }

  addToChats(chat) {
    //console.log(chat)
    const str = "chat" + chat.id + "you";
    let bool = false;
    FakeData.chats.forEach((item, i) => {
      if (item.chatBoxRef === str) {
        bool = true
      }
    })

    if (bool) {
      return;
    }
    chat.chatBoxRef = str
    FakeData.chats.push(chat)
    FakeData.shared("chatWidget").getData()
  }

  removeChat(str) {
    FakeData.chats.forEach((item, i) => {
      if (item.chatBoxRef === str) {
        FakeData.chats.splice(i, 1)
        FakeData.shared("chatWidget").getData()
      }
    })
  }

  onLogin(username) {
    const _that = this;
    _that.setState({
      userId: username
    });

    _that.getData()
    _that.setOnline()
    _that.getMessageNotice()
    _that.getEventNotice()

    this.initSystem(username);
    window.location = "/profile/" + username;
  }

  onRegister(username) {
    const _that = this;
    _that.setState({
      userId: username
    });

    _that.getData()
    _that.setOnline()
    _that.getMessageNotice()
    _that.getEventNotice()
    this.initSystem(username);

    window.location = "/profile/" + username;
  }

  render() {
    const currentKey = this.props.location.pathname.split('/')[1] || '/';
    const timeout = { enter: 300, exit: 200 }
    return (
      <div className="app">
        <HeaderUI />
        <TransitionGroup component="div">
          <CSSTransition key={currentKey} timeout={timeout} classNames="fade" appear>
            <div className="container" style={{ paddingPottom: '2cm', minHeight: "600px" }}>
              <Switch>
                <Route exact path="/" component={(props) => <EncryptedPages pageType="H" component={Home} {...props} />}></Route>
                <Route exact path="/u/:id" component={(props) => <EncryptedPages pageType="F" component={Profile} {...props} />} />
                <Route exact path="/login" component={(props) => <Login onLogin={this.onLogin.bind(this)} {...props} />} />
                <Route exact path="/register" component={(props) => <Register onRegister={this.onRegister.bind(this)} {...props} />} />
                <Route exact path="/game/:id" component={(props) => <EncryptedPages pageType="G" component={Game} {...props} />} />
                <Route exact path="/create" component={(props) => <EncryptedPages pageType="" component={Create} {...props} />}></Route>
                <Route exact path="/create/tournament" component={(props) => <EncryptedPages pageType="" component={TournamentInit} {...props} />}></Route>
                <Route exact path="/create/club" component={(props) => <EncryptedPages pageType="" component={ClubInt} {...props} />}></Route>
                <Route exact path="/create/institution" component={(props) => <EncryptedPages pageType="" component={EducationInit} {...props} />}></Route>
                <Route exact path="/create/team" component={(props) => <EncryptedPages pageType="" component={TeamInit} {...props} />}></Route>
                <Route exact path="/profile/:id" component={(props) => <EncryptedPages pageType="F" component={Profile} {...props} />} />
                <Route exact path="/gmc" component={(props) => <EncryptedPages pageType="GMC" component={GMCView} {...props} />} />
                <Route exact path="/core/:gameId" component={(props) => <EncryptedPages pageType="GMCC" component={GMCCore} {...props} />} />
                <Route exact path="/club/:id" component={(props) => <EncryptedPages pageType="C" component={Club} {...props} />} />
                <Route exact path="/institution/:id" component={(props) => <EncryptedPages pageType="I" component={Institution} {...props} />} />
                <Route exact path="/chats" component={(props) => <EncryptedPages pageType="MSG" component={Chat} {...props} />} />
                <Route exact path="/events" component={(props) => <EncryptedPages pageType="EV" component={Events} {...props} />} />
                <Route exact path="/search" component={(props) => <EncryptedPages pageType="SCH" component={Search} {...props} />} />
                <Route exact path="/event/:id" component={(props) => <EncryptedPages pageType="E" component={Event} {...props} />} />
                <Route exact path="/test" component={TestView} />
                <Route exact path="/post/:userName/posts/:id/:type" component={(props) => <EncryptedPages pageType="FEED" component={PostView} {...props} />} />
                <Route exact path="/team/:id" component={(props) => <EncryptedPages pageType="T" component={Team} {...props} />} />
                <Route exact path="/league/:id" component={(props) => <EncryptedPages pageType="L" component={League} {...props} />} />
                <Route exact path="/tournament/:id" component={(props) => <EncryptedPages pageType="L" component={League} {...props} />} />
                <Route exact path="/group/:id" component={(props) => <EncryptedPages pageType="Q" component={Group} {...props} />} />
                <Route exact path="/tactic-board/:sport" component={(props) => <EncryptedPages pageType="TACTIC" component={TacticBoard} {...props} />} />
                <Route exact path="/all-sports" component={(props) => <EncryptedPages pageType="TACTIC" component={Sports} {...props} />} />
                <Route exact path="/dashboard/:id" component={(props) => <EncryptedPages pageType="DASH" component={Dashboard} {...props} />} />
                <Route exact path="/confirm/:hash/:id" component={ConfirmAcivity} />
                <Route exact path="/404" component={NoMatch} />
                <Route exact component={NoMatch} />
              </Switch>
            </div>
          </CSSTransition>
        </TransitionGroup>
        <ChatBoxList chats={this.state.openChats} />
        <FooterUI />
      </div>
    );
  }
}

const NoMatch = ({ location }) => (
  <div style={{ width: "60vw", height: "45vh", background: "#fff" }} className={"confirm-pf-box"}>
    <img src={"images/404.png"} style={{ width: "auto", height: "10vw", borderRadius: "0px" }} />
    {/*<span>{"404"}</span>*/}
    <div className={"desc"}>{"Requested page not found, please check the url then try again!"}</div>
    <button onClick={() => {
      window.location = "/";
    }}>Go Home</button>
  </div>
)

class ConfirmAcivity extends Component {
  constructor(p) {
    super(p)
    this.state = {
      isLoading: true,
      isVerifying: false,
      isDone: false,
      error: false,
      obj: null
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.getData()
  }

  getData = () => {
    const _that = this;
    const data = {
      hash: this.props.match.params.hash
    }

    FakeData.post("/getConfirm.php?auth0", data, {
      success(res) {
        if (!_that._isMounted) {

          return;
        }

        if (res.error) {
          _that.setState({ error: true, obj: null, isLoading: false });
        } else {
          _that.setState({ obj: res, error: false, isLoading: false });
        }
      },
      error() {
        _that.setState({ error: true, obj: null, isLoading: false });
      }
    })
  }

  verify = () => {
    const { isLoading, isVerifying, error, obj, isDone } = this.state;
    const _that = this;
    const data = {
      id: obj.id
    }

    FakeData.post("/verifyProfile.php?auth0", data, {
      success(res) {
        _that.setState({
          isVerifying: false,
          isDone: true
        });
      },
      error(e) {
        _that.setState({
          isVerifying: false,
          isDone: false
        });
      }
    })
  }

  getPath = (user, search = "?sInit=about") => {
    let path = { pathname: "/", search };
    switch (user.type) {
      case "F":
        path.pathname = "/profile/" + user.user;
        break;
      case "P":
        path.pathname = "/profile/" + user.user;
        break;
      case "T":
        path.pathname = "/team/" + user.id;
        break;
      case "C":
        path.pathname = "/club/" + user.user;
        break;
      case "I":
        path.pathname = "/institution/" + user.user;
        break;
      case "L":
        path.pathname = "/tournament/" + user.user;
        break;
      default:
        path.pathname = "/";
        path.search = "";
        break;
    }

    return path;
  }

  render() {
    const { isLoading, isVerifying, error, obj, isDone } = this.state;
    if (isLoading) {
      return (
        <div style={{ width: "60vw", height: "45vh", background: "#fff" }}>
          <LoadingState style={{ width: "100%", height: "100%", background: "#fff" }} isShown={true} text={"Please wait while validating confirmation token"} />
        </div>
      )
    }

    if (error || obj === null) {
      return (
        <Redirect to={{
          pathname: "/404",
          state: { from: this.props.location }
        }} />
      )
    }

    return (
      <div style={{ width: "60vw", height: "45vh", background: "#fff" }} className={"confirm-pf-box"}>
        <img src={obj.user.image} />
        <span>{obj.user.name}</span>
        {!obj.verified && <div className={"desc"}>{"Confirm this profile?"}</div>}
        {obj.verified && <div className={"desc"}>{"Profile already verified!"}</div>}
        {!obj.verified &&
          <button onClick={() => {
            this.setState({ isVerifying: true });
            this.verify();
          }}>Confirm</button>
        }
        {obj.verified &&
          <button onClick={() => {
            window.location = "/";
          }}>Go Home</button>
        }
        {isVerifying &&
          <div className={"overlay"}>
            <LoadingState style={{ width: "100%", height: "100%" }} isShown={true} text={"Verifying..."} />
          </div>
        }
        {isDone &&
          <div className={"overlay confirm-done"} style={{ background: "#fff" }}>
            <i className={"material-icons"}>done</i>
            <Link to={this.getPath(obj.user)}>Go to profile</Link>
          </div>
        }
      </div>
    );
  }
}

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        email: "",
        isHash: false,
        pass: ""
      },
      errorLogin: false,
      isLoading: false,
      isRegister: false,
      isLogged: (getCookie("supotsu-user") === "" || getCookie("supotsu-user").split("-")[1] === undefined) ? false : true
    }

    this.signIn = this.signIn.bind(this);
  }

  signWithGoogle() {
    const provider = new FireBase.auth.GoogleAuthProvider();
    const _that = this
    FireBase.auth().signInWithPopup(provider).then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      _that.authFirebase(user)

      // ...
    }).catch(function (error) {
      console.log(error)
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  signWithFacebook() {
    const provider = new FireBase.auth.FacebookAuthProvider();
    const _that = this
    FireBase.auth().signInWithPopup(provider).then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      console.log(result.user)
      var user = result.user;
      //_that.authFirebase(user)

      // ...
    }).catch(function (error) {
      console.log(error)
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  signWithTwitter() {
    const provider = new FireBase.auth.TwitterAuthProvider();
    const _that = this
    FireBase.auth().signInWithPopup(provider).then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      _that.authFirebase(user)

      // ...
    }).catch(function (error) {
      console.log(error)
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  authFirebase(user) {
    //console.log(user)
    const _that = this
    FireBase.auth().onAuthStateChanged(function (user) {
      if (user) {
        //console.log("Logged")
        _that.state.user.email = user.email
        _that.state.user.pass = user.uid
        _that.state.user.isHash = true
        _that.setState({
          user: _that.state.user
        });
        FakeData.setData("authUser", user)
        setTimeout(() => {
          _that.signIn()
        }, 500)
      } else {
        alert("Error Signing in with social network")
      }
    });
  }

  signIn() {
    const _that = this;
    const user = _that.state.user
    if (user.email === "") {
      this.setState({
        emailErr: true
      });
      return;
    }

    if (user.pass.length < 1) {
      this.setState({
        passErr: true
      });
      return;
    }

    const dataTo = {
      user: user
    }

    _that.setState({
      isLoading: true
    });

    FakeData.post("/signIn.php?auth0", dataTo, {
      success: ((res) => {
        if (!res.error) {
          const _that = this;
          fakeAuth.authenticate(() => {
            _that.setState({
              isLogged: true,
              isLoading: false
            });
            _that.props.onLogin(res.username)
            FakeData.alert("Logged In Successfully!");
          }, res.username)
        } else {
          _that.setState({
            errorLogin: true,
            isLoading: false
          });
        }
      }),
      error: ((err) => {

      })
    }, true, "", (res) => { })
  }

  onRegister() {
    this.setState({ isRegister: true });
  }

  render() {
    const { isRegister, isLogged } = this.state;
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    if (isLogged) {
      return (
        <Redirect to={from} />
      )
    }

    if (isRegister) {
      return (
        <Redirect to={{ pathname: "/register", state: null }} />
      )
    }
    return (
      <div className="full-screen-page">
        <div className="log-reg-holder" style={{ width: "500px" }}>
          <div className="log-reg-holder-header">
            <img src="images/supotsu_logo.svg" />
          </div>
          <div className="log-reg-holder-body">
            {this.state.errorLogin &&
              <div style={{ padding: "10px 0px", color: "red" }}>Incorrect login details</div>
            }
            <div className="split-input">
              <div className="input-field">
                <span>Email/Username</span>
                <input className={(this.state.emailErr) ? "normal-input error" : "normal-input"} onChange={(e) => {
                  const val = e.target.value
                  this.state.user.email = val
                  this.setState({
                    user: this.state.user,
                    emailErr: false
                  });
                }} />
              </div>
              <div className="input-field">
                <span>Password</span>
                <input type="password" className={(this.state.passErr) ? "normal-input error" : "normal-input"} onChange={(e) => {
                  const val = e.target.value
                  this.state.user.pass = val
                  this.setState({
                    user: this.state.user,
                    passErr: false
                  });
                }} />
              </div>
            </div>
            <button className="gbl-btn" style={{ marginTop: "-10px" }} onClick={this.signIn.bind(this)}>Login</button>
            <div className="or-split">OR</div>
            <SocialButton pref="Login up with " label="Facebook" src="images/facebook_icon_wht.svg" onClick={() => {
              this.signWithFacebook()
            }} />
            <SocialButton pref="Login up with " label="Twitter" src="images/twitter_icon_wht.svg" onClick={() => {
              this.signWithTwitter()
            }} />
            <SocialButton pref="Login up with " label="Google" src="images/google_icon.svg" onClick={() => {
              this.signWithGoogle()
            }} />
            <div className="or-split">OR</div>
            <button className="gbl-btn" onClick={() => this.onRegister()}>Register</button>
          </div>
        </div>
      </div>
    );
  }
}

class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        name: "",
        surname: "",
        displayName: "",
        gender: "",
        photoUrl: "",
        bday: null,
        email: "",
        pass: "",
        uid: "",
        provider: "Supotsu",
        isSocialAuth: false,
        isAfterReg: false,
        sportsFollowed: [],
        mySport: [],
        isHash: false,
        address: "",
        suburbs: "",
        postalCode: "",
        country: "",
        isUnderAge: false,
        parent: null,
        coach: null,
      },
      errorCreate: false,
      isAddingFollow: false,
      isAddingPlay: false,
      suggested: "",
      isDone: false
    }
  }

  signWithGoogle() {
    const _that = this
    const provider = new FireBase.auth.GoogleAuthProvider();
    FireBase.auth().signInWithPopup(provider).then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      FakeData.setData("authUser", user)
      var names = user.displayName.split(" ")
      console.log(token)
      _that.state.user.name = names[0]
      _that.state.user.surname = names[1]
      _that.state.user.email = user.email
      _that.state.user.photoUrl = (user.photoURL) ? user.photoURL : ""
      _that.state.user.provider = "Google"
      //_that.state.user.isSocialAuth = user.emailVerified
      _that.state.user.uid = user.uid
      _that.state.user.pass = user.uid
      _that.state.user.isHash = true
      _that.setState({
        user: _that.state.user
      });
      // ...
    }).catch(function (error) {
      console.log(error)
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  signWithFacebook() {
    const _that = this
    const provider = new FireBase.auth.FacebookAuthProvider();
    provider.addScope("public_profile");
    provider.addScope("user_hometown");
    provider.addScope("user_location");
    FireBase.auth().signInWithPopup(provider).then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      FakeData.setData("authUser", user)
      var names = user.displayName.split(" ")
      //console.log(user)
      _that.state.user.name = names[0]
      _that.state.user.surname = names[1]
      _that.state.user.email = user.email
      _that.state.user.photoUrl = (user.photoURL) ? user.photoURL : ""
      _that.state.user.provider = "Facebook"
      //_that.state.user.isSocialAuth = user.emailVerified
      _that.state.user.uid = user.uid
      _that.state.user.pass = user.uid
      _that.state.user.isHash = true
      _that.setState({
        user: _that.state.user
      });
      // ...
    }).catch(function (error) {
      console.log(error)
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  signWithTwitter() {
    const _that = this
    const provider = new FireBase.auth.TwitterAuthProvider();
    FireBase.auth().signInWithPopup(provider).then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      FakeData.setData("authUser", user)
      var names = user.displayName.split(" ")
      _that.state.user.name = names[0]
      _that.state.user.surname = (names[1] === null) ? "" : names[1]
      _that.state.user.email = (user.email === null) ? "" : user.email
      _that.state.user.photoUrl = (user.photoURL) ? user.photoURL : ""
      _that.state.user.provider = "Twitter"
      //_that.state.user.isSocialAuth = user.emailVerified
      _that.state.user.uid = user.uid
      _that.state.user.pass = user.uid
      _that.state.user.isHash = true
      _that.setState({
        user: _that.state.user
      });
      // ...
    }).catch(function (error) {
      console.log(error)
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  saveGeneric() {
    const _that = this;
    const user = this.state.user;
    if (user.name === "") {
      this.setState({ nameErr: true });
      return;
    }

    if (user.surname === "") {
      this.setState({ surnameErr: true });
      return;
    }

    if (user.displayName === "" || (user.displayName.indexOf(' ') > -1)) {
      this.setState({ usernameError: true });
      return;
    }

    if (user.email === "" || (user.email.indexOf('@') === -1 && user.email.indexOf('.') === -1)) {
      this.setState({ emailErr: true });
      return;
    }

    if (user.pass.length < 7 && user.provider === "Supotsu") {
      this.setState({ passErr: true });
      return;
    }

    if (user.pass !== user.confirmPass && user.provider === "Supotsu") {
      this.setState({ passTooErr: true });
      return;
    }

    if (user.bday === null) {
      this.setState({ bDayErr: true });
      return;
    }

    if (user.gender === "") {
      this.setState({ genErr: true });
      return;
    }

    if (user.location === "") {
      this.setState({ locErr: true });
      return;
    }

    if (user.address === "") {
      this.setState({ addressErr: true });
      return;
    }

    if (user.suburbs === "") {
      this.setState({ suburbErr: true });
      return;
    }

    if (user.postalCode === "") {
      this.setState({ postalCodeErr: true });
      return;
    }

    if (user.country === "") {
      this.setState({ countryErr: true });
      return;
    }

    const dataTo = {
      user: this.state.user
    }

    FakeData.post("/registerUser.php?auth0", dataTo, {
      success: ((res) => {
        if (res.error) {
          this.setState({ errorCreate: true, usernameError: res.isUsernameError, emailErr: res.isEmailError, suggested: res.suggested });
        } else {
          this.setState({ errorCreate: false, user: res });
        }
      }),
      error: ((err) => {
        console.log(err)
      })
    }, true, "", () => { })
  }

  saveSocial() {
    const _that = this;
    const dataTo = {
      user: this.state.user
    }

    FakeData.post("/registerUser.php?auth0", dataTo, {
      success: ((res) => {
        if (res.error) {
          this.setState({ errorCreate: true, usernameError: res.isUsernameError, emailErr: res.isEmailError, suggested: res.suggested });
        } else {
          this.setState({ errorCreate: false, user: res });
        }
      }),
      error: ((err) => {
        console.log(err)
      })
    }, true, "", () => { })
  }

  evtDateChgange(e) {
    const _that = this;
    const val = e.target.value;
    _that.state.user.bday = val;
    _that.setState({ user: _that.state.user, bDayErr: false });
  }

  onSportsFollowAdd(arr) {
    this.state.user.sportsFollowed = arr;
    this.setState({
      user: this.state.user,
      followedErr: (arr.length === 0) ? true : false,
      isAddingFollow: false
    });
  }

  onSportsPlayAdd(arr) {
    if (arr === null) {
      this.setState({
        playedErr: (this.state.user.mySport.length === 0) ? true : false,
        isAddingPlay: false
      });

      return;
    }

    this.state.user.mySport.push(arr);
    this.setState({
      user: this.state.user,
      playedErr: (arr.length === 0) ? true : false,
      isAddingPlay: false
    });
  }

  saveSports() {
    if (this.state.user.sportsFollowed.length === 0) {
      this.setState({
        followedErr: true
      });
      return
    }

    if (this.state.user.mySport.length === 0) {
      this.setState({
        playedErr: true
      });
      return
    }

    const dataTo = {
      userId: this.state.user.id,
      sportsFollowed: this.state.user.sportsFollowed,
      sportsPlayed: this.state.user.mySport
    }

    //console.log(dataTo)
    const _that = this

    FakeData.post("/saveSports.php?auth0", dataTo, {
      success: ((res) => {
        if (!res.error) {
          const _that = this;
          fakeAuth.authenticate(() => {
            _that.setState({
              isDone: true,
              isLoading: false
            });
            _that.props.onRegister(_that.state.user.username)
          }, _that.state.user.username)
        }
      }),
      error: ((err) => {

      })
    }, true, "Registered Successfully!", (res) => { })
  }

  render() {
    const { user } = this.state;
    if (this.state.isDone) {
      return (
        <Redirect to={{ path: "/create", state: { to: "/profile/" + this.state.user.username + "?sInit=about" } }} />
      )
    }
    return (
      <div className="full-screen-page" style={{ overflowY: "auto" }}>
        {this.state.user.isAfterReg &&
          <div className="after-register-profile">
            <div className="after-register-profile-content">
              <div className="after-register-profile-content-head">
                <img src="images/add_blu.svg" />
                <h1>Personal Profile</h1>
              </div>
              <div className="after-register-profile-content-item">
                <h3>Sports I follow</h3>
                <div className={(this.state.followedErr) ? "added-sports-list error" : "added-sports-list"}>
                  {
                    this.state.user.sportsFollowed.map((item, i) => {

                      return (
                        <div key={i} className="added-sport-item">
                          <img src={item.image.replace("_wht", "")} />
                        </div>
                      )
                    })
                  }
                  <div className="add-to-sport" onClick={() => {
                    this.setState({
                      isAddingFollow: true
                    });
                  }}>
                    <img src="images/add_blu.svg" /> Add
                  </div>
                </div>
              </div>
              <div className="after-register-profile-content-item">
                <h3>Sports I play</h3>
                <div className={(this.state.playedErr) ? "added-sports-list error" : "added-sports-list"}>
                  {
                    this.state.user.mySport.map((item, i) => {
                      return (
                        <div key={i} className="added-sport-item">
                          <img src={item.image.replace("_wht", "")} />
                        </div>
                      )
                    })
                  }
                  <div className="add-to-sport" onClick={() => {
                    this.setState({
                      isAddingPlay: true
                    });
                  }}>
                    <img src="images/add_blu.svg" /> Add
                  </div>
                </div>
              </div>
            </div>
            <div tabIndex="0" className="after-register-profile-button gbl-btn" onClick={this.saveSports.bind(this)}>Save Profile</div>
            <AddSportFollow isOpen={this.state.isAddingFollow} onClose={this.onSportsFollowAdd.bind(this)} />
            <AddSportPlay isOpen={this.state.isAddingPlay} onClose={this.onSportsPlayAdd.bind(this)} />
          </div>
        }
        {!this.state.user.isAfterReg &&
          <div className="log-reg-holder" style={{ width: "600px" }}>
            <div className="log-reg-holder-header">
              {(this.state.user.photoUrl !== "" && this.isSet) &&
                <img src={this.state.user.photoUrl} className="social-picture" />
              }
              <img src="images/supotsu_logo.svg" />
            </div>
            {this.state.user.isSocialAuth &&
              <div className="log-reg-holder-body">
                {this.state.errorCreate &&
                  <div style={{ padding: "10px 0px", color: "red" }}>{(this.state.usernameError) ? "Account with this email address or username already exists, try this one : " + this.state.suggested : "Account with this email address already exists"}</div>
                }
                <button className="gbl-btn" onClick={() => { this.saveSocial() }}>Continue as {this.state.user.name}</button>
              </div>
            }
            {!this.state.user.isSocialAuth &&
              <div className="log-reg-holder-body">
                {this.state.errorCreate &&
                  <div style={{ padding: "10px 0px", color: "red" }}>{(this.state.usernameError) ? "Account with this email address or username already exists, try this one : " + this.state.suggested : "Account with this email address already exists"}</div>
                }
                <div className="split-input">
                  <div className="input-field">
                    <span>First Name</span>
                    <input value={this.state.user.name} className={(this.state.nameErr) ? "normal-input error" : "normal-input"} onChange={(e) => {
                      const val = e.target.value
                      this.state.user.name = val;
                      this.setState({ user: this.state.user, nameErr: false });
                    }} />
                  </div>
                  <div className="input-field">
                    <span>Last Name</span>
                    <input type="" value={this.state.user.surname} className={(this.state.surnameErr) ? "normal-input error" : "normal-input"} onChange={(e) => {
                      const val = e.target.value
                      this.state.user.surname = val;
                      this.setState({ user: this.state.user, surnameErr: false });
                    }} />
                  </div>
                </div>
                <div className="split-input">
                  <div className="input-field">
                    <span>Username</span>
                    <input value={this.state.user.displayName} className={(this.state.usernameError) ? "normal-input error" : "normal-input"} onChange={(e) => {
                      const val = e.target.value
                      this.state.user.displayName = val.toLowerCase();
                      this.setState({ user: this.state.user, usernameError: (val.indexOf(" ") > -1) });
                    }} />
                  </div>
                  <div className="input-field">
                    <span>Email</span>
                    <input value={this.state.user.email} type="email" className={(this.state.emailErr) ? "normal-input error" : "normal-input"} onChange={(e) => {
                      const val = e.target.value
                      let err = (val.indexOf('@') > -1 && val.indexOf('.') > -1) ? false : true
                      this.state.user.email = val;
                      this.setState({ user: this.state.user, emailErr: err });
                    }} />
                  </div>
                </div>
                {this.state.user.provider === "Supotsu" &&
                  <div className="split-input">
                    <div className="input-field">
                      <span>Password</span>
                      <input type="password" className={(this.state.passErr) ? "normal-input error" : "normal-input"} onChange={(e) => {
                        const val = e.target.value
                        this.state.user.pass = val;
                        let err = (val.length < 7) ? true : false
                        this.setState({ user: this.state.user, passErr: err });
                      }} />
                    </div>
                    <div className="input-field">
                      <span>Repeat Password</span>
                      <input type="password" className={(this.state.passTooErr) ? "normal-input error" : "normal-input"} onChange={(e) => {
                        const val = e.target.value
                        this.state.user.confirmPass = val;
                        let err = (this.state.user.pass !== val) ? true : false
                        this.setState({ user: this.state.user, passTooErr: err });
                      }} />
                    </div>
                  </div>
                }

                <div className={(this.state.bDayErr) ? "input-field error" : "input-field"}>
                  <span>Birth Date</span>
                  <DatePicker withYear={true} withMonth={true} withDay={true} onChangeDate={(d) => {
                    const _that = this;
                    _that.state.user.bday = d;
                    const arr = new Date(d).getFullYear();
                    const date = new Date().getFullYear();
                    const age = date - arr;
                    const isTrue = age <= 13 ? true : false;
                    _that.state.user.isUnderAge = isTrue;
                    _that.state.user.parent = isTrue ? _that.state.user.parent : null;
                    _that.state.user.coach = isTrue ? _that.state.user.coach : null;

                    _that.setState({ user: _that.state.user, bDayErr: false });
                  }} />
                </div>
                {user.isUnderAge &&
                  <div style={{ padding: "10px 0px", textAlign: "center", background: "#fff", color: "#000", marginBottom: "15px" }}>
                    Please select a parent and coach to verify your profile. Make sure that the person searched for is or has a profile on Supotsu
                  </div>
                }
                {user.isUnderAge &&
                  <div className="split-input">
                    <InputFieldUserPicker error={user.isUnderAge && user.parent === null ? true : user.parent === user.coach ? true : false} label={"Parent/Guardian"} onSelectedItem={(item) => {
                      this.state.user.parent = item;
                      this.setState({ user });
                    }} />
                    <InputFieldUserPicker error={user.isUnderAge && user.coach === null ? true : user.parent === user.coach ? true : false} label={"Coach"} onSelectedItem={(item) => {
                      this.state.user.coach = item;
                      this.setState({ user });
                    }} />
                  </div>
                }
                <div className="split-input" style={{ marginTop: "-8px" }}>
                  <div onClick={() => {
                    this.state.user.gender = "female"
                    this.setState({
                      user: this.state.user
                    });
                  }}><input className={(this.state.genErr) ? "error" : ""} type="radio" readOnly name="gender" checked={(this.state.user.gender === "female") ? true : false} /><label style={{ color: "#fff" }}>Female</label></div>
                  <div onClick={() => {
                    this.state.user.gender = "male"
                    this.setState({
                      user: this.state.user
                    });
                  }}><input className={(this.state.genErr) ? "error" : ""} type="radio" readOnly name="gender" checked={(this.state.user.gender === "male") ? true : false} /><label style={{ color: "#fff" }}>Male</label></div>
                </div>
                <div className="input-field" style={{ marginTop: "10px" }}>
                  <span>Your Location</span>
                  <Geosuggest ref={(ref) => this.placeElem = ref} highlightMatch={true} onSuggestSelect={(item) => {
                    const val = item.label;
                    console.log(item.location)
                    this.state.user.location = val;
                    this.setState({ user: this.state.user, locErr: false });
                    if (this.placeElem != null) {
                      this.placeElem.blur()
                    }
                  }} />
                </div>
                <div className="split-input">
                  <div className="input-field">
                    <span>Address</span>
                    <input value={this.state.user.address} className={(this.state.addressErr) ? "normal-input error" : "normal-input"} onChange={(e) => {
                      const val = e.target.value
                      this.state.user.address = val;
                      this.setState({ user: this.state.user, addressErr: false });
                    }} />
                  </div>
                  <div className="input-field">
                    <span>Suburbs</span>
                    <input type="" value={this.state.user.suburbs} className={(this.state.suburbErr) ? "normal-input error" : "normal-input"} onChange={(e) => {
                      const val = e.target.value
                      this.state.user.suburbs = val;
                      this.setState({ user: this.state.user, suburbErr: false });
                    }} />
                  </div>
                </div>
                <div className="split-input">
                  <div className="input-field">
                    <span>Postal Code</span>
                    <input value={this.state.user.postalCode} className={(this.state.postalCodeErr) ? "normal-input error" : "normal-input"} onChange={(e) => {
                      const val = e.target.value
                      this.state.user.postalCode = val;
                      this.setState({ user: this.state.user, postalCodeErr: false });
                    }} />
                  </div>
                  <div className="input-field">
                    <span>Country</span>
                    <CountryDropdown classes={(this.state.countryErr) ? "error" : ""}
                      value={this.state.user.country}
                      onChange={(val) => {
                        this.state.user.country = val;
                        this.setState({ user: this.state.user, countryErr: false });
                      }} />
                  </div>
                </div>
                <button className="gbl-btn" onClick={() => this.saveGeneric()}>Register</button>
                <div className="or-split">OR</div>
                <SocialButton pref="Sign up with " label="Facebook" src="images/facebook_icon_wht.svg" onClick={() => { this.signWithFacebook() }} />
                <SocialButton pref="Sign up with " label="Twitter" src="images/twitter_icon_wht.svg" onClick={() => { this.signWithTwitter() }} />
                <SocialButton pref="Sign up with " label="Google" src="images/google_icon.svg" onClick={() => { this.signWithGoogle() }} />
              </div>
            }
          </div>
        }
      </div>
    );
  }
}

class InputFieldUserPicker extends Component {
  state = {
    user: { id: null, name: "" },
    isLoading: false,
    results: [],
    isFocus: false
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const _that = this;
    _that.setState({ isLoading: true });
    FakeData.post("/getAllUsers.php?auth0", {}, {
      success(res) {
        if (res.status === "illegal_entry") {
          _that.setState({ results: [], isLoading: false });
          return;
        }
        _that.setState({ results: res, isLoading: false });
      }
    })
  }

  render = () => {
    const { label } = this.props;
    const { results, isLoading, user, isFocus } = this.state;
    return (
      <div className="input-field" ref={"root"} style={{ position: "relative" }} tabIndex={0} onFocus={() => {
        this.setState({ isFocus: true });
      }} onBlur={() => {
        this.setState({ isFocus: false });
      }}>
        <span>{label}</span>
        <input value={this.state.user.name} className={(this.props.error) ? "normal-input error" : "normal-input"} onChange={(e) => {
          const val = e.target.value
          user.name = val;
          this.setState({ user });
        }} onFocus={() => {
          this.setState({ isFocus: true });
        }} />
        {isFocus &&
          <div className="input-field-dp">
            <EmptyState isShown={results.filter((item, i) => { return item.name.toLowerCase().indexOf(user.name.toLowerCase()) > -1 }).length === 0 && !isLoading} text={"No match found!"} style={{ padding: "10px 0px", height: "50px" }} />
            <EmptyState isShown={isLoading} text={"Loading..."} style={{ padding: "10px 0px", height: "50px" }} />
            {!isLoading &&
              results.filter((item, i) => { return item.name.toLowerCase().indexOf(user.name.toLowerCase()) > -1 }).map((item, i) => {
                if (item.id === user.id) {
                  return null;
                } else {
                  return (
                    <div key={i} className="input-field-dp-item" onClick={() => {
                      this.setState({ user: item, isFocus: false });
                      this.refs.root.blur();
                      if (this.props.onSelectedItem) {
                        this.props.onSelectedItem(item)
                      }
                    }}>
                      <img src={item.image} />
                      <span>{item.name}</span>
                    </div>
                  )
                }
              })
            }
          </div>
        }
      </div>
    )
  }
}

class SocialButton extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={"social-btn " + this.props.label.toLowerCase()} onClick={() => this.props.onClick()}>
        <img src={this.props.src} />
        <span>{this.props.pref + this.props.label}</span>
      </div>
    );
  }
}

export class AddSportFollow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sports: [],
      list: []
    }
  }

  componentDidMount() {
    FakeData.mountState("sport-fl-picker", true)
    this.getSports()
  }

  componentWillUnmount() {
    FakeData.mountState("sport-fl-picker", false)
  }


  onClose() {
    const arr = []
    const sports = this.state.sports
    const _that = this
    //console.log(data)
    sports.forEach((item, i) => {
      if (item.isSelected) {
        arr.push(item)
      }
    })

    this.props.onClose(arr)
  }

  getSports() {
    if (this.state.sports.length > 0 || !FakeData.isMounted("sport-fl-picker")) {
      return;
    }

    const _that = this

    this.setState({
      sports: (FakeData.getData("all_sports")) ? FakeData.getData("all_sports") : [],
      list: (FakeData.getData("all_sports")) ? FakeData.getData("all_sports") : []
    });

    setTimeout((() => {
      _that.getSports()
    }), 1500)
  }

  filterSports(val) {
    const sports = this.state.sports
    const _that = this
    const list = []
    sports.forEach((item, i) => {
      if (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1) {
        list.push(item)
        this.setState({
          list: list
        });
      }
    })
  }

  onSelectSport(data) {
    const sports = this.state.sports
    const _that = this
    //console.log(data)
    sports.forEach((item, i) => {
      if (item.name === data.name) {
        item.isSelected = (item.isSelected) ? false : true
        this.setState({
          sports: this.state.sports
        });
      }
    })
  }

  addhere() {
    const url = "/saveToSports.php?auth0";
    const arr = []
    const sports = this.state.sports
    const _that = this
    const already = []
    //console.log(data)
    sports.forEach((item, i) => {
      if (item.isSelected && !this.notInMine(item)) {
        arr.push(item)
      }

      if (item.isSelected && this.notInMine(item)) {
        already.push(item)
      }
    })

    const dataTo = {
      userId: this.props.to,
      sportsFollowed: arr
    }

    FakeData.post(url, dataTo, {
      success: ((res) => {
        _that.onClose()
      }),
      error: ((err) => {

      })
    }, true, (already.length > 0) ? already.length + " Sports were not added because you already follow them" : "Data Saved!", ((e) => { }))

    this.props.onClose(arr)
  }

  addToClub() {
    const url = "/saveClubSports.php?auth0";
    const arr = []
    const sports = this.state.sports
    const _that = this
    const already = []
    //console.log(data)
    sports.forEach((item, i) => {
      if (item.isSelected && !this.notInMine(item)) {
        arr.push(item)
      }

      if (item.isSelected && this.notInMine(item)) {
        already.push(item)
      }
    })

    const dataTo = {
      id: this.props.to,
      type: this.props.type,
      sports: arr
    }

    FakeData.post(url, dataTo, {
      success: ((res) => {
        _that.onClose()
      }),
      error: ((err) => {

      })
    }, true, (already.length > 0) ? already.length + " Sports were not added because you already have in your club" : "Data Saved!", ((e) => { }))

    this.props.onClose(arr)
  }

  notInMine(sport) {
    const arr = this.props.sports;
    let bool = false;
    for (let x = 0; x < arr.length; x++) {
      if (arr[x].id === sport.id) {
        bool = true;
        break;
      }
    }

    return bool;
  }

  render() {
    const sports = (FakeData.getData("all_sports")) ? FakeData.getData("all_sports") : []
    return (
      <Modal isOpen={this.props.isOpen} onClose={this.onClose.bind(this)}>
        <div className="sport-picker add-place" style={{ width: "640px" }}>
          <h1>Add A Sport</h1>
          <input list="sports" placeholder="Search for sport" style={{ padding: "3px", width: "100%", marginBottom: "5px" }} onChange={(e) => {
            const val = e.target.value
            this.filterSports(val)
          }} />
          <datalist id="sports">
            {
              this.state.sports.map((item, i) => {
                return (
                  <option key={i} value={item.name} />
                )
              })
            }
          </datalist>
          <div className="sport-pk-list">
            {
              this.state.sports.map((item, i) => {
                if (!item.isSelected) {
                  return null;
                }

                return (
                  <div key={i} onClick={() => this.onSelectSport(item)} className={(item.isSelected) ? "active" : ""}>
                    <img src={(item.image !== null) ? item.image.replace("_wht", "") : "server/media/blank_emblem.png"} />
                  </div>
                )
              })
            }
            {
              this.state.list.map((item, i) => {
                if (item.isSelected) {
                  return null;
                }

                return (
                  <div key={i} onClick={() => this.onSelectSport(item)} className={(item.isSelected) ? "active" : ""}>
                    <img src={(item.image !== null) ? item.image.replace("_wht", "") : "server/media/blank_emblem.png"} />
                  </div>
                )
              })
            }
          </div>
          <button className="gbl-btn" onClick={() => {
            if (this.props.isExtending) {
              this.addhere()
            } else if (this.props.isClub) {
              this.addToClub()
            } else {
              this.onClose()
            }
          }}>Add Sports</button>
        </div>
      </Modal>
    );
  }
}

export class AddSportPlay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sports: [],
      teams: [],
      sport: {},
      sportFilter: "",
      teamFilter: "",
      team: {},
      position: "",
      location: "",
      coords: {}
    }
  }

  onClose() {
    this.props.onClose(null)
  }

  onSelectSport(value) {
    this.setState({
      sportFilter: value,
      team: {},
      sportErr: false
    });
  }

  getTeams(arr) {
    const list = [];
    arr.forEach((item, i) => {
      if (((item.sport !== null) && item.sport.toLowerCase().indexOf(this.state.sportFilter.toLowerCase()) > -1) && item.name.toLowerCase().indexOf(this.state.teamFilter.toLowerCase()) > -1 && item.location.toLowerCase().indexOf(this.state.location.toLowerCase()) > -1) {
        list.push(item)
      }
    })

    return list;
  }

  onAddSport() {
    if (this.state.sportFilter === "") {
      this.setState({
        sportErr: true
      });

      return
    }

    if (this.state.position === "") {
      this.setState({
        posErr: true
      });

      return
    }

    if (!this.state.team.id) {
      this.setState({
        teamErr: true
      });

      return
    }

    const sports = (FakeData.getData("all_sports")) ? FakeData.getData("all_sports") : []
    sports.forEach((item, i) => {
      if (item.name === this.state.sportFilter) {
        const dataTo = item
        dataTo.position = this.state.position;
        dataTo.team = this.state.team

        this.props.onClose(dataTo)
        this.setState({
          sports: [],
          teams: [],
          sport: {},
          sportFilter: "",
          teamFilter: "",
          team: {},
          position: ""
        });
      }
    })
  }

  addhere() {
    const url = "/saveToSports.php?auth0";
    const _that = this
    //console.log(data)
    if (this.state.sportFilter === "") {
      this.setState({
        sportErr: true
      });

      return
    }

    if (this.state.position === "") {
      this.setState({
        posErr: true
      });

      return
    }

    if (!this.state.team.id) {
      this.setState({
        teamErr: true
      });

      return
    }

    const sports = (FakeData.getData("all_sports")) ? FakeData.getData("all_sports") : []
    let bool = false;
    let dataTo = {}
    for (let x = 0; x < sports.length; x++) {
      const item = sports[x];
      if (item.name === this.state.sportFilter && !this.notInMine(item)) {
        dataTo = item
        dataTo.position = this.state.position;
        dataTo.team = this.state.team
        bool = true;
        break;
      }
    }

    if (!bool) {
      alert("Sport item already exist!");
      _that.setState({
        sports: [],
        teams: [],
        sport: {},
        sportFilter: "",
        teamFilter: "",
        team: {},
        position: ""
      });
    } else {
      const arr = []
      arr[0] = dataTo
      const _dataTo = {
        id: _that.props.to,
        sportsPlayed: arr
      }

      FakeData.post("/saveSportPlay.php?auth0", _dataTo, {
        success: ((e) => {
          _that.props.onClose(dataTo)
          _that.setState({
            sports: [],
            teams: [],
            sport: {},
            sportFilter: "",
            teamFilter: "",
            team: {},
            position: ""
          });
        }),
        error: ((e) => {

        })
      }, true, "Data SaveD!", ((e) => { }))
    }
  }

  notInMine(sport) {
    const arr = this.props.sports;
    let bool = false;
    for (let x = 0; x < arr.length; x++) {
      if (arr[x].id === sport.id) {
        bool = true;
        break;
      }
    }

    return bool;
  }

  render() {
    const sports = (FakeData.getData("all_sports")) ? FakeData.getData("all_sports") : []
    const teams = this.getTeams((FakeData.getData("all_teams")) ? FakeData.getData("all_teams") : [])
    return (
      <Modal isOpen={this.props.isOpen} onClose={this.onClose.bind(this)}>
        <div className="sport-picker add-place" style={{ width: "640px" }}>
          <h1>Add A Sport</h1>

          {/*<select className={(this.state.sportErr)?"error":""} onChange={(e)=>{
              this.onSelectSport(e.target.value)
            }}>
            <option disabled="true">Select Sport</option>
            {
              sports.map((item,i)=>{
                return(
                  <option key={i} value={item.name}>{item.name}</option>
                )
              })
            }
          </select>*/}
          <div className="split-input">
            <div>

              <input list="sports" className={(this.state.sportErr) ? "error" : ""} placeholder="Search for sport" style={{ padding: "3px", width: "100%", marginBottom: "5px" }} onChange={(e) => {
                this.onSelectSport(e.target.value)
              }} />
              <datalist id="sports">
                {
                  sports.map((item, i) => {
                    return (
                      <option key={i} value={item.name} />
                    )
                  })
                }
              </datalist>
              <input placeholder="Search Team by Name" style={{ padding: "3px", width: "100%", marginBottom: "5px" }} onChange={(e) => {
                this.setState({
                  teamFilter: e.target.value
                });
              }} />
            </div>
            <div>
              <input placeholder="Position you play" className={(this.state.posErr) ? "error" : ""} style={{ padding: "3px", width: "100%", marginBottom: "5px" }} onChange={(e) => {
                this.setState({
                  position: e.target.value,
                  posErr: false
                });
              }} />
              <Geosuggest placeholder="Search by Suburbs, Street, City or Country" ref={(ref) => this.placeElem = ref} highlightMatch={true} onSuggestSelect={(item) => {
                const val = item.label
                this.setState({ location: val, coords: item.location });
                if (this.placeElem != null) {
                  this.placeElem.blur()
                }
              }} onChange={(item) => this.setState({ location: item })} />
            </div>
          </div>

          <div className={(this.state.teamErr) ? "sport-pk-list error" : "sport-pk-list"}>
            {
              teams.map((item, i) => {
                if (item.image === null) {
                  return null;
                }

                return (
                  <div key={i} onClick={() => this.setState({
                    team: item,
                    teamErr: false
                  })} className={(item.id === this.state.team.id) ? "active" : ""}>
                    <img src={item.image} />
                  </div>
                )
              })
            }
          </div>

          <button className="gbl-btn" onClick={() => {
            if (this.props.isExtending) {
              this.addhere()
            } else {
              this.onAddSport()
            }
          }}>Add Sport</button>
        </div>
      </Modal>
    );
  }
}

class EncryptedPages extends React.PureComponent {
  constructor(p) {
    super(p)
    this.state = {

    }
  }

  componentDidMount() {
    this._isMounted = true;
    if (fakeAuth.isAuthenticated) {
      const { pageType } = this.props;
      const from = parseURL(document.referrer);
      const to = parseURL(window.location.href)
      this.runInit(2000)
    }
  }


  componentWillUnmount() {
    this._isMounted = false;
    if (fakeAuth.isAuthenticated) {
      const { pageType } = this.props;
    }
  }

  runInit = (int = 1000) => {
    const _that = this;
    const from = parseURL(document.referrer);
    const to = parseURL(window.location.href);
    const user = {
      id: FakeData.getData("yoo").id,
      type: "F"
    }

    const data = {
      user,
      from,
      to
    }

    /*FakeData.post("/", data, {
      success(res){
        _that.id = "";
        setTimeout(()=>{
          _that.update(2000)
        }, int)
      },
      error(){

      }
    })*/
  }

  update = (int = 1000) => {
    const _that = this;
    const data = {
      id: this.id
    }

    FakeData.post("/", data, {
      success(res) {
        _that.id = "";
        setTimeout(() => {
          _that.update(int)
        }, int)
      },
      error() {

      }
    })
  }

  render() {
    if (fakeAuth.isAuthenticated) {
      const $Component = this.props.component;
      return (
        <$Component match={this.props.match} history={this.props.history} location={this.props.location} />
      )
    }
    return (
      <Redirect to={{
        pathname: "/login",
        state: { from: this.props.location }
      }} />
    );
  }
}

function parseURL(url) {
  var a = document.createElement('a');
  a.href = url;
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.host,
    hostname: a.hostname,
    port: a.port,
    query: a.search,
    params: FakeData.getQueries(a.search),
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^/])/, '/$1')
  };
}

export default withRouter(App);
