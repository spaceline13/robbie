import React from 'react';
import { WithContext as ReactTags } from 'react-tag-input';

const KeyCodes = {
    comma: 188,
    enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class MultiInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tags: props.value?props.value:[],
            suggestions: props.suggestions?props.suggestions:[]
        };
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
    }

    handleDelete(i) {
        const { tags } = this.state;
        const newTags = tags.filter((tag, index) => index !== i);
        this.setState({ tags: newTags });
        this.props.setParentValue(newTags.map(item => item.text));
    }

    handleAddition(tag) {
        const newTags = [...this.state.tags, tag];
        this.setState({ tags: newTags });
        this.props.setParentValue(newTags.map(item => item.text));
    }

    handleDrag(tag, currPos, newPos) {
        const tags = [...this.state.tags];
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        this.setState({ tags: newTags });
        this.props.setParentValue(newTags.map(item => item.text));
    }

    render() {
        const { tags, suggestions } = this.state;
        return (
                <ReactTags tags={tags}
                   suggestions={suggestions}
                   handleDelete={this.handleDelete}
                   handleAddition={this.handleAddition}
                   handleDrag={this.handleDrag}
                   delimiters={delimiters}
                   placeholder={this.props.placeholder}
                />
        )
    }
};
export default MultiInput;