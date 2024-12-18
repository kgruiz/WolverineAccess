window.addEventListener("scroll", () => {
  const backToTopButton = document.querySelector(".back-to-top")
  const homeButton = document.querySelector(".home-button")

  if (window.scrollY > 200) {
    backToTopButton.style.display = "block"
    homeButton.style.display = "block"
  } else {
    backToTopButton.style.display = "none"
    homeButton.style.display = "none"
  }
})

document.querySelector(".back-to-top").addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
})

document.querySelector(".home-button").addEventListener("click", () => {
  window.location.href = "index.html"
})

const showMoreButton = document.getElementById("show-more")
const showLessButton = document.getElementById("show-less")
const showAllButton = document.getElementById("show-all")
const additionalCards = document.querySelectorAll(".additional-cards")

showMoreButton.addEventListener("click", () => {

  additionalCards.forEach(card => {
    card.classList.remove("hidden")
  })

  showMoreButton.classList.add("hidden")
  showLessButton.classList.remove("hidden")
  showAllButton.classList.remove("hidden")
})

showLessButton.addEventListener("click", () => {

  additionalCards.forEach(card => {
    card.classList.add("hidden")
  })

  showMoreButton.classList.remove("hidden")
  showLessButton.classList.add("hidden")
  showAllButton.classList.add("hidden")
})
