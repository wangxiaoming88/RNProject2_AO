import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import {baseStyles} from '../styles';
import AvatarComponent from '../common/avatar';

let options = {
  title: 'Select Avatar', // specify null or empty string to remove the title
  cancelButtonTitle: 'Cancel',
  takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
  chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
  cameraType: 'back', // 'front' or 'back'
  mediaType: 'photo', // 'photo' or 'video'
  videoQuality: 'high', // 'low', 'medium', or 'high'
  durationLimit: 10, // video recording max time in seconds
  maxWidth: 500, // photos only
  maxHeight: 500, // photos only
  aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
  aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
  quality: 0.8, // 0 to 1, photos only
  angle: 0, // android only, photos only
  allowsEditing: false, // Built in functionality to resize/reposition the image after selection
  noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
  storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
    skipBackup: true, // ios only - image will NOT be backed up to icloud
    path: 'images' // ios only - will save image at /Documents/images rather than the root
  }
};

class PhotoComponent extends React.Component {
  updateAvatar() {
    ImagePicker.showImagePicker(options, (response) => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }
      else {
        // const source64 = 'data:image/jpeg;base64,' + response.data;
        let source;
        if (Platform.OS === 'ios') {
          // uri (on iOS)
          source = {uri: response.uri.replace('file://', ''), isStatic: true};
        } else {
          // uri (on android)
          source = {uri: response.uri, isStatic: true};
        }

        let fileName = source.uri.split('/').pop();
        source.name = fileName;
        source.data = response.data;

        this.props.onUpdate(source);
      }
    });
  }

  render() {
    // let imageSize = Math.min(Dimensions.get('window').height, Dimensions.get('window').width) / 2;
    let imageSize = 100;

    return (
      <View>
        <View style={ [baseStyles.centeredContainer, {padding: 20}] }>
          <TouchableOpacity onPress={ this.updateAvatar.bind(this) }>
            <AvatarComponent avatar={ this.props.avatar }
              style={{height: imageSize, width: imageSize, borderRadius: imageSize / 2}} />
            <Text style={ [baseStyles.linkL, {textAlign: 'center'}] }>edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default PhotoComponent;
