'use client';
import { useState } from 'react';
import Sidebar from "../components/sidebar/page";
import Navbar from "../components/navbar/page";
import "./meals.css";

export default function MealsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bookedMeals, setBookedMeals] = useState({});

  const menu = [
    { day: "Monday", breakfast: "Poha & Tea", lunch: "Dal Tadka & Rice", dinner: "Paneer Butter Masala" },
    { day: "Tuesday", breakfast: "Stuffed Paratha", lunch: "Rajma Chawal", dinner: "Mix Veg & Roti" },
    { day: "Wednesday", breakfast: "Idli Sambar", lunch: "Chole Bhature", dinner: "Egg Curry / Malai Kofta" },
    { day: "Thursday", breakfast: "Aloo Poori", lunch: "Kadhi Pakoda", dinner: "Chicken Curry / Paneer" },
    { day: "Friday", breakfast: "Upma", lunch: "Veg Biryani", dinner: "Aloo Gobhi & Roti" },
    { day: "Saturday", breakfast: "Puri Bhaji", lunch: "Dal Baati", dinner: "Special Veg Thali" },
    { day: "Sunday", breakfast: "Chole Kulche", lunch: "Paneer Pulao", dinner: "Mushroom Masala" },
  ];

  const toggleMeal = (day, type) => {
    const key = `${day}-${type}`;
    setBookedMeals(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="ml-app-layout">
      {/* Sidebar - Stays fixed */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="ml-main-content">
        <Navbar setIsOpen={setIsSidebarOpen} />
        
        <main className="ml-scroll-body">
          <header className="ml-header-section">
            <div className="ml-header-text">
              <h1>Weekly Menu</h1>
              <p>View and confirm your attendance for upcoming meals.</p>
            </div>
            <div className="ml-stats-badge">
              <div className="ml-stat-item"><strong>4.2 ★</strong> Mess Rating</div>
            </div>
          </header>

          <div className="ml-menu-grid">
            {menu.map((item) => (
              <div key={item.day} className="ml-day-card">
                <div className="ml-day-title">{item.day}</div>
                
                {/* Breakfast Slot */}
                <div className="ml-meal-slot">
                  <span className="ml-meal-type">Breakfast</span>
                  <p className="ml-food-name">{item.breakfast}</p>
                  <button 
                    className={bookedMeals[`${item.day}-br`] ? "ml-btn-booked" : "ml-btn-book"}
                    onClick={() => toggleMeal(item.day, 'br')}
                  >
                    {bookedMeals[`${item.day}-br`] ? "✓ Confirmed" : "I'm Eating"}
                  </button>
                </div>

                {/* Lunch Slot */}
                <div className="ml-meal-slot">
                  <span className="ml-meal-type">Lunch</span>
                  <p className="ml-food-name">{item.lunch}</p>
                  <button 
                    className={bookedMeals[`${item.day}-ln`] ? "ml-btn-booked" : "ml-btn-book"}
                    onClick={() => toggleMeal(item.day, 'ln')}
                  >
                    {bookedMeals[`${item.day}-ln`] ? "✓ Confirmed" : "I'm Eating"}
                  </button>
                </div>

                {/* Dinner Slot */}
                <div className="ml-meal-slot">
                  <span className="ml-meal-type">Dinner</span>
                  <p className="ml-food-name">{item.dinner}</p>
                  <button 
                    className={bookedMeals[`${item.day}-dn`] ? "ml-btn-booked" : "ml-btn-book"}
                    onClick={() => toggleMeal(item.day, 'dn')}
                  >
                    {bookedMeals[`${item.day}-dn`] ? "✓ Confirmed" : "I'm Eating"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}