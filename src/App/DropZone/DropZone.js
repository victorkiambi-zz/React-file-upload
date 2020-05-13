import React, {Component} from 'react';
import './DropZone.css'
import { Col, Row} from "react-bootstrap";
import CropModal from "../CropModal/CropModal";


class DropZone extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: false,
            errorInfo: "",
            show: false,
            newImage: null,
            files: [],
            src: null,

        };
        this.fileInputRef = React.createRef();
        this._openFileDialog = this._openFileDialog.bind(this);
        this._onFilesAdded = this._onFilesAdded.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.getCroppedImage = this._getCroppedImage.bind(this);

    }

    handleClose() {
        this.setState({
            show: false,
            src: null,
        });

    }

    _openFileDialog() {
        if (this.props.disabled)
            return;
        this.setState({
            errors: false,
            errorInfo: ""
        });
        this.fileInputRef.current.click();
    }

    _onFilesAdded(e) {
        if (this.props.disabled) {
            return;
        }

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            if (!this.isImage(file)) {
                this.props.onFilesAdded(file);
                return;
            }

            this.setState({ show: true, files:file });
            this.checkFileSize(file);

            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.setState({
                        src: reader.result
                    }
                );
                reader.onerror = function (error) {
                    console.log('Error: ', error);
                };
            }
        }
    }

    _getCroppedImage(croppedImage) {
        let file_object = fetch(croppedImage)
            .then(r => r.blob())
            .then(blob => {
                let file_name = this.state.files.name; //e.g ueq6ge1j_name.pdf
                let file_object = new File([blob], file_name, {type: this.state.files.type});
                this.props.onFilesAdded(file_object);
                this.props.handleGetBlob(croppedImage);
            });
    }

    isImage(file) {
        return file && file['type'].split('/')[0] === 'image';
    }

    checkFileSize(files) {
        if (files.size > 1000000000) {
            this.setState({
                errors: true,
                errorInfo: "File too Large"
            });
        }
    }

    renderModal() {
        return(
            <CropModal
                show={this.state.show} handleClose={this.handleClose}
                src={this.state.src}
                getCroppedImage={this.getCroppedImage}
                crop={this.state.crop}
            />
        )
    }

    render() {

        return (
            <Row>
                <Col md={6} className="DropZone"
                     onClick={this._openFileDialog}
                     style={{ cursor: this.props.disabled ? "default" : "pointer" }}
                >
                    <input ref={this.fileInputRef}

                           className="FileInput"
                           style={{display: "none"}}
                           type="file"
                           onChange={this._onFilesAdded}
                           disabled={this.props.disabled}/>
                    <span>Upload Files</span>
                </Col>
                <Col md={2}>
                    {this.renderModal()}
                </Col>
            </Row>
        );
    }
}
export default DropZone;