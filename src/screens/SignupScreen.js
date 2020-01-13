import React, { memo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { setUserData } from "../redux/actions";
import { signUpUser } from '../core/auth-api';
import { connect } from 'react-redux';
import { theme } from "../core/theme";
import Logo from "../components/Logo";
import Toast from "../components/Toast";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import MapBackground from "../components/MapBackground";
import TheWhiteSquare from '../components/TheWhiteSquare';
import {
   emailValidator,
   passwordValidator,
   nameValidator
} from "../core/untilities";

const RegisterScreen = ({ navigation, dispatch }) => {
   const [name, setName] = useState({ value: "", error: "" });
   const [email, setEmail] = useState({ value: "", error: "" });
   const [password, setPassword] = useState({ value: "", error: "" });
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   const _onSignUpPressed = async () => {
      if (loading) return;

      const nameError = nameValidator(name.value);
      const emailError = emailValidator(email.value);
      const passwordError = passwordValidator(password.value);

      if (emailError || passwordError || nameError) {
         setName({ ...name, error: nameError });
         setEmail({ ...email, error: emailError });
         setPassword({ ...password, error: passwordError });
         return;
      };

      setLoading(true);

      const response = await signUpUser({
         name: name.value,
         email: email.value,
         password: password.value
      });

      dispatch(setUserData({
         uid: response.uid,
         displayName: response.displayName,
         email: response.email,
         phoneNumber: response.phoneNumber,
         photoURL: response.photoURL,
      }));

      setLoading(false);

      if (response.error) {
         setError(response.error);
         return
      };

      navigation.navigate("Dashboard");
   };

   return (
      <>
         <MapBackground />
         <BackButton goBack={() => navigation.navigate("HomeScreen")} />
         <View style={styles.wrapper}>
            <TheWhiteSquare height={85} top={6}>
               <Logo />

               <Header>Create Account</Header>

               <TextInput
                  label="Name"
                  returnKeyType="next"
                  value={name.value}
                  onChangeText={text => setName({ value: text, error: "" })}
                  error={!!name.error}
                  errorText={name.error}
               />

               <TextInput
                  label="Email"
                  returnKeyType="next"
                  value={email.value}
                  onChangeText={text => setEmail({ value: text, error: "" })}
                  error={!!email.error}
                  errorText={email.error}
                  autoCapitalize="none"
                  autoCompleteType="email"
                  textContentType="emailAddress"
                  keyboardType="email-address"
               />

               <TextInput
                  label="Password"
                  returnKeyType="done"
                  value={password.value}
                  onChangeText={text => setPassword({ value: text, error: "" })}
                  error={!!password.error}
                  errorText={password.error}
                  secureTextEntry
                  autoCapitalize="none"
               />

               <Button
                  loading={loading}
                  mode="contained"
                  onPress={_onSignUpPressed}
                  style={styles.button}
               >
                  Sign Up
               </Button>

               <View style={styles.row}>
                  <Text style={styles.label}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
                     <Text style={styles.link}>Login</Text>
                  </TouchableOpacity>
               </View>
            </TheWhiteSquare>
         </View>

         <Toast
            type={'error'}
            message={error}
            onDismiss={() => setError("")}
         />
      </>
   );
};

const styles = StyleSheet.create({
   label: {
      color: theme.colors.secondary
   },
   button: {
      marginTop: 24
   },
   row: {
      flexDirection: "row",
      marginTop: 4
   },
   link: {
      fontWeight: "bold",
      color: theme.colors.primary
   },
   wrapper: {
      alignItems: 'center'
   }
});

export default connect()(memo(RegisterScreen));
