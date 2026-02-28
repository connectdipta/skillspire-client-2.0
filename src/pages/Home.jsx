import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Banner from "../components/Banner";
import PopularContests from "../components/PopularContests";
import WinnerShowcase from "../components/WinnerShowcase";
import ExtraSections from "../components/ExtraSections";
import FAQSection from "../components/FAQSection";
import Banner2 from "../components/Banner2";

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
      offset: 120,
    });
  }, []);

  return (
    <div className="relative">
      {/* HERO */}
      <section data-aos="fade-up" data-aos-delay="100">
        <Banner />
      </section>

      {/* POPULAR CONTESTS */}
      <section data-aos="fade-up" data-aos-delay="150">
        <PopularContests />
      </section>

      {/* WINNER SHOWCASE */}
      <section data-aos="zoom-in-up" data-aos-delay="200">
        <WinnerShowcase />
      </section>

       {/* HERO */}
      <section data-aos="fade-up" data-aos-delay="100">
        <Banner2 />
      </section>


      {/* EXTRA SECTIONS */}
      <section data-aos="fade-up" data-aos-delay="150">
        <ExtraSections />
      </section>

      {/* FAQ */}
      <section data-aos="fade-up" data-aos-delay="100">
        <FAQSection />
      </section>
    </div>
  );
};

export default Home;
