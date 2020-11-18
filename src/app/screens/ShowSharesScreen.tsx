import React from "react";
import { connect } from 'react-redux';
import { ReduxState } from '../redux/store';
import { setSecret } from '../redux/actions';
import * as C from '../redux/constants';
import NavigationButtons from '../NavigationButtons';


const SecretScreen = (props: Props) => {
    return <div>
        <h1>TODO</h1>
        <NavigationButtons
            prev={C.SCREEN_SHARE_COUNTS} />
    </div>
}


interface Props {
    mode: string,
    totalCount: number,
    thresholdCount: number,
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
