import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import * as Font from 'expo-font';
import { AuthProviderProps } from "@/interface/commonInterface";

const FontLoader = ({children}: AuthProviderProps) => {
    const [fontsLoaded, setFontsLoaded] = useState(false);


    useEffect(() => {

        (
            async function loadFonts () {
                await Font.loadAsync({
                   
                })
                setFontsLoaded(true);
            }


        )()




    }, [])



    if (!fontsLoaded) {
        return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
        );
     }

    return children;


}


export default FontLoader;