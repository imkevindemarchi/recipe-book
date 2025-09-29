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
import { INGREDIENT_API, IMAGE_API } from "../../api";

// Assets
import { AddIcon, SearchIcon } from "../../assets/icons";

// Components
import { Input, LiquidGlass, Modal, Table } from "../../components";

// Contexts
import { LoaderContext, TLoaderContext } from "../../providers/loader.provider";
import { PopupContext, TPopupContext } from "../../providers/popup.provider";

// Types
import { THTTPResponse, TIngredient } from "../../types";
import { IColumn } from "../../components/Table.component";

// Utils
import { setPageTitle } from "../../utils";

interface ITableData {
  from: number;
  to: number;
  total: number;
  page: number;
  label: string;
}

interface IModal {
  show: boolean;
  item: TIngredient | null;
}

const DEFAULT_DELETE_MODAL: IModal = {
  show: false,
  item: null,
};

const AdminIngredients: FC = () => {
  const { t } = useTranslation();
  const { state: isLoading, setState: setIsLoading }: TLoaderContext =
    useContext(LoaderContext) as TLoaderContext;
  const [searchParams, setSearchParams] = useSearchParams({});
  const TABLE_DEFAULT_STATE: ITableData = {
    from: parseInt(searchParams.get("from") as string) || 0,
    to: parseInt(searchParams.get("to") as string) || 4,
    total: parseInt(searchParams.get("total") as string) || 0,
    page: parseInt(searchParams.get("page") as string) || 1,
    label: searchParams.get("label") || "",
  };
  const [table, setTable] = useState<ITableData>(TABLE_DEFAULT_STATE);
  const [tableData, setTableData] = useState<TIngredient[] | null>(null);
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const [deleteModal, setDeleteModal] = useState<IModal>(DEFAULT_DELETE_MODAL);
  const navigate: NavigateFunction = useNavigate();
  const { pathname } = useLocation();

  const talbeColumns: IColumn[] = [
    { key: "label", value: t("name") },
    { key: "icon", value: t("icon") },
  ];

  setPageTitle(t("ingredients"));

  async function getData(): Promise<void> {
    setIsLoading(true);

    await Promise.resolve(
      INGREDIENT_API.getAllWithFilters(table.from, table.to, table.label)
    ).then((response: THTTPResponse) => {
      if (response && response.hasSuccess) {
        setTableData(response.data);
        setTable((prevState) => {
          return { ...prevState, total: response?.totalRecords as number };
        });
      } else openPopup(t("unableLoadIngredients"), "error");
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

  async function onTableDelete(rowData: TIngredient): Promise<void> {
    setDeleteModal({
      show: true,
      item: rowData,
    });
  }

  function onTableRowClick(rowData: any): void {
    navigate(`${pathname}/edit/${rowData.id}`);
  }

  const title: ReactNode = (
    <span className="text-white text-2xl">{t("ingredients")}</span>
  );

  async function onDelete(): Promise<void> {
    setDeleteModal(DEFAULT_DELETE_MODAL);
    setIsLoading(true);

    await Promise.resolve(
      INGREDIENT_API.delete(deleteModal.item?.id as string)
    ).then(async (ingredientRes: THTTPResponse) => {
      if (ingredientRes && ingredientRes.hasSuccess) {
        await Promise.resolve(
          IMAGE_API.delete(deleteModal.item?.id as string)
        ).then((imageRes: THTTPResponse) => {
          if (imageRes && imageRes.hasSuccess) {
            openPopup(t("ingredientSuccessfullyDeleted"), "success");
            getData();
          }
        });
      } else openPopup(t("unableDeleteIngredient"), "error");
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
        value={table.label}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          let text: string = event.target.value;
          if (text.length > 0)
            text = text.charAt(0).toUpperCase() + text.slice(1);

          setTable((prevState) => {
            return {
              ...prevState,
              label: text,
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
      title={t("deleteIngredient")}
      onCancel={() => setDeleteModal(DEFAULT_DELETE_MODAL)}
      onSubmit={onDelete}
      cancelButtonText="no"
      submitButtonText="yes"
    >
      <span className="text-white opacity-80">
        {t("confirmToDelete", { name: deleteModal.item?.label })}
      </span>
    </Modal>
  );

  useEffect(() => {
    getData();

    // eslint-disable-next-line
  }, [table.from, table.to]);

  useEffect(() => {
    setSearchParams({
      label: table.label,
      from: table.from,
      to: table.to,
      page: table.page,
    } as any);

    // eslint-disable-next-line
  }, [table.label, table.from, table.to, table.page]);

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

export default AdminIngredients;
