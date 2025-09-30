import React, { FC, ReactNode, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Api
import { CATEGORY_API, RECIPE_API } from "../../api";

// Assets
import { MONTHS } from "../../assets";

// Components
import { LineChart, LiquidGlass } from "../../components";

// Contexts
import { LoaderContext, TLoaderContext } from "../../providers/loader.provider";
import { PopupContext, TPopupContext } from "../../providers/popup.provider";

// Types
import DoughnutChart, {
  TDoughnutChartData,
} from "../../components/DoughnutChart.component";
import { TCategory, THTTPResponse, TRecipe } from "../../types";

// Utils
import { getDateFromDB, setPageTitle } from "../../utils";

const AdminDashboard: FC = () => {
  const { t } = useTranslation();
  const [totalRecipes, setTotalRecipes] = useState<number | null>(null);
  const [doughnutChartLabels, setDoughnutChartLabels] = useState<
    string[] | null
  >(null);
  const [doughnutChartData, setDoughnutChartData] = useState<number[] | null>(
    null
  );
  const [previousYearLineChartData, setPreviousYearLineChartData] =
    useState<any>(null);
  const [currentYearLineChartData, setCurrentYearLineChartData] = useState<
    number[] | null
  >(null);
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;

  const currentYear: number = new Date().getFullYear();
  const previousYear: number = new Date().getFullYear() - 1;
  const elabDoughnutChartData: TDoughnutChartData = {
    label: t("category"),
    data: doughnutChartData as number[],
    backgroundColor: [
      process.env.REACT_APP_SECONDARY_COLOR as string,
      process.env.REACT_APP_TERTIARY_COLOR as string,
      process.env.REACT_APP_FOURTH_COLOR as string,
      process.env.REACT_APP_FIFTH_COLOR as string,
      process.env.REACT_APP_SIXTH_COLOR as string,
    ],
  };
  const lineChartLabels: string[] = MONTHS.map((month: string) => {
    return t(month);
  });
  const elabLineChartData: any[] = [
    {
      label: previousYear.toString(),
      data: previousYearLineChartData as number[],
      borderColor: process.env.REACT_APP_PRIMARY_COLOR as string,
    },
    {
      label: currentYear.toString(),
      data: currentYearLineChartData as number[],
      borderColor: process.env.REACT_APP_SECONDARY_COLOR as string,
    },
  ];

  setPageTitle(t("recipes"));

  function splitRecipesForMonth(recipes: TRecipe[]): any {
    const data: any = {};

    recipes.forEach((recipe: TRecipe) => {
      const recipeMonth: number = getDateFromDB(
        recipe.createdDate as string
      ).getMonth();

      if (!data[recipeMonth.toString()]) {
        data[recipeMonth] = [];
      }

      data[recipeMonth].push(recipe);
    });

    return data;
  }

  async function getData(): Promise<void> {
    setIsLoading(true);

    await Promise.all([RECIPE_API.getAll(), CATEGORY_API.getAll()]).then(
      (response: THTTPResponse[]) => {
        if (
          response[0] &&
          response[0].hasSuccess &&
          response[1] &&
          response[1].hasSuccess
        ) {
          let totalApetizers: number = 0;
          let totalFirstDhises: number = 0;
          let totalSecondDhises: number = 0;
          let totalSideDhises: number = 0;
          let totalCakes: number = 0;

          response[0].data.forEach((recipe: TRecipe) => {
            switch (recipe.category?.label) {
              case "Antipasti": {
                totalApetizers += 1;
                break;
              }
              case "Primi": {
                totalFirstDhises += 1;
                break;
              }
              case "Secondi": {
                totalSecondDhises += 1;
                break;
              }
              case "Contorni": {
                totalSideDhises += 1;
                break;
              }
              case "Dolci": {
                totalCakes += 1;
                break;
              }
            }
          });

          const doughnutChartLabels: string[] = response[1].data.map(
            (category: TCategory) => {
              return category.label;
            }
          );

          setDoughnutChartLabels(doughnutChartLabels);
          setDoughnutChartData([
            totalApetizers,
            totalFirstDhises,
            totalSecondDhises,
            totalSideDhises,
            totalCakes,
          ]);

          const previousYearTops: TRecipe[] = response[0].data.filter(
            (recipe: TRecipe) => {
              const recipeYear: number = getDateFromDB(
                recipe.createdDate as string
              ).getFullYear();

              return recipeYear === previousYear;
            }
          );
          const currentYearTops: TRecipe[] = response[0].data.filter(
            (recipe: TRecipe) => {
              const recipeYear: number = getDateFromDB(
                recipe.createdDate as string
              ).getFullYear();

              return recipeYear === currentYear;
            }
          );

          const splittedPreviousYearTopsForMonth: any =
            splitRecipesForMonth(previousYearTops);
          const splittedCurrentYearTopsForMonth: any =
            splitRecipesForMonth(currentYearTops);

          const previousYearLineChartData: any = {};
          MONTHS.forEach((month: string, index: number) => {
            previousYearLineChartData[t(month)] =
              splittedPreviousYearTopsForMonth[index + 1]?.length;
          });
          const currentYearLineChartData: any = {};
          MONTHS.forEach((month: string, index: number) => {
            currentYearLineChartData[t(month)] =
              splittedCurrentYearTopsForMonth[index + 1]?.length;
          });

          setPreviousYearLineChartData(previousYearLineChartData);
          setCurrentYearLineChartData(currentYearLineChartData);

          setTotalRecipes(response[0]?.totalRecords as number);
        } else openPopup(t("unableLoadRecipes"), "error");
      }
    );

    setIsLoading(false);
  }

  const title: ReactNode = (
    <span className="text-white text-2xl">{t("dashboard")}</span>
  );

  const totalRecipesComponent: ReactNode = (
    <LiquidGlass className="flex flex-col gap-5 p-10" borderRadius={30}>
      <span className="text-white font-bold text-xl">{t("totalRecipes")}</span>
      <span className="text-white font-bold text-[3em]">{totalRecipes}</span>
    </LiquidGlass>
  );

  const categoriesComponent: ReactNode = (
    <LiquidGlass className="flex flex-col gap-5 p-10" borderRadius={30}>
      <span className="text-white font-bold text-xl">{t("categories")}</span>
      <DoughnutChart
        labels={doughnutChartLabels as string[]}
        data={elabDoughnutChartData}
      />
    </LiquidGlass>
  );

  const periodComponent: ReactNode = (
    <LiquidGlass className="flex flex-col gap-5 p-10" borderRadius={30}>
      <span className="text-white font-bold text-xl">{t("period")}</span>
      <LineChart labels={lineChartLabels} data={elabLineChartData} />
    </LiquidGlass>
  );

  useEffect(() => {
    getData();

    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col gap-5">
      {title}
      <div className="flex justify-between gap-10 w-full mobile:flex-col mobile:gap-5">
        <div className="flex flex-col justify-between mobile:gap-5">
          {totalRecipesComponent}
          {categoriesComponent}
        </div>
        <div className="w-full">{periodComponent}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
