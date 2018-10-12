import React, {Component} from 'react';
import StepZilla from 'react-stepzilla';
import DetermineHeaders from './MultistepRDFComps/DetermineHeaders';
import UploadXL from "./MultistepRDFComps/UploadXL";
import DatapackageUpload from "./DatapackageUpload";

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
            {name: 'StepOne', component: <DatapackageUpload noResource={true} parent={this}/>},
            {name: 'StepTwo', component: <UploadXL parent={this}/>},
            {name: 'StepThree', component: <DetermineHeaders parent={this}/>},
        ];
        return (
            <div>
                {authToken ? (
                <div className='step-progress'>
                    <StepZilla showNavigation={false} steps={steps}/>
                </div>
                ):<div>Not authorized</div>}
            </div>
        );
    };
};

export default MultistepRDF;