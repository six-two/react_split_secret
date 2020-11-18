import React from 'react';
import { setScreen } from './redux/actions';


const GoToScreenButton = (props: Props) => {
    const onClick = () => setScreen(props.targetScreen);
    return <button
        className="button-goto-screen"
        onClick={onClick}>
        {props.label}
    </button>
};


interface Props {
    label: string,
    targetScreen: string,
}

export default GoToScreenButton;
