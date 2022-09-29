import { extendTheme } from "native-base";

const config = {
  useSystemColorMode: false,
  initialColorMode: "light",
};

const colors = {
  primary: {
    50: "#E3F2FD",
    100: "#CFD9E7",
    200: "#B3BEC5",
    300: "#90A4A9",
    400: "#78909C",
    500: "#607D8B",
    600: "#546E7A",
    700: "#455A64",
    800: "#37474F",
    900: "#263238",
  },
};

export default extendTheme({ config, colors });
