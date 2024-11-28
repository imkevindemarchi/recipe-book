import {
    ChangeEvent,
    Dispatch,
    MouseEvent,
    ReactNode,
    SetStateAction,
} from "react";

export type RecipeT = {
    id?: string;
    name: string;
    time: string;
    peopleNumber: number;
    category: string;
    isFavourite?: boolean;
};

export type CategoryT = {
    id?: string;
    name: string;
};

export type ErrorT = { value: boolean; message?: string | null };

export type StepT = {
    id?: string;
    step: string;
    recipeId: string;
};

export type IngredientT = {
    id?: string;
    name: string;
    icon?: string;
    recipeId?: string;
    quantity?: string;
};

export type OptionT = {
    key?: string;
    value: string;
    icon?: string;
};

// Input
export type InputTypeT = "text" | "number" | "password";

export interface InputI {
    placeholder: string;
    type?: InputTypeT;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    error?: ErrorT;
    disabled?: boolean;
    startIcon?: any;
    endIcon?: any;
    name?: string;
    isDarkMode?: boolean;
}

// Autocomplete
export interface AutocompleteI {
    placeholder: string;
    type?: InputTypeT;
    value: OptionT;
    onChange: (option: OptionT) => void;
    error?: ErrorT;
    disabled?: boolean;
    startIcon?: any;
    endIcon?: any;
    name?: string;
    isDarkMode?: boolean;
    options: OptionT[];
}

// Button
export type ButtonT = "button" | "submit" | "reset";

export interface ButtonI {
    disabled?: boolean;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    type?: ButtonT;
    children: ReactNode;
}

// Snackbar
export interface SnackbarStateI {
    message: string | null;
    isOpen: boolean;
    type: SnackbarMessageT;
}

export interface SnackbarContextI {
    state: SnackbarStateI;
    setState?: Dispatch<SetStateAction<SnackbarStateI>>;
    closeHandler: () => void;
    activateHandler: (message: string, type: SnackbarMessageT) => void;
}

export interface SnackbarProviderI {
    children: ReactNode;
}

export type SnackbarMessageT = "success" | "warning" | "error" | null;

export interface SnackbarI {
    state: SnackbarStateI;
    onClose: () => void;
}

// Backdrop
export interface BackdropI {
    isOpen: boolean;
    onClose?: () => void;
    isDarkMode: boolean;
    children: ReactNode;
}

// Loader
export interface LoaderI {
    isOpen: boolean;
    isDarkMode: boolean;
}

// Auth
export interface AuthContextI {
    session: any;
    setSession: Dispatch<SetStateAction<any>>;
}

export interface AuthProviderI {
    children: ReactNode;
}

// Loader
export interface LoaderContextI {
    state: boolean;
    setState: Dispatch<SetStateAction<boolean>>;
}

export interface LoaderProviderI {
    children: ReactNode;
}

// Layout
export interface LayoutI {
    children: ReactNode;
    isAdminSection: boolean;
    pathname: string;
}

// Routes
export type RouteT = {
    path: string;
    name?: string;
    isHidden?: boolean;
    element: any;
};

// Navbar
export interface NavbarI {
    isAdminSection: boolean;
    urlSection: string;
    routes: RouteT[];
    isDarkMode: boolean;
    themeHandler: () => void;
    logoutHandler: () => void;
}

// IconButton
export interface IconButtonI {
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    children: ReactNode;
    className?: string;
    type?: ButtonT;
}

// Theme
export interface ThemeContextI {
    state: string;
    stateHandler: () => void;
}

export interface ThemeProviderI {
    children: ReactNode;
}

export type ThemeT = "light" | "dark";

// Sidebar
export interface SidebarI {
    isAdminSection: boolean;
    urlSection: string;
    routes: RouteT[];
    isDarkMode: boolean;
    themeHandler: () => void;
    logoutHandler: () => void;
    isActive: boolean;
    stateHandler: () => void;
}

export interface SidebarContextI {
    state: boolean;
    stateHandler: () => void;
}

export interface SidebarProviderI {
    children: ReactNode;
}

// Hamburger
export interface HamburgerI {
    isActive: boolean;
    isDarkMode: boolean;
    onClick: () => void;
}

// Table
export type TableColumnT = {
    key: string;
    value?: string;
};

export interface TableI {
    columns: TableColumnT[];
    data: any[];
    isDarkMode: boolean;
    totalRecords: number;
    deleteHandler?: (rowData: any) => void;
    currentPage: number;
    previousPageHandler: () => void;
    nextPageHandler: () => void;
    rowHandler: (rowData: any) => void;
}

export interface TableFoooterBtnI {
    onClick: () => void;
    disabled: boolean;
    children: ReactNode;
}

// Card
export interface CardI {
    children: ReactNode;
    hiddenOnMobile?: boolean;
}

// Modal
export interface ModalI {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    isDarkMode: boolean;
    submitBtnText: string;
    cancelBtnText: string;
    submitHandler: (event: MouseEvent<HTMLButtonElement>) => void;
    children: ReactNode;
}

// GoBackBtn
export interface GoBackBtnI {
    isDarkMode: boolean;
}

// InputFile
export interface InputFileI {
    value: File | null;
    onChange: (file: File) => void;
    error?: ErrorT;
    icon: any;
}

// TextArea
export interface TextAreaI {
    placeholder: string;
    value: string;
    type?: string;
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    error?: ErrorT;
    disabled?: boolean;
    name?: string;
    isDarkMode?: boolean;
}

// HTTP
export type HTTPResponseDataT = {
    data?: any;
    totalRecords?: any;
    value: boolean;
};

// Footer
export interface FooterI {
    isDarkMode: boolean;
    routes: RouteT[];
    urlSection: string;
}

// BackToTopButton
export interface BackToTopButtonI {
    isDarkMode: boolean;
}

// Procedure
export interface ProcedureI {
    isDarkMode: boolean;
    isAdminSection?: boolean;
    recipeId: string | undefined;
}

// Steps
export interface StepsI {
    data: StepT[];
    isDarkMode: boolean;
}

// IngredientsCarousel
export interface IngredientsCarouselI {
    data: IngredientT[];
    isDarkMode: boolean;
}

// SmallCard
export interface SmallCardI {
    title: string;
    backgroundImage: string;
    path?: string;
}

// BigCard
export interface BigCardI {
    title: string;
    backgroundImage: string;
    path?: string;
    time?: string;
    isDarkMode: boolean;
    className?: string;
    titleClassName?: string;
}
