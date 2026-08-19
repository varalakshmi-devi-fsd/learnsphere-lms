const API = "http://localhost:5000";

const state = {
  user: JSON.parse(localStorage.getItem("eduflow_user") || "null"),
  token: localStorage.getItem("eduflow_token") || "",
  courses: [],
  currentCourse: null,
  currentQuiz: null
};

function esc(v=""){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.style.display="block";setTimeout(()=>t.style.display="none",2600)}
function saveAuth(data){state.user=data.user;state.token=data.token||"";localStorage.setItem("eduflow_user",JSON.stringify(state.user));localStorage.setItem("eduflow_token",state.token);renderNav()}
function logout(){localStorage.removeItem("eduflow_user");localStorage.removeItem("eduflow_token");state.user=null;state.token="";route("home")}
function authHeaders(json=false){const h={};if(state.token)h.Authorization=`Bearer ${state.token}`;if(json)h["Content-Type"]="application/json";return h}
async function api(path,opts={}){const res=await fetch(API+path,{...opts,headers:{...authHeaders(!!opts.body),...(opts.headers||{})}});let data={};try{data=await res.json()}catch{}if(!res.ok)throw new Error(data.message||`Request failed (${res.status})`);return data}

function renderNav(){
  const nav=document.getElementById("nav");
  nav.innerHTML = state.user
    ? `<a class="nav-link" href="#dashboard" onclick="route('dashboard')">Dashboard</a>
       <a class="nav-link" href="#catalog" onclick="route('catalog')">Courses</a>
       <button class="btn-light" onclick="logout()">Logout</button>`
    : `<a class="nav-link" href="#catalog" onclick="route('catalog')">Courses</a>
       <a class="nav-link" href="#login" onclick="route('login')">Login</a>
       <button class="btn" onclick="route('register')">Register</button>`;
}

function layout(html){document.getElementById("app").innerHTML=html;window.scrollTo(0,0);renderNav()}

async function loadCourses(){
  try{state.courses=await api("/api/courses");return state.courses}catch(e){toast(e.message);return[]}
}

function home(){
  layout(`<section class="hero"><div class="container hero-grid">
    <div><span class="badge">STUDENT LEARNING PLATFORM</span>
      <h1>Master New Skills with Interactive Courses</h1>
      <p>An all-in-one learning platform for structured video lessons, interactive quizzes and verified completion certificates.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:25px">
        <button class="btn" onclick="route('catalog')">Explore Courses</button>
        ${state.user?`<button class="btn-light" onclick="route('dashboard')">Student Dashboard</button>`:`<button class="btn-light" onclick="route('login')">Student Sign In</button>`}
      </div>
      <div class="stat-grid"><div class="stat"><b>HD</b><span>Video Learning</span></div><div class="stat"><b>Quiz</b><span>Instant Evaluation</span></div><div class="stat"><b>PDF</b><span>Completion Certificate</span></div></div>
    </div>
    <div class="hero-card"><span class="category">Student Portal</span><h2>Learn at your own pace</h2><p class="muted">Watch course videos, complete the assessment and earn your certificate when you pass.</p>
      <div class="card" style="margin-top:18px;background:#f8fbff"><b>Learning flow</b><p class="muted">Course → Video Lessons → Quiz → Pass → Certificate</p></div>
    </div>
  </div></section>
  <section class="section"><div class="container"><div class="section-head"><div><h2>Why EduFlow?</h2><p class="muted">Everything you need for a simple learning journey.</p></div></div>
  <div class="grid"><div class="card"><h3>Self-Paced Video Learning</h3><p class="muted">Stream structured YouTube lessons directly inside the course page.</p></div><div class="card"><h3>Interactive Quizzes</h3><p class="muted">Answer course questions and get instant score feedback.</p></div><div class="card"><h3>Verified Certificates</h3><p class="muted">Pass the course quiz and generate a printable certificate.</p></div></div></div></section>`);
}

