import React from "react";
import { connect } from 'react-redux';
import { ReduxState } from '../redux/store';
import * as C from '../redux/constants';
import ModeScreen from './ModeScreen';
import SecretScreen from './SecretScreen';
import ShareCountScreen from './ShareCountScreen';
import ShowSharesScreen from './ShowSharesScreen';

const ScreenManager = (props: Props) => {
    switch (props.screen) {
        case C.SCREEN_MODE:
            return <ModeScreen />
        case C.SCREEN_SECRET:
            return <SecretScreen />
        case C.SCREEN_SHARE_COUNTS:
            return <ShareCountScreen />
        case C.SCREEN_SHOW_SHARES:
            return <ShowSharesScreen />
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

const ReduxComponent = connect(mapStateToProps)(ScreenManager);
export default ReduxComponent;
