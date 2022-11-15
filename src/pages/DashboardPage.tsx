import React, { PureComponent, useCallback, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { REQUEST_TYPE } from "../Enums/RequestType";
import { useApi } from "../hooks/useApi";
import { FilmEntity } from "../models/FilmEnity";

export default function DashboardPage() {
  const [films, setFilms] = useState<FilmEntity[]>([]);
  const { callApi } = useApi();
  const getFilmData = useCallback(() => {
    callApi<FilmEntity[]>(REQUEST_TYPE.GET, "api/films")
      .then((res) => {
        setFilms(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [callApi]);

  useEffect(() => {
    getFilmData();
  }, [getFilmData]);

  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        marginTop: 20,
        position: "fixed",
      }}
    >
      <div className="flex-wrap">
        <LineChart
          width={700}
          height={300}
          data={films}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line type="monotone" dataKey="views" stroke="#82ca9d" />
        </LineChart>

        <LineChart
          width={700}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="pv"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </div>
    </div>
  );
}
