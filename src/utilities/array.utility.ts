export function filterArrayByString(array: any[], string: string): any[] {
    return array.filter((x: any) =>
        x.value.toLowerCase().includes(string.toLowerCase())
    );
}
