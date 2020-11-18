import React from "react";
import { connect } from 'react-redux';
import { ReduxState } from '../redux/store';
import { setSecret } from '../redux/actions';
import * as C from '../redux/constants';
import NavigationButtons from '../NavigationButtons';


const SecretScreen = (props: Props) => {
    const onChange = (e: any) => setSecret(e.target.value);

    return <div>
        <h1>Secret</h1>

        <label>
            Type your secret here:
            <input
                type="text"
                autoFocus
                value={props.secret}
                onChange={onChange} />
        </label>

        <NavigationButtons
            prev={C.SCREEN_MODE}
            next={C.SCREEN_SHARE_COUNTS}
            disableNext={!props.secret} />
    </div>
}


interface Props {
    mode: string,
    secret: string,
    secretFormat: string,
}

// export default FullscreenManager;
const mapStateToProps = (state: ReduxState, ownProps: any) => {
    return {
        ...ownProps,
        mode: state.mode,
        secret: state.secret,
        secretFormat: state.secret_format,
    };
};

const ReduxComponent = connect(mapStateToProps)(SecretScreen);
export default ReduxComponent;
