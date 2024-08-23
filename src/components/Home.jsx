// import React from 'react'

// function Home() {
//   return (
// <div className="relative overflow-hidden p-3 md:p-5 m-3 text-center bg-gray-100">
//   <div className="max-w-md mx-auto my-5 p-5">
//     <h1 className="text-4xl font-light">Punny headline</h1>
//     <p className="text-lg font-light">And an even wittier subheading to boot. Jumpstart your marketing efforts with this example based on Apple's marketing pages.</p>
//     <a className="mt-4 inline-block border border-gray-400 text-gray-700 py-2 px-4 rounded hover:bg-gray-200" href="#">
//       Coming soon
//     </a>
//   </div>
//   <div className="hidden md:block absolute inset-y-0 right-0 w-48 h-48 bg-gray-300 shadow-md"></div>
//   <div className="hidden md:block absolute inset-y-0 left-0 w-48 h-48 bg-gray-300 shadow-md"></div>
// </div>

//   )
// }

// export default Home

import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-6">LeetCode Analyzer</h1>
        <p className="text-lg mb-4">
          Welcome to LeetCode Analyzer, your go-to tool for analyzing your coding progress and performance on LeetCode.
        </p>
        <p className="text-lg mb-8">
          Whether you're preparing for coding interviews or just looking to improve your algorithmic skills, our platform provides detailed insights to help you track and enhance your problem-solving abilities. Explore your performance trends, strengths, and areas for improvement with our in-depth analysis.
        </p>
        <Link to="/analyzer">
          <button className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition duration-300">
            Go to Analyzer
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
