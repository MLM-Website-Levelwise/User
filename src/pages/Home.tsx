import React, { useEffect } from "react";

const Home: React.FC = () => {
  useEffect(() => {
    const menuToggle = document.getElementById("menuToggle") as HTMLElement;
    const navLinks = document.getElementById("navLinks") as HTMLElement;
    const overlay = document.getElementById("overlay") as HTMLElement;
    const closeButton = document.getElementById("closeButton") as HTMLElement;

    const toggleMenu = () => {
      navLinks.classList.toggle("active");
      menuToggle.classList.toggle("active");
      overlay.classList.toggle("active");
      document.body.style.overflow = navLinks.classList.contains("active")
        ? "hidden"
        : "auto";
    };

    const closeMenu = () => {
      navLinks.classList.remove("active");
      menuToggle.classList.remove("active");
      overlay.classList.remove("active");
      document.body.style.overflow = "auto";
    };

    menuToggle?.addEventListener("click", toggleMenu);
    overlay?.addEventListener("click", closeMenu);
    closeButton?.addEventListener("click", closeMenu);

    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("scroll", () => {
      const navbar = document.querySelector(".navbar") as HTMLElement;
      if (window.scrollY > 50) {
        navbar.style.background = "rgba(2, 21, 61, 0.98)";
      } else {
        navbar.style.background = "rgba(2, 21, 61, 0.95)";
      }
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(
          (this as HTMLAnchorElement).getAttribute("href")!
        );
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("mouseenter", function () {
        (this as HTMLElement).style.transform = "translateY(-3px) scale(1.02)";
      });
      btn.addEventListener("mouseleave", function () {
        (this as HTMLElement).style.transform = "translateY(0) scale(1)";
      });
    });
  }, []);

  return (
    <>
      {/* Overlay */}
      <div
        id="overlay"
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 opacity-0 invisible transition-all duration-300 z-[999]"
      ></div>

      {/* Navbar */}
      <nav className="navbar fixed top-0 w-full bg-[rgba(2,21,61,0.95)] backdrop-blur z-[1000] py-3 transition-all duration-300">
        <div className="nav-container max-w-[1200px] mx-auto flex justify-between items-center px-8">
          {/* Hamburger menu for mobile only */}
          <div
            id="menuToggle"
            className="menu-toggle flex flex-col cursor-pointer p-1 md:hidden"
          >
            <span className="w-[25px] h-[3px] bg-white my-[3px] rounded"></span>
            <span className="w-[25px] h-[3px] bg-white my-[3px] rounded"></span>
            <span className="w-[25px] h-[3px] bg-white my-[3px] rounded"></span>
          </div>

          {/* Logo */}
          <a
            href="#"
            className="logo text-yellow-400 font-bold text-xl hidden md:inline-block"
          >
            Prime Next
          </a>

          {/* Nav links */}
          <ul
            id="navLinks"
            className="nav-links fixed md:static md:flex md:flex-row md:items-center md:gap-8 text-white font-medium transition-all duration-300
    flex-col top-0 left-[-85%] w-[85%] h-screen md:h-auto bg-gradient-to-br from-[rgba(2,21,61,0.98)] to-[rgba(15,23,42,0.98)]
    backdrop-blur-[20px] pt-20 px-8 border-r border-yellow-300/20 md:p-0 md:bg-transparent md:border-none md:w-auto
    [&.active]:left-0 z-[999] shadow-2xl"
          >
            {/* Close Button */}
            <div className="absolute top-4 right-4 md:hidden">
              <button
                id="closeButton"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Logo in sidebar */}
            {/* <li className="mb-12 md:hidden">
              <div className="text-yellow-400 font-bold text-2xl text-center">
                Prime Next
              </div>
            </li> */}

            {/* Navigation Items */}
            <li className="mb-8 md:mb-0">
              <a
                href="#home"
                className="block py-3 px-4 rounded-lg hover:bg-white/10 transition-colors duration-200 text-lg md:text-base md:p-0 md:hover:bg-transparent md:hover:text-yellow-400"
              >
                Home
              </a>
            </li>
            <li className="mb-8 md:mb-0">
              <a
                href="#about"
                className="block py-3 px-4 rounded-lg hover:bg-white/10 transition-colors duration-200 text-lg md:text-base md:p-0 md:hover:bg-transparent md:hover:text-yellow-400"
              >
                About Us
              </a>
            </li>
            <li className="mb-8 md:mb-0">
              <a
                href="#services"
                className="block py-3 px-4 rounded-lg hover:bg-white/10 transition-colors duration-200 text-lg md:text-base md:p-0 md:hover:bg-transparent md:hover:text-yellow-400"
              >
                Services
              </a>
            </li>
            <li className="mb-8 md:mb-0">
              <a
                href="#contact"
                className="block py-3 px-4 rounded-lg hover:bg-white/10 transition-colors duration-200 text-lg md:text-base md:p-0 md:hover:bg-transparent md:hover:text-yellow-400"
              >
                Contact Us
              </a>
            </li>

            {/* Login Button in sidebar */}
            <li className="mt-12 md:hidden">
              <a
                href="/login"
                className="block bg-white text-slate-800 py-3 px-6 rounded-full font-semibold hover:bg-white-500 transition-all text-center"
              >
                Login
              </a>
            </li>
          </ul>

          {/* Login Button (always visible) */}
          <a
            href="/login"
            className="login-btn bg-yellow-400  text-slate-800 py-1 px-4 rounded-full font-semibold hover:bg-yellow-600  hover:translate-y-[-2px] hover:shadow-lg transition-all inline-block"
          >
            Login
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="hero min-h-screen bg-[linear-gradient(135deg,rgba(15,23,42,0.6),rgba(30,41,59,0.7)),url('/bg.jpg')] bg-center bg-cover bg-no-repeat flex items-center justify-center text-white relative overflow-hidden"
      >
        <div className="hero-content max-w-[900px] px-8 z-10 relative mt-20 text-center">
          <div className="hero-company text-yellow-400 text-lg font-semibold tracking-[2px] uppercase mb-6">
            Prime Next
          </div>
          <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Your Next Prime Opportunity to Grow Wealth Together
          </h1>
          <p className="hero-subtitle text-slate-200 text-lg md:text-xl max-w-[700px] mx-auto mb-10 leading-relaxed">
            Join a powerful network of achievers. Unlock financial freedom
            through community-driven growth, smart strategies, and transparent
            rewards.
          </p>
          <div className="hero-buttons flex flex-wrap justify-center gap-4">
            <a
              href="#"
              className="btn btn-primary bg-gradient-to-br from-yellow-400 to-yellow-500 text-slate-800 font-semibold text-lg px-8 py-4 rounded-full shadow-md hover:translate-y-[-3px] hover:shadow-xl transition-all inline-flex items-center justify-center"
            >
              👉 Join Now
            </a>
            <a
              href="#"
              className="btn btn-secondary border border-white/30 backdrop-blur text-white font-semibold text-lg px-8 py-4 rounded-full hover:bg-white/10 hover:border-yellow-400 hover:translate-y-[-3px] hover:shadow-xl transition-all inline-flex items-center justify-center"
            >
              📘 Learn More
            </a>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section
        id="about"
        className="aboutus py-16 px-4 max-w-[1200px] mx-auto bg-gradient-to-b from-blue-50 to-white"
      >
        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              Know{" "}
              <span className="bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                About Us
              </span>
            </h2>
            <p className="text-xl text-black-800 max-w-3xl mx-auto">
              Redefining success through connection, opportunity, and shared
              growth.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Image */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {/* Main large image */}
                <div className="col-span-2 relative rounded-xl overflow-hidden shadow-2xl">
                  <div className="aspect-w-16 aspect-h-10 bg-blue-200 rounded-xl overflow-hidden">
                    <img
                      src="/aboutus.jpg"
                      alt="Descriptive Alt Text"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-blue-900/20 hover:bg-blue-900/10 transition-colors duration-300"></div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-4xl sm:text-5xl font-bold text-blue-900 leading-tight">
                    Turning everyday people into talented entrepreneurs.
                  </h2>
                </div>

                <p className="text-lg text-black-800 leading-relaxed">
                  At Prime Next, we're more than just a business—we’re a growing
                  network of dreamers, doers, and achievers. Built on the
                  foundation of trust, transparency, and teamwork, we empower
                  individuals to unlock their full potential through smart
                  earning opportunities and personal growth. Our innovative
                  multi-level marketing model offers a fair, rewarding platform
                  for every partner—whether you're just starting out or scaling
                  new heights. Join us as we reshape the future of
                  entrepreneurship, one connection at a time.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                  Know More Coverage →
                </button>
                <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                  Get Offer upto 50% →
                </button>
              </div>

              {/* Stats */}
              <div className="flex justify-between items-center gap-6 pt-8 overflow-x-auto">
                {/* Stat 1 */}
                <div className="text-center min-w-[100px] flex-1">
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-2xl font-bold text-blue-600">$</span>
                    <span className="text-3xl font-bold text-blue-900">
                      690
                    </span>
                    <span className="text-xl font-bold text-blue-600">k+</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">Total Deals</p>
                </div>

                {/* Stat 3 (Optional) */}
                <div className="text-center min-w-[100px] flex-1">
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-2xl font-bold text-blue-600">🚀</span>
                    <span className="text-3xl font-bold text-blue-900">
                      120
                    </span>
                    <span className="text-xl font-bold text-blue-600">+</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Projects Launched
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className=" px-4 bg-gradient-to-b from-white to-blue-50"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Premium Services
              </span>
            </h2>
            <p className="text-xl text-black-800 max-w-3xl mx-auto">
              Unlock your potential with our comprehensive MLM solutions
              designed to accelerate your success
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Network Building Card */}
            <div className="animate-fade-in-up">
              <div className="group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-300 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>

                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&h=400"
                    alt="Network Building"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-blue-900/30 transition-colors duration-500"></div>

                  <div className="absolute top-4 left-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    Network Building
                  </h3>
                  <p className="text-black-800 text-sm leading-relaxed mb-4">
                    Build and expand your network with powerful tools and
                    strategies designed to help you connect with potential
                    partners and customers worldwide.
                  </p>

                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group/btn">
                    <span className="mr-2">Learn More</span>
                    <svg
                      className="w-4 h-4 transition-transform group-hover/btn:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </div>

                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-200 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
              </div>
            </div>

            {/* Income Growth Card */}
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              <div className="group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-400 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>

                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&h=400"
                    alt="Income Growth"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-blue-900/30 transition-colors duration-500"></div>

                  <div className="absolute top-4 left-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    Income Growth
                  </h3>
                  <p className="text-black-800 text-sm leading-relaxed mb-4">
                    Maximize your earning potential with our comprehensive
                    income growth strategies, training programs, and performance
                    optimization tools.
                  </p>

                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group/btn">
                    <span className="mr-2">Learn More</span>
                    <svg
                      className="w-4 h-4 transition-transform group-hover/btn:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </div>

                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-800 to-blue-600 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
              </div>
            </div>

            {/* Leadership Development Card */}
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "400ms" }}
            >
              <div className="group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>

                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&h=400"
                    alt="Leadership Development"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-blue-900/30 transition-colors duration-500"></div>

                  <div className="absolute top-4 left-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    Leadership Development
                  </h3>
                  <p className="text-black-800 text-sm leading-relaxed mb-4">
                    Develop your leadership skills and build a successful team
                    with our proven training programs and mentorship
                    opportunities.
                  </p>

                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group/btn">
                    <span className="mr-2">Learn More</span>
                    <svg
                      className="w-4 h-4 transition-transform group-hover/btn:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </div>

                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-800 to-blue-600 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-blue-950 text-white mt-10 pt-12 pb-6 px-4 sm:px-6 lg:px-8 border-t border-blue-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* Company Info */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white-200">Prime Next</h2>
              <p className="text-white-200 text-sm">
                Empowering entrepreneurs worldwide to achieve financial freedom
                through our proven MLM platform and community support.
              </p>
            </div>

            {/* Quick Links and MLM Resources */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-yellow-500">
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-white-200 hover:text-white text-sm transition-colors"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white-200 hover:text-white text-sm transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white-200 hover:text-white text-sm transition-colors"
                    >
                      Services
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white-200 hover:text-white text-sm transition-colors"
                    >
                      Compensation Plan
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white-200 hover:text-white text-sm transition-colors"
                    >
                      Testimonials
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-yellow-500">
                  MLM Resources
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-white-200 hover:text-white text-sm transition-colors"
                    >
                      Training Materials
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white-200 hover:text-white text-sm transition-colors"
                    >
                      Marketing Tools
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white-200 hover:text-white text-sm transition-colors"
                    >
                      Webinars
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white-200 hover:text-white text-sm transition-colors"
                    >
                      Success Stories
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white-200 hover:text-white text-sm transition-colors"
                    >
                      FAQs
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-yellow-500">
                Contact Us
              </h3>
              <address className="not-italic text-white-200 text-sm space-y-2">
                <p>
                  123 Business Ave, Suite 500
                  <br />
                  New York, NY 10001
                </p>
                <p>
                  <a
                    href="tel:+18005551234"
                    className="hover:text-white transition-colors"
                  >
                    +1 (800) 555-1234
                  </a>
                </p>
                <p>
                  <a
                    href="mailto:support@primenext.com"
                    className="hover:text-white transition-colors"
                  >
                    support@primenext.com
                  </a>
                </p>
                <p>Mon-Fri: 9AM - 6PM EST</p>
              </address>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-blue-800 my-6"></div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white-400 text-xs mb-4 md:mb-0">
              © 2025 Prime Next MLM. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 text-xs">
              <a
                href="#"
                className="text-white-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-white-400 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-white-400 hover:text-white transition-colors"
              >
                Compliance
              </a>
              <a
                href="#"
                className="text-white-400 hover:text-white transition-colors"
              >
                Income Disclosure
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