function login(){
  layout(`<div class="auth-wrap"><div class="auth-card"><span class="category">Secure Access Portal</span><h2>Student Sign In</h2><p class="muted">Enter your credentials to access your dashboard.</p>
    <form onsubmit="doLogin(event)"><div class="form-group"><label>Email</label><input id="email" type="email" required placeholder="student@university.edu"></div>
    <div class="form-group"><label>Password</label><input id="password" type="password" required placeholder="••••••••"></div>
    <button class="btn" style="width:100%">Sign In to Student Dashboard</button></form>
    <p class="muted" style="margin-top:18px">Need a new account? <a href="#register" onclick="route('register')" style="color:#2563eb;font-weight:700">Register here</a></p>
  </div></div>`);
}
async function doLogin(e){e.preventDefault();try{const data=await api("/api/auth/login",{method:"POST",body:JSON.stringify({email:email.value,password:password.value})});saveAuth(data);toast("Login successful");route("dashboard")}catch(err){toast(err.message)}}

function register(){
  layout(`<div class="auth-wrap"><div class="auth-card"><span class="category">Create EduFlow Account</span><h2>Join EduFlow</h2><p class="muted">Create your student account.</p>
    <form onsubmit="doRegister(event)"><div class="form-group"><label>Full Name</label><input id="rname" required placeholder="e.g. Jane Smith"></div>
    <div class="form-group"><label>Email</label><input id="remail" type="email" required placeholder="name@example.com"></div>
    <div class="form-group"><label>Password</label><input id="rpassword" type="password" minlength="6" required></div>
    <div class="form-group"><label>Confirm Password</label><input id="rconfirm" type="password" minlength="6" required></div>
    <button class="btn" style="width:100%">Complete Registration</button></form>
    <p class="muted" style="margin-top:18px">Already have an account? <a href="#login" onclick="route('login')" style="color:#2563eb;font-weight:700">Sign In</a></p>
  </div></div>`);
}
async function doRegister(e){e.preventDefault();if(rpassword.value!==rconfirm.value)return toast("Passwords do not match");try{const data=await api("/api/auth/register",{method:"POST",body:JSON.stringify({name:rname.value,email:remail.value,password:rpassword.value,role:"student"})});toast(data.message||"Registration successful");route("login")}catch(err){toast(err.message)}}

async function catalog(){
  layout(`<section class="section"><div class="container"><div class="section-head"><div><span class="category">Catalog</span><h2>Explore Course Catalog</h2><p class="muted">Select a course to view its syllabus, videos and quiz.</p></div></div><div id="catalogGrid" class="grid"><div class="spinner">Loading courses...</div></div></div></section>`);
  const courses=await loadCourses();const grid=document.getElementById("catalogGrid");
  if(!courses.length){grid.innerHTML=`<div class="empty">No courses available yet.</div>`;return}
  grid.innerHTML=courses.map(c=>courseCard(c)).join("");
}
function courseCard(c){return `<div class="card course-card"><div><span class="category">${esc(c.category||"Programming")}</span><h3 style="font-size:21px;margin-top:9px">${esc(c.title)}</h3><p class="muted">${esc(c.description||"Learn practical skills through structured lessons.")}</p><div class="meta"><span>${esc(c.instructor||"SVEC Faculty")}</span><span>${esc(c.duration||"Self-paced")}</span><span>${esc(c.level||"Beginner")}</span></div></div><div class="grow"></div><button class="btn" onclick="route('course', '${c._id}')">View Details & Start</button></div>`}

