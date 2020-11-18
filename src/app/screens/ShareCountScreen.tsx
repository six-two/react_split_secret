import React from "react";
import { connect } from 'react-redux';
import { ReduxState } from '../redux/store';
import { setSecret } from '../redux/actions';
import * as C from '../redux/constants';
import NavigationButtons from '../NavigationButtons';
import { ThresholdShareInput, TotalShareInput } from '../ShareNumberInputs';


const SecretScreen = (props: Props) => {
    // TODO also put the constant size shares stuff here (advanced only)
    return <div>
        <h1>Shares</h1>
        Your secret will be split into {props.totalCount} shares (think of them as parts).
        <br />
        Anyone having {props.thresholdCount} (or more) different shares can recover the secret.
        <br />
        It is not possible for someone with {props.thresholdCount - 1} (or fewer) shares to reconstruct the secret.
        <br />
        Use the input fields below to change these values.
        <br />
        <br />

        <h2>Total share count</h2>
        It has to be at least as high as the threshold count, but can not be bigger that 255.
        <TotalShareInput />

        <h2>Threshold share count</h2>
        It has to be at least 2 and can not be bigger than the total share count.
        <ThresholdShareInput />

        <NavigationButtons
            prev={C.SCREEN_SECRET}
            next={C.SCREEN_SHOW_SHARES} />
    </div >
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
        totalCount: state.total_share_count,
        thresholdCount: state.threshold_share_count,
    };
};

const ReduxComponent = connect(mapStateToProps)(SecretScreen);
export default ReduxComponent;
