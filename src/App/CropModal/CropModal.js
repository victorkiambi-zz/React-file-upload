import React, {Component} from 'react'
import {Button, Modal, ModalFooter} from "react-bootstrap";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css'
import './CropModal.css'


class CropModal extends Component{
    constructor(props) {
        super(props);
        this.state = ({
            crop: {
                aspect: 4 / 3,
                unit: "px",
                height: 300,
                x: 75,
                y: 30,
            },
            rotation: 0
        });
        this._onCropChange = this._onCropChange.bind(this);
        this._showCroppedImage = this._showCroppedImage.bind(this);
        this._onImageLoaded = this._onImageLoaded.bind(this);
        this.handleRotate = this.handleRotate.bind(this);
        this.cropper = React.createRef();
        this.crop = this._crop.bind(this);

    }

    _crop(){
        let croppedImage = this.cropper.current.getCroppedCanvas().toDataURL();
        this.setState({ croppedImage });
    }

    _handleCroppedImage() {
        this.props.getCroppedImage(this.state.croppedImage);
        this.props.handleClose();
    }

    _onImageLoaded(image) {
        this.cropper = image
    }

    _onCropChange (crop) {
        this.setState({ crop: crop })
    };

     _showCroppedImage() {
         this.props.getCroppedImage(this.state.croppedImage);
         this.props.handleClose();
    }

    handleRotate() {
        console.log("clicked");
        this.setState({
            rotation: this.state.rotation + 90
        })
    }


    render () {
        return(
            <Modal show={this.props.show} onHide={this.props.handleClose}
                   src={this.props.src}
                   onExited={this.props.handleClose}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Crop Image
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="thisModal">
                        <Button onClick={this.handleRotate}> Rotate right </Button>
                        <Cropper
                            ref={this.cropper}
                            src={this.props.src}
                            aspectRatio={4 / 3}
                            crop={this.crop}
                            rotateTo={this.state.rotation}
                            style={{height: 400, width: '100%'}}
                        />
                    </div>
                </Modal.Body>
                <ModalFooter>
                    <Button onClick={this._showCroppedImage} variant="primary">
                        Save
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default CropModal;