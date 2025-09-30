import { FC } from "react";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export type TLineChartData = {
  label: string;
  data: number[];
  borderColor: string;
};

interface IProps {
  labels: string[];
  data: TLineChartData[];
}

const LineChart: FC<IProps> = ({ labels, data }) => {
  const dataset: ChartData<"line", number[], string> = {
    labels,
    datasets: data,
  };

  const options: any = {
    plugins: {
      legend: {
        labels: {
          color: "#ffffff",
        },
      },
    },
    scales: {
      y: {
        ticks: { color: "#ffffff" },
      },
      x: {
        ticks: { color: "#ffffff" },
      },
    },
  };

  return <Line data={dataset} options={options} />;
};

export default LineChart;
