import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const configureGoogle = () => {
  GoogleSignin.configure({
    webClientId:
      "1098288554934-sabriagio647m93tjdq499nbcejmhjpq.apps.googleusercontent.com",
    iosClientId:
      "1098288554934-iqttq274f82vv5akovmn8eeq4vggn9hj.apps.googleusercontent.com",
    offlineAccess: true,
  });
};
