// import { useCallback, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../../utils/axiosInstance.ts";
// import axios from "axios";
// import { Segmented, TabsProps } from "antd";
import { Input, Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { getProjectEnvVariables } from "../shared/projectEnvVariables.ts";
const { envVariables } = getProjectEnvVariables();

const MainContainer = styled.div`
  width: 100dvh;
  height: 100dvh;
  padding-top: 0.5rem;
`;

interface IMonthYearQueryParams {
  month: number;
  year: number;
  queryParams: string;
}

const UsersMonlyMealCount = () => {
  const [usersMonthlyMeal, setUsersMonthlyMeal] = useState([]);
  const [detectChange, setDeltectChange] = useState(0);
  const [paramsWithQueryParams, setParamsWithQueryParams] =
    useState<IMonthYearQueryParams>({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      queryParams: "",
    });

  const fetchPending = async () => {
    const response = await axios(
      `${envVariables.VITE_BASE_URL}/v1/super-user/users-total-meal/month/${paramsWithQueryParams.month}/year/${paramsWithQueryParams.year}?employeeQuery=${paramsWithQueryParams.queryParams}`,
      {
        method: "get",
        withCredentials: true,
      },
    );
    setUsersMonthlyMeal(response.data.data.userData || []);
  };

  const onQueryParamsChange = async (
    type: keyof IMonthYearQueryParams,
    value: any,
  ) => {
    setParamsWithQueryParams((prev) => ({
      ...prev,
      [type]: value,
    }));
    setDeltectChange((prev) => prev + 1);
  };

  useEffect(() => {
    fetchPending();
  }, [detectChange]);

  return (
    <MainContainer>
      <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
        <p>Filter ID</p>
        <div>
          <Input
            value={paramsWithQueryParams.queryParams}
            onChange={(e) => onQueryParamsChange("queryParams", e.target.value)}
          />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
        <p>Filter history</p>
        <Select
          showSearch
          placeholder="Select a month"
          onChange={(value) => onQueryParamsChange("month", value)}
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          // defaultValue={month[new Date().getMonth()]}
          value={paramsWithQueryParams.month}
          options={[
            { value: 1, label: "January" },
            { value: 2, label: "February" },
            { value: 3, label: "March" },
            { value: 4, label: "April" },
            { value: 5, label: "May" },
            { value: 6, label: "June" },
            { value: 7, label: "July" },
            { value: 8, label: "August" },
            { value: 9, label: "September" },
            { value: 10, label: "October" },
            { value: 11, label: "November" },
            { value: 12, label: "December" },
          ]}
        />

        <Select
          showSearch
          placeholder="Select a year"
          onChange={(value) => onQueryParamsChange("year", value)}
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          // defaultValue={month[new Date().getMonth()]}
          value={paramsWithQueryParams.year}
          options={[
            { value: 2024, label: "2024" },
            { value: 2025, label: "2025" },
            { value: 2026, label: "2026" },
            { value: 2027, label: "2027" },
            { value: 2028, label: "2028" },
            { value: 2029, label: "2029" },
            { value: 2030, label: "2030" },
          ]}
        />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
        {usersMonthlyMeal.map((data: any, index: number) => (
          <div
            style={{
              lineHeight: ".25rem",
              border: "1px solid black",
              borderRadius: "5px",
              width: "250px",
              padding: ".5rem",
            }}
            key={index}
          >
            <p style={{ fontWeight: "600" }}>{data?.name}</p>
            <hr />
            <p>Employee Id: {data?.employeeId}</p>
            <p>Total Meal: {data?.totalMeals}</p>
          </div>
        ))}
      </div>
    </MainContainer>
  );
};

export default UsersMonlyMealCount;
