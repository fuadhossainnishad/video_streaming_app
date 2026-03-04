import {
    appleAuth,
    AppleRequestOperation,
    AppleRequestScope,
} from "@invertase/react-native-apple-authentication";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export interface SocialAuthPayload {
    email: string;
    name: string;
    photo: string;
}

const FALLBACK_PHOTO =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    offlineAccess: true,
});

export async function signInWithGoogle(): Promise<SocialAuthPayload> {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // signIn() returns the signed-in user directly — no getCurrentUser() needed
    const signInResult = await GoogleSignin.signIn();

    // v15+ wraps user inside `data`, older versions return user at root
    const user = "data" in signInResult ? signInResult.data?.user : signInResult.user;

    if (!user?.email) {
        throw new Error("Google sign-in failed: no user returned");
    }

    return {
        email: user.email,
        name: user.name ?? "",
        photo: user.photo ?? FALLBACK_PHOTO,
    };
}

export async function signInWithApple(): Promise<SocialAuthPayload> {
    if (!appleAuth.isSupported) {
        throw new Error("Apple Sign-In is only supported on iOS 13+");
    }

    const appleAuthResponse = await appleAuth.performRequest({
        requestedOperation: AppleRequestOperation.LOGIN,
        requestedScopes: [AppleRequestScope.EMAIL, AppleRequestScope.FULL_NAME],
    });

    const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthResponse.user
    );

    if (credentialState !== appleAuth.State.AUTHORIZED) {
        throw new Error("Apple Sign-In not authorized");
    }

    const firstName = appleAuthResponse.fullName?.givenName ?? "";
    const lastName = appleAuthResponse.fullName?.familyName ?? "";

    return {
        email: appleAuthResponse.email ?? "",
        name: [firstName, lastName].filter(Boolean).join(" "),
        photo: FALLBACK_PHOTO,
    };
}