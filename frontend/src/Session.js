import { useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

// Session page which shows an ongoing class
// This component has two views: an instructor view and a student view
// Main difference is that students can ask questions, while instructors have elevated privileges on questions
function Session() {

  const navigate = useNavigate();

  const user = localStorage.getItem("USER");
  const userType = localStorage.getItem("type");
  const sessionCode = localStorage.getItem("sessionCode");

  const [title, setTitle] = useState("");
  const [questionBody, setQuestionBody] = useState("");
  const [questions, setQuestions] = useState([]);
  const [tags, setTags] = useState([]);
  const [starOption, setStarOption] = useState([]);

  function submitQuestion() {
    console.log("submitting question", title, questionBody);
    socket.emit("create_question", {title: title, question_body: questionBody, session_code: sessionCode})
  }

  socket.on("updated_questions", (data) => {
    console.log("consuming updated_questions", data);
    setQuestions(data);
  });

  socket.on("provide_tags", (data) => {
    console.log("consuming provided tags", data);
    setTags(data);
  });

  function findTagWithId(id) {
    for (let i = 0; i < tags.length; i++) {
      if (tags[i].id == id) {
        console.log(tags, tags[i], tags[i].name)
        return tags[i].name;
      }
    }
  }

  function goToDashboard() {
    navigate("/dashboard");
  }

  function toggleStarOption() {
    if (starOption == "is-empty") {
      setStarOption(""); // full star
    } else {
      setStarOption("is-empty"); // full star
    }
  }

  // Instructor render
  if (userType == "instructor") {
    return (
      <div className="Session">
        <div className="custom-wrapper" class="nes-balloon">
          <div className="custom-left">
            <h1>Instructor: {user}</h1>
            <h3>Session Code: {sessionCode}</h3>
          </div>
          <div className="custom-right">
            <div className="EndSession">
              <button onClick={goToDashboard} class="nes-btn is-error">End Session</button>
            </div>
          </div>
        </div>
        <br/>
        <br/>
        
        {/* <div class="nes-balloon">
        <h2>Questions</h2>
        {tags && questions.map(question =>
          <div>
            <h4>{question.title}</h4>
            <p>{question.question_body}</p>
            <p>{question.tag}</p>
          </div>)}
        </div> */}

        <div className="nes-balloon">
          <h2>Questions</h2>
          {questions.map(question =>
            <div className="nes-balloon">
              <h4>{question.title}</h4>
              <p>{question.question_body}</p>
              <a href="#" class="nes-badge">
                <span class="is-primary">{question.tag}</span>
              </a>
            </div>)}
        </div>
          
      </div>
    )
  }
  // Student render
  else {
    return (
      <div className="Session">
        <div class="nes-balloon">
          <h4>Ask a question.</h4>
          <div class="nes-field is-inline">
            <label for="inline_field">Title</label>
            <input onChange={(e) => setTitle(e.target.value)} type="text" id="inline_field" class="nes-input is-success" placeholder="Enter a title..."></input>
          </div>

          <br/>
          <div class="nes-field is-inline">
            <label for="inline_field">Description</label>
            <input onChange={(e) => setQuestionBody(e.target.value)} type="text" id="inline_field" class="nes-input is-success" placeholder="Enter your description..."></input>
          </div>
          <br/>
          <br/>

          <button class="nes-btn is-success" onClick={submitQuestion}>Ask Question</button>
        </div>

        <br/>
        <br/>
        <br/>
        <div className="nes-balloon">
          <h2>Questions</h2>
          {questions.map(question =>
            <div className="nes-balloon">
              <i onClick={toggleStarOption} class={`nes-icon is-small star ${starOption}`}></i>
              <h4>{question.title}</h4>
              <p>{question.question_body}</p>
              <a href="#" class="nes-badge">
                <span class="is-primary">{question.tag}</span>
              </a>
            </div>)}
        </div>
      </div>
    )
  }
}

export default Session;