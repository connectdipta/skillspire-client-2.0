import React, { useState } from "react";
import { FiChevronUp, FiChevronDown, FiArrowRight } from "react-icons/fi";

const faqData = [
  {
    question: "What is SkillSpire?",
    answer:
      "SkillSpire is an online contest platform where users can participate in skill-based competitions, showcase their talent, and win exciting rewards.",
  },
  {
    question: "How can I participate in a contest?",
    answer:
      "Simply create an account, browse available contests, and join any contest that matches your interests.",
  },
  {
    question: "Is SkillSpire free to use?",
    answer:
      "Creating an account is free. Some premium contests may require an entry fee, which will be clearly mentioned.",
  },
  {
    question: "How are winners selected?",
    answer:
      "Winners are selected based on predefined rules such as score, performance, or judge evaluation.",
  },
  {
    question: "How do I receive my rewards?",
    answer:
      "Rewards are credited to your account or delivered as mentioned in the contest details.",
  },
  {
    question: "Can I join multiple contests?",
    answer:
      "Yes, you can participate in multiple contests at the same time.",
  },
  {
    question: "Is SkillSpire secure?",
    answer:
      "Yes, SkillSpire uses secure authentication and data protection to ensure fair and safe participation.",
  },
  {
    question: "Can I create my own contest?",
    answer:
      "Yes, eligible users and organizations can create and manage contests on SkillSpire.",
  },
];

const INITIAL_VISIBLE_COUNT = 5;

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-base-200 py-16 px-4 md:px-8 rounded-4xl mt-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-secondary">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base-content/70 max-w-2xl mx-auto">
            Everything you need to know about contests, participation, and rewards on SkillSpire.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.slice(0, visibleCount).map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`rounded-xl border transition-all duration-300
                  ${isOpen ? "border-primary" : "border-base-300"}
                  bg-base-100`}
              >
                <button
                  className={`w-full flex justify-between items-center p-5 text-left font-semibold
                    ${isOpen ? "text-primary" : "text-base-content"}`}
                  onClick={() => toggleFAQ(index)}
                >
                  {item.question}
                  {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500
                    ${isOpen ? "max-h-40 p-5 pt-0 opacity-100" : "max-h-0 opacity-0 p-0"}`}
                >
                  <p className="text-base-content/70 text-sm border-t border-base-300 pt-4">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Show More */}
        {visibleCount < faqData.length && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setVisibleCount(faqData.length)}
              className="flex items-center gap-2 px-8 py-3 rounded-full
                bg-primary text-secondary font-semibold shadow-md
                hover:shadow-lg transition"
            >
              See More FAQs
              <FiArrowRight />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQSection;
