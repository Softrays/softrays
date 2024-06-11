// Price Section

document.getElementById("switch").addEventListener("click", function () {
  document.getElementById("second").classList.remove("display");
  document.getElementById("first").classList.add("display");
});

document.getElementById("switch2").addEventListener("click", function () {
  document.getElementById("second").classList.add("display");
  document.getElementById("third").classList.remove("display");
});

document.getElementById("back-switch").addEventListener("click", function () {
  document.getElementById("second").classList.add("display");
  document.getElementById("first").classList.remove("display");
});

document.getElementById("back-switch2").addEventListener("click", function () {
  document.getElementById("third").classList.add("display");
  document.getElementById("second").classList.remove("display");
});

$(".sworks").on("click", function () {
  $("#price").removeClass("display");
});

// SHOW AND HIDE PASSWORD
function tooglePassword() {
  const togglePassword = document.querySelector("#togglePassword");
  const password = document.querySelector("#password");

  togglePassword.addEventListener("click", (e) => {
    const type =
      password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
    togglePassword.classList.toggle("ri-eye-off-fill");
  });

  const anotherTogglePassword = document.querySelector(
    "#anotherTogglePassword"
  );
  const anotherPassword = document.querySelector("#anotherPassword");

  anotherTogglePassword.addEventListener("click", (e) => {
    const type =
      anotherPassword.getAttribute("type") === "password" ? "text" : "password";
    anotherPassword.setAttribute("type", type);
    anotherTogglePassword.classList.toggle("ri-eye-off-fill");
  });
}
tooglePassword();

// TogglePage
function togglePage() {
  $("#switcher").click(() => {
    $("#first").addClass("display");
    $("#second").removeClass("display");
  });
}
togglePage();

// SWITCH PAGES

// document.getElementById("one").addEventListener("click", function(){
//   document.getElementById("second").classList.remove("display")
//   document.getElementById("first").classList.add("display")
//   alert("hello")
// })

// PRICE

function changePrice() {
  // course = document.querySelector("biw").dataset.value;
  course = document.querySelector("#courses").value;
  console.log(course);
  switch (course) {
    case "nil":
      document.getElementById("price").value = 0;
      break;
    case "Advance Certification in Microsoft Excel":
      document.getElementById("price").value = 50000;
      document.getElementById("duration").value = "2 Weeks";
      break;
    case "Advance Certification in Solid Works":
      document.getElementById("price").value = 60000;
      document.getElementById("duration").value = "6 Weeks";
      break;
    case "Advance Certification in AutoCAD (2D&3D)":
      document.getElementById("price").value = 60000;
      document.getElementById("duration").value = "8 Weeks";
      break;
    case "Advance Certification in Revit (2D&3D)":
      document.getElementById("price").value = 60000;
      document.getElementById("duration").value = "8 Weeks";
      break;
    case "Advance Certification in Python (Data Science)":
      document.getElementById("price").value = 150000;
      document.getElementById("duration").value = "8 Weeks";
      break;
    case "Advance Certification in Java Programming":
      document.getElementById("price").value = 150000;
      document.getElementById("duration").value = "8 Weeks";
      break;
    case "Advance Certification in Cyber Security":
      document.getElementById("price").value = 150000;
      document.getElementById("duration").value = "12 Weeks";
      break;
    case "Advance Certification in Digital Marketing":
      document.getElementById("price").value = 200000;
      document.getElementById("duration").value = "12 Weeks";
      break;
    case "Certification in Information Technology and Computing":
      document.getElementById("price").value = 80000;
      document.getElementById("duration").value = "6 Weeks";
      break;
    case "Professional Certification in Adobe Photoshop":
      document.getElementById("price").value = 60000;
      document.getElementById("duration").value = "8 Weeks";
      break;
    case "Computer Systems Engineering A+ and Networking N+ (CSE)":
      document.getElementById("price").value = 80000;
      document.getElementById("duration").value = "8 Weeks";
      break;
    case "Certification in CorelDRAW and Digital Printing":
      document.getElementById("price").value = 60000;
      document.getElementById("duration").value = "8 Weeks";
      break;
    case "Certificate in Python Programming":
      document.getElementById("price").value = 60000;
      document.getElementById("duration").value = "6 Weeks";
      break;
    case "Certificate in Digital Marketing":
      document.getElementById("price").value = 100000;
      document.getElementById("duration").value = "6 Weeks";
      break;
    case "Certificate in Motion Graphics":
      document.getElementById("price").value = 100000;
      document.getElementById("duration").value = "8 Weeks";
      break;
    case "CCNA (CISCO CERTIFICATION)":
      document.getElementById("price").value = 150000;
      document.getElementById("duration").value = "8 Weeks";
      break;
    case "CCNP (CISCO CERTIFICATION)":
      document.getElementById("price").value = 150000;
      document.getElementById("duration").value = "8 Weeks";
      break;
    case "Data Analytics":
      document.getElementById("price").value = 150000;
      document.getElementById("duration").value = "6 Weeks";
      break;
    case "Internship":
      document.getElementById("price").value = 50000;
      document.getElementById("duration").value = "8 Weeks";
      break;
    case "Mini Importation Training":
      document.getElementById("price").value = 50000;
      document.getElementById("duration").value = "4 Weeks";
      break;
    case "Mobile App Development (Hybrid)":
      document.getElementById("price").value = 150000;
      document.getElementById("duration").value = "12 Weeks";
      break;
    case "Sage Accounting":
      document.getElementById("price").value = 80000;
      document.getElementById("duration").value = "6 Weeks";
      break;
    case "User Interface/User Experience (UI/UX) Desgin":
      document.getElementById("price").value = 100000;
      document.getElementById("duration").value = "8 Weeks";
      break;
    case "Web Development (Front End)":
      document.getElementById("price").value = 150000;
      document.getElementById("duration").value = "8 Weeks";
      break;
    case "Web Development (Full Stack)":
      document.getElementById("price").value = 300000;
      document.getElementById("duration").value = "10 Weeks";
      break;
    case "siwes/IT":
      document.getElementById("price").value = 10000;
      document.getElementById("duration").value = "6 Months";
      break;
    default:
      console.log(course);
      break;
  }
}
