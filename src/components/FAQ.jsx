import React from 'react';

const FAQs = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">What is LeetCode Analyzer?</h2>
          <p className="text-lg">
            LeetCode Analyzer is a tool designed to provide deep insights into your LeetCode coding practice. It helps you track your progress, analyze your performance, and identify areas for improvement, making your coding practice more effective and data-driven.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">How does LeetCode Analyzer work?</h2>
          <p className="text-lg">
            LeetCode Analyzer connects with your LeetCode account and pulls your submission data. It then analyzes this data to generate detailed reports on your performance, including success rates, problem-solving speed, and areas that need more focus.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Is LeetCode Analyzer free to use?</h2>
          <p className="text-lg">
            Yes, LeetCode Analyzer is a free tool. You can use it without any cost or commitment.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">How can I contact support?</h2>
          <p className="text-lg">
            If you have any questions, issues, or feedback, you can contact our support team via the Contact Us page. We're here to help and will respond as quickly as possible.
          </p>
        </section>
      </div>
    </div>
  );
};

export default FAQs;
