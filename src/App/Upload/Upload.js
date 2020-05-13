import React, {Component} from "react";
import DropZone from '../DropZone/DropZone'
import Progress from "../Progress/Progress";
import {Button, Col, Row} from "react-bootstrap";

class Upload  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            src: null,
            files: [],
            show: false,
            uploading: false,
            uploadProgress: {},
            successfullyUploaded: false
        };

        this.onFilesAdded = this.onFilesAdded.bind(this);
        this.uploadFiles = this.uploadFiles.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleGetBlob = this.handleGetBlob.bind(this);
    }

    handleClose() {
        this.setState({
            show: false,
            src: null
        });
    }

    handleShow() {
        this.setState({ show: true });
    }

    handleGetBlob(src) {
        this.setState({
            src: src
        })
        console.log("src", src)
    }
    onFilesAdded(files) {
        this.setState(prevState => ({
            files: prevState.files.concat(files)
        }));
        this.handleShow();
    }

    async uploadFiles() {
        this.setState({
            uploadProgress: {},
            uploading: true });
        const promises = [];
        this.state.files.forEach(file => {
            promises.push(this.sendRequest(file));
        });
        try {
            await Promise.all(promises);

            this.setState({ successfullyUploaded: true, uploading: false });
        } catch (e) {
            // Not Production ready! Do some error handling here instead...
            this.setState({ successfullyUploaded: true, uploading: false });
        }
    }

    sendRequest(file) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();

            req.upload.addEventListener("progress", event => {
                if (event.lengthComputable) {
                    const copy = { ...this.state.uploadProgress };
                    copy[file.name] = {
                        state: "pending",
                        percentage: (event.loaded / event.total) * 100
                    };
                    this.setState({ uploadProgress: copy });
                }
            });

            req.upload.addEventListener("load", event => {
                const copy = { ...this.state.uploadProgress };
                copy[file.name] = { state: "done", percentage: 100 };
                this.setState({ uploadProgress: copy });
                resolve(req.response);
            });

            req.upload.addEventListener("error", event => {
                const copy = { ...this.state.uploadProgress };
                copy[file.name] = { state: "error", percentage: 0 };
                this.setState({ uploadProgress: copy });
                reject(req.response);
            });

            const formData = new FormData();
            formData.append("file", file, file.name);

            req.open("POST", "http://localhost:8000/upload");
            req.send(formData);
        });
    }

    renderProgress(file) {
        const uploadProgress = this.state.uploadProgress[file.name];
        if (this.state.uploading || this.state.successfullyUploaded) {
            return (
                <div className="ProgressWrapper">
                    <Progress progress={uploadProgress ? uploadProgress.percentage : 0} />
                    <img
                        className="CheckIcon"
                        alt="done"
                        src="check_circle-24px.svg"
                        style={{
                            opacity:
                                uploadProgress && uploadProgress.state === "done" ? 0.5 : 0
                        }}
                    />
                </div>
            );
        }
    }

    renderActions() {
        if (this.state.successfullyUploaded) {
            return (
                <Button variant="danger"
                    onClick={() => this.setState({ files: [], successfullyUploaded: false })}
                >
                    Clear
                </Button>
            );
        } else {
            return (
                <Button
                    variant="primary"
                    disabled={this.state.files.length < 0 || this.state.uploading}
                    onClick={this.uploadFiles}
                >
                    Upload
                </Button>
            );
        }
    }


    render() {
        const src = this.state;

        return(
            <Row style={{padding: "10px"}}>
                <Col md={4}>
                    <DropZone className="DropZone"
                        onFilesAdded={this.onFilesAdded}
                        handleGetBlob={this.handleGetBlob}
                    >
                    </DropZone>
                    {this.state.files.map(file => {
                        return (
                            <Row key={file.name} className="Files">
                                <Col md={4}>
                                    <p>{file.name}</p>
                                    {this.renderActions()}
                                </Col>
                            </Row>
                        );
                    })}
                </Col>
                <Col md={4}>
                    {src ?
                    <img
                        src={this.state.src}
                    /> : ""}
                </Col>

            </Row>

        )
    }

}
export default Upload;