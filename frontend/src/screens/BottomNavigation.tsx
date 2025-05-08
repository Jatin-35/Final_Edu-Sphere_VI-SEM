import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

interface BottomNavigationProps {
  navigateTo: (screen: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ navigateTo }) => {
  return (
    <View
                style={{
                    position: 'absolute',
                    bottom: 6,
                    left: 0,
                    right: 0,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    backgroundColor: '#f1f1f9',
                }}
            >
                <TouchableOpacity onPress={() => navigateTo("Content")}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#333',}}>🏠</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    height: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onPress={() => navigateTo("ChatBot")}>
                    <Image 
                        source={require('../../assets/images/bot4.jpg')}
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 50,
                            borderColor: '#ffffff',
                            borderWidth: 5,
                        }}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateTo("Profile")}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#333' }}>👤</Text>
                </TouchableOpacity>
            </View>
    );
};

export default BottomNavigation;
