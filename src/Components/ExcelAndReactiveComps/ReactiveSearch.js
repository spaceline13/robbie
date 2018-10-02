import React, {Component} from 'react';
import {CategorySearch, ReactiveBase, ReactiveList} from "@appbaseio/reactivesearch";

class ReactiveSearch extends Component {

    render() {
        var count=0;
        return (
            <ReactiveBase
                url="http://192.168.1.30:9200"
                app="banana">
                <CategorySearch
                    componentId="searchbox"
                    dataField="label"
                    categoryField="banana.label" // use "brand.keyword" for newly cloned datasets
                    placeholder="Search for bananas"
                />

                <ReactiveList
                    componentId="results"
                    dataField="label"
                    size={6}
                    pagination={true}
                    react={{
                        and: ["searchbox"]
                    }}
                    onData={(res) =>
                        <div key={"data"+count++} className="" style={{textAlign:'left',padding: '0px', border: '1px solid #f7941d', backgroundColor: '#4b4b4a1f', color: '#4b4b4a' }}>
                            <div>
                                <h4>{res.label}</h4>
                                <p style={{fontSize:'12px'}}>{res.URI}</p>
                            </div>
                        </div>
                    }
                />
            </ReactiveBase>
        )
    }
}

export default ReactiveSearch;