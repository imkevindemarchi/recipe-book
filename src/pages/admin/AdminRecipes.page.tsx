import React, {
  ChangeEvent,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  NavigateFunction,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";

// Api
import { IMAGE_API, RECIPE_API } from "../../api";

// Assets
import { AddIcon, SearchIcon } from "../../assets/icons";

// Components
import { Input, LiquidGlass, Modal, Table } from "../../components";

// Contexts
import { LoaderContext, TLoaderContext } from "../../providers/loader.provider";
import { PopupContext, TPopupContext } from "../../providers/popup.provider";

// Types
import { THTTPResponse, TRecipe } from "../../types";
import { IColumn } from "../../components/Table.component";

// Utils
import { setPageTitle } from "../../utils";

interface ITableData {
  from: number;
  to: number;
  total: number;
  page: number;
  name: string;
}

interface IModal {
  show: boolean;
  item: TRecipe | null;
}

const DEFAULT_DELETE_MODAL: IModal = {
  show: false,
  item: null,
};

const AdminRecipes: FC = () => {
  const { t } = useTranslation();
  const { state: isLoading, setState: setIsLoading }: TLoaderContext =
    useContext(LoaderContext) as TLoaderContext;
  const [searchParams, setSearchParams] = useSearchParams({});
  const TABLE_DEFAULT_STATE: ITableData = {
    from: parseInt(searchParams.get("from") as string) || 0,
    to: parseInt(searchParams.get("to") as string) || 4,
    total: parseInt(searchParams.get("total") as string) || 0,
    page: parseInt(searchParams.get("page") as string) || 1,
    name: searchParams.get("name") || "",
  };
  const [table, setTable] = useState<ITableData>(TABLE_DEFAULT_STATE);
  const [tableData, setTableData] = useState<TRecipe[] | null>(null);
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const [deleteModal, setDeleteModal] = useState<IModal>(DEFAULT_DELETE_MODAL);
  const navigate: NavigateFunction = useNavigate();
  const { pathname } = useLocation();

  const talbeColumns: IColumn[] = [
    { key: "name", value: t("name") },
    { key: "category", value: t("category") },
    { key: "image", value: t("image") },
  ];

  setPageTitle(t("recipes"));

  async function getData(): Promise<void> {
    setIsLoading(true);

    await Promise.resolve(
      RECIPE_API.getAllWithFilters(table.from, table.to, table.name)
    ).then((response: THTTPResponse) => {
      if (response && response.hasSuccess) {
        const data: TRecipe[] = response.data.map((recipe: TRecipe) => {
          return { ...recipe, category: recipe.category.label };
        });
        setTableData(data);
        setTable((prevState) => {
          return { ...prevState, total: response?.totalRecords as number };
        });
      } else openPopup(t("unableLoadRecipes"), "error");
    });

    setIsLoading(false);
  }

  async function onTableGoPreviousPage(): Promise<void> {
    setTable((prevState) => {
      return {
        ...prevState,
        page: table.page - 1,
        from: table.from - 5,
        to: table.to - 5,
      };
    });
  }

  async function onTableGoNextPage(): Promise<void> {
    setTable((prevState) => {
      return {
        ...prevState,
        page: table.page + 1,
        from: table.from + 5,
        to: table.to + 5,
      };
    });
  }

  async function onTableDelete(rowData: TRecipe): Promise<void> {
    setDeleteModal({
      show: true,
      item: rowData,
    });
  }

  function onTableRowClick(rowData: any): void {
    navigate(`${pathname}/edit/${rowData.id}`);
  }

  const title: ReactNode = (
    <span className="text-white text-2xl">{t("recipes")}</span>
  );

  async function onDelete(): Promise<void> {
    setDeleteModal(DEFAULT_DELETE_MODAL);
    setIsLoading(true);

    await Promise.resolve(
      RECIPE_API.delete(deleteModal.item?.id as string)
    ).then(async (recipeRes: THTTPResponse) => {
      if (recipeRes && recipeRes.hasSuccess)
        await Promise.resolve(
          IMAGE_API.delete(deleteModal.item?.id as string)
        ).then((imageRes: THTTPResponse) => {
          if (imageRes && imageRes.hasSuccess) {
            openPopup(t("recipeSuccessfullyDeleted"), "success");
            getData();
          }
        });
      else openPopup(t("unableDeleteRecipe"), "error");
    });

    setIsLoading(false);
  }

  function onGoToNewPage(): void {
    navigate(`${pathname}/new`);
  }

  const header: ReactNode = (
    <div className="w-full flex justify-between items-center gap-5">
      <Input
        autoFocus
        placeholder={t("searchForName")}
        value={table.name}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          let text: string = event.target.value;
          if (text.length > 0)
            text = text.charAt(0).toUpperCase() + text.slice(1);

          setTable((prevState) => {
            return {
              ...prevState,
              name: text,
              from: 0,
              to: 4,
              page: 1,
            };
          });
        }}
        onSearch={getData}
        startIcon={<SearchIcon className="text-white text-2xl" />}
      />
      <LiquidGlass
        onClick={onGoToNewPage}
        className="p-3 cursor-pointer hover:opacity-50"
      >
        <AddIcon className="text-white text-2xl" />
      </LiquidGlass>
    </div>
  );

  const tableComponent: ReactNode = (
    <Table
      data={tableData}
      columns={talbeColumns}
      total={table.total}
      onGoPreviousPage={onTableGoPreviousPage}
      onGoNextPage={onTableGoNextPage}
      info={table}
      isLoading={isLoading}
      onDelete={onTableDelete}
      onRowClick={onTableRowClick}
    />
  );

  const modalComponent: ReactNode = (
    <Modal
      isOpen={deleteModal.show}
      title={t("deleteRecipe")}
      onCancel={() => setDeleteModal(DEFAULT_DELETE_MODAL)}
      onSubmit={onDelete}
      cancelButtonText="no"
      submitButtonText="yes"
    >
      <span className="text-white opacity-80">
        {t("confirmToDelete", { name: deleteModal.item?.name })}
      </span>
    </Modal>
  );

  useEffect(() => {
    getData();

    // eslint-disable-next-line
  }, [table.from, table.to]);

  useEffect(() => {
    setSearchParams({
      name: table.name,
      from: table.from,
      to: table.to,
      page: table.page,
    } as any);

    // eslint-disable-next-line
  }, [table.name, table.from, table.to, table.page]);

  return (
    <div className="flex flex-col gap-5">
      {title}
      {header}
      <LiquidGlass className="flex flex-col gap-10">
        {tableComponent}
      </LiquidGlass>
      {modalComponent}
    </div>
  );
};

export default AdminRecipes;
