window.addEventListener("scroll", () => {

  const backToTopButton = document.querySelector(".back-to-top")

  if (window.scrollY > 200) {
    backToTopButton.style.display = "block"
  } else {
    backToTopButton.style.display = "none"
  }

})

document.querySelector(".back-to-top").addEventListener("click", () => {

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })

})