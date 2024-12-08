import React, { useState, useEffect } from "react";
import './App.css';
import customImage from "./coin.png"; 
import { FaHome, FaGift, FaWallet } from "react-icons/fa";
import axios from 'axios';

function App() {
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState("game");
  const [progress, setProgress] = useState(0);
  const [level, setLevel] = useState(1);
  const [goal, setGoal] = useState(100);
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
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

  const telegramId = "your-unique-telegram-id"; // You should replace this with a dynamic value when the user first interacts with the app.

  useEffect(() => {
    // Fetch the user progress when the app loads
    fetchProgress(telegramId);

    // Simulate the loading bar
    const interval = setInterval(() => {
      setLoadingBarProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const BASE_URL = 'https://coin-click.onrender.com';

  const saveProgress = async (telegramId, progress, level, reward, tapPower) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/user/${telegramId}`, {
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

  const fetchProgress = async (telegramId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/user/${telegramId}`);
      const user = response.data;
      setProgress(user.progress);
      setLevel(user.level);
      setReward(user.reward);
      setTapPower(user.tapPower);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const handleCoinClick = () => {
    const newProgress = progress + tapPower;
    const newReward = reward + tapPower;

    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);

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
    
    // Save the updated progress
    saveProgress(telegramId, newProgress, level, newReward, tapPower);
  };
  
  const handleTapPowerUpgrade = () => {
    // Find the current upgrade information
    const currentUpgrade = tapPowerUpgrades.find(upgrade => upgrade.multiplier === tapPower);
    const currentUpgradeIndex = tapPowerUpgrades.findIndex(upgrade => upgrade.multiplier === tapPower);
    
    if (currentUpgradeIndex === -1) {
      alert("Error: Current tap power level not found.");
      return;
    }
  
    // Custom logic for each upgrade level
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
      // Check if you have enough rewards to upgrade
      if (reward >= nextUpgrade.cost) {
        // Update reward and tap power correctly
        setReward(prevReward => prevReward - nextUpgrade.cost);
        setTapPower(nextUpgrade.multiplier);
        
        // Save the updated progress
        saveProgress(telegramId, progress, level, reward - nextUpgrade.cost, nextUpgrade.multiplier);
      } else {
        alert(`Not enough rewards! You need ${nextUpgrade.cost} rewards to upgrade.`);
      }
    } else {
      alert('You have reached the maximum tap power upgrade!');
    }
  };
  
  

  const renderGameScreen = () => {
    // Determine current level and cost based on tap power
    const currentLevel = (() => {
      switch(tapPower) {
        case 1: return 1;
        case 2: return 2;
        case 3: return 3;
        case 4: return 4;
        case 5: return 5;
        case 6: return 6;
        case 7: return 7;
        case 8: return 8;
        default: return 1;
      }
    })();
  
    const currentCost = (() => {
      switch(tapPower) {
        case 1: return 200;
        case 2: return 400;
        case 3: return 800;
        case 4: return 1600;
        case 5: return 3200;
        case 6: return 6400;
        case 7: return 12800;
        case 8: return 25600;
        default: return 200;
      }
    })();
  
  
    return (
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
              Tap Power: Level {currentLevel}
            </div>
            <button 
              onClick={handleTapPowerUpgrade} 
              className="upgrade-button"
            >
              Upgrade (Cost: {currentCost})
            </button>
          </div>
  
          <div>
            <div
              className={`clicker ${isAnimating ? "clicked" : ""}`}
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
  };
  

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

  return (
    <div className="app">
      {loading ? (
        <div className="loading-screen">
          <div className="loading-bar">
            <div
              className="loading-bar-progress"
              style={{ width: `${loadingBarProgress}%` }}
            ></div>
          </div>
        </div>
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
