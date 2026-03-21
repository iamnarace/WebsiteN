$(document).ready(function () {
  $("#menu").click(function () {
    $(this).toggleClass("fa-times");
    $(".navbar").toggleClass("nav-toggle");
  });

  $(window).on("scroll load", function () {
    $("#menu").removeClass("fa-times");
    $(".navbar").removeClass("nav-toggle");

    if (window.scrollY > 60) {
      document.querySelector("#scroll-top").classList.add("active");
      document.querySelector("header").classList.add("header-shadow");
    } else {
      document.querySelector("#scroll-top").classList.remove("active");
      document.querySelector("header").classList.remove("header-shadow");
    }

    $("section").each(function () {
      const height = $(this).outerHeight();
      const offset = $(this).offset().top - 200;
      const top = $(window).scrollTop();
      const id = $(this).attr("id");

      if (top > offset && top < offset + height) {
        $(".navbar ul li a").removeClass("active");
        $('.navbar').find(`[href="#${id}"]`).addClass("active");
      }
    });
  });

  $('a[href*="#"]').on("click", function (e) {
    const target = $(this).attr("href");
    if (target.startsWith("#") && $(target).length) {
      e.preventDefault();
      $("html, body").animate(
        { scrollTop: $(target).offset().top },
        500,
        "linear"
      );
    }
  });

  $("#contact-form").submit(function (event) {
    event.preventDefault();

    emailjs.init({
      publicKey: "MY5L9lgL3nRdTue_4",
    });

    emailjs
      .sendForm("service_5mev86q", "template_kghd9wc", "#contact-form")
      .then(
        function () {
          document.getElementById("contact-form").reset();
          alert("Thanks. Your message has been sent.");
        },
        function () {
          alert("Message could not be sent right now. Please try again.");
        }
      );
  });
});

document.addEventListener("visibilitychange", function () {
  document.title = "Portfolio | Naresh Adhikari";
  $("#favicon").attr("href", "assets/images/favicon.png");
});

var typed = new Typed(".typing-text", {
  strings: [
    "IT Support Specialist",
    "Systems Engineer",
    "Microsoft 365 Administrator",
    "Azure Administrator"
  ],
  loop: true,
  typeSpeed: 55,
  backSpeed: 28,
  backDelay: 1200,
});

async function fetchData(type = "skills") {
  const response =
    type === "skills"
      ? await fetch("skills.json")
      : await fetch("./projects/projects.json");
  return response.json();
}

function showSkills(skills) {
  const skillsContainer = document.getElementById("skillsContainer");
  let skillHTML = "";

  skills.forEach((skill) => {
    skillHTML += `
      <div class="bar">
        <div class="info">
          <img src="./assets/images/skills/${skill.icon}" alt="${skill.name}" />
          <span>${skill.name}</span>
        </div>
      </div>
    `;
  });

  skillsContainer.innerHTML = skillHTML;
}

function showProjects(projects) {
  const projectsContainer = document.querySelector("#work .box-container");
  if (!projectsContainer) return;

  let projectHTML = "";
  projects
    .slice(0, 6)
    .filter((project) => project.category !== "android")
    .forEach((project) => {
      projectHTML += `
        <div class="box tilt">
          <img draggable="false" src="/assets/images/projects/${project.image}" alt="${project.name}" />
          <div class="content">
            <div class="tag">
              <h3>${project.name}</h3>
            </div>
            <div class="desc">
              <p>${project.desc}</p>
              <div class="btns">
                <a href="${project.links.view}" class="btn" target="_blank" rel="noreferrer">View</a>
                <a href="${project.links.code}" class="btn" target="_blank" rel="noreferrer">Code</a>
              </div>
            </div>
          </div>
        </div>
      `;
    });

  projectsContainer.innerHTML = projectHTML;
  VanillaTilt.init(document.querySelectorAll(".tilt"), {
    max: 10,
    speed: 400,
    glare: true,
    "max-glare": 0.12,
  });
}

fetchData().then((data) => {
  showSkills(data);
});

fetchData("projects").then((data) => {
  showProjects(data);
});

VanillaTilt.init(document.querySelectorAll(".tilt"), {
  max: 10,
  speed: 400,
  glare: true,
  "max-glare": 0.12,
});

if (document.getElementById("particles-js")) {
  particlesJS("particles-js", {
    particles: {
      number: { value: 45, density: { enable: true, value_area: 800 } },
      color: { value: "#ffffff" },
      shape: { type: "circle" },
      opacity: { value: 0.18, random: true },
      size: { value: 3, random: true },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.08,
        width: 1
      },
      move: { enable: true, speed: 1.5, direction: "none", random: false }
    },
    interactivity: {
      detect_on: "canvas",
      events: { onhover: { enable: false }, onclick: { enable: false }, resize: true }
    },
    retina_detect: true
  });
}

const srtop = ScrollReveal({
  origin: "top",
  distance: "50px",
  duration: 900,
  reset: false,
});

srtop.reveal(".home .content h2", { delay: 120 });
srtop.reveal(".home .content .hero-role-line", { delay: 170 });
srtop.reveal(".home .content .hero-summary", { delay: 210 });
srtop.reveal(".home .content .hero-badges", { delay: 250 });
srtop.reveal(".home .content .hero-actions", { delay: 290 });
srtop.reveal(".home .content .socials", { delay: 330 });
srtop.reveal(".home .image", { delay: 220 });

srtop.reveal(".about .content h3", { delay: 120 });
srtop.reveal(".about .content .tag", { delay: 160 });
srtop.reveal(".about .content p", { interval: 90 });
srtop.reveal(".about .content .compact-info", { delay: 220 });

srtop.reveal(".skills .container .bar", { interval: 80 });
srtop.reveal(".education .box", { interval: 120 });
srtop.reveal(".experience .timeline .container", { interval: 120 });
srtop.reveal(".contact .container", { delay: 160 });
