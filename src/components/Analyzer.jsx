import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Pie, Bar, Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const nullImg =
  'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=';

const Analyzer = () => {
  const { ID } = useParams();
  const [userID, setUserID] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [basicDetail, setBasicDetail] = useState({
    name: 'Not Added',
    avatar: nullImg,
    ranking: 'Not Available',
    reputation: 0,
    contributionPoints: 0,
  });

  const [solvedStats, setSolvedStats] = useState({
    total: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    totalQuestions: 0,
    totalEasy: 0,
    totalMedium: 0,
    totalHard: 0,
  });

  const [submissionStats, setSubmissionStats] = useState({
    totalSubmissions: 0,
    easySubmissions: 0,
    mediumSubmissions: 0,
    hardSubmissions: 0,
    acceptanceRate: 0,
  });

  const [beatStats, setBeatStats] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });

  const [skillStats, setSkillStats] = useState({
    advanced: [],
    intermediate: [],
    fundamental: [],
  });

  const [contestStats, setContestStats] = useState({
    contestAttend: 0,
    contestRating: 0,
    contestGlobalRanking: 0,
    totalParticipants: 0,
    contestTopPercentage: 0,
    contestBadges: null,
    contestParticipation: [],
  });

  const [recentSubmissions, setRecentSubmissions] = useState([]);

  const [pieData, setPieData] = useState({ labels: [], datasets: [] });
  const [solvedBarData, setSolvedBarData] = useState({ labels: [], datasets: [] });
  const [submissionBarData, setSubmissionBarData] = useState({ labels: [], datasets: [] });

  const [isInvalidFetch, setIsInvalidFetch] = useState(false);
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Update userID from URL
  useEffect(() => {
    if (ID) {
      setUserID(ID);
      setInputValue(ID);
    }
  }, [ID]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setUserID(inputValue.trim());
      setIsInvalidFetch(false);
      setRateLimitExceeded(false);
    }
  };

  useEffect(() => {
    if (!userID) return;
    fetchAllData(userID);
  }, [userID]);

  const fetchAllData = async (username) => {
    try {
      setIsLoading(true);
      // Reset error states
      setIsInvalidFetch(false);
      setRateLimitExceeded(false);

      const [profileRes, solvedRes, beatRes, skillRes, userProfileRes, contestRes] = await Promise.all([
        fetch(`https://alfa-leetcode-api.onrender.com/${username}`),
        fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`),
        fetch(`https://alfa-leetcode-api.onrender.com/userProfileUserQuestionProgressV2/${username}`),
        fetch(`https://alfa-leetcode-api.onrender.com/skillStats/${username}`),
        fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`),
        fetch(`https://alfa-leetcode-api.onrender.com/${username}/contest`),
      ]);

      if ([profileRes, solvedRes, beatRes, skillRes, userProfileRes, contestRes].some((res) => res.status === 429)) {
        setRateLimitExceeded(true);
        setIsLoading(false);
        return;
      }

      const profile = await profileRes.json();
      const solved = await solvedRes.json();
      const beat = await beatRes.json();
      const skill = await skillRes.json();
      const userProfile = await userProfileRes.json();
      const contest = await contestRes.json();

      // Profile Info
      if (!profile || profile.errors || !userProfile) {
        setIsInvalidFetch(true);
        setIsLoading(false);
        return;
      }

      // Set basic details
      setBasicDetail({
        name: profile.name || 'Not Added',
        avatar: profile.avatar || nullImg,
        ranking: userProfile.ranking || 'Not Available',
        reputation: userProfile.reputation || 0,
        contributionPoints: userProfile.contributionPoint || 0,
      });

      // Solved Stats
      setSolvedStats({
        total: userProfile.totalSolved || 0,
        easy: userProfile.easySolved || 0,
        medium: userProfile.mediumSolved || 0,
        hard: userProfile.hardSolved || 0,
        totalQuestions: userProfile.totalQuestions || 0,
        totalEasy: userProfile.totalEasy || 0,
        totalMedium: userProfile.totalMedium || 0,
        totalHard: userProfile.totalHard || 0,
      });

      // Submission Stats
      const totalSubmissions = userProfile.totalSubmissions || [];
      const allSubmissions = totalSubmissions.find(item => item.difficulty === 'All') || { count: 0, submissions: 0 };
      const easySubmissions = totalSubmissions.find(item => item.difficulty === 'Easy') || { count: 0, submissions: 0 };
      const mediumSubmissions = totalSubmissions.find(item => item.difficulty === 'Medium') || { count: 0, submissions: 0 };
      const hardSubmissions = totalSubmissions.find(item => item.difficulty === 'Hard') || { count: 0, submissions: 0 };
      
      setSubmissionStats({
        totalSubmissions: allSubmissions.submissions || 0,
        easySubmissions: easySubmissions.submissions || 0,
        mediumSubmissions: mediumSubmissions.submissions || 0,
        hardSubmissions: hardSubmissions.submissions || 0,
        acceptanceRate: allSubmissions.submissions > 0 
          ? ((userProfile.totalSolved / allSubmissions.submissions) * 100).toFixed(2) 
          : 0,
      });

      // Beat Stats
      const beatData = beat.data?.userProfileUserQuestionProgressV2?.userSessionBeatsPercentage || [];
      setBeatStats({
        easy: beatData.find((d) => d.difficulty === 'EASY')?.percentage || 0,
        medium: beatData.find((d) => d.difficulty === 'MEDIUM')?.percentage || 0,
        hard: beatData.find((d) => d.difficulty === 'HARD')?.percentage || 0,
      });

      // Recent Submissions
      setRecentSubmissions(userProfile.recentSubmissions || []);

      // Contest Stats
      setContestStats(contest || {
        contestAttend: 0,
        contestRating: 0,
        contestGlobalRanking: 0,
        totalParticipants: 0,
        contestTopPercentage: 0,
        contestBadges: null,
        contestParticipation: [],
      });

      // Skill Stats
      const skillData = skill.data?.matchedUser?.tagProblemCounts;
      if (skillData) {
        setSkillStats({
          advanced: skillData.advanced || [],
          intermediate: skillData.intermediate || [],
          fundamental: skillData.fundamental || [],
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  // Update pie chart whenever beat stats change
  useEffect(() => {
    setPieData({
      labels: ['Easy', 'Medium', 'Hard'],
      datasets: [
        {
          label: 'Beat Percentage',
          data: [beatStats.easy, beatStats.medium, beatStats.hard],
          backgroundColor: ['#34D399', '#60A5FA', '#FBBF24'],
          hoverOffset: 6,
        },
      ],
    });
  }, [beatStats]);

  // Update solved bar chart
  useEffect(() => {
    setSolvedBarData({
      labels: ['Easy', 'Medium', 'Hard'],
      datasets: [
        {
          label: 'Solved',
          data: [solvedStats.easy, solvedStats.medium, solvedStats.hard],
          backgroundColor: ['#34D399', '#60A5FA', '#FBBF24'],
        },
        {
          label: 'Total',
          data: [solvedStats.totalEasy, solvedStats.totalMedium, solvedStats.totalHard],
          backgroundColor: ['rgba(52, 211, 153, 0.3)', 'rgba(96, 165, 250, 0.3)', 'rgba(251, 191, 36, 0.3)'],
        },
      ],
    });
  }, [solvedStats]);

  // Update submission bar chart
  useEffect(() => {
    setSubmissionBarData({
      labels: ['Easy', 'Medium', 'Hard'],
      datasets: [
        {
          label: 'Submissions',
          data: [
            submissionStats.easySubmissions,
            submissionStats.mediumSubmissions,
            submissionStats.hardSubmissions
          ],
          backgroundColor: ['#34D399', '#60A5FA', '#FBBF24'],
        }
      ],
    });
  }, [submissionStats]);

  // Function to format timestamp to readable date
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  // Function to get difficulty color
  const getDifficultyColor = (difficulty) => {
    if (difficulty.includes('Easy')) return 'text-green-500';
    if (difficulty.includes('Medium')) return 'text-blue-500';
    if (difficulty.includes('Hard')) return 'text-yellow-500';
    return 'text-gray-500';
  };

  // Calculate percentage progress for each difficulty
  const calculateProgress = () => {
    return {
      easy: solvedStats.totalEasy > 0 ? (solvedStats.easy / solvedStats.totalEasy) * 100 : 0,
      medium: solvedStats.totalMedium > 0 ? (solvedStats.medium / solvedStats.totalMedium) * 100 : 0,
      hard: solvedStats.totalHard > 0 ? (solvedStats.hard / solvedStats.totalHard) * 100 : 0,
      total: solvedStats.totalQuestions > 0 ? (solvedStats.total / solvedStats.totalQuestions) * 100 : 0
    };
  };

  const progress = calculateProgress();

  // Function to get trend direction icon
  const getTrendIcon = (direction) => {
    if (direction === 'UP') return '↑';
    if (direction === 'DOWN') return '↓';
    return '→';
  };

  // Function to get trend direction color
  const getTrendColor = (direction) => {
    if (direction === 'UP') return 'text-green-500';
    if (direction === 'DOWN') return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-center">LeetCode Analyzer</h1>

        {rateLimitExceeded ? (
          <div className="text-red-600 text-center font-semibold">
            🚫 API Rate Limit Exceeded. Please try again after some time.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="userID" className="block text-lg font-medium mb-1">
                LeetCode User ID
              </label>
              <input
                type="text"
                id="userID"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="e.g., aditya_c0des"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-zinc-800 text-white py-2 px-4 rounded hover:bg-zinc-600 transition duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Analyze'}
            </button>
          </form>
        )}
      </div>

      {!rateLimitExceeded && !isInvalidFetch && userID && !isLoading && (
        <div className="w-full max-w-5xl bg-white p-6 mt-6 rounded-lg shadow-md">
          {/* User Profile Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-4">
            {/* Left section: Avatar + Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img
                src={basicDetail.avatar}
                alt="User Avatar"
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold">{userID}</h2>
                <p className="text-gray-600">
                  {basicDetail.name !== 'Not Added' ? basicDetail.name : ''}
                </p>
                <div className="flex flex-wrap items-center mt-2 gap-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Rank: {basicDetail.ranking}
                  </span>
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Points: {basicDetail.contributionPoints}
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Reputation: {basicDetail.reputation}
                  </span>
                </div>
              </div>
            </div>

            {/* Right section: Stats */}
            <div className="sm:text-right">
              <div className="bg-green-100 text-green-800 text-lg sm:text-xl font-medium px-3 py-1 rounded w-fit sm:ml-auto">
                {solvedStats.total} / {solvedStats.totalQuestions} Solved
              </div>
              <p className="text-gray-600 mt-1">
                Acceptance Rate: {submissionStats.acceptanceRate}%
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6 overflow-x-auto">
            <ul className="flex flex-nowrap justify-center sm:justify-start -mb-px space-x-2 px-2 sm:px-0">
              <li>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`whitespace-nowrap text-sm sm:text-base inline-block p-2 sm:p-4 ${
                    activeTab === 'overview'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-600 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('submissions')}
                  className={`whitespace-nowrap text-sm sm:text-base inline-block p-2 sm:p-4 ${
                    activeTab === 'submissions'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-600 hover:border-gray-300'
                  }`}
                >
                  Recent Submissions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('contests')}
                  className={`whitespace-nowrap text-sm sm:text-base inline-block p-2 sm:p-4 ${
                    activeTab === 'contests'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-600 hover:border-gray-300'
                  }`}
                >
                  Contests
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('skills')}
                  className={`whitespace-nowrap text-sm sm:text-base inline-block p-2 sm:p-4 ${
                    activeTab === 'skills'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-600 hover:border-gray-300'
                  }`}
                >
                  Skills
                </button>
              </li>
            </ul>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              {/* Progress Bars */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3">Progress Overview</h2>
                <div className="grid gap-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-green-600 font-medium">Easy</span>
                      <span className="text-green-600">{solvedStats.easy} / {solvedStats.totalEasy}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress.easy}%` }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-blue-600 font-medium">Medium</span>
                      <span className="text-blue-600">{solvedStats.medium} / {solvedStats.totalMedium}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress.medium}%` }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-yellow-600 font-medium">Hard</span>
                      <span className="text-yellow-600">{solvedStats.hard} / {solvedStats.totalHard}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${progress.hard}%` }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-purple-600 font-medium">Total</span>
                      <span className="text-purple-600">{solvedStats.total} / {solvedStats.totalQuestions}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${progress.total}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts - Two columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Beat Percentage */}
                <div className="p-4 border rounded-lg shadow-sm">
                  <h3 className="text-lg font-bold mb-2">Beat Percentage</h3>
                  <div className="h-64">
                    <Pie data={pieData} options={{
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `${context.label}: ${context.raw.toFixed(2)}%`;
                            }
                          }
                        }
                      }
                    }} />
                  </div>
                </div>

                {/* Solved Problems */}
                <div className="p-4 border rounded-lg shadow-sm">
                  <h3 className="text-lg font-bold mb-2">Problems Solved vs Total</h3>
                  <div className="h-64">
                    <Bar data={solvedBarData} options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }} />
                  </div>
                </div>
              </div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="text-md font-semibold text-green-800">Submissions</h3>
                  <p className="text-2xl font-bold">{submissionStats.totalSubmissions}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-md font-semibold text-blue-800">Acceptance Rate</h3>
                  <p className="text-2xl font-bold">{submissionStats.acceptanceRate}%</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="text-md font-semibold text-yellow-800">Contest Rating</h3>
                  <p className="text-2xl font-bold">{contestStats.contestRating ? contestStats.contestRating.toFixed(0) : 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submissions Tab */}
          {activeTab === 'submissions' && (
            <div>
              <h2 className="text-xl font-bold mb-3">Recent Submissions</h2>
              
              {/* Recent Submissions Table */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Problem
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Language
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSubmissions.map((submission, index) => (
                      <tr key={index} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {submission.title}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-medium ${
                            submission.statusDisplay === 'Accepted' 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {submission.statusDisplay}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {submission.lang}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {formatTimestamp(submission.timestamp)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Submissions Chart */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">Submissions Distribution</h3>
                <div className="h-64">
                  <Bar data={submissionBarData} />
                </div>
              </div>
            </div>
          )}

          {/* Contest Tab */}
          {activeTab === 'contests' && (
          <div>
            <h2 className="text-xl font-bold mb-3">Contest Performance</h2>
            
            {/* Contest Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg shadow-sm">
                <h3 className="text-md font-semibold text-blue-800">Contest Rating</h3>
                <p className="text-2xl font-bold">{contestStats.contestRating ? contestStats.contestRating.toFixed(0) : 'N/A'}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg shadow-sm">
                <h3 className="text-md font-semibold text-green-800">Global Ranking</h3>
                <p className="text-2xl font-bold">{contestStats.contestGlobalRanking || 'N/A'}</p>
                <p className="text-sm text-gray-600">
                  {contestStats.totalParticipants ? `Out of ${contestStats.totalParticipants} participants` : ''}
                </p>
                <p className="text-sm text-gray-600">Top {contestStats.contestTopPercentage || 0}%</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg shadow-sm">
                <h3 className="text-md font-semibold text-purple-800">Contests Attended</h3>
                <p className="text-2xl font-bold">{contestStats.contestAttend || 0}</p>
              </div>
            </div>
            
            {/* Contest Participation History */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3">Contest History</h3>
              {contestStats.contestParticipation && contestStats.contestParticipation.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3">Contest</th>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">Ranking</th>
                        <th scope="col" className="px-6 py-3">Rating</th>
                        <th scope="col" className="px-6 py-3">Problems Solved</th>
                        <th scope="col" className="px-6 py-3">Finish Time</th>
                        <th scope="col" className="px-6 py-3">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contestStats.contestParticipation.map((contest, index) => (
                        <tr key={index} className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {contest.contest?.title || 'Unknown Contest'}
                          </td>
                          <td className="px-6 py-4">
                            {contest.contest?.startTime ? formatTimestamp(contest.contest.startTime) : 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            {contest.ranking || 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            {contest.rating ? contest.rating.toFixed(1) : 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            {contest.problemsSolved || 0}/{contest.totalProblems || 0}
                          </td>
                          <td className="px-6 py-4">
                            {contest.finishTimeInSeconds ? 
                              `${Math.floor(contest.finishTimeInSeconds / 60)}m ${contest.finishTimeInSeconds % 60}s` : 
                              'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={getTrendColor(contest.trendDirection)}>
                              {getTrendIcon(contest.trendDirection)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 italic">No contest participation data available.</p>
              )}
            </div>
            
            {/* Contest Badges if available */}
            {contestStats.contestBadges && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3">Contest Badges</h3>
                <div className="flex flex-wrap gap-2">
                  {contestStats.contestBadges.map((badge, index) => (
                    <div key={index} className="px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="font-medium text-yellow-700">{badge.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
            <div>
              <h2 className="text-xl font-bold mb-3">Skills Analysis</h2>
              
              {/* Skills Accordion */}
              <div className="mb-6">
                {['fundamental', 'intermediate', 'advanced'].map((level) => (
                  <div key={level} className="mb-4 border rounded-lg overflow-hidden">
                    <h3 className="text-lg font-semibold capitalize bg-gray-50 p-4 border-b">
                      {level} Skills
                    </h3>
                    <div className="p-4">
                      {skillStats[level].length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {skillStats[level].map((skill, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg">
                              <div className="font-medium">{skill.tagName}</div>
                              <div className="text-sm text-gray-500">Solved: {skill.problemsSolved}</div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                <div 
                                  className={`h-1.5 rounded-full ${
                                    level === 'fundamental' ? 'bg-green-500' : 
                                    level === 'intermediate' ? 'bg-blue-500' : 'bg-purple-500'
                                  }`} 
                                  style={{ width: `${(skill.problemsSolved / skill.tagProblemCount) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No data available</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {/* will work on it in future.. */}

        </div>
      )}

      {/* Invalid Fetch */}
      {isInvalidFetch && !rateLimitExceeded && !isLoading && (
        <div className="text-red-600 font-semibold text-center mt-4 w-full max-w-5xl">
          ❌ Invalid Username or Data Not Found.
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-blue-600 font-semibold text-center mt-4 w-full max-w-5xl">
          ⏳ Loading user data...
        </div>
      )}
    </div>
  );
};

export default Analyzer;