import React from "react";
import { connect } from 'react-redux';
import { ReduxState } from '../redux/store';
import * as C from '../redux/constants';
import ModeScreen from './ModeScreen';


const ScreenManager = (props: Props) => {
    switch (props.screen) {
        case C.SCREEN_MODE:
            return <ModeScreen />
        default:
            return <h1 className="error-message">Screen not implemented: "{props.screen}"</h1>
    }
}


interface Props {
    screen: string,
}

// export default FullscreenManager;
const mapStateToProps = (state: ReduxState, ownProps: any) => {
    return {
        ...ownProps,
        screen: state.screen,
    };
};

const ReduxScreenManager = connect(mapStateToProps)(ScreenManager);
export default ReduxScreenManager;
