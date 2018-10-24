import React, {Component} from 'react';
import StepZilla from 'react-stepzilla';
import UploadXL from "./MultistepRDFComps/UploadXL";
import MakeRDF from "./MultistepRDFComps/MakeRDF";
import LoadJSON from "./MultistepRDFComps/LoadJSON";
import GenerateRDF from "./MultistepRDFComps/GenerateRDF";

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
        const steps = [
            {name: 'Upload Excel File', component: <UploadXL parent={this}/>},
            {name: 'Choose Model', component: <LoadJSON parent={this}/>},
            {name: 'Edit Model', component: <MakeRDF parent={this}/>},
            {name: 'Finished', component: <GenerateRDF parent={this}/>}
        ];
        return (
            <div>
                <div className='step-progress'>
                    <StepZilla stepsNavigation={false} showNavigation={false} steps={steps}/>
                </div>
            </div>
        );
    };
};

export default MultistepRDF;