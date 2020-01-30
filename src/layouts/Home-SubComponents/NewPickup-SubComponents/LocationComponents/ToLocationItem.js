import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GoogleAutoComplete } from 'react-native-google-autocomplete';

class ToLocationItem extends PureComponent {

    render() {
        return (
            <GoogleAutoComplete apiKey={this.props.googAPI} debounce={300} components="country:usa">
                {({ fetchDetails }) => (
                    <TouchableOpacity 
                        style={styles.root} 
                        onPress={() => {
                            handlePress = async () => {
                                const res = await fetchDetails(this.props.place_id);
                                // console.log("This is the response: ", res)
                                // Accessing lat/lng coordinates from API response
                                const coords = res.geometry.location;
                                // Passing fromLocation's coordinates to Redux state
                                this.props.updateToLocation(coords); 
                                // console.log("These are coords: ", coords);
                                this.props.updateToState(res.formatted_address);
                            };
                            handlePress();
                            // on selection of item, set view of Time/Date Picker to true
                            this.props.setToValue();
                            this.props.clearToValues();
                            this.props.clearToSelections();
                        }}> 
                        <Text>{this.props.description}</Text>
                    </TouchableOpacity>
                )}
            </GoogleAutoComplete>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        height: '25%',
        paddingHorizontal: '25%',
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center',
        backgroundColor: 'white'
    }
})

export default ToLocationItem;