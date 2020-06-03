export const FLAG_TOOLTIP_VERSION = false;

export const getFlagValue = (flag) => {
    return process.env.NODE_ENV === "development" ? true : flag;
}