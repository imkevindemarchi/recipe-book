import { FC } from "react";
import { DotLoader as Spinner } from "react-spinners";

// Components
import Backdrop from "./Backdrop.component";

// Types
import { LoaderI } from "../types";

const Loader: FC<LoaderI> = ({ isOpen, isDarkMode }) => {
    return (
        <Backdrop isOpen={isOpen} isDarkMode={isDarkMode}>
            <Spinner color="white" />
        </Backdrop>
    );
};

export default Loader;
