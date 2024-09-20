import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import axiosInstance from "../../utils/axiosInstance.ts";
import axios from "axios";
import { Button, Segmented } from "antd";
import styled from "styled-components";
import PendingWeeklyMealPlan from "./PendingWeeklyPlan.tsx";
// import EditUsersMealData from "./EditUsersMealData.tsx";
import PrintSignetureSheet from "./PrintSignetureSheet.tsx";
import UsersMonlyMealCount from "./UsersMonlyMealCount.tsx";

const wind = window as any;

const MainContainer = styled.div`
  width: 100dvh;
  height: 100dvh;
  padding: 1rem;
  display: flex;
  flex-flow: column;
`;

type Align =
  | "Pending weekly meal plan"
  // | "Edit users meal data"
  | "Print Signeture Sheet"
  | "Users Monly Meal Count";

const Admin = () => {
  const [alignValue, setAlignValue] = useState<Align>(
    "Pending weekly meal plan",
  );

  const navigate = useNavigate();
  const fetchUser = useCallback(async () => {
    try {
      // const response = await axiosInstance.get("/auth/user");
      const response = await axios(`${wind.env.VITE_BASE_URL}/v1/auth/user`, {
        method: "get",
        withCredentials: true,
      });
      if (response.status !== 200) {
        navigate("/login");
      }

      if (response.data.data.userData.role != "admin") {
        navigate("/home");
      }
    } catch (err) {
      navigate("/login");
      console.log(err);
    }
  }, [navigate]);
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  return (
    <MainContainer>
      <div>
        <Button type="primary" onClick={() => navigate("/")}>
          Go to user mode
        </Button>
      </div>
      <Segmented
        defaultValue="Pending weekly meal plan"
        style={{ marginBottom: 8 }}
        size="large"
        type="primary"
        onChange={(value: Align) => setAlignValue(value)}
        options={[
          "Pending weekly meal plan",
          // "Edit users meal data",
          "Users Monly Meal Count",
          "Print Signeture Sheet",
        ]}
      />
      {alignValue === "Pending weekly meal plan" ? (
        <PendingWeeklyMealPlan />
      ) : alignValue === "Print Signeture Sheet" ? (
        <PrintSignetureSheet />
      ) : alignValue === "Users Monly Meal Count" ? (
        <UsersMonlyMealCount />
      ) : null}
    </MainContainer>
  );
};

export default Admin;
