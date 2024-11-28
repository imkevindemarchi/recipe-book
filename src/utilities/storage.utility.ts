export function setToStorage(propLabel: string, data: any): void {
    const name = `${process.env.REACT_APP_WEBSITE_NAME} - ${propLabel}`;
    const elabData = JSON.stringify(data);

    localStorage.setItem(name, elabData);
}

export function getFromStorage(propLabel: string): any {
    const name = `${process.env.REACT_APP_WEBSITE_NAME} - ${propLabel}`;

    return JSON.parse(localStorage.getItem(name) as string);
}

export function removeFromStorage(propLabel: string): void {
    const name = `${process.env.REACT_APP_WEBSITE_NAME} - ${propLabel}`;

    localStorage.removeItem(name);
}
