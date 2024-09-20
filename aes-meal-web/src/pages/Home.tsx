import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { Button, Checkbox, Select, Table, TableColumnsType } from "antd";
import { DataSourceItemType } from "antd/es/auto-complete/index";

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100dvw;
  height: 100dvh; /* Full screen height */
`;

const wind = window as any;

const LeftContainer = styled.div`
  width: 25%;
  background-color: rgb(59 130 246 / 0.5);
  color: black;
  padding: 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 100%;
    padding: 10px;
  }
`;

const RightContainer = styled.div`
  width: 73%;
  background-color: #f0f0f0;
  padding: 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 100%;
    padding: 10px;
  }
`;

interface IUser {
  name: string;
  employeeId: string;
  email: string;
  role: string;
  pendingWeeklyMealPlan: boolean[];
}

const defaultUser: IUser = {
  email: "",
  employeeId: "",
  role: "",
  name: "",
  pendingWeeklyMealPlan: [],
};

interface IMealHistory {
  month: number;
  year: number;
}

interface IMealRecord {
  id: string;
  created_at: string; // ISO date format
  updated_at: string; // ISO date format
  consumerId: string;
  dayOfMonth: number;
  dayOfWeek: number;
  month: number;
  year: number;
  numberOfMeal: number;
}

const weekOfDay = ["Sun", "Mon", "Tue", "Wed", "Thus", "Fri", "Sat"];

const Home = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState<IUser>(defaultUser);
  const onLogout = async () => {
    try {
      const response = await axios(`${wind.env.VITE_BASE_URL}/v1/auth/logout`, {
        method: "get",
        withCredentials: true,
      });

      localStorage.removeItem("aes-meal-user");

      if (response.status == 200) {
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios(`${wind.env.VITE_BASE_URL}/v1/auth/user`, {
        method: "get",
        withCredentials: true,
      });

      localStorage.setItem(
        "aes-meal-user",
        JSON.stringify(response?.data?.data?.userData),
      );
      setWeeklyPlan(response?.data?.data?.userData.weeklyMealPlan);
      setUserDetails(response?.data?.data?.userData);

      if (response.status !== 200) {
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // useEffect(()=>{
  //   const user = JSON.parse(localStorage.getItem("aes-meal-user") || "")
  //   setUserDetails(user)
  // },[])

  const [mealHistory, setMealHistory] = useState<IMealHistory>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [totalMeal, setTotalMeal] = useState(0);
  const [table, setTable] = useState<
    {
      date: string;
      mealCount: number;
      key: number;
    }[]
  >();
  const onMealDataChange = async (
    filterType: keyof IMealHistory,
    value: number,
  ) => {
    setMealHistory((prev) => ({
      ...prev,
      [filterType]: value,
    }));

    const month: number = filterType === "month" ? value : mealHistory.month;
    const year: number = filterType === "year" ? value : mealHistory.year;

    const response = await axios<{
      success: boolean;
      data: {
        mealData: IMealRecord[];
      };
    }>(
      `${wind.env.VITE_BASE_URL}/v1/user/user-meal-data/month/${month}/year/${year}`,
      {
        method: "get",
        withCredentials: true,
      },
    );
    // setMealData(response.data.data.mealData)

    const tableData = response.data.data.mealData.map((data, index) => {
      return {
        date: data.dayOfMonth + "-" + data.month + "-" + data.year,
        mealCount: data.numberOfMeal,
        key: index,
      };
    });

    const totalMealCount = response.data.data.mealData.reduce((sum, data) => {
      return sum + data.numberOfMeal;
    }, 0);
    setTotalMeal(totalMealCount);
    setTable(tableData);
  };

  const columns: TableColumnsType<DataSourceItemType> = [
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Meal Count",
      dataIndex: "mealCount",
    },
  ];

  const fetchMealData = async () => {
    const response = await axios<{
      success: boolean;
      data: {
        mealData: IMealRecord[];
      };
    }>(
      `${wind.env.VITE_BASE_URL}/v1/user/user-meal-data/month/${mealHistory.month}/year/${mealHistory.year}`,
      {
        method: "get",
        withCredentials: true,
      },
    );
    // setMealData(response.data.data.mealData)

    const tableData = response.data.data.mealData.map((data, index) => {
      return {
        date: data.dayOfMonth + "-" + data.month + "-" + data.year,
        mealCount: data.numberOfMeal,
        key: index,
      };
    });

    const totalMealCount = response.data.data.mealData.reduce((sum, data) => {
      return sum + data.numberOfMeal;
    }, 0);
    setTotalMeal(totalMealCount);
    setTable(tableData);
  };
  useEffect(() => {
    fetchMealData();
  }, []);

  //---user weekly plan
  const [weeklyMealPlan, setWeeklyPlan] = useState<boolean[]>([]);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  const fetchWeeklyPlanData = async () => {
    const tempMeal = localStorage.getItem("aes-meal-user");
    const weeklyPlan = JSON.parse(tempMeal || "");
    setWeeklyPlan(weeklyPlan.weeklyMealPlan);
  };

  const handleWeeklyPlanChange = (index: number) => {
    setIsUpdate(true);
    const updatedCheckboxes = [...weeklyMealPlan];
    updatedCheckboxes[index] = !updatedCheckboxes[index];
    setWeeklyPlan(updatedCheckboxes);
  };

  const onWeeklyUpdateChange = async () => {
    try {
      const response = await axios(
        `${wind.env.VITE_BASE_URL}/v1/user/update-weekly-meal-plan`,
        {
          method: "put",
          data: {
            weeklyMealPlan,
          },
          withCredentials: true,
        },
      );
      localStorage.setItem(
        "aes-meal-user",
        JSON.stringify(response?.data?.data?.userData),
      );
      setWeeklyPlan(response?.data?.data?.userData.weeklyMealPlan);
      setUserDetails(response?.data?.data?.userData);
      // console.log("TTTEES: ", response?.data?.data?.userData);

      setIsUpdate(false);
    } catch (er) {
      console.log(er);
    }
  };
  useEffect(() => {
    fetchWeeklyPlanData();
  }, []);

  // delete weekly plan
  const onClickPendingWeeklyPlan = async () => {
    try {
      const response = await axios(
        `${wind.env.VITE_BASE_URL}/v1/user/clean-pending-meal`,
        {
          method: "delete",
          withCredentials: true,
        },
      );
      setIsUpdate(false);
      setUserDetails(response?.data?.data?.userData);
      setUserDetails((prev) => ({
        ...prev,
        pendingWeeklyMealPlan: [],
      }));
    } catch (er) {
      console.log(er);
    }
  };

  return (
    <MainContainer>
      <LeftContainer>
        <div>
          <h2>{userDetails.name}</h2>
          <div style={{ display: "flex", gap: "2rem" }}>
            <Button onClick={onLogout}>Logout</Button>
            {userDetails.role === "admin" && (
              <Button type="primary" onClick={() => navigate("/admin")}>
                Go to admin mode
              </Button>
            )}
          </div>
        </div>
        <p>{userDetails.employeeId}</p>
        <p>{userDetails.email}</p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {userDetails.pendingWeeklyMealPlan &&
          userDetails.pendingWeeklyMealPlan.length > 0 ? (
            <p>Pending weekly plan</p>
          ) : null}
          {userDetails.pendingWeeklyMealPlan &&
          userDetails.pendingWeeklyMealPlan.length > 0 ? (
            <Button
              onClick={onClickPendingWeeklyPlan}
              size="small"
              type="primary"
              danger
            >
              Delete
            </Button>
          ) : null}
        </div>
        {userDetails.pendingWeeklyMealPlan &&
        userDetails.pendingWeeklyMealPlan.length > 0
          ? userDetails.pendingWeeklyMealPlan.map((data, index) => (
              <Checkbox key={index} checked={data}>
                {weekOfDay[index]}
              </Checkbox>
            ))
          : null}
      </LeftContainer>
      <RightContainer>
        <h2>Meal Information</h2>
        <h4>Total meal: {totalMeal}</h4>
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
          <p>Filter history</p>
          <Select
            showSearch
            placeholder="Select a month"
            onChange={(value) => onMealDataChange("month", value)}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            // defaultValue={month[new Date().getMonth()]}
            value={mealHistory.month}
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
            onChange={(value) => onMealDataChange("year", value)}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            // defaultValue={month[new Date().getMonth()]}
            value={mealHistory.year}
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <p>Weekly plan&nbsp;&nbsp;&nbsp;&nbsp;</p>
          {weeklyMealPlan &&
            weeklyMealPlan.map((checked, index) => (
              <Checkbox
                key={index}
                checked={checked}
                onChange={() => handleWeeklyPlanChange(index)}
              >
                {weekOfDay[index]}
              </Checkbox>
            ))}

          {isUpdate ? (
            <Button onClick={onWeeklyUpdateChange} size="small" type="primary">
              Update
            </Button>
          ) : null}
        </div>
        <Table
          columns={columns}
          pagination={false}
          dataSource={table as any}
          size="small"
        />
      </RightContainer>
    </MainContainer>
  );
};

export default Home;
