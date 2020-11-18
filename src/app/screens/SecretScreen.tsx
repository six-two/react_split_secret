import React from "react";
import { connect } from 'react-redux';
import { ReduxState } from '../redux/store';
import { setMode } from '../redux/actions';
import * as C from '../redux/constants';
import RadioBoxContainer, { Option } from '../RadioBoxContainer';
import NavigationButtons from '../NavigationButtons';


const ModeScreen = (props: Props) => {
    return <div>
        <h1>Secret</h1>
        TODO
        <NavigationButtons
            prev={C.SCREEN_MODE}
            next={C.SCREEN_SHARE_COUNTS} />
    </div>
}


interface Props {
    mode: string,
}

// export default FullscreenManager;
const mapStateToProps = (state: ReduxState, ownProps: any) => {
    return {
        ...ownProps,
        mode: state.mode,
    };
};

const ReduxScreenManager = connect(mapStateToProps)(ModeScreen);
export default ReduxScreenManager;
