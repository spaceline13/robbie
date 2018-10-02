import React, {Component} from "react";

class DragDropFile extends Component {
    constructor(props) {
        super(props);
        this.onDrop = this.onDrop.bind(this);
    };
    suppress(evt) { evt.stopPropagation(); evt.preventDefault(); };
    onDrop(evt) { evt.stopPropagation(); evt.preventDefault();
        const files = evt.dataTransfer.files;
        if(files && files[0]) this.props.handleFile(files[0]);
    };
    render() { return (
        <div style={{minHeight:'50px',border:'1px dotted grey'}} onDrop={this.onDrop} onDragEnter={this.suppress} onDragOver={this.suppress}>
            Drag n Drop Excel files here
            {this.props.children}
        </div>
    ); };
};

export default DragDropFile;