async function coursePage(id){
  layout(`<section class="course-hero"><div class="container"><div class="spinner">Loading course...</div></div></section>`);
  try{state.currentCourse=await api(`/api/courses/${id}`)}catch(e){return layout(`<div class="section container"><div class="card"><h2>Course not found</h2><p class="muted">${esc(e.message)}</p></div></div>`)}
  const c=state.currentCourse,videos=(c.videos||[]).slice().sort((a,b)=>(a.order||0)-(b.order||0));
  layout(`<section class="course-hero"><div class="container"><span class="category">${esc(c.category||"Development")}</span><h1 style="font-size:42px">${esc(c.title)}</h1><p class="muted" style="max-width:800px">${esc(c.description||"")}</p><div class="meta"><span>Instructor: ${esc(c.instructor||"SVEC Faculty")}</span><span>${videos.length} Lessons</span><span>${esc(c.level||"Beginner")}</span></div></div></section>
  <section class="section"><div class="container course-layout"><div>
    <div class="card"><h2>Course Syllabus & Lessons</h2><p class="muted">Watch each lesson below.</p><div class="video-list" id="videoList">${videos.map((v,i)=>`<div class="video-item"><div><b>Lesson ${i+1}: ${esc(v.title)}</b><div class="muted" style="font-size:12px">YouTube video</div></div><button class="btn-light" onclick="watchVideo('${esc(v.youtubeUrl)}','${esc(v.title)}',${i})">Watch</button></div>`).join("")}</div></div>
    <div id="player" style="margin-top:20px"></div>
  </div><aside><div class="card"><span class="category">Course Progress</span><h3 id="progressText">0% Completed</h3><div class="progress"><div id="progressBar" style="width:0%"></div></div><p class="muted" style="font-size:13px">Complete your lessons and take the final quiz.</p><button class="btn" style="width:100%" onclick="openCourseQuiz('${c._id}')">Take Course Quiz</button></div></aside></div></section>`);
  updateProgress(id,videos.length);
}
function watchVideo(url,title,index){
  const id=getYoutubeId(url);if(!id)return toast("Invalid YouTube link");
  document.getElementById("player").innerHTML=`<div class="card"><h2>${esc(title)}</h2><iframe class="video-frame" src="https://www.youtube.com/embed/${id}" title="${esc(title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><button class="btn" onclick="markLesson(${index})">Mark Completed</button></div>`;
  document.getElementById("player").scrollIntoView({behavior:"smooth",block:"start"});
}
function getYoutubeId(url=""){try{const u=new URL(url);if(u.hostname.includes("youtu.be"))return u.pathname.slice(1);return u.searchParams.get("v")||""}catch{return""}}
function markLesson(index){if(!state.currentCourse)return;const key=`progress_${state.currentCourse._id}`;const p=JSON.parse(localStorage.getItem(key)||"[]");if(!p.includes(index))p.push(index);localStorage.setItem(key,JSON.stringify(p));updateProgress(state.currentCourse._id,(state.currentCourse.videos||[]).length);toast("Lesson marked completed")}
function updateProgress(id,total){const p=JSON.parse(localStorage.getItem(`progress_${id}`)||"[]");const pct=total?Math.round(p.length/total*100):0;const t=document.getElementById("progressText"),b=document.getElementById("progressBar");if(t)t.textContent=`${pct}% Completed`;if(b)b.style.width=pct+"%"}

async function openCourseQuiz(id){try{const q=await api(`/api/quiz/course/${id}`);state.currentQuiz=q;renderQuiz(q,id)}catch(e){toast(e.message);document.getElementById("player").innerHTML=`<div class="card"><h3>Quiz could not be loaded</h3><p class="muted">${esc(e.message)}</p><p class="muted">Make sure the quiz exists in MongoDB and the backend server is running.</p></div>`}}

