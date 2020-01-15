import firebase from "firebase/app";
import "firebase/auth";

export const logoutUser = () => {
   firebase.auth().signOut();
};

export const signUpUser = async ({ name, email, password }) => {
   try {
      let response = await firebase.auth().createUserWithEmailAndPassword(email, password);
      firebase.auth().currentUser.updateProfile({
         displayName: name
      });
      return response;
   } catch (error) {
      switch (error.code) {
         case "auth/email-already-in-use":
            return {
               error: "E-mail already in use."
            };
         case "auth/invalid-email":
            return {
               error: "Invalid e-mail address format."
            };
         case "auth/weak-password":
            return {
               error: "Password is too weak."
            };
         case "auth/too-many-requests":
            return {
               error: "Too many request. Try again in a minute."
            };
         default:
            return {
               error: "Check your internet connection."
            };
      }
   }
};

export const loginUser = async ({ email, password }) => {
   try {
      return await firebase.auth().signInWithEmailAndPassword(email, password);
   } catch (error) {
      switch (error.code) {
         case "auth/invalid-email":
            return {
               error: "Invalid email address format."
            };
         case "auth/user-not-found":
         case "auth/wrong-password":
            return {
               error: "Invalid email address or password."
            };
         case "auth/too-many-requests":
            return {
               error: "Too many request. Try again in a minute."
            };
         default:
            return {
               error: "Check your internet connection."
            };
      }
   }
};

export const sendEmailWithPassword = async email => {
   try {
      return await firebase.auth().sendPasswordResetEmail(email);
   } catch (error) {
      switch (error.code) {
         case "auth/invalid-email":
            return {
               error: "Invalid email address format."
            };
         case "auth/user-not-found":
            return {
               error: "User with this email does not exist."
            };
         case "auth/too-many-requests":
            return {
               error: "Too many request. Try again in a minute."
            };
         default:
            return {
               error: "Check your internet connection."
            };
      }
   }
};