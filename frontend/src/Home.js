import { useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

// Home page, where instructors can log in
// or students can join classes with their name and session code
function Home() {
  const navigate = useNavigate();

  // instructor
  const [email, setEmail] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  // student
  const [name, setName] = useState("");
  const [sessionCode, setSessionCode] = useState("");

  // Called when "Log In" is pressed
  const logIn = () => {
    fetch(`http://localhost:5000/login?email=${email}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => res.json()).then(data => {
      if (data) {
        // save items to local storage to know type of user, which instructor, etc.
        localStorage.setItem("instructor_id", data.instructor_id);
        localStorage.setItem("phrase", data.phrase)
        localStorage.setItem("USER", email)
        localStorage.setItem("type", "instructor")
        setAuthenticated(true);
        console.log(localStorage)
        navigate("/dashboard") // redirect to the dashboard after log in
      }
    })
  }

  function joinSession() {
    // emit a join event, to establish a connection with the server
    socket.emit("join", {name: name, room: sessionCode});
    localStorage.setItem("type", "student")
    localStorage.setItem("sessionCode", sessionCode)
    navigate("/session"); // redirect to session page after joining
  }

  return (
    <div className="Home nes-balloon">
      <h1>WolfAsks</h1>

      <div class="nes-balloon">
        <h4>Instructor? Log in to start a session, or sign up to get started.</h4>

        <div class="nes-field is-inline">
          <label for="inline_field">Email</label>
          <input onChange={(e) => setEmail(e.target.value)} type="text" id="inline_field" class="nes-input is-success" placeholder="Enter your email..."></input>
        </div>

        <br/>
        <div class="nes-field is-inline">
          <label for="inline_field">Password</label>
          <input type="password" id="inline_field" class="nes-input is-success" placeholder="Enter your password..."></input>
        </div>
        <br/>
        <br/>


        <button class="nes-btn is-success" onClick={logIn}>Log In</button>
        &nbsp;
        <button class="nes-btn is-primary">Sign Up</button>
      </div>
      <br/>
      <br/>
      <br/>

      <div class="nes-balloon">
        <h4>Student? Join a session using the code provided by your instructor.</h4>
        <div class="nes-field is-inline">
          <label for="inline_field">Name</label>
          <input onChange={(e) => setName(e.target.value)} type="text" id="inline_field" class="nes-input is-success" placeholder="Enter your name..."></input>
        </div>

        <br/>
        <div class="nes-field is-inline">
          <label for="inline_field">Session Code</label>
          <input onChange={(e) => setSessionCode(e.target.value)} type="text" id="inline_field" class="nes-input is-success" placeholder="Enter your session code..."></input>
        </div>
        <br/>
        <br/>

        <button class="nes-btn is-success" onClick={joinSession}>Join Session</button>
      </div>

      <br/>
      <section class="message-list">
        <i class="nes-octocat animate"></i>
        <a href="https://github.com/PackHacks2022" class="nes-balloon from-left">
          <p>View on GitHub</p>
        </a>
      </section>
    </div>
  )
}

export default Home;