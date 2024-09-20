import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Checkbox } from "antd";
import styled from "styled-components";

function getCurrentWeekDatesWithMonth() {
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, etc.
  const startOfWeek = new Date(today); // Create a copy of today

  // Set the startOfWeek date to the last Sunday
  startOfWeek.setDate(today.getDate() - currentDayOfWeek);

  const datesOfWeek = [];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Loop through the week (7 days)
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    const day = date.getDate();
    const month = monthNames[date.getMonth()]; // Get month name
    datesOfWeek.push(`${day} ${month}`); // Format as '12 Sep'
  }

  return datesOfWeek;
}

// const weekDatesWithMonth = getCurrentWeekDatesWithMonth();
// console.log(weekDatesWithMonth); // Output: ['15 Sep', '16 Sep', '17 Sep', '18 Sep', '19 Sep', '20 Sep', '21 Sep']

const MainContainer = styled.div`
  width: 100dvh;
  height: 100dvh;
  padding-top: 0.5rem;
`;
const convertDate = (date: string) => {
  return new Date(date).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const Card = styled.h1`
  display: flex;
  gap: 0.5rem;
  flex-flow: column;
  /* align-items: center; */
  border: 2px solid gray;
  border-radius: 5px;
  padding: 1rem;
`;

const weekOfDay = ["Sun", "Mon", "Tue", "Wed", "Thus", "Fri", "Sat"];
const wind = window as any;

const PendingWeeklyMealPlan = () => {
  // const [pendingWeeklyPlanRequests, setPendingWeeklyPlanRequests] =
  const [pendingWeeklyPlans, setPendingWeeklyPlans] = useState<any[]>([]);
  const fetchPending = async () => {
    const response = await axios(
      `${wind.env.VITE_BASE_URL}/v1/super-user/get-pending-weekly-meal-plan`,
      {
        method: "get",
        withCredentials: true,
      },
    );

    setPendingWeeklyPlans(response.data.data.pendingWeeklyPlans);
  };

  const onClickAction = async (
    userId: string,
    actionType: "approve" | "reject",
  ) => {
    try {
      await axios(
        `${wind.env.VITE_BASE_URL}/v1/super-user/action-pending-weekly-meal-plan/action/${actionType}/user/${userId}`,
        {
          method: "put",
          withCredentials: true,
        },
      );
      fetchPending();
    } catch (err: any) {
      console.log(err?.message);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const test1 = (weeklyPlan: any, index: number, pendingValue: boolean) => {
    //    if (pendingValue === undefined || weeklyPlan[index] === undefined) return pendingValue
    const pv = pendingValue ? "true" : "false";
    const wv = weeklyPlan[index] ? "true" : "false";
    return pv === wv;
  };
  return (
    <MainContainer>
      {pendingWeeklyPlans ? (
        pendingWeeklyPlans.map((data: any) => (
          <Card key={data._id}>
            <div style={{ display: "flex", alignItems: "center", gap: "3rem" }}>
              <p style={{ fontSize: "1rem" }}>{data.name}</p>
              <p style={{ fontSize: ".8rem" }}>
                {convertDate(data.updated_at)}
              </p>
            </div>
            <div>
              <div style={{ display: "flex", gap: "1.625rem" }}>
                {getCurrentWeekDatesWithMonth().length &&
                  getCurrentWeekDatesWithMonth().map(
                    (data: any, index: number) => (
                      <p style={{ fontSize: ".8rem" }} key={index}>
                        {data}
                      </p>
                    ),
                  )}
              </div>
              <div style={{ display: "flex", gap: ".5rem" }}>
                {data.pendingWeeklyMealPlan &&
                  data.pendingWeeklyMealPlan.map(
                    (data1: any, index: number) => (
                      <Checkbox key={index} checked={data1}>
                        <span
                          style={{
                            color: test1(data?.weeklyMealPlan, index, data1)
                              ? "black"
                              : "red",
                          }}
                        >
                          {weekOfDay[index]}
                        </span>
                      </Checkbox>
                    ),
                  )}
              </div>
            </div>
            <div style={{ display: "flex", gap: ".5rem" }}>
              <Button
                type="primary"
                onClick={() => onClickAction(data._id, "reject")}
                danger
              >
                Reject
              </Button>
              <Button
                onClick={() => onClickAction(data._id, "approve")}
                type="primary"
              >
                Approve
              </Button>
            </div>
          </Card>
        ))
      ) : (
        <p style={{ paddingLeft: "1rem" }}>Pending weekly plan is empty</p>
      )}
    </MainContainer>
  );
};

export default PendingWeeklyMealPlan;
