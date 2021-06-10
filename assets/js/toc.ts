window.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        if (entry.intersectionRatio > 0) {
          document
            .querySelector(`nav li a[href="#${id}"]`)
            .parentElement.classList.add("active");
        } else {
          document
            .querySelector(`nav li a[href="#${id}"]`)
            .parentElement.classList.remove("active");
        }
      });
    });
    //:is(h1, h2, h3, h4, h5, h6)
    // Track all sections that have an `id` applied
    document
      .querySelectorAll(":is(h2, h3, h4, h5, h6)[id]")
      .forEach((section) => {
        observer.observe(section);
      });
  });