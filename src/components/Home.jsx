import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] bg-gray-100 p-6">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-6">LeetCode Analyzer</h1>
        <p className="text-lg mb-4">
          Welcome to LeetCode Analyzer, your go-to tool for analyzing your coding progress and performance on LeetCode.
        </p>
        <p className="text-lg mb-8">
          Whether you're preparing for coding interviews or just looking to improve your algorithmic skills, our platform provides detailed insights to help you track and enhance your problem-solving abilities. Explore your performance trends, strengths, and areas for improvement with our in-depth analysis.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/analyzer">
            <button className="bg-gray-800 text-white py-2 px-6 rounded hover:bg-gray-900 transition duration-300">
              Go to Analyzer
            </button>
          </Link>
          <Link to="/about">
            <button className="bg-gray-800 text-white py-2 px-6 rounded hover:bg-gray-900 transition duration-300">
              About Us
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
