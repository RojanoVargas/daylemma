import * as Font from "expo-font";

export const loadFonts = async () => {
  await Font.loadAsync({
    "my-custom-font": require("../app/assets/fonts/gordqucikblack-p7erv.ttf"),
  });
};
