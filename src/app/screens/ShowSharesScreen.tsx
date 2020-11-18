import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { ReduxState } from '../redux/store';
import * as C from '../redux/constants';
import NavigationButtons from '../NavigationButtons';
import { splitSecret, SplitSecretResult } from '../SplitSecret';
import { blockify } from '../Formatter';


const SecretScreen = (props: Props) => {
    const defaultState: SplitSecretResult = { error: "Secret is being split. Please wait..." };
    const [state, setState] = useState(defaultState);

    useEffect(
        () => {
            const splitResult = splitSecret(props.state);
            setState(splitResult);
        }, [props.state]
    );

    return <div>
        <h1>Result</h1>
        {state.error &&
            <>
                <h2>Error</h2>
                <div className="err-msg">{state.error}</div>
            </>
        }
        {state.shares &&
            <>
                <h2>Shares</h2>
                <ol>
                    {state.shares.map(share =>
                        <li>{blockify(share)}</li>
                    )}
                </ol>
            </>
        }
        {state.encrypted_data &&
            <>
                <h2>Encrypted data</h2>
                {btoa(state.encrypted_data)}
            </>
        }
        <NavigationButtons
            prev={C.SCREEN_SHARE_COUNTS} />
    </div>
}



interface Props {
    state: ReduxState,
}

// export default FullscreenManager;
const mapStateToProps = (state: ReduxState, ownProps: any) => {
    return {
        ...ownProps,
        state: state,
    };
};

const ReduxComponent = connect(mapStateToProps)(SecretScreen);
export default ReduxComponent;
