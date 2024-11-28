import { ChangeEvent, FC, MouseEvent, useRef } from "react";

// Components
import IconButton from "./IconButton.component";

// Types
import { InputFileI } from "../types";

const InputFile: FC<InputFileI> = ({ value, onChange, error, icon }) => {
    const hiddenFileInput = useRef<HTMLInputElement>(null);

    const errorComponent = error?.value && (
        <span className="text-red">{error?.message}</span>
    );

    function iconButtonClickHandler(
        event: MouseEvent<HTMLButtonElement>
    ): void {
        event.preventDefault();
        if (hiddenFileInput.current) {
            hiddenFileInput.current.click();
        }
    }

    const iconButton = (
        <IconButton className="p-5" onClick={iconButtonClickHandler}>
            {icon}
        </IconButton>
    );

    const fileName = (
        <span className="text-primary mobile:hidden">{value?.name}</span>
    );

    function inputHandler(event: ChangeEvent<HTMLInputElement>): void {
        const files = event.target.files;
        if (files && files.length > 0) onChange(files[0]);
    }

    const input = (
        <input
            ref={hiddenFileInput}
            type="file"
            id="file-upload"
            onChange={inputHandler}
        />
    );

    return (
        <div className="flex flex-row gap-5 items-center">
            {iconButton}
            {fileName}
            {input}
            {errorComponent}
        </div>
    );
};

export default InputFile;
