import React, {Component} from 'react';
import StepZilla from 'react-stepzilla';
import UploadXL from "./MultistepRDFComps/UploadXL";
import MakeRDF from "./MultistepRDFComps/MakeRDF";

class MultistepRDF extends Component {
    constructor(props) {
        super(props);
        this.state = {
            excelFile:null,
            workbook:null
        };
    };

    render() {
        const authToken = localStorage.getItem('auth-token');
        const steps = [
            {name: 'Upload', component: <UploadXL parent={this}/>},
            {name: 'Make RDF', component: <MakeRDF parent={this}/>},
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