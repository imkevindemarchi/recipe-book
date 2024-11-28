import { FC, MouseEvent } from "react";

// Assets
import { ArrowLeftIcon, ArrowRightIcon, DeleteIcon } from "../assets/icons";

// Components
import IconButton from "./IconButton.component";

// Types
import { TableColumnT, TableFoooterBtnI, TableI } from "../types";

// Utilities
import { approximateByExcess } from "../utilities";

const Table: FC<TableI> = ({
    columns,
    data,
    isDarkMode,
    totalRecords,
    deleteHandler,
    currentPage,
    previousPageHandler,
    nextPageHandler,
    rowHandler,
}) => {
    const canGoPrevious: boolean = currentPage > 1;
    const totalPages: number = approximateByExcess(totalRecords / 5);
    const canGoNext: boolean = currentPage < totalPages;

    function onDelete(
        event: MouseEvent<HTMLButtonElement>,
        rowData: any
    ): void {
        event.stopPropagation();
        event.preventDefault();
        deleteHandler && deleteHandler(rowData);
    }

    const FooterButton = ({
        onClick,
        disabled,
        children,
    }: TableFoooterBtnI) => (
        <button
            disabled={disabled}
            onClick={(event: MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();
                onClick();
            }}
            className={`transition-all duration-200  flex justify-center items-center p-2 rounded-lg 
                ${
                    disabled
                        ? "cursor-not-allowed bg-primary-transparent-2"
                        : "hover:bg-primary-transparent-2 bg-primary-transparent"
                }
            `}
        >
            {children}
        </button>
    );

    return (
        <div className="overflow-x-scroll relative">
            <table className="w-full">
                <thead className="bg-primary-transparent w-full">
                    <tr>
                        {columns.map((column) => (
                            <th className="py-3 mobile:px-5" key={column.key}>
                                <span className="text-primary text-lg whitespace-nowrap">
                                    {column.value}
                                </span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {totalRecords > 0 &&
                        data.map((rowData: any) => (
                            <tr
                                key={rowData.id}
                                onClick={() => rowHandler(rowData)}
                                className="bg-primary-transparent-2 hover:bg-primary-transparent transition-all duration-200 cursor-pointer"
                            >
                                {columns.map((column: TableColumnT) => {
                                    const isActionColumn: boolean =
                                        column.key === "actions";
                                    const isImageColumn: boolean =
                                        column.key === "image";
                                    const isEmailColumn: boolean =
                                        column.key === "email";

                                    return isActionColumn && deleteHandler ? (
                                        <td
                                            className="py-3 mobile:px-5"
                                            key={column.key}
                                        >
                                            <div className="flex justify-center items-center w-full h-full">
                                                <IconButton
                                                    onClick={(
                                                        event: MouseEvent<HTMLButtonElement>
                                                    ) =>
                                                        onDelete(event, rowData)
                                                    }
                                                >
                                                    <DeleteIcon className="text-2xl text-primary" />
                                                </IconButton>
                                            </div>
                                        </td>
                                    ) : isImageColumn ? (
                                        <td
                                            className="p-10 mobile:py-5 flex justify-center"
                                            key={column.key}
                                        >
                                            <div className="bg-primary-transparent w-40 flex justify-center items-center p-5 rounded-xl">
                                                <img
                                                    src={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/images/${rowData.id}`}
                                                    alt="Impossibile visualizzare l'immagine."
                                                    className="object-contain w-40"
                                                />
                                            </div>
                                        </td>
                                    ) : (
                                        <td
                                            key={column.key}
                                            className="py-3 text-center"
                                        >
                                            <span
                                                className={`text-md transition-all duration-200
                                                    ${
                                                        isEmailColumn &&
                                                        "text-primary font-bold"
                                                    }
                                                    ${
                                                        !isEmailColumn &&
                                                        isDarkMode
                                                            ? "text-white"
                                                            : "text-black"
                                                    }
                                                `}
                                            >
                                                {rowData[column.key]}
                                            </span>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                </tbody>
            </table>
            {totalRecords === 0 && (
                <div className="w-full flex justify-center items-center py-5 bg-primary-transparent-2 rounded-bl-lg rounded-br-lg">
                    <span
                        className={`text-md
                            ${isDarkMode ? "text-white" : "text-black"}
                        `}
                    >
                        Nessun risultato...
                    </span>
                </div>
            )}
            {totalRecords > 0 && (
                <div className="w-full bg-primary-transparent p-5 rounded-bl-lg rounded-br-lg flex justify-between sticky bottom-0 left-0 right-0">
                    <span
                        className={`${
                            isDarkMode ? "text-white" : "text-black"
                        }`}
                    >
                        Totale: {totalRecords}
                    </span>
                    <div className="flex flex-row gap-5">
                        <FooterButton
                            disabled={!canGoPrevious}
                            onClick={() => previousPageHandler()}
                        >
                            <ArrowLeftIcon
                                className={`text-2xl
                                ${
                                    !canGoPrevious
                                        ? "text-primary-transparent"
                                        : "text-primary"
                                }
                            `}
                            />
                        </FooterButton>
                        <FooterButton
                            disabled={!canGoNext}
                            onClick={() => nextPageHandler()}
                        >
                            <ArrowRightIcon
                                className={`text-2xl
                                ${
                                    !canGoNext
                                        ? "text-primary-transparent"
                                        : "text-primary"
                                }
                            `}
                            />
                        </FooterButton>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;
