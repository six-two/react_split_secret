import React from "react";
import { connect } from 'react-redux';
import * as C from './redux/constants';
import { ReduxState } from './redux/store';
import { setSecretFormat } from './redux/actions';
import Dropdown from './Dropdown';

const TYPES = new Map<string, string>();
TYPES.set(C.SECRET_TYPE_RAW, 'Text / Raw');
TYPES.set(C.SECRET_TYPE_BASE64, 'Base64');
TYPES.set(C.SECRET_TYPE_HEX, 'Hex string');


const SecretTypeChooser = (props: Props) => {
    return (
        <div>
            <Dropdown
                value={props.value}
                optionMap={TYPES}
                onValueChange={props.setValue} />
        </div>
    );
}


interface Props {
    value: string,
    setValue: (newValue: string) => void,
}

// export default FullscreenManager;
const mapStateToProps = (state: ReduxState, ownProps: any) => {
    return {
        ...ownProps,
        value: state.secret_format,
        setValue: setSecretFormat
    };
};

const ReduxSecretTypeChooser = connect(mapStateToProps)(SecretTypeChooser);
export default ReduxSecretTypeChooser;
