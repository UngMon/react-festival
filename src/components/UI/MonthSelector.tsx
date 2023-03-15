import React from "react";
import { useNavigate } from "react-router-dom";
import "./MonthSelector.css";

interface MonthProps {
  setMonth: (value: string) => void;
}

const MonthSelector = (props: MonthProps) => {
  const navigate = useNavigate();

  const pickedMonthHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    props.setMonth(value);
    navigate(`/all-festival/month/${value}`)
  };

  return (
    <div className="picker-month">
      <select onChange={pickedMonthHandler}>
        <option value="default" disabled>
          월을 선택하세요
        </option>
        <option value="all">전체</option>
        <option value="01">1월</option>
        <option value="02">2월</option>
        <option value="03">3월</option>
        <option value="04">4월</option>
        <option value="05">5월</option>
        <option value="06">6월</option>
        <option value="07">7월</option>
        <option value="08">8월</option>
        <option value="09">9월</option>
        <option value="10">10월</option>
        <option value="11">11월</option>
        <option value="12">12월</option>
      </select>
    </div>
  );
};

export default MonthSelector;
