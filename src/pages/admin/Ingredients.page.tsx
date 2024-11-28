import {
    ChangeEvent,
    FC,
    MouseEvent,
    useContext,
    useEffect,
    useState,
} from "react";
import {
    NavigateFunction,
    useLocation,
    useNavigate,
    useSearchParams,
} from "react-router-dom";

// Api
import { INGREDIENTS_API } from "../../api";

// Assets
import { AddIcon, CancelIcon, SearchIcon } from "../../assets/icons";

// Components
import { Card, IconButton, Input, Modal, Table } from "../../components";

// Contexts
import { LoaderContext, SnackbarContext, ThemeContext } from "../../providers";

// Types
import {
    IngredientT,
    LoaderContextI,
    SnackbarContextI,
    TableColumnT,
    ThemeContextI,
} from "../../types";

// Utilities
import { setPageTitle } from "../../utilities";

interface FormDataI {
    name: string;
}

const Ingredients: FC = () => {
    const { state: theme } = useContext(ThemeContext) as ThemeContextI;
    const [searchParams, setSearchParams] = useSearchParams({});
    const [formData, setFormData] = useState<FormDataI>({
        name: searchParams.get("name") || "",
    });
    const navigate: NavigateFunction = useNavigate();
    const { pathname }: { pathname: string } = useLocation();
    const { setState: setIsLoading } = useContext(
        LoaderContext
    ) as LoaderContextI;
    const [from, setFrom] = useState<number>(
        parseInt(searchParams.get("from") as string) || 0
    );
    const [to, setTo] = useState<number>(
        parseInt(searchParams.get("to") as string) || 4
    );
    const [tableCurrentPage, setTableCurrentPage] = useState<number>(
        parseInt(searchParams.get("page") as string) || 1
    );
    const [tableData, setTableData] = useState<IngredientT[]>([]);
    const { activateHandler: activateSnackbar } = useContext(
        SnackbarContext
    ) as SnackbarContextI;
    const [totalIngredients, setTotalIngredients] = useState<number>(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedIngredient, setSelectedIngredient] =
        useState<IngredientT | null>(null);

    const pageTitle: string = "Ingredienti";
    const isDarkMode: boolean = theme === "dark";
    const tableColumns: TableColumnT[] = [
        {
            key: "name",
            value: "Nome",
        },
        {
            key: "icon",
            value: "Icona",
        },
        {
            key: "actions",
        },
    ];

    setPageTitle(pageTitle);

    async function getDataHandler() {
        setIsLoading(true);

        const res = await INGREDIENTS_API.getAll(from, to, formData.name);

        if (res.value && res.data && res.totalRecords) {
            setTableData(res.data);
            setTotalIngredients(parseInt(res.totalRecords));
        } else
            activateSnackbar("Impossibile recuperare gli ingredienti", "error");

        setIsLoading(false);
    }

    useEffect(() => {
        getDataHandler();

        // eslint-disable-next-line
    }, [from, to]);

    const title = <span className="text-3xl text-primary">{pageTitle}</span>;

    function inputHandler(event: ChangeEvent<HTMLInputElement>): void {
        const { name, value }: { name: string; value: string } = event.target;

        setFormData((prevState) => ({ ...prevState, [name]: value }));
    }

    function submitHandler(event: any): void {
        event.preventDefault();

        setSearchParams({
            name: formData.name,
            from: from.toString(),
            to: to.toString(),
            page: tableCurrentPage.toString(),
        });
    }

    function resetHandler(event: MouseEvent<HTMLButtonElement>): void {
        event.preventDefault();
        setSearchParams({
            name: "",
            from: "0",
            to: "4",
            page: "1",
        });
        setFormData({ name: "" });
        setFrom(0);
        setTo(4);
        setTableCurrentPage(1);
    }

    const form = (
        <Card>
            <form
                onSubmit={submitHandler}
                className="flex flex-row gap-5 mobile:flex-col mobile:justify-center mobile:items-center"
            >
                <div className="w-[30vh] mobile:w-full">
                    <Input
                        name="name"
                        placeholder="Nome"
                        value={formData.name}
                        onChange={inputHandler}
                        isDarkMode={isDarkMode}
                    />
                </div>
                <div className="flex gap-5 flex-row">
                    <IconButton
                        type="submit"
                        className="w-14 h-14 flex justify-center items-center bg-primary"
                    >
                        <SearchIcon className="text-white" />
                    </IconButton>
                    <IconButton
                        onClick={resetHandler}
                        className="w-14 h-14 flex justify-center items-center"
                    >
                        <CancelIcon
                            className={isDarkMode ? "text-white" : "text-black"}
                        />
                    </IconButton>
                </div>
            </form>
        </Card>
    );

    function tablePreviousPageHandler(): void {
        setFrom(from - 5);
        setTo(to - 5);
        setTableCurrentPage(tableCurrentPage - 1);
        setSearchParams({
            name: formData.name,
            from: (from - 5).toString(),
            to: (to - 5).toString(),
            page: (tableCurrentPage - 1).toString(),
        });
    }

    function tableNextPageHandler(): void {
        setFrom(from + 5);
        setTo(to + 5);
        setTableCurrentPage(tableCurrentPage + 1);
        setSearchParams({
            name: formData.name,
            from: (from + 5).toString(),
            to: (to + 5).toString(),
            page: (tableCurrentPage + 1).toString(),
        });
    }

    function pageHandler(url: string): void {
        navigate(url);
    }

    function tableRowHandler(rowData: any): void {
        pageHandler(`${pathname}/${rowData.id}`);
    }

    function tableDeleteHandler(rowData: any): void {
        setSelectedIngredient(rowData);
        setIsDeleteModalOpen(true);
    }

    const table = (
        <Table
            columns={tableColumns}
            data={tableData}
            currentPage={tableCurrentPage}
            isDarkMode={isDarkMode}
            nextPageHandler={tableNextPageHandler}
            previousPageHandler={tablePreviousPageHandler}
            rowHandler={tableRowHandler}
            totalRecords={totalIngredients}
            deleteHandler={tableDeleteHandler}
        />
    );

    const btn = (
        <div className="fixed bottom-10 right-10 mobile:bottom-5 mobile:right-5">
            <IconButton
                onClick={() => pageHandler(`${pathname}/new`)}
                className="px-4 py-4 bg-pink-2"
            >
                <AddIcon className="text-primary text-3xl" />
            </IconButton>
        </div>
    );

    async function deleteHandler() {
        setIsLoading(true);

        if (selectedIngredient?.id) {
            const res = await INGREDIENTS_API.delete(selectedIngredient.id);

            if (res.value) {
                setIsDeleteModalOpen(false);
                activateSnackbar(
                    "Ingrediente eliminato con successo",
                    "success"
                );
                await getDataHandler();
            } else {
                activateSnackbar(
                    "Impossibile eliminare l'ingrediente",
                    "error"
                );
            }
        }

        setIsLoading(false);
    }

    const modal = (
        <Modal
            title="Elimina ingrediente"
            cancelBtnText="No"
            isDarkMode={isDarkMode}
            submitBtnText="Sì"
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            submitHandler={deleteHandler}
        >
            <span
                className={`transition-all duration-200 text-lg
                    ${isDarkMode ? "text-white" : "text-black"}
                `}
            >
                Confermi di voler eliminare l'ingrediente
                <span className="text-primary ml-1">
                    {selectedIngredient?.name}
                </span>
                ?
            </span>
        </Modal>
    );

    return (
        <>
            <div className="flex flex-col gap-10">
                {title}
                {form}
                {table}
                {btn}
            </div>
            {modal}
        </>
    );
};

export default Ingredients;
