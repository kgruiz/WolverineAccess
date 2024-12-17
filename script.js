window.addEventListener("scroll", () => {
  const backToTopButton = document.querySelector(".back-to-top");
  const homeButton = document.querySelector(".home-button");

  if (window.scrollY > 200) {
    backToTopButton.style.display = "block";
    homeButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
    homeButton.style.display = "none";
  }
});

document.querySelector(".back-to-top").addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

document.querySelector(".home-button").addEventListener("click", () => {
  window.location.href = "index.html";
});