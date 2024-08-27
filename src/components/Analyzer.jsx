import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Analyzer = () => {
  const nullImg = 'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=';
  const [userID, setUserID] = useState('Enter Valid Username');
  const [basicDetail, SetBasicDetail] = useState({name:'Not Added', avatar:nullImg, ranking:"Not Available"});
  const [solvedStats, setSolvedStats] = useState({ totalSolved:0, easy:0, medium:0, hard:0 });
  const [isInvalidFetch, setIsInvalidFetch] = useState(false);

  const { ID } = useParams();
  useEffect(() => {
    if(String(ID).length != 0) {setUserID(ID);}
  }, [ID]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let getid = document.getElementById('userID').value;
    setUserID(getid);
  };

  useEffect(() => {
    // fetchAndSet();
  }, [userID]);

const fetchAndSet = () => {
  if(userID === 'Enter Valid Username') return;

  fetch(`https://alfa-leetcode-api.onrender.com/${userID}`)
  .then((response) => response.json())
  .then((data) => {
    if('errors' in data) return true;
    if(String(data.name).length == 0){
      SetBasicDetail({...basicDetail,
        avatar: data.avatar,
        ranking: data.ranking,
      });
    }
    else {
      SetBasicDetail({
        ...basicDetail,
        name: data.name,
        avatar: data.avatar,
        ranking: data.ranking,
      });
    }
    return false;
  })
  .then((check) => {
    console.log(check);
    setIsInvalidFetch(check)
  })
  .catch((error) => {
    console.error('Error:', error);
  });

  if(isInvalidFetch){ 
    alert('Invalid User ID');
    setUserID('Enter Valid Username');
    return;
  }

  fetch(`https://alfa-leetcode-api.onrender.com/${userID}/solved`)
  .then((response) => response.json())
  .then((data) => {
    setSolvedStats({
      ...solvedStats,
      totalSolved: data.solvedProblem,
      easy: data.easySolved,
      medium: data.mediumSolved,
      hard: data.hardSolved
    });
    console.log("is here");
  });
};


  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">LeetCode Analyzer</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="userID" className="block text-lg font-medium mb-2">
              LeetCode User ID
            </label>
            <input
              type="text"
              id="userID"
            //   value={userID}
            //   onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your LeetCode User ID"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 transition duration-300"
          >
            Analyze
          </button>
        </form>
      </div>

      {/* Details Section
      {detailsVisible && (
        
      )} */}

        <div className="max-w-6xl w-full bg-white p-8 mt-6 rounded-lg shadow-md">
          <div className='IMG&DETAILS flex justify-between'>
            <div className='Details'>
                <h2 className="text-2xl font-bold mb-4">User Details</h2>
                <p className="text-lg mb-2">Username: {userID}</p>
                <p className="text-lg mb-2">Name: {basicDetail.name}</p>
                <p className="text-lg mb-2">Rank: {basicDetail.ranking}</p>
            </div>
            <div className="Img">
                <img src={basicDetail.avatar} className='h-52 w-auto' alt=""/>
            </div>
          </div>
          <div className='Stats pt-3'>
            <h2 className="text-2xl font-bold mb-4">Problem Stats</h2>
            <p className="text-lg mb-2">Total Problems Solved: {solvedStats.totalSolved}</p>
            <p className='text-lg mb-2'>Easy Problems: {solvedStats.easy}</p>
            <p className='text-lg mb-2'>Medium Problems: {solvedStats.medium}</p>
            <p className='text-lg mb-2'>Hard Problems: {solvedStats.hard}</p>
          </div>
        </div>
    </div>
  );
};

export default Analyzer;
