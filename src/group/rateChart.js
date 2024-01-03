import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ToDoListRate() {
  const {groupId} = useParams();
  const [rateData, setRateData] = useState([]);
  const accessToken = localStorage.getItem("access");

  useEffect(() => {
     axios.get(`/group/${groupId}/my-to-do`,{
        headers:{Authorization:`Bearer ${accessToken}`}
     }).then(response=>{
        console.log(response.data);
        setRateData(response.data);
     }).catch(error=>{
      console.error(error);
  });
      
  }, []);

  const options = {
      responsive: true,
      plugins: {
          legend: {
              position: "top",
          },
          title: {
              display: true,
              text: "my to do 달성률",
          },
      },
  };

  let labels = [];
  if (rateData.length > 0) {
      labels = rateData.map((data) => data.date);
  }

  const data = {
      labels,
      datasets: [
          {
              label: "달성률",
              data: rateData.map((data) => data.progress_rate),
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
      ],
  };
  return (
      <div className='chart'>
          {rateData.length > 0 && <Line options={options} data={data} />}
      </div>
  );
}

export default ToDoListRate;