import React, {Component} from 'react';
import StepZilla from 'react-stepzilla';
import UploadXL from "./MultistepRDFComps/UploadXL";
import MakeRDF from "./MultistepRDFComps/MakeRDF";
import LoadJSON from "./MultistepRDFComps/LoadJSON";

class MultistepRDF extends Component {
    constructor(props) {
        super(props);
        this.state = {
            excelFile:null,
            workbook:null,
            rdfModel:null
        };
    };

    render() {
        const authToken = localStorage.getItem('auth-token');
        const steps = [
            {name: 'Upload Excel File', component: <UploadXL parent={this}/>},
            {name: 'Choose Model', component: <LoadJSON parent={this}/>},
            {name: 'Generate RDF Specifications', component: <MakeRDF parent={this}/>}
        ];
        return (
            <div>
                {authToken ? (
                <div className='step-progress'>
                    <StepZilla stepsNavigation={false} showNavigation={false} steps={steps}/>
                </div>
                ):<div>Not authorized</div>}
            </div>
        );
    };
};

export default MultistepRDF;