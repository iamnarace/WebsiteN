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
      $("header").addClass("header-shadow");
    } else {
      document.querySelector("#scroll-top").classList.remove("active");
      $("header").removeClass("header-shadow");
    }

    $("section").each(function () {
      const height = $(this).outerHeight();
      const offset = $(this).offset().top - 220;
      const top = $(window).scrollTop();
      const id = $(this).attr("id");

      if (top >= offset && top < offset + height) {
        $(".navbar ul li a").removeClass("active");
        $('.navbar').find(`[href="#${id}"]`).addClass("active");
      }
    });
  });

  $('a[href*="#"]').on("click", function (e) {
    const href = $(this).attr("href");
    if (href && href.startsWith("#") && $(href).length) {
      e.preventDefault();
      $("html, body").animate(
        { scrollTop: $(href).offset().top },
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
          alert("Message sent successfully.");
        },
        function () {
          alert("Message failed to send. Please try again.");
        }
      );
  });
});

document.addEventListener("visibilitychange", function () {
  document.title = "Naresh Adhikari | Portfolio";
  $("#favicon").attr("href", "./assets/images/favicon.png");
});

var typed = new Typed(".typing-text", {
  strings: [
    "IT Support",
    "Desktop Engineering",
    "Microsoft 365 Administration",
    "Azure Support",
    "End-User Computing"
  ],
  loop: true,
  typeSpeed: 55,
  backSpeed: 28,
  backDelay: 1200,
});

async function fetchData() {
  const response = await fetch("./skills.json");
  return response.json();
}

function showSkills(skills) {
  const skillsContainer = document.getElementById("skillsContainer");
  let skillHTML = "";

  skills.forEach((skill) => {
    skillHTML += `
      <div class="bar">
        <div class="info">
          <i class="${skill.fa}" aria-hidden="true"></i>
          <span>${skill.name}</span>
        </div>
      </div>
    `;
  });

  skillsContainer.innerHTML = skillHTML;
}

fetchData().then((data) => {
  showSkills(data);
});

VanillaTilt.init(document.querySelectorAll(".tilt"), {
  max: 10,
  speed: 400,
  glare: true,
  "max-glare": 0.12,
});

const srtop = ScrollReveal({
  origin: "top",
  distance: "60px",
  duration: 900,
  reset: false,
});

srtop.reveal(".home .content h2", { delay: 120 });
srtop.reveal(".home .content p", { delay: 160 });
srtop.reveal(".home .content .hero-actions", { delay: 220 });
srtop.reveal(".home .content .socials", { delay: 260 });
srtop.reveal(".home .image", { delay: 280 });

srtop.reveal(".about .content h3", { delay: 120 });
srtop.reveal(".about .content .tag", { delay: 150 });
srtop.reveal(".about .content p", { delay: 180 });
srtop.reveal(".about .content .compact-info", { delay: 220 });

srtop.reveal(".skills .container .bar", { interval: 90 });
srtop.reveal(".education .box", { interval: 140 });
srtop.reveal(".experience .timeline .container", { interval: 140 });
srtop.reveal(".contact .container", { delay: 160 });

if (typeof particlesJS !== "undefined") {
  particlesJS("particles-js", {
    particles: {
      number: { value: 40, density: { enable: true, value_area: 900 } },
      color: { value: "#ffffff" },
      shape: { type: "circle" },
      opacity: { value: 0.16, random: true },
      size: { value: 3, random: true },
      line_linked: {
        enable: true,
        distance: 140,
        color: "#ffffff",
        opacity: 0.08,
        width: 1
      },
      move: {
        enable: true,
        speed: 1.5,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "grab" },
        onclick: { enable: false },
        resize: true
      },
      modes: {
        grab: { distance: 150, line_linked: { opacity: 0.14 } }
      }
    },
    retina_detect: true
  });
}
