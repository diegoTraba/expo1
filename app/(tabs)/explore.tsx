import React, { useState, useEffect } from 'react'
import { View, Button, Image, PermissionsAndroid, Platform, Alert } from 'react-native';
import DocumentScanner from 'react-native-document-scanner-plugin'
import ImgToBase64 from 'react-native-image-base64';

export default () => {
  const [scannedImage, setScannedImage] = useState();

  const scanDocument = async () => {
    // start the document scanner
  const { scannedImages } = await DocumentScanner.scanDocument()
  
    if(scannedImages){
      // get back an array with scanned image file paths
      if (scannedImages.length > 0) {
        // set the img src, so we can view the first scanned image
        setScannedImage(scannedImages[0])
        
  
        // save()
        // await saveToGallery(scannedImages[0]);
        //   alert('Image saved to gallery!');
      }
    }   
  }

   const save = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization' :'Bearer '},
      // body: JSON.stringify({ title: 'React POST Request Example' })
    };
    const requestOptionsLogin={
      method: 'POST',
      headers: { 'Content-Type': 'application/json'}
    }
    fetch('https://admisiones-test.curso-mir.com/security/createToken', requestOptionsLogin)
    .then(data => {
        var token= data.json();
        requestOptions.headers.Authorization='Bearer '+token
        var imgB64=ImgToBase64.getBase64String(scannedImage)
        fetch('https://admisiones-test.curso-mir.com/api/Respuestas/'+ imgB64, requestOptions)
        .then(data => {
          // setAllowances(data);
          console.log(data.json)
        })
        .catch(err => {
          console.log("Error haciendo el POST: "+err.message);       
        });

      }).catch(err => {
        console.log("Error haciendo el login: "+err.message);
      });

    
    } 
  
    
  const handleSubmit = (event) => {
    event.preventDefault()
    // save() // Save games when form is submitted
  }

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Needed',
            message: 'This app needs the storage permission to save photos to your gallery',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };

  useEffect(() => {
    // call scanDocument on load
    scanDocument()
    
  }, []);

  return (
    <View>
      <Image
            resizeMode="contain"
            style={{ width: '100%', height: '80%' }}
            source={{ uri: scannedImage }}
          />
    <Button title="Guardar" onPress={save} />
    </View>
    
  )
}