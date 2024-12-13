import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import customImage from "./coin.png"; 
import { FaHome, FaGift, FaWallet } from "react-icons/fa";
import axios from 'axios';

function App() {
  const [currentScreen, setCurrentScreen] = useState("username");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [progress, setProgress] = useState(0);
  const [level, setLevel] = useState(1);
  const [goal, setGoal] = useState(100);
  const [reward, setReward] = useState(0);
  const [tapPower, setTapPower] = useState(1);

  const levelRewards = [
    10, 50, 100, 250, 500, 1000, 2500, 5000
  ];

  const levelGoals = [
    100, 500, 1000, 2000, 5000, 10000, 50000, 100000
  ];

  const tapPowerUpgrades = [
    { level: 1, cost: 200, multiplier: 1 },
    { level: 2, cost: 400, multiplier: 2 },
    { level: 3, cost: 800, multiplier: 3 },
    { level: 4, cost: 1600, multiplier: 4 },
    { level: 5, cost: 3200, multiplier: 5 },
    { level: 6, cost: 6400, multiplier: 6 },
    { level: 7, cost: 12800, multiplier: 7 },
    { level: 8, cost: 25600, multiplier: 8 }
  ];

  const BASE_URL = 'https://coin-click.onrender.com'; // Use environment variable

  const saveProgress = async (username, progress, level, reward, tapPower) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/user/${username}`, {
        progress,
        level,
        reward,
        tapPower
      });
      console.log('Progress saved:', response.data);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const fetchProgress = useCallback(async (username) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/user/${username}`);
      const user = response.data;
      setProgress(user.progress);
      setLevel(user.level);
      setReward(user.reward);
      setTapPower(user.tapPower);
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  }, [BASE_URL]); // Include dependencies used inside fetchProgress
  
  useEffect(() => {
    if (isUsernameSet) {
      fetchProgress(username);
    }
  }, [isUsernameSet, username, fetchProgress]); // Include fetchProgress in dependencies
  

  useEffect(() => {
    if (isUsernameSet) {
      fetchProgress(username);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUsernameSet, username]);

  const checkUsernameExists = async (username) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/user/exists/${username}`);
      return response.data.exists; // Assume the API returns a boolean field `exists`
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  };

  const handleUsernameSubmit = async () => {
    const usernameExists = await checkUsernameExists(username);
    if (usernameExists) {
      setUsernameError("Username already exists! Please choose another.");
    } else {
      setUsernameError("");
      setIsUsernameSet(true);
      setCurrentScreen("game");
    }
  };

  const handleCoinClick = () => {
    const newProgress = progress + tapPower;
    const newReward = reward + tapPower;

    if (newProgress >= goal) {
      const newLevel = level + 1;
      let newGoal;

      if (newLevel <= levelGoals.length) {
        newGoal = levelGoals[newLevel - 1];
        const levelUpReward = levelRewards[newLevel - 1] || levelRewards[levelRewards.length - 1];
        setReward(prevReward => prevReward + levelUpReward);
      } else {
        newGoal = goal * 2;
      }

      setLevel(newLevel);
      setProgress(0);
      setGoal(newGoal);
    } else {
      setProgress(newProgress);
    }

    setReward(newReward);
    saveProgress(username, newProgress, level, newReward, tapPower);
  };

  const handleTapPowerUpgrade = () => {
    const currentUpgradeIndex = tapPowerUpgrades.findIndex(upgrade => upgrade.multiplier === tapPower);
    
    if (currentUpgradeIndex === -1) {
      alert("Error: Current tap power level not found.");
      return;
    }

    const nextUpgrade = (() => {
      switch(currentUpgradeIndex) {
        case 0: return { level: 2, cost: 200, multiplier: 2 };
        case 1: return { level: 3, cost: 400, multiplier: 3 };
        case 2: return { level: 4, cost: 800, multiplier: 4 };
        case 3: return { level: 5, cost: 1600, multiplier: 5 };
        case 4: return { level: 6, cost: 3200, multiplier: 6 };
        case 5: return { level: 7, cost: 6400, multiplier: 7 };
        case 6: return { level: 8, cost: 12800, multiplier: 8 };
        default: return null;
      }
    })();
    
    if (nextUpgrade) {
      if (reward >= nextUpgrade.cost) {
        setReward(prevReward => prevReward - nextUpgrade.cost);
        setTapPower(nextUpgrade.multiplier);
        saveProgress(username, progress, level, reward - nextUpgrade.cost, nextUpgrade.multiplier);
      } else {
        alert(`Not enough rewards! You need ${nextUpgrade.cost} rewards to upgrade.`);
      }
    } else {
      alert('You have reached the maximum tap power upgrade!');
    }
  };

  const renderUsernameForm = () => (
    <div className="username-form">
      <h2>Enter your Username</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <button onClick={handleUsernameSubmit}>Submit</button>
      {usernameError && <p className="error">{usernameError}</p>}
    </div>
  );

  const renderGameScreen = () => (
    <div className="game-screen">
      <div className="progress-level-container">
        <div className="progress-container">
          <div
            className="progress-bar-fill"
            style={{
              width: `${(progress / goal) * 100}%`,
            }}
          ></div>
        </div>
        <div className="level-indicator">Level: {level}</div>
      </div>
      <div className="game-layout-container">
        <div className="tap-power-upgrade-section">
          <div className="tap-power-level">
            Tap Power: Level {tapPower}
          </div>
          <button onClick={handleTapPowerUpgrade} className="upgrade-button">
            Upgrade (Cost: {tapPowerUpgrades[tapPower - 1]?.cost})
          </button>
        </div>
        <div>
          <div
            className="clicker"
            onClick={handleCoinClick}
            style={{
              width: "150px",
              height: "150px",
              backgroundImage: `url(${customImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: "2px solid #fff",
              borderRadius: "50%",
              cursor: "pointer",
            }}
          ></div>
        </div>
      </div>
      <div className="reward-display">
        Reward: {reward}
      </div>
    </div>
  );

  const renderWalletScreen = () => (
    <div className="wallet-screen">
      <h2>Wallet</h2>
      <p>Coming soon...</p>
    </div>
  );

  const renderDailyCheckInScreen = () => (
    <div className="daily-check-in-screen">
      <h2>Daily Check-In</h2>
      <p>Coming soon...</p>
    </div>
  );

  const renderContent = () => {
    switch (currentScreen) {
      case "game":
        return renderGameScreen();
      case "dailyCheckIn":
        return renderDailyCheckInScreen();
      case "wallet":
        return renderWalletScreen(); 
      default:
        return renderGameScreen();
    }
  };

  useEffect(() => {
    if (isUsernameSet) {
      fetchProgress(username);  // Fetch progress data after username is set
    }
  }, [isUsernameSet, username]);

  return (
    <div className="app">
      {currentScreen === "username" ? (
        renderUsernameForm()
      ) : (
        <>
          <div className="content">{renderContent()}</div>
          <div className="navigation bg-gray-100 border-t flex justify-around items-center py-3 fixed bottom-0 w-full">
            <button
              onClick={() => setCurrentScreen("game")}
              className={`flex flex-col items-center ${currentScreen === "game" ? "text-black" : "text-gray-500"}`}
            >
              <FaHome size={24} />
            </button>

            <button
              onClick={() => setCurrentScreen("wallet")}
              className={`flex flex-col items-center ${currentScreen === "wallet" ? "text-black" : "text-gray-500"}`}
            >
              <FaWallet size={24} />
            </button>

            <button
              onClick={() => setCurrentScreen("dailyCheckIn")}
              className={`flex flex-col items-center ${currentScreen === "dailyCheckIn" ? "text-black" : "text-gray-500"}`}
            >
              <FaGift size={24} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;