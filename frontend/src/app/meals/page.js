'use client';

import { useState } from 'react';
import Sidebar from '../components/sidebar/page';
import Navbar from '../components/navbar/page';
import './meals.css';

export default function MealsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const menu = [
    {
      day: 'Monday',
      breakfast: 'Poha & Tea',
      lunch: 'Dal Tadka & Rice',
      dinner: 'Paneer Butter Masala',
      color: '#4a3fc0',
    },
    {
      day: 'Tuesday',
      breakfast: 'Stuffed Paratha',
      lunch: 'Rajma Chawal',
      dinner: 'Mix Veg & Roti',
      color: '#0f6e56',
    },
    {
      day: 'Wednesday',
      breakfast: 'Idli Sambar',
      lunch: 'Chole Bhature',
      dinner: 'Egg Curry / Malai Kofta',
      color: '#993556',
    },
    {
      day: 'Thursday',
      breakfast: 'Aloo Poori',
      lunch: 'Kadhi Pakoda',
      dinner: 'Chicken Curry / Paneer',
      color: '#854f0b',
    },
    {
      day: 'Friday',
      breakfast: 'Upma',
      lunch: 'Veg Biryani',
      dinner: 'Aloo Gobhi & Roti',
      color: '#185fa5',
    },
    {
      day: 'Saturday',
      breakfast: 'Puri Bhaji',
      lunch: 'Dal Baati',
      dinner: 'Special Veg Thali',
      color: '#993c1d',
    },
    {
      day: 'Sunday',
      breakfast: 'Chole Kulche',
      lunch: 'Paneer Pulao',
      dinner: 'Mushroom Masala',
      color: '#3b6d11',
    },
  ];

  const handleMealOrder = (day, type) => {
    const mealKey = `${day}-${type}`;
    setSelectedMeal(prev => (prev === mealKey ? null : mealKey));
  };

  const renderButton = (day, type) => {
    const mealKey = `${day}-${type}`;
    if (selectedMeal === mealKey) {
      return (
        <button className="ml-btn ml-btn-confirmed" onClick={() => handleMealOrder(day, type)}>
          ✓ Ordered
        </button>
      );
    }
    if (selectedMeal && selectedMeal.startsWith(`${day}-`)) {
      return <button className="ml-btn ml-btn-disabled" disabled>Booked</button>;
    }
    return (
      <button className="ml-btn ml-btn-order" onClick={() => handleMealOrder(day, type)}>
        Order
      </button>
    );
  };

  return (
    <div className="ml-app-layout">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="ml-main-content">
        <Navbar setIsOpen={setIsSidebarOpen} />
        <main className="ml-scroll-body">

          <div className="ml-header">
            <div>
              <h1>Mess Meal Booking</h1>
              <p>Order one meal per day for the current week.</p>
            </div>
            <div className="ml-rating-box">
              <span>Smart Hostel Mess</span>
              <strong>4.8 ★</strong>
            </div>
          </div>

          <div className="ml-menu-grid">
            {menu.map((item) => (
              <div key={item.day} className="ml-day-card">

                {/* DAY HEADER */}
                <div className="ml-day-header" style={{ background: item.color }}>
                  <span className="ml-day-label">{item.day}</span>
                </div>

                {/* MEAL SLOTS */}
                {[
                  { type: 'breakfast', label: 'Breakfast', item: item.breakfast },
                  { type: 'lunch',     label: 'Lunch',     item: item.lunch },
                  { type: 'dinner',    label: 'Dinner',    item: item.dinner },
                ].map(({ type, label, item: dish }) => (
                  <div key={type} className="ml-meal-slot">
                    <div className="ml-slot-top">
                      <span className={`ml-tag ml-tag-${type}`}>{label}</span>
                    </div>
                    <p className="ml-dish-name">{dish}</p>
                    {renderButton(item.day, type)}
                  </div>
                ))}

              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}