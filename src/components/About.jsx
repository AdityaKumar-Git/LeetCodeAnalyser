import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-6">About LeetCode Analyzer</h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg mb-4">
            At LeetCode Analyzer, our mission is to empower developers and aspiring coders by providing deep insights into their coding practices. We believe that understanding one's strengths and weaknesses is key to growth, and our tool is designed to help users identify these areas with precision.
          </p>
          <p className="text-lg">
            We strive to make coding practice more effective and efficient by offering detailed analysis, progress tracking, and tailored recommendations. Whether you are preparing for an interview or simply honing your skills, LeetCode Analyzer is here to support you on your journey.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
          <ul className="list-disc list-inside text-lg mb-4">
            <li>Comprehensive analytics on your LeetCode performance.</li>
            <li>Personalized recommendations based on your coding history.</li>
            <li>Track your progress over time with visual charts and reports.</li>
            <li>Enhance your preparation for coding interviews with focused analysis.</li>
          </ul>
          <p className="text-lg">
            We understand the challenges faced by developers in a highly competitive environment. Our platform is designed to make your coding journey more structured and data-driven, ensuring that you can focus on what truly matters—improving your skills.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Our Features</h2>
          <p className="text-lg mb-4">
            LeetCode Analyzer offers a suite of powerful features to enhance your coding experience:
          </p>
          <div className="ml-4">
            <h3 className="text-xl font-semibold mb-2">Detailed Problem Analysis</h3>
            <p className="text-lg mb-4">
              Break down your LeetCode submissions with in-depth analysis on problem difficulty, and more. Identify which problems challenge you the most and focus your practice accordingly.
            </p>

            <h3 className="text-xl font-semibold mb-2">Interview Preparation</h3>
            <p className="text-lg mb-4">
              Prepare for coding interviews with confidence. Our tools help you identify your strengths and weaknesses, so you can optimize your study sessions and go into interviews fully prepared.
            </p>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-lg mb-4">
            We love hearing from our users! If you have any questions, feedback, or suggestions, feel free to reach out to us.
          </p>
          <Link to="/contact">
            <button className="bg-gray-800 text-white py-2 px-6 rounded hover:bg-gray-900 transition duration-300">
              Go to Contact Us
            </button>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default About;
