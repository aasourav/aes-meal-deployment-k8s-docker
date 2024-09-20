import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, TableColumnsType } from "antd";
import styled from "styled-components";
import { DataSourceItemType } from "antd/es/auto-complete/index";
import { usePDF } from "react-to-pdf";
import { getProjectEnvVariables } from "../shared/projectEnvVariables.ts";
const { envVariables } = getProjectEnvVariables();

const MainContainer = styled.div`
  width: 100dvh;
  height: 100dvh;
  padding-top: 0.5rem;

  tr {
    border: 1px solid red !important;
  }
`;

const convertDate = () => {
  return new Date().toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function extractDateComponents() {
  const today = new Date();

  // Extract the day of the month
  const dayOfMonth = today.getDate();

  // Extract the month (1-indexed)
  const month = today.getMonth() + 1;

  // Extract the year
  const year = today.getFullYear();

  return { dayOfMonth, month, year };
}
// /meal-data-signeture/day/:day/month/:month/year/:year
const PrintSignetureSheet = () => {
  const [usersMealSignetures, setUsersMealSignetures] = useState([]);
  const { dayOfMonth, month, year } = extractDateComponents();
  const fetchPending = async () => {
    const response = await axios(
      `${envVariables.VITE_BASE_URL}/v1/super-user/meal-data-signeture/day/${dayOfMonth}/month/${month}/year/${year}`,
      {
        method: "get",
        withCredentials: true,
      },
    );

    const tempUser = response.data.data.userWithMealDoc
      ? response.data.data.userWithMealDoc.filter((data: any) => {
          if (data?.mealsConsumed[0].numberOfMeal === 0) {
            return false;
          }
          return {
            name: data.name,
            signeture: "",
            key: data._id,
          };
        })
      : [];
    setUsersMealSignetures(tempUser || []);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const columns: TableColumnsType<DataSourceItemType> = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Signeture",
      dataIndex: "signeture",
      align: "center",
    },
  ];

  const { toPDF, targetRef } = usePDF({
    filename: `aes-meal-${convertDate()}.pdf`,
  });
  return (
    <MainContainer>
      <Button
        style={{ marginLeft: "1rem" }}
        type="primary"
        size="large"
        onClick={() => toPDF()}
      >
        Print
      </Button>
      <div style={{ padding: "1.5rem" }} ref={targetRef}>
        <p style={{ fontWeight: "500" }}>
          AES meal signeture sheet <br />
          Date: {convertDate()}
        </p>
        <Table
          columns={columns}
          dataSource={usersMealSignetures as any}
          size="small"
          pagination={false}
          components={{
            header: {
              cell: (data: any) => (
                <th style={{ border: "1px solid black" }}>{data?.children}</th>
              ),
            },
            body: {
              cell: (data: any) => (
                <td style={{ border: "1px solid black" }}>{data?.children}</td>
              ),
            },
          }}
        />
      </div>
    </MainContainer>
  );
};

export default PrintSignetureSheet;
