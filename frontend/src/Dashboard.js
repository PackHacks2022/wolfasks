import "nes.css/css/nes.min.css";
import { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import {CanvasJSChart} from 'canvasjs-react-charts'

const socket = io.connect("http://localhost:5000");

const instructorId = localStorage.getItem("instructor_id");

// Main page for an instructor
// Shows all courses and corresponding tags
// Instructor can start a new session for any course
// Instructor can view historical charts about a specific course
function Dashboard() {
  const navigate = useNavigate();

  const [userAndCourseInfoFetched, setUserAndCourseInfoFetched] = useState(false);
  const [tagInfoFetched, setTagInfoFetched] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [courses, setCourses] = useState([]);
  const [tags, setTags] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);

  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const result = await axios(`http://localhost:5000/instructor/${instructorId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const data = await result.data;

      setFirstName(data.first_name);
      setLastName(data.last_name);
    }

    const fetchCourses = async () => {
      const result = await axios(`http://localhost:5000/courses?instructor_id=${instructorId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const data = await result.data;

      setCourses(data);
    }

    setUserAndCourseInfoFetched(false);
    fetchUserInfo();
    fetchCourses();
    setUserAndCourseInfoFetched(true);
  }, []);

  useEffect(() => {
    if (courses) {
      const fetchTags = async (courseId) => {
        const result = await axios(
          `http://localhost:5000/tags?course_id=${courseId}`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });

        setTags(prevTags => [...prevTags, result.data]);
      };

      const fetchPastSessions = async (courseId) => {
        const result = await axios(
          `http://localhost:5000/past_sessions?course_id=${courseId}`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });

          console.log(result.data);

        setPastSessions(prevPastSessions => [...prevPastSessions, result.data]);
      };

      setTagInfoFetched(false);
      courses.forEach(course => {
        fetchTags(course.id);
      });
      courses.forEach(course => {
        fetchPastSessions(course.id);
      });
      setTagInfoFetched(true);
    }
  }, [courses]);

  useEffect(() => {
    console.log(tags);
  }, [tags]);

  useEffect(() => {
    // console.log(pastSessions);
    // [ { x: 1, y: 64 }, ... ]
    // [ { session #, engagement % }]

    const newDataPoints = [];

    // push { session #, engagement % } onto newDataPoints
    pastSessions.forEach((pastSession, i) => {
      newDataPoints.push({x: i, y: pastSession.engagement_percent})
    })

    setDataPoints(newDataPoints);
  }, [pastSessions]);

  const startSession = async (i) => {
    // pass the tags to the server so they can be broadcasted to clients
    socket.emit("accept_tags", tags[i]);

    const result = await axios(`http://localhost:5000/create_session?phrase=${localStorage.getItem("PHRASE")}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const data = await result.data;
    console.log("received session code", data)
    localStorage.setItem("sessionCode", data);

    navigate("/session");
  }

  const chart1options = {
    animationEnabled: true,
    exportEnabled: true,
    theme: "light2", // "light1", "dark1", "dark2"
    title:{
      text: "Student Engagement (%) Per Session"
    },
    axisY: {
      title: "Student Engagement Rate (%)",
      suffix: "%"
    },
    axisX: {
      title: "Session",
      prefix: "#",
      interval: 2
    },
    data: [{
      type: "line",
      toolTipContent: "Week {x}: {y}%",
      dataPoints: [
        {x: 1, y: 73},
        {x: 2, y: 72},
        {x: 3, y: 79},
        {x: 4, y: 80},
        {x: 5, y: 85},
        {x: 6, y: 89},
        {x: 7, y: 94}
      ]
    }]
  }
  const chart2options = {
    animationEnabled: true,
    exportEnabled: true,
    theme: "light2", // "light1", "dark1", "dark2"
    title:{
      text: "Student Engagement (%) Per Session"
    },
    axisY: {
      title: "Student Engagement Rate (%)",
      suffix: "%"
    },
    axisX: {
      title: "Session",
      prefix: "#",
      interval: 2
    },
    data: [{
      type: "line",
      toolTipContent: "Week {x}: {y}%",
      dataPoints: [
        {x: 1, y: 78},
        {x: 2, y: 69},
        {x: 3, y: 74},
        {x: 4, y: 89},
        {x: 5, y: 86},
        {x: 6, y: 90},
        {x: 7, y: 91}
      ]
    }]
  }

  const chart3options = {
    animationEnabled: true,
    exportEnabled: true,
    theme: "light2", // "light1", "dark1", "dark2"
    title:{
      text: "Student Engagement (%) Per Session"
    },
    axisY: {
      title: "Student Engagement Rate (%)",
      suffix: "%"
    },
    axisX: {
      title: "Session",
      prefix: "#",
      interval: 2
    },
    data: [{
      type: "line",
      toolTipContent: "Week {x}: {y}%",
      dataPoints: [
        {x: 1, y: 75},
        {x: 2, y: 76},
        {x: 3, y: 79},
        {x: 4, y: 85},
        {x: 5, y: 86},
        {x: 6, y: 96},
        {x: 7, y: 98}
      ]
    }]
  }
  const chart4options = {
    animationEnabled: true,
    exportEnabled: true,
    theme: "light2", // "light1", "dark1", "dark2"
    title:{
      text: "Student Engagement (%) Per Session"
    },
    axisY: {
      title: "Student Engagement Rate (%)",
      suffix: "%"
    },
    axisX: {
      title: "Session",
      prefix: "#",
      interval: 2
    },
    data: [{
      type: "line",
      toolTipContent: "Week {x}: {y}%",
      dataPoints: [
        {x: 1, y: 67},
        {x: 2, y: 64},
        {x: 3, y: 56},
        {x: 4, y: 74},
        {x: 5, y: 76},
        {x: 6, y: 87},
        {x: 7, y: 78}
      ]
    }]
  }
  const charts = [
    chart1options,
    chart2options,
    chart3options,
    chart4options
    // chart 2
    // chart 3
    // chart 4
  ]

  // Course 1: 


// Mon, 14 Feb 2022 00:00:00 GMT 78
// Mon, 21 Feb 2022 00:00:00 GMT 69
// Mon, 28 Feb 2022 00:00:00 GMT 74
// Mon, 07 Mar 2022 00:00:00 GMT 89
// Mon, 14 Mar 2022 00:00:00 GMT 86
// Mon, 21 Mar 2022 00:00:00 GMT 90
// Mon, 28 Mar 2022 00:00:00 GMT 91

// Mon, 14 Feb 2022 00:00:00 GMT 75
// Mon, 21 Feb 2022 00:00:00 GMT 76
// Mon, 28 Feb 2022 00:00:00 GMT 79
// Mon, 07 Mar 2022 00:00:00 GMT 85
// Mon, 14 Mar 2022 00:00:00 GMT 86
// Mon, 21 Mar 2022 00:00:00 GMT 96
// Mon, 28 Mar 2022 00:00:00 GMT 98

  return (
    <div className="Dashboard" class="nes-balloon">
      <div className="custom-wrapper">
        <div className="custom-left">
          <h1>Welcome, {firstName} {lastName}.</h1>
        </div>
        <div className="custom-right-logout">
          <div className="EndSession">
            <button class="nes-btn is-error">Logout</button>
          </div>
        </div>
      </div>
      <h3>Courses</h3>
      {userAndCourseInfoFetched && tagInfoFetched && courses.map((course, i) => 
        <div class="nes-balloon">
          <strong>Course {i + 1}: {course.department} {course.number} {course.title}</strong>
          {tags.map((tagGroup, j) => {
            return i == j && 
            <div>
              {tagGroup.map(tag => <div href="#" class="nes-badge course-tags">
                                      <span class="is-primary">{tag.name}</span>
                                    </div>)}
            </div>
          })}
          <ul>
          {/* {pastSessions.map((pastSessionsGroup, j) => {
            return i == j &&
            <div>
              {pastSessionsGroup.map(pastSession => <li>{pastSession.timestamp} {pastSession.engagement_percent}</li>)}
            </div>
          })} */}
          </ul>
          <button class="nes-btn is-success" onClick={() => startSession(i)}>Start Session</button>
          <br />
          <br />
          <br />
          <div>
            <CanvasJSChart options={charts[i]} />
          </div>
        </div>
      )}
    </div>
  )
}


// function StaticPage() {
//   return (
//     <div className="nes-balloon">
//       <textarea id="textarea_field" class="nes-textarea">Enter Question Here</textarea>
//       <span class="nes-text is-primary">Fancy Text</span>
//       <p type="text" class="is-primary">Mock text</p>
//       <button type="button" class="nes-btn is-primary">Start Class</button>
//       <label>
//         <input type="radio" class="nes-radio" name="answer" />
//         <span>No</span>
//       </label>

//       <ul class="lists">
//       <li>Good morning.</li>
//       <li>Thou hast had a good night's sleep, I hope.</li>
//       <li>Thou hast had a good afternoon</li>
//       <li>Good night.</li>
//     </ul>
//     </div>
//   );
// }

// export default StaticPage;

export default Dashboard;