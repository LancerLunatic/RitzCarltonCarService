import axios from 'axios';
import { connect } from 'react-redux';
import { updateFromLocation } from '../../../../redux/actions';
import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { theme } from "../../../../core/theme.js";
import Button from '../../../../components/Button';
import DateTimeMapView from './DateTimeMapView.js';
import LocationMapView from './LocationForm.js'

const LocationForm = ({ updateFromLocation, ...props }) => {
    // MAKE SURE TO REMOVE GOOGLE MAPS API KEY BEFORE PUSHING TO GIT HUB!!!!!!!!
    
    // REMEMBER TO ADD API KEY IF YOU WANT TO SEARCH GOOGLE PLACES!!!!!!!!
    
    // Rendering of DateTimePicker on Click of Next to select date and time
    //  Adjust styling and rendering of this component !!!
    
    // If there is a From and a To location in state hooks, render Location page with two Text fields
    //  that contain the To and From coordinates ---> allow both to be clickable and to return to original Location form 
    //      ---> best way to transition on returning back to form
    //  Also create a back button (arrow) to be placed to the left of the To and From location Text fields to
    //      also navigate back to original Location form input fields
    //  Then allow for Date/Time picker to show, and underneath create a Next and Back button
    //      only enable Next button as clickable when a date in the future is selected
    //  If the button "Schedule a Ride Now", do not display the Time/Date picker (set another hook to only render
    //      selection input fields)
    
    const GOOGLE_MAPS_APIKEY = '';

    // Hooks for storing 'toLocation' and 'fromLocation'
    const [fromLocation, setFrom] = useState('');
    const [toLocation, setTo] = useState('');

    // Hook for mounting initial From location of user
    const [componentDidMount, setMounted] = useState(false);

    // Hook to use different From location for rerendering purposes
    const [newFromLocation, changeFrom] = useState(null);

    getReverseGeocode = async () => {
        if (props.geoLocation) {
            // If component has not mounted, request geolocation
            if (!componentDidMount) {
                let lat = props.geoLocation.latitude;
                let long = props.geoLocation.longitude;
                let coords = lat + "," + long; 
        
                let res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords}&key=${GOOGLE_MAPS_APIKEY}`);
                console.log("This is the response: ", res);
                let address = res.data.results[1].formatted_address
                // Setting initial from location to user's current geoLocation address
                setFrom(address);
                // Setting current from value as default until user changes text input field
                changeFrom(false);
                // Setting componentDidMount to true
                setMounted(true);
                // Setting Redux state to user's current location
                updateFromLocation(response.data.results[1].geometry.location)
            }    
        }    
    }

    // Get user's reverse geoCoded address
    getReverseGeocode();
    
    // Hook to allow for saving of inputValue in From/To TextInput fields
    // const [newFromInputValue, changeFromInput] = useState(false);
    // const [newToInputValue, changeToInput] = useState(false);
    
    // Setting date for date/time picker
    const [currentDate, setDate] = useState(new Date());

    // Store new From location in hook and in redux
    const updateFromState = (newFromLocation) => {
        setFrom(newFromLocation);
        props.setFrom(fromLocation);
    };

    // Store new To location in hook and in redux
    const updateToState = (newToLocation) => {
        setTo(newToLocation);
        props.setTo(toLocation);
    };

    const dateAlert = (selectedDate) => {
        let today = new Date();
        if (selectedDate < today) {
            Alert.alert(
                'We\'re Sorry!',
                'Please select a time in the future to schedule your request.',
                [
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false},
              );
        } else {
            setDate(selectedDate);
            props.setTime(currentDate);
        }
    }

    // Resets focus of From text input to display selected address via from-location drop down menu
    // const setFromValue = () => {
    //     changeFromInput(false)
    // }

    // Resets focus of To text input to display selected address via to-location drop down menu
    // const setToValue = () => {
    //     changeToInput(false)
    // }

    // If this is a scheduled request, render the Text Input fields to select a From and To Destination
    //  then, allow to user to view their destination request on the map
    //  and then, render Time&Date selector to confirm future request
    //  and then, ask user to submit request
    // Else,
    //  only render the Text Input fields to select a From and To Destination,
    //  then, allow user to view their desination request on the map,
    //  and then, ask user to submit request

    if (props.scheduled) {
        if (fromLocation !== '' && toLocation !== '') {
            return (
                <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
                    <View styles={styles.container}>
                        <DateTimeMapView>

                        </DateTimeMapView>
                        <View style={styles.singleRideButtonContainer}>
                            <Button style={styles.backButton} 
                                mode='contained' 
                                onPress={() => props.setForm(1)}
                            >
                                Next
                            </Button>
                            <Button style={styles.backButton} 
                                mode='contained' 
                                onPress={() => props.setPage("home")}
                            >
                                Back
                            </Button>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            )
        } else {
            return (
                <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
                    <View styles={styles.container}>
                        <LocationMapView 
                                apiKey={GOOGLE_MAPS_APIKEY}
                                toLocation={toLocation}   
                                fromLocation={fromLocation}
                                setFrom={setFrom}       


                                changeFrom={changeFrom}
                                newFromLocation={newFromLocation}

                                newFromInputValue={newFromInputValue}
                                fromLocation={fromLocation}
                                changeFromInput={changeFromInput} 
                                changeToInput={changeToInput}
                                newToInputValue={newToInputValue}
                                updateFromState={updateFromState}
                                updateFromLocation={updateFromLocation}
                                setFromValue={setFromValue}
                                updateToState={updateToState}
                                updateToLocation={updateToLocation}
                                setToValue={setToValue}
                            >
                        </LocationMapView>
                        <View style={styles.singleRideButtonContainer}>
                            <Button style={styles.backButton} 
                                mode='contained' 
                                onPress={() => props.setForm(1)}
                            >
                                Next
                            </Button>
                            <Button style={styles.backButton} 
                                mode='contained' 
                                onPress={() => props.setPage("home")}
                            >
                                Back
                            </Button>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            )

        }
    }
    

    return (
        <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
            <View styles={styles.container}>
                <LocationMapView 
                    apiKey={GOOGLE_MAPS_APIKEY}
                    toLocation={toLocation}   
                    fromLocation={fromLocation} 
                    newFromLocation={newFromLocation}
                    changeFrom={changeFrom}
                    newFromInputValue={newFromInputValue}
                    fromLocation={fromLocation}
                    changeFromInput={changeFromInput} 
                    changeToInput={changeToInput}
                    newToInputValue={newToInputValue}
                    updateFromState={updateFromState}
                    updateFromLocation={updateFromLocation}
                    setFromValue={setFromValue}
                    updateToState={updateToState}
                    updateToLocation={updateToLocation}
                    setToValue={setToValue}
                >
                </LocationMapView>
                {fromLocation === '' && toLocation === '' &&
                    <View style={styles.buttonContainer}>
                        <Button style={styles.backOnlyButton} 
                            mode='contained' 
                            onPress={() => props.setPage("home")}
                        >
                            Back
                        </Button>
                    </View> 
                }
                {fromLocation === '' || toLocation === '' &&
                    <View style={styles.buttonContainer}>
                        <Button style={styles.backOnlyButton} 
                            mode='contained' 
                            onPress={() => props.setPage("home")}
                        >
                            Back
                        </Button>
                    </View> 
                }
                {fromLocation !== '' && toLocation !== '' &&
                    <View style={styles.singleRideButtonContainer}>
                        <Button style={styles.backButton} 
                            mode='contained' 
                            onPress={() => props.setForm(1)}
                        >
                            Next
                        </Button>
                        <Button style={styles.backButton} 
                            mode='contained' 
                            onPress={() => props.setPage("home")}
                        >
                            Back
                        </Button>
                    </View>
                }  
            </View>
        </TouchableWithoutFeedback>
    )
    
} 

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    surface: {
        flex: 1,
        width: '200%',
        marginTop: '7%',
        maxHeight: '30%',
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center'
    },
    fromWrapper: {
        flex: 1,
        width: 325,
        height: '5%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    toWrapper: {
        flex: 1,
        width: 325,
        height: '5%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    scroll: {
        flex: 1,
        width: '100%',
        maxHeight: '100%',
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center'
    },
    scrollView: {
        height: '50%',
        width: '100%',
        marginHorizontal: '10%',
        maxHeight: '100%',
    },
    buttonContainer: {
        flex: 1,
        maxHeight: '100%',
        width: "100%",
        flexDirection: 'column',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        justifyContent: 'center',
        marginBottom: '10%'
    },
    singleRideButtonContainer: {
        flex: 1,
        maxHeight: '100%',
        width: "100%",
        flexDirection: 'column',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        justifyContent: 'center',
        marginBottom: '10%'
    },
    backButton: {
        maxHeight: "100%",
        width: "100%",
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary,
        borderRadius: 10
    },
    nextButton: {
        maxHeight: "100%",
        width: "100%",
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary,
        borderRadius: 10
    },
    text: {
        fontFamily: Platform.OS === 'ios' ? "Arial" : "Roboto",
        letterSpacing: 2,
        fontWeight: "bold",
        fontSize: 15,
        lineHeight: 40,
        color: theme.colors.secondary,
    }
});

const mapStateToProps = state => {
    console.log('This is state: ', state)
    return {
        geoLocation: state.geoLocation,
    }
}

export default connect(mapStateToProps, {})(LocationForm);
