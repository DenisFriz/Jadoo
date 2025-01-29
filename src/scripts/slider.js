document.addEventListener("DOMContentLoaded", () => {
  const SliderContainer = document.querySelector(".slider__container");
  let slideIndex = 0;
  const Dots = document.querySelector(".people__dots");
  const ArrowTop = document.querySelector(".arrow__top");
  const ArrowBottom = document.querySelector(".arrow__bottom");

  Dots.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.classList.contains("people__dot")) {
      slideIndex = [...target.parentElement.children].indexOf(target); // Get index of the clicked dot.
      changeSlide();
      setActiveDot();
      if (slideIndex == 0) {
        ArrowTop.style.opacity = "0.5";
        ArrowBottom.style.opacity = "1";
      } else if (slideIndex == SliderContainer.children.length - 1) {
        ArrowTop.style.opacity = "1";
        ArrowBottom.style.opacity = "0.5";
      } else {
        ArrowTop.style.opacity = "1";
        ArrowBottom.style.opacity = "1";
      }
    }
  });

  ArrowTop.addEventListener("click", () => {
    slideIndex -= 1;
    if (slideIndex <= 0) {
      slideIndex = 0;
      ArrowTop.style.opacity = "0.5";
    } else {
      ArrowTop.style.opacity = "1";
      ArrowBottom.style.opacity = "1";
    }
    changeSlide();
    setActiveDot();
  });

  ArrowBottom.addEventListener("click", () => {
    slideIndex += 1;
    if (slideIndex >= SliderContainer.children.length - 1) {
      slideIndex = SliderContainer.children.length - 1;
      ArrowBottom.style.opacity = "0.5";
    } else {
      ArrowTop.style.opacity = "1";
      ArrowBottom.style.opacity = "1";
    }
    changeSlide();
    setActiveDot();
  });

  function changeSlide() {
    const slideHeight = 282; // Assuming each slide is 200px tall
    SliderContainer.style.transform = `translate3d(0, ${
      -slideIndex * slideHeight
    }px, 0)`;
  }

  function setActiveDot() {
    for (let i = 0; i < Dots.children.length; i++) {
      Dots.children[i].classList.remove("dot--active");
    }
    Dots.children[slideIndex].classList.add("dot--active");
  }

  const Header = document.querySelector(".header");
  document.addEventListener("scroll", (e) => {
    // If user scrolls more than 100px add an active class to the header or remove.
    if (this.pageYOffset > 100) {
      Header.classList.add("header--active");
    } else {
      Header.classList.remove("header--active");
    }
  });

  const Header_Burger_Menu = document.querySelector(".burger__menu");
  const Header_List = document.querySelector(".header__list");
  let isBurgerMenuOpen = false;

  setHeaderListPosition();

  window.addEventListener("resize", () => {
    setHeaderListPosition();
  });

  Header_Burger_Menu.addEventListener("click", (e) => {
    e.stopPropagation();
    closeBurgerMenu();
  });

  window.addEventListener("click", () => {
    if (isBurgerMenuOpen) {
      closeBurgerMenu();
    }
  });

  function closeBurgerMenu() {
    if (Header_List.classList.contains("header__list--active")) {
      Header_List.classList.remove("header__list--active");
      Header_Burger_Menu.classList.remove("burger__close");
      isBurgerMenuOpen = false;
    } else {
      Header_List.classList.add("header__list--active");
      Header_Burger_Menu.classList.add("burger__close");
      isBurgerMenuOpen = true;
    }
  }

  function setHeaderListPosition() {
    if (Header_List.getBoundingClientRect().left <= 0) {
      Header_List.style.right = "auto";
      Header_List.style.left = "0";
    }
  }
});