function renderQuiz(q,id){
  const host=document.getElementById("player");if(!host)return;
  host.innerHTML=`<div class="card"><span class="category">Module Evaluation</span><h2>${esc(q.title||"Course Quiz")}</h2><p class="muted">Pass mark: ${q.passMark||60}%</p><form id="quizForm">${(q.questions||[]).map((x,i)=>`<div class="quiz-question"><h3>${i+1}. ${esc(x.question)}</h3>${(x.options||[]).map(o=>`<label class="option"><input type="radio" name="q${i}" value="${esc(o)}"> ${esc(o)}</label>`).join("")}</div>`).join("")}</form><button class="btn" onclick="submitQuiz('${id}')">Submit Quiz Answers</button><div id="quizResult"></div></div>`;
  host.scrollIntoView({behavior:"smooth"});
}
function submitQuiz(id){
  const q=state.currentQuiz;let score=0;
  (q.questions||[]).forEach((x,i)=>{const selected=document.querySelector(`input[name="q${i}"]:checked`);if(selected&&selected.value===x.correctAnswer)score++});
  const pct=q.questions?.length?Math.round(score/q.questions.length*100):0;const pass=pct>=(q.passMark||60);
  const r=document.getElementById("quizResult");
  r.className=`result ${pass?"pass":"fail"}`;
  r.innerHTML=pass?`<h2>Quiz Passed</h2><p><b>${score}/${q.questions.length}</b> correct — ${pct}%</p><p>Congratulations! You completed the assessment.</p><button class="btn" onclick="route('certificate','${id}')">View Completion Certificate</button>`:`<h2>Quiz Not Passed</h2><p><b>${score}/${q.questions.length}</b> correct — ${pct}%</p><p>You need ${q.passMark||60}% to pass.</p><button class="btn-light" onclick="renderQuiz(state.currentQuiz,'${id}')">Try Again</button>`;
}

function dashboard(){
  if(!state.user)return route("login");
  loadCourses().then(courses=>{
    layout(`<section class="dashboard-top"><div class="container"><span class="category">Student Portal</span><h1 style="font-size:42px">Welcome back, ${esc(state.user.name)}!</h1><p class="muted">Student ID: #${esc(String(state.user.id).slice(-8).toUpperCase())}</p><div class="dashboard-actions"><button class="btn" onclick="route('catalog')">Enroll in New Course</button><button class="btn-light" onclick="route('catalog')">Browse Catalog</button></div></div></section><section class="section" style="padding-top:20px"><div class="container"><div class="section-head"><div><h2>Available Courses</h2><p class="muted">Continue learning from the EduFlow catalog.</p></div></div><div class="grid">${courses.map(courseCard).join("")}</div></div></section>`);
  });
}

function certificate(id){
  if(!state.user)return route("login");
  const c=state.courses.find(x=>x._id===id)||state.currentCourse;
  if(!c)return route("catalog");
  const date=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
  layout(`<div class="certificate"><div class="cert-brand">EduFlow Learning Management System</div><h1>Certificate of Completion</h1><p class="muted">This certificate is officially awarded to</p><div class="cert-name">${esc(state.user.name).toUpperCase()}</div><p class="muted">for successfully completing the required learning modules and assessment for</p><div class="cert-course">${esc(c.title)}</div><div class="cert-grid"><div class="cert-sign"><b>${date}</b><br><span class="muted">Issue Date</span></div><div class="cert-sign"><b>SVEC Faculty</b><br><span class="muted">Instructor</span></div><div class="cert-sign"><b>${esc(String(state.user.id).slice(-8).toUpperCase())}</b><br><span class="muted">Student ID</span></div></div></div><div class="print-actions"><button class="btn" onclick="window.print()">Print / Save as PDF</button><button class="btn-light" onclick="route('dashboard')">Back to Dashboard</button></div>`);
}

function route(page,arg){
  if(page==="home")return home();
  if(page==="login")return login();
  if(page==="register")return register();
  if(page==="catalog")return catalog();
  if(page==="dashboard")return dashboard();
  if(page==="course")return coursePage(arg);
  if(page==="certificate")return certificate(arg);
}

window.addEventListener("hashchange",()=>{const [p,a]=location.hash.slice(1).split("/");if(p)route(p,a);else home()});
renderNav();
const initial=location.hash.slice(1).split("/");
if(initial[0])route(initial[0],initial[1]);else home();